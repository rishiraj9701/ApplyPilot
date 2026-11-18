import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  User,
  Bot,
  BookmarkCheck,
  History,
  Shield,
  Download,
  Upload,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  ExternalLink,
  RotateCw,
  Search,
  FileText,
  Key,
  Cpu,
  Layers,
  Save,
  Briefcase,
  GraduationCap,
  FolderGit2,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { StorageService } from '../../src/services/storage/storageService';
import {
  CandidateProfile,
  CandidateProfileSchema,
  AISettings,
  Preferences,
  ApplicationRecord,
  SavedQA,
  Experience,
  Education,
  Project,
} from '../../src/core/schema';
import { parsePdfBuffer } from '../../src/services/resume/pdfParser';
import { ResumeExtractor } from '../../src/services/resume/resumeExtractor';
import { createAIProvider } from '../../src/services/ai/aiService';

export default function OptionsDashboard() {
  const [activeTab, setActiveTab] = useState<'profiles' | 'ai' | 'qa' | 'history' | 'settings'>('profiles');
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<CandidateProfile | null>(null);
  const [aiSettings, setAiSettings] = useState<AISettings | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [savedQA, setSavedQA] = useState<SavedQA[]>([]);

  // UI state
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [testingAI, setTestingAI] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{ ok: boolean; message: string; models?: string[] } | null>(null);

  // New QA form state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Custom');

  // Search filters
  const [historySearch, setHistorySearch] = useState('');
  const [qaSearch, setQaSearch] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    const [allProfiles, current, ai, prefs, apps, qa] = await Promise.all([
      StorageService.getProfiles(),
      StorageService.getActiveProfile(),
      StorageService.getAISettings(),
      StorageService.getPreferences(),
      StorageService.getApplications(),
      StorageService.getSavedQA(),
    ]);

    setProfiles(allProfiles);
    setActiveProfile(current || allProfiles[0] || null);
    setAiSettings(ai);
    setPreferences(prefs);
    setApplications(apps);
    setSavedQA(qa);
  }

  function showMessage(text: string, type: 'success' | 'error' = 'success') {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  }

  // --- RESUME PDF UPLOAD & PARSE ---
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showMessage('Please select a valid PDF file.', 'error');
      return;
    }

    setIsParsingPdf(true);
    try {
      const buffer = await file.arrayBuffer();
      const parseResult = await parsePdfBuffer(buffer);

      if (!parseResult.fullText.trim()) {
        throw new Error('Could not extract text from the PDF. It may be a scanned image.');
      }

      const category = 'Software Engineering';
      const profileName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      const newProfile = ResumeExtractor.extractFromText(parseResult.fullText, profileName, category);

      await StorageService.saveProfile(newProfile);
      await loadAllData();
      setActiveProfile(newProfile);
      showMessage(`Successfully parsed "${file.name}" into a new candidate profile!`);
    } catch (err: any) {
      showMessage(`Resume parsing failed: ${err.message}`, 'error');
    } finally {
      setIsParsingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  // --- PROFILE MANAGEMENT ---
  async function handleSaveActiveProfile() {
    if (!activeProfile) return;
    try {
      const updated = {
        ...activeProfile,
        updatedAt: new Date().toISOString(),
      };
      await StorageService.saveProfile(updated);
      await loadAllData();
      showMessage('Candidate profile saved locally!');
    } catch (err: any) {
      showMessage(`Validation failed: ${err.message}`, 'error');
    }
  }

  async function handleDeleteProfile(id: string) {
    if (!confirm('Are you sure you want to delete this resume profile?')) return;
    await StorageService.deleteProfile(id);
    await loadAllData();
    showMessage('Profile deleted.');
  }

  async function handleSetDefaultProfile(id: string) {
    const profile = profiles.find((p) => p.id === id);
    if (!profile) return;
    profile.isDefault = true;
    await StorageService.saveProfile(profile);
    await StorageService.setActiveProfileId(id);
    await loadAllData();
    showMessage(`Set "${profile.name}" as default profile.`);
  }

  // --- AI SETTINGS ---
  async function handleSaveAISettings(e: React.FormEvent) {
    e.preventDefault();
    if (!aiSettings) return;
    await StorageService.saveAISettings(aiSettings);
    showMessage('AI settings updated!');
  }

  async function handleTestAIConnection() {
    if (!aiSettings) return;
    setTestingAI(true);
    setAiTestResult(null);

    const provider = createAIProvider(aiSettings);
    if (!provider) {
      setAiTestResult({ ok: false, message: 'Provider is set to None. Please select Ollama or Gemini.' });
      setTestingAI(false);
      return;
    }

    try {
      const status = await provider.testConnection();
      setAiTestResult(status);
    } catch (err: any) {
      setAiTestResult({ ok: false, message: err?.message || 'Connection test failed.' });
    } finally {
      setTestingAI(false);
    }
  }

  // --- PREFERENCES ---
  async function handleSavePreferences(newPrefs: Partial<Preferences>) {
    if (!preferences) return;
    const updated = await StorageService.savePreferences(newPrefs);
    setPreferences(updated);
    showMessage('Preferences updated!');
  }

  // --- SAVED QA ---
  async function handleAddQA(e: React.FormEvent) {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const qa: SavedQA = {
      id: `qa_${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await StorageService.saveQA(qa);
    setNewQuestion('');
    setNewAnswer('');
    await loadAllData();
    showMessage('Saved response added to vault!');
  }

  async function handleDeleteQA(id: string) {
    await StorageService.deleteQA(id);
    await loadAllData();
    showMessage('Answer deleted from vault.');
  }

  // --- APPLICATION HISTORY ---
  async function handleDeleteApp(id: string) {
    await StorageService.deleteApplication(id);
    await loadAllData();
    showMessage('Application record deleted.');
  }

  async function handleStatusChange(id: string, status: any) {
    await StorageService.updateApplicationStatus(id, status);
    await loadAllData();
    showMessage('Application status updated.');
  }

  // --- BACKUP & RESTORE ---
  async function handleExportBackup() {
    const backup = await StorageService.exportAllData();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applypilot-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage('Backup downloaded successfully!');
  }

  async function handleImportBackup(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const res = await StorageService.importAllData(parsed);
      await loadAllData();
      showMessage(`Backup restored! ${res.profileCount} profiles loaded.`);
    } catch (err: any) {
      showMessage(`Restore failed: ${err.message}`, 'error');
    }
  }

  async function handleClearAll() {
    if (confirm('CAUTION: This will delete all local profiles, settings, and application history. Continue?')) {
      if (confirm('Final confirmation: Are you completely sure?')) {
        await StorageService.clearAllData();
        await loadAllData();
        showMessage('All local extension data erased.');
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              ApplyPilot
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Local-First Extension
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Candidate profile manager, ATS autofill rules, and offline AI configuration.
            </p>
          </div>
        </div>

        {/* Global Toast */}
        {statusMessage && (
          <div
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 ${
              statusMessage.type === 'error'
                ? 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
                : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
            }`}
          >
            {statusMessage.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {statusMessage.text}
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-8">
        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'profiles'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Candidate Profiles</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
            {profiles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Engine & Ollama</span>
        </button>

        <button
          onClick={() => setActiveTab('qa')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'qa'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Saved Q&A Vault</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
            {savedQA.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Application History</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
            {applications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Privacy & Backup</span>
        </button>
      </div>

      {/* TAB CONTENT: PROFILES */}
      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profiles List & Upload */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl bg-[#0c1018] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                  Resume Variants ({profiles.length})
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isParsingPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  {isParsingPdf ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Import PDF</span>
                </button>
              </div>

              {/* Profiles list items */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {profiles.map((p) => {
                  const isSelected = activeProfile?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setActiveProfile(p)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-xs truncate max-w-[180px]">
                          {p.name}
                        </span>
                        {p.isDefault && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {p.personal.fullName} • {p.personal.email}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions for Selected Profile */}
            {activeProfile && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-mono text-slate-400 block mb-2">Variant Controls</span>
                <button
                  onClick={() => handleSetDefaultProfile(activeProfile.id)}
                  disabled={activeProfile.isDefault}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-50 text-left flex items-center justify-between cursor-pointer"
                >
                  <span>Set as Default for Autofill</span>
                  {activeProfile.isDefault && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                <button
                  onClick={() => handleDeleteProfile(activeProfile.id)}
                  className="w-full py-2 px-3 rounded-lg bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 text-left flex items-center justify-between cursor-pointer"
                >
                  <span>Delete Profile</span>
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Profile Editor */}
          <div className="lg:col-span-8">
            {activeProfile ? (
              <div className="p-6 rounded-3xl bg-[#0c1018] border border-slate-800 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Editing: {activeProfile.name}</span>
                    </h2>
                    <span className="text-xs font-mono text-slate-400">
                      Changes persist locally in chrome.storage.local
                    </span>
                  </div>

                  <button
                    onClick={handleSaveActiveProfile}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>

                {/* Section: Personal Info */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={activeProfile.personal.fullName}
                        onChange={(e) =>
                          setActiveProfile({
                            ...activeProfile,
                            personal: { ...activeProfile.personal, fullName: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={activeProfile.personal.email}
                        onChange={(e) =>
                          setActiveProfile({
                            ...activeProfile,
                            personal: { ...activeProfile.personal, email: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={activeProfile.personal.phone || ''}
                        onChange={(e) =>
                          setActiveProfile({
                            ...activeProfile,
                            personal: { ...activeProfile.personal, phone: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Location / City</label>
                      <input
                        type="text"
                        value={activeProfile.personal.location || ''}
                        onChange={(e) =>
                          setActiveProfile({
                            ...activeProfile,
                            personal: { ...activeProfile.personal, location: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">LinkedIn Profile</label>
                      <input
                        type="text"
                        value={activeProfile.personal.linkedin || ''}
                        onChange={(e) =>
                          setActiveProfile({
                            ...activeProfile,
                            personal: { ...activeProfile.personal, linkedin: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">GitHub / Portfolio</label>
                      <input
                        type="text"
                        value={activeProfile.personal.github || ''}
                        onChange={(e) =>
                          setActiveProfile({
                            ...activeProfile,
                            personal: { ...activeProfile.personal, github: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Professional Summary */}
                <div className="space-y-2">
                  <h3 className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
                    Professional Summary
                  </h3>
                  <textarea
                    rows={3}
                    value={activeProfile.summary || ''}
                    onChange={(e) => setActiveProfile({ ...activeProfile, summary: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                {/* Section: Skills */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      Technical Skills ({activeProfile.skills.length})
                    </h3>
                  </div>
                  <input
                    type="text"
                    value={activeProfile.skills.join(', ')}
                    onChange={(e) =>
                      setActiveProfile({
                        ...activeProfile,
                        skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Comma separated: React, TypeScript, Go, Kubernetes"
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                  <span className="text-[11px] text-slate-500 font-mono block">
                    Separate skills with commas
                  </span>
                </div>

                {/* Section: Work Experience */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      Work Experience ({activeProfile.experience.length})
                    </h3>
                    <button
                      onClick={() =>
                        setActiveProfile({
                          ...activeProfile,
                          experience: [
                            ...activeProfile.experience,
                            {
                              id: `exp_${Date.now()}`,
                              company: 'New Company',
                              title: 'Software Engineer',
                              location: '',
                              startDate: '2023',
                              endDate: 'Present',
                              current: true,
                              description: '',
                              highlights: [],
                              skills: [],
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Experience
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeProfile.experience.map((exp, idx) => (
                      <div key={exp.id || idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <input
                            type="text"
                            value={exp.company}
                            placeholder="Company"
                            onChange={(e) => {
                              const list = [...activeProfile.experience];
                              list[idx].company = e.target.value;
                              setActiveProfile({ ...activeProfile, experience: list });
                            }}
                            className="p-2 rounded bg-slate-900 border border-slate-800 text-white font-semibold"
                          />
                          <input
                            type="text"
                            value={exp.title}
                            placeholder="Title"
                            onChange={(e) => {
                              const list = [...activeProfile.experience];
                              list[idx].title = e.target.value;
                              setActiveProfile({ ...activeProfile, experience: list });
                            }}
                            className="p-2 rounded bg-slate-900 border border-slate-800 text-white"
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <input
                            type="text"
                            value={`${exp.startDate} - ${exp.endDate}`}
                            placeholder="2022 - Present"
                            onChange={(e) => {
                              const parts = e.target.value.split('-');
                              const list = [...activeProfile.experience];
                              list[idx].startDate = parts[0]?.trim() || '';
                              list[idx].endDate = parts[1]?.trim() || '';
                              setActiveProfile({ ...activeProfile, experience: list });
                            }}
                            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono"
                          />
                          <button
                            onClick={() => {
                              const list = activeProfile.experience.filter((_, i) => i !== idx);
                              setActiveProfile({ ...activeProfile, experience: list });
                            }}
                            className="text-slate-500 hover:text-rose-400 text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-[#0c1018] border border-slate-800">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Profile Selected</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Import a PDF resume or click on an existing profile from the left column to view and edit details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: AI SETTINGS */}
      {activeTab === 'ai' && aiSettings && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0c1018] border border-slate-800 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <span>AI Provider Configuration</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              AI is completely optional. If configured, ApplyPilot can draft answers to open-ended screening questions based on your verified profile.
            </p>
          </div>

          <form onSubmit={handleSaveAISettings} className="space-y-5 text-xs">
            {/* Provider Selection */}
            <div>
              <label className="block text-slate-300 font-bold mb-2">Selected AI Engine</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'none', label: 'None (No AI)', desc: 'Pure deterministic autofill' },
                  { id: 'ollama', label: 'Ollama (Local)', desc: '100% offline & private' },
                  { id: 'gemini', label: 'Google Gemini', desc: 'Cloud API with user key' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAiSettings({ ...aiSettings, provider: item.id as any })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      aiSettings.provider === item.id
                        ? 'bg-slate-900 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/40 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs mb-0.5">{item.label}</div>
                    <div className="text-[10px] text-slate-500 leading-tight">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ollama options */}
            {aiSettings.provider === 'ollama' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-emerald-400 font-mono text-[11px]">
                  <span>Localhost Ollama Connection</span>
                  <span>100% Private</span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Ollama HTTP Endpoint</label>
                  <input
                    type="text"
                    value={aiSettings.ollamaEndpoint}
                    onChange={(e) => setAiSettings({ ...aiSettings, ollamaEndpoint: e.target.value })}
                    placeholder="http://localhost:11434"
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Local Model Name</label>
                  <input
                    type="text"
                    value={aiSettings.ollamaModel}
                    onChange={(e) => setAiSettings({ ...aiSettings, ollamaModel: e.target.value })}
                    placeholder="llama3.2:3b or mistral:latest"
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* Gemini options */}
            {aiSettings.provider === 'gemini' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-cyan-400 font-mono text-[11px]">
                  <span>Google Gemini Cloud API</span>
                  <span>Direct to Google</span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Google AI Studio API Key</label>
                  <input
                    type="password"
                    value={aiSettings.geminiApiKey}
                    onChange={(e) => setAiSettings({ ...aiSettings, geminiApiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Your key is stored strictly on this device in chrome.storage.local.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Gemini Model</label>
                  <input
                    type="text"
                    value={aiSettings.geminiModel}
                    onChange={(e) => setAiSettings({ ...aiSettings, geminiModel: e.target.value })}
                    placeholder="gemini-2.5-flash"
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* Answer Tone Style */}
            <div>
              <label className="block text-slate-400 mb-1">Answer Tone Style</label>
              <select
                value={aiSettings.answerStyle}
                onChange={(e) => setAiSettings({ ...aiSettings, answerStyle: e.target.value as any })}
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
              >
                <option value="professional">Professional (Balanced & confident)</option>
                <option value="concise">Concise (Short, bullet-friendly)</option>
                <option value="conversational">Conversational (Warm & engaging)</option>
                <option value="technical">Technical (Engineering metrics focused)</option>
              </select>
            </div>

            {/* Test result display */}
            {aiTestResult && (
              <div
                className={`p-3 rounded-xl border text-xs font-mono ${
                  aiTestResult.ok
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                }`}
              >
                {aiTestResult.message}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleTestAIConnection}
                disabled={testingAI || aiSettings.provider === 'none'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-mono disabled:opacity-50 cursor-pointer"
              >
                {testingAI && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Test Connection</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save AI Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: SAVED Q&A */}
      {activeTab === 'qa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Question Form */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0c1018] border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-cyan-400" />
              <span>Add Recurring Response</span>
            </h2>

            <form onSubmit={handleAddQA} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="Personal introduction">Personal introduction</option>
                  <option value="Motivation">Motivation ("Why Us?")</option>
                  <option value="Technical experience">Technical experience</option>
                  <option value="Availability">Availability & Notice Period</option>
                  <option value="Salary expectations">Salary expectations</option>
                  <option value="Relocation">Relocation & Work Auth</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Standard Question / Trigger</label>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. What is your notice period?"
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Approved Answer Text</label>
                <textarea
                  rows={4}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="e.g. My standard notice period is 2 weeks from signed offer acceptance."
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
              >
                Save to Vault
              </button>
            </form>
          </div>

          {/* List of Saved Answers */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search saved answers..."
                value={qaSearch}
                onChange={(e) => setQaSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="space-y-3">
              {savedQA
                .filter((qa) => qa.question.toLowerCase().includes(qaSearch.toLowerCase()) || qa.answer.toLowerCase().includes(qaSearch.toLowerCase()))
                .map((qa) => (
                  <div key={qa.id} className="p-4 rounded-2xl bg-[#0c1018] border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {qa.category}
                      </span>
                      <button
                        onClick={() => handleDeleteQA(qa.id)}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-bold text-white text-sm">{qa.question}</div>
                    <p className="text-slate-300 leading-relaxed">{qa.answer}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: APPLICATION HISTORY */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-3xl bg-[#0c1018] border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">Application Ledger</h2>
              <p className="text-xs text-slate-400">
                Local chronological record of all job applications filled with ApplyPilot.
              </p>
            </div>

            <input
              type="text"
              placeholder="Filter by company or role..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white w-64"
            />
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            {applications.length > 0 ? (
              applications
                .filter((a) => a.company.toLowerCase().includes(historySearch.toLowerCase()) || a.jobTitle.toLowerCase().includes(historySearch.toLowerCase()))
                .map((app) => (
                  <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white text-sm">{app.company}</div>
                      <div className="text-slate-300">
                        {app.jobTitle} • <span className="font-mono text-emerald-400">{app.atsPlatform}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        Applied: {new Date(app.appliedAt).toLocaleDateString()} with variant "{app.resumeProfileName}"
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                      >
                        <option value="interested">Interested</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready to apply</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>

                      <button
                        onClick={() => handleDeleteApp(app.id)}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs font-mono">
                No applications logged yet. Applications filled via extension are automatically recorded here.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRIVACY & SETTINGS */}
      {activeTab === 'settings' && preferences && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0c1018] border border-slate-800 shadow-2xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>Privacy & Storage Controls</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              ApplyPilot operates with zero servers. Your data is stored strictly in your browser.
            </p>
          </div>

          {/* Preferences */}
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">Protect Non-Empty Inputs</div>
                <div className="text-[11px] text-slate-400">
                  Never overwrite fields you already typed manually
                </div>
              </div>
              <input
                type="checkbox"
                checked={!preferences.overwriteNonEmpty}
                onChange={(e) => handleSavePreferences({ overwriteNonEmpty: !e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">Show Floating Assistant Dock</div>
                <div className="text-[11px] text-slate-400">
                  Displays a 1-click autofill pill on recognized job applications
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences.showFloatingAssistant}
                onChange={(e) => handleSavePreferences({ showFloatingAssistant: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white">Duplicate Warning Window</div>
                <div className="text-[11px] text-slate-400">
                  Warn if you already applied to the same company within N days
                </div>
              </div>
              <input
                type="number"
                min={7}
                max={365}
                value={preferences.duplicateWarningDays}
                onChange={(e) => handleSavePreferences({ duplicateWarningDays: parseInt(e.target.value) || 90 })}
                className="w-20 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-center"
              />
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Local Backup & Migration</h3>
            <p className="text-xs text-slate-400">
              Export all candidate profiles, saved Q&A, and application records as a single structured JSON file.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportBackup}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-mono cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export JSON Backup</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-mono cursor-pointer">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Restore From Backup</span>
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
            </div>
          </div>

          {/* Danger Zone: Clear Data */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-rose-400">Danger Zone</h3>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono cursor-pointer"
            >
              Clear All Local Data & Reset Extension
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
