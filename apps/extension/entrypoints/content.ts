import { resolveATSAdapter, setNativeValue } from '../src/adapters';
import { AutofillService } from '../src/services/autofill/autofillService';
import { ExtensionMessage } from '../src/services/messaging/messages';
import { StorageService } from '../src/services/storage/storageService';

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_idle',
  main() {
    const currentUrl = window.location.href;
    const adapter = resolveATSAdapter(document, currentUrl);

    // Message listener for popup & background
    chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
      if (!message || typeof message !== 'object' || !('type' in message)) {
        return false;
      }

      const msg = message as ExtensionMessage;

      if (msg.type === 'GET_PAGE_STATUS') {
        try {
          const jobDetails = adapter.extractJobDetails(document, currentUrl);
          const fields = adapter.getApplicationFields(document);
          const isSupported = adapter.name !== 'Generic Application' || fields.length > 2;

          sendResponse({
            isSupported,
            atsPlatform: adapter.name,
            jobDetails,
            fieldsCount: fields.length,
          });
        } catch (err: any) {
          sendResponse({
            isSupported: false,
            atsPlatform: 'Unknown',
            jobDetails: { title: 'Unknown', company: 'Unknown', url: currentUrl, atsPlatform: 'Unknown' },
            fieldsCount: 0,
          });
        }
        return true;
      }

      if (msg.type === 'EXECUTE_AUTOFILL') {
        if (!msg.payload?.profile) {
          sendResponse({ success: false, error: 'No profile provided in payload' });
          return false;
        }

        AutofillService.executeAutofill(
          adapter,
          document,
          msg.payload.profile,
          msg.payload.overwrite
        )
          .then((result) => {
            showInlineToast(`Autofilled ${result.filled} fields (${result.skipped} skipped)`);
            sendResponse({ success: true, result });
          })
          .catch((err) => {
            showInlineToast(`Autofill error: ${err.message}`, true);
            sendResponse({ success: false, error: err.message });
          });
        return true;
      }

      if (msg.type === 'INSERT_ANSWER_TO_FIELD') {
        if (!msg.payload?.answer) {
          sendResponse({ success: false, error: 'No answer provided in payload' });
          return false;
        }

        try {
          const target = document.getElementById(msg.payload.fieldId) ||
            document.querySelector(`[name="${msg.payload.fieldId}"]`) ||
            document.querySelector('textarea');

          if (target && target instanceof HTMLElement) {
            setNativeValue(target, msg.payload.answer);
            showInlineToast('AI answer inserted into field');
            sendResponse({ success: true });
          } else {
            sendResponse({ success: false, error: 'Target element not found' });
          }
        } catch (err: any) {
          sendResponse({ success: false, error: err?.message });
        }
        return true;
      }

      return false;
    });

    // Mount lightweight floating badge if supported job portal
    initFloatingAssistant(adapter, currentUrl);
  },
});

function showInlineToast(text: string, isError = false) {
  const existing = document.getElementById('applypilot-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'applypilot-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647;
    background: ${isError ? '#7f1d1d' : '#064e3b'};
    color: #ecfdf5;
    padding: 10px 16px;
    border-radius: 12px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    border: 1px solid ${isError ? '#ef4444' : '#10b981'};
    transition: all 0.3s ease;
  `;
  toast.textContent = `ApplyPilot: ${text}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

async function initFloatingAssistant(adapter: any, url: string) {
  // Only inject if it's an ATS or has an active application form
  const isAts = adapter.name !== 'Generic Application' || url.includes('/jobs') || url.includes('/apply') || url.includes('/careers');
  if (!isAts) return;

  const prefs = await StorageService.getPreferences();
  if (!prefs.showFloatingAssistant) return;

  if (document.getElementById('applypilot-floating-dock')) return;

  const dock = document.createElement('div');
  dock.id = 'applypilot-floating-dock';
  dock.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 2147483640;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #090d16;
    border: 1px solid #10b981;
    border-radius: 30px;
    padding: 6px 14px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.5);
    font-family: system-ui, -apple-system, sans-serif;
    cursor: pointer;
    user-select: none;
    transition: transform 0.2s ease;
  `;

  dock.innerHTML = `
    <div style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></div>
    <span style="color: #ffffff; font-size: 12px; font-weight: 700;">ApplyPilot</span>
    <span style="color: #6ee7b7; font-size: 11px; background: rgba(16,185,129,0.15); padding: 2px 8px; border-radius: 10px;">${adapter.name}</span>
  `;

  dock.addEventListener('mouseenter', () => {
    dock.style.transform = 'scale(1.04)';
  });
  dock.addEventListener('mouseleave', () => {
    dock.style.transform = 'scale(1)';
  });

  dock.addEventListener('click', async () => {
    const profile = await StorageService.getActiveProfile();
    if (!profile) {
      showInlineToast('No candidate profile found. Open extension options to import resume.', true);
      return;
    }
    const result = await AutofillService.executeAutofill(adapter, document, profile, prefs.overwriteNonEmpty);
    showInlineToast(`Autofilled ${result.filled} fields (${result.skipped} skipped)`);
  });

  document.body.appendChild(dock);
}
