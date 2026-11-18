import { useState, useEffect } from 'react';
import {
  Zap,
  Bot,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  FileText,
  Clock,
  RotateCw,
} from 'lucide-react';
import { StorageService } from '../../src/services/storage/storageService';
import { CandidateProfile, ApplicationRecord } from '../../src/core/schema';
import { JobDetails, FillResult } from '../../src/adapters';
import { JobIntelligenceService, SkillMatchResult } from '../../src/services/job/jobIntelligence';

export default function Popup() {
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<CandidateProfile | null>(null);
  const [pageStatus, setPageStatus] = useState<{
    isSupported: boolean;
    atsPlatform: string;
    jobDetails: JobDetails;
    fieldsCount: number;
  } | null>(null);

  const [matchResult, setMatchResult] = useState<SkillMatchResult | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<ApplicationRecord | null>(null);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [fillResult, setFillResult] = useState<FillResult | null>(null);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const allProfiles = await StorageService.getProfiles();
      const current = await StorageService.getActiveProfile();
      setProfiles(allProfiles);
      setActiveProfile(current);

      // Query current active browser tab
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const tab = tabs[0];
        if (tab?.id && tab.url) {
          setActiveTabId(tab.id);

          try {
            const resp = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_STATUS' });
            if (resp) {
              setPageStatus(resp);

              // Check for duplicate application
              if (resp.jobDetails?.company && resp.jobDetails?.title) {
                const dup = await StorageService.checkDuplicate(
                  resp.jobDetails.company,
                  resp.jobDetails.title,
                  resp.jobDetails.url
                );
                setDuplicateWarning(dup);
              }

              // Calculate match score if profile exists
              if (current && resp.jobDetails) {
                const match = JobIntelligenceService.analyzeMatch(resp.jobDetails, current);
                setMatchResult(match);
              }
            }
          } catch {
            // Content script might not be injected on chrome:// or restricted pages
            setPageStatus({
              isSupported: false,
              atsPlatform: 'Restricted / Not a Job Board',
              jobDetails: {
                title: tab.title || 'Page',
                company: 'General',
                url: tab.url,
                atsPlatform: 'Generic',
              },
              fieldsCount: 0,
            });
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error loading extension data');
    }
  }

  async function handleProfileChange(profileId: string) {
    await StorageService.setActiveProfileId(profileId);
    const chosen = profiles.find((p) => p.id === profileId) || null;
    setActiveProfile(chosen);

    if (chosen && pageStatus?.jobDetails) {
      const match = JobIntelligenceService.analyzeMatch(pageStatus.jobDetails, chosen);
      setMatchResult(match);
    }
  }

  async function handleAutofill() {
    if (!activeProfile) {
      setErrorMsg('Please create or select a candidate profile first.');
      return;
    }
    if (!activeTabId) return;

    setIsAutofilling(true);
    setErrorMsg(null);
    setFillResult(null);

    const prefs = await StorageService.getPreferences();

    try {
      const response = await chrome.tabs.sendMessage(activeTabId, {
        type: 'EXECUTE_AUTOFILL',
        payload: {
          profile: activeProfile,
          overwrite: prefs.overwriteNonEmpty,
        },
      });

      if (response?.success && response.result) {
        setFillResult(response.result);

        // Record or update application history
        if (pageStatus?.jobDetails) {
          await StorageService.saveApplication({
            id: `app_${Date.now()}`,
            company: pageStatus.jobDetails.company,
            jobTitle: pageStatus.jobDetails.title,
            jobUrl: pageStatus.jobDetails.url,
            location: pageStatus.jobDetails.location || '',
            appliedAt: new Date().toISOString(),
            resumeProfileId: activeProfile.id,
            resumeProfileName: activeProfile.name,
            atsPlatform: pageStatus.atsPlatform,
            status: 'applied',
            matchScore: matchResult?.overallScore,
          });
        }
      } else {
        setErrorMsg(response?.error || 'Autofill did not complete.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed communicating with target tab.');
    } finally {
      setIsAutofilling(false);
    }
  }

  function openOptions() {
    if (typeof chrome !== 'undefined' && chrome.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('../options/index.html', '_blank');
    }
  }

  return (
    <div className="p-4 flex flex-col gap-3 font-sans text-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-white text-sm tracking-tight block">
              ApplyPilot
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Local-First</span>
          </div>
        </div>

        <button
          onClick={openOptions}
          title="Open Dashboard & Settings"
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Duplicate Warning Alert */}
      {duplicateWarning && (
        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <span className="font-bold">Duplicate Notice:</span> You previously applied to{' '}
            <strong>{duplicateWarning.company}</strong> for "{duplicateWarning.jobTitle}" on{' '}
            {new Date(duplicateWarning.appliedAt).toLocaleDateString()}.
          </div>
        </div>
      )}

      {/* Page Detection HUD */}
      <div className="p-3 rounded-xl bg-[#0c1018] border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-mono">Target ATS:</span>
          <span className="font-bold text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {pageStatus?.atsPlatform || 'Scanning...'}
          </span>
        </div>

        {pageStatus?.jobDetails && (
          <div>
            <div className="text-xs font-bold text-white truncate">
              {pageStatus.jobDetails.title}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {pageStatus.jobDetails.company} {pageStatus.jobDetails.location ? `• ${pageStatus.jobDetails.location}` : ''}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
          <span>Inputs Found: {pageStatus?.fieldsCount ?? 0}</span>
          <span>Zero Cloud Uploads</span>
        </div>
      </div>

      {/* Active Profile Switcher */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-mono">Active Resume Variant:</span>
          <button
            onClick={openOptions}
            className="text-emerald-400 hover:underline inline-flex items-center text-[10px] font-mono cursor-pointer"
          >
            Manage Profiles <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {profiles.length > 0 ? (
          <select
            value={activeProfile?.id || ''}
            onChange={(e) => handleProfileChange(e.target.value)}
            className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.personal.fullName}) {p.isDefault ? '• Default' : ''}
              </option>
            ))}
          </select>
        ) : (
          <div className="p-2.5 rounded-lg bg-slate-950 border border-dashed border-slate-800 text-center">
            <span className="text-slate-400 text-[11px] block mb-1.5">No resume profile found</span>
            <button
              onClick={openOptions}
              className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] cursor-pointer"
            >
              Import PDF Resume
            </button>
          </div>
        )}
      </div>

      {/* Match Score Indicator */}
      {matchResult && (
        <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400">Profile Match Score</div>
            <div className="text-[11px] text-slate-300 font-mono">
              Matched {matchResult.matchedSkills.length} skills
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {matchResult.overallScore}%
          </div>
        </div>
      )}

      {/* Error Callout */}
      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[11px]">
          {errorMsg}
        </div>
      )}

      {/* Fill Result Summary */}
      {fillResult && (
        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 space-y-1">
          <div className="font-bold text-[11px] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Autofill Success
          </div>
          <div className="text-[10px] text-slate-300 font-mono">
            {fillResult.filled} fields filled • {fillResult.skipped} skipped
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-1 flex flex-col gap-2">
        <button
          onClick={handleAutofill}
          disabled={isAutofilling || !activeProfile}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-950/40"
        >
          {isAutofilling ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Populating fields...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Execute Autofill</span>
            </>
          )}
        </button>

        <button
          onClick={openOptions}
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Open Full Profile Dashboard</span>
        </button>
      </div>

      {/* Footer Note */}
      <div className="text-center text-[10px] font-mono text-slate-500 pt-1">
        ApplyPilot never auto-submits applications.
      </div>
    </div>
  );
}
