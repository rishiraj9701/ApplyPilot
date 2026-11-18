import { StorageService } from '../src/services/storage/storageService';
import { createAIProvider } from '../src/services/ai/aiService';
import { ExtensionMessage } from '../src/services/messaging/messages';

export default defineBackground(() => {
  // Initialization on install
  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      const existing = await StorageService.getProfiles();
      if (existing.length === 0) {
        // Initialize default preferences
        await StorageService.savePreferences({
          overwriteNonEmpty: false,
          duplicateWarningDays: 90,
          showFloatingAssistant: true,
        });
      }
    }
  });

  // Central message dispatcher
  chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
    if (message.type === 'PING') {
      sendResponse({ status: 'pong' });
      return true;
    }

    if (message.type === 'TEST_AI_CONNECTION') {
      StorageService.getAISettings()
        .then((settings) => {
          const provider = createAIProvider(settings);
          if (!provider) {
            sendResponse({ ok: false, message: 'No AI provider selected (set to None).' });
            return;
          }
          return provider.testConnection();
        })
        .then((status) => sendResponse(status))
        .catch((err) => sendResponse({ ok: false, message: err?.message || 'Error testing connection' }));

      return true; // async reply
    }

    if (message.type === 'GENERATE_AI_ANSWER') {
      StorageService.getAISettings()
        .then((settings) => {
          const provider = createAIProvider(settings);
          if (!provider) {
            throw new Error('AI provider is not configured. Please select Ollama or Gemini in Settings.');
          }
          return provider.generateAnswer(message.payload);
        })
        .then((result) => sendResponse({ success: true, result }))
        .catch((err) => sendResponse({ success: false, error: err?.message || 'AI generation failed' }));

      return true; // async reply
    }

    return false;
  });
});
