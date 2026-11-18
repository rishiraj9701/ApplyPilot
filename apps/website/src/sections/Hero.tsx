import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  FileText,
  Zap,
  Bot,
  Terminal,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon } from '../components/BrandIcons';
import { SITE_CONFIG } from '../config/site';
import { MagneticButton, FadeIn } from '../animations/MotionPrims';

export function Hero() {
  const [activeTab, setActiveTab] = useState<'preview' | 'schema'>('preview');
  const [isSimulatingAutofill, setIsSimulatingAutofill] = useState(false);
  const [fillState, setFillState] = useState({
    name: 'Sarah Chen',
    email: 'sarah.chen@example.dev',
    linkedin: 'linkedin.com/in/sarahchen-eng',
    portfolio: 'sarahchen.dev',
    experience: '6 years (Distributed Systems, TS, React)',
    screeningAnswer:
      'In my last role at FinScale, I architected a low-latency event processing pipeline handling 120k events/sec. I am eager to apply this experience to your real-time core platform.',
  });

  const triggerAutofillSimulation = () => {
    setIsSimulatingAutofill(true);
    setTimeout(() => {
      setIsSimulatingAutofill(false);
    }, 1200);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial gradient and technical grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          {/* Engineering status badge */}
          <FadeIn delay={0.05} direction="down">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 mb-6 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LOCAL-FIRST BROWSER EXTENSION</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">ZERO CLOUD RESUME STORAGE</span>
            </div>
          </FadeIn>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
            Job applications.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Less repetition.
            </span>{' '}
            More momentum.
          </h1>

          {/* Supporting Text */}
          <FadeIn delay={0.2} direction="up">
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10">
              {SITE_CONFIG.description}
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={0.3} direction="up">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <a
                  href="#install"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get ApplyPilot</span>
                  <span className="text-xs font-mono font-normal opacity-75 ml-1">v0.1.0</span>
                </a>
              </MagneticButton>

              <MagneticButton>
                <a
                  href={SITE_CONFIG.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all hover:text-white active:scale-[0.98]"
                >
                  <GithubIcon className="w-4 h-4 text-slate-400" />
                  <span>Explore on GitHub</span>
                </a>
              </MagneticButton>
            </div>
          </FadeIn>

          {/* Quick value trust badges */}
          <FadeIn delay={0.4} direction="up">
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                No subscriptions
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Local storage only
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Ollama / Gemini optional
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Human-in-the-loop
              </span>
            </div>
          </FadeIn>
        </div>

        {/* High-Fidelity Original Product Visual Interface */}
        <FadeIn delay={0.45} direction="up">
          <div className="relative max-w-5xl mx-auto rounded-2xl border border-slate-800/90 bg-[#0c0e14] shadow-2xl shadow-black/80 overflow-hidden">
            {/* Window header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                {/* Browser Address Bar */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-slate-400 font-mono text-[11px] w-64 sm:w-80 truncate">
                  <span className="text-emerald-400">https://</span>
                  <span>boards.greenhouse.io/acme-corp/jobs/48201</span>
                </div>
              </div>

              {/* View mode toggle & Simulation button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerAutofillSimulation}
                  disabled={isSimulatingAutofill}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isSimulatingAutofill ? 'animate-spin' : ''}`} />
                  <span>Simulate Fill</span>
                </button>

                <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      activeTab === 'preview'
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Interactive Form
                  </button>
                  <button
                    onClick={() => setActiveTab('schema')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      activeTab === 'schema'
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Local Profile JSON
                  </button>
                </div>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#0c0e14] to-[#090a0f]">
              {activeTab === 'preview' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Target ATS Application Form */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                          ATS Target: Greenhouse
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          Staff Infrastructure Engineer
                        </h3>
                        <p className="text-xs text-slate-400">Acme Cloud Systems • San Francisco (Hybrid)</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Form Detected
                      </span>
                    </div>

                    {/* Simulated ATS Inputs */}
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">
                          Full Name <span className="text-rose-400">*</span>
                        </label>
                        <div
                          className={`px-3 py-2 rounded-lg bg-slate-900 border transition-all ${
                            isSimulatingAutofill
                              ? 'border-emerald-400 bg-emerald-950/20 ring-1 ring-emerald-400'
                              : 'border-slate-800 text-slate-200'
                          }`}
                        >
                          {fillState.name}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-medium mb-1">
                            Email <span className="text-rose-400">*</span>
                          </label>
                          <div
                            className={`px-3 py-2 rounded-lg bg-slate-900 border transition-all truncate ${
                              isSimulatingAutofill
                                ? 'border-emerald-400 bg-emerald-950/20 ring-1 ring-emerald-400'
                                : 'border-slate-800 text-slate-200'
                            }`}
                          >
                            {fillState.email}
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-medium mb-1">
                            LinkedIn Profile
                          </label>
                          <div
                            className={`px-3 py-2 rounded-lg bg-slate-900 border transition-all truncate ${
                              isSimulatingAutofill
                                ? 'border-emerald-400 bg-emerald-950/20 ring-1 ring-emerald-400'
                                : 'border-slate-800 text-slate-200'
                            }`}
                          >
                            {fillState.linkedin}
                          </div>
                        </div>
                      </div>

                      {/* AI Screening Answer Question */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-300 font-medium">
                            Why are you interested in this position?
                          </label>
                          <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                            <Bot className="w-3 h-3" /> AI Tailored
                          </span>
                        </div>
                        <div
                          className={`p-3 rounded-lg bg-slate-900 border transition-all text-slate-200 leading-relaxed text-[11px] ${
                            isSimulatingAutofill
                              ? 'border-cyan-400 bg-cyan-950/20 ring-1 ring-cyan-400'
                              : 'border-slate-800'
                          }`}
                        >
                          {fillState.screeningAnswer}
                        </div>
                      </div>

                      {/* Mock manual submission button */}
                      <div className="pt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Requires manual click to submit</span>
                        </div>
                        <button
                          type="button"
                          disabled
                          className="px-4 py-2 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold cursor-not-allowed border border-slate-700"
                        >
                          Submit Application (Manual)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: ApplyPilot Local Extension Overlay */}
                  <div className="lg:col-span-5 rounded-xl border border-emerald-500/30 bg-slate-950/90 p-4 shadow-xl relative">
                    {/* Extension Badge header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                          <Zap className="w-3 h-3 text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-white">ApplyPilot Extension</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Active on Tab
                      </span>
                    </div>

                    {/* Detected context */}
                    <div className="space-y-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-400">Active Profile</span>
                          <span className="font-mono text-emerald-400 font-semibold">Staff-Infra.json</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Local Storage</span>
                          <span className="font-mono text-slate-300">chrome.storage.local</span>
                        </div>
                      </div>

                      {/* Autofill confidence checklist */}
                      <div className="space-y-1.5 text-[11px]">
                        <div className="text-slate-400 font-mono text-[10px] uppercase">
                          Detected Inputs (4/4 Mapped)
                        </div>
                        <div className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800/60">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            #applicant_name
                          </span>
                          <span className="text-emerald-400 font-mono">100% Match</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800/60">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            #applicant_email
                          </span>
                          <span className="text-emerald-400 font-mono">100% Match</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800/60">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            #custom_question_01
                          </span>
                          <span className="text-cyan-400 font-mono">AI Drafted</span>
                        </div>
                      </div>

                      {/* AI Mode Selector */}
                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-slate-400">AI Engine</span>
                          <span className="font-mono text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                            Ollama (Local)
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          Drafted locally via mistral:7b at localhost:11434. No candidate credentials sent to external clouds.
                        </p>
                      </div>

                      {/* Action buttons inside extension */}
                      <button
                        onClick={triggerAutofillSimulation}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Autofill Form Fields</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Schema JSON View */
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 text-[11px] mb-3">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      ~/.applypilot/profiles/primary.json (Stored locally)
                    </span>
                    <span className="text-emerald-400">Verified Schema v1.2</span>
                  </div>
                  <pre className="text-slate-200 leading-relaxed">
{`{
  "profile_id": "usr_9482fa81",
  "storage_target": "chrome.storage.local",
  "personal": {
    "full_name": "${fillState.name}",
    "email": "${fillState.email}",
    "phone": "+1 (555) 019-2834",
    "location": "San Francisco, CA",
    "urls": {
      "linkedin": "https://${fillState.linkedin}",
      "github": "https://github.com/sarahchen-dev",
      "portfolio": "https://${fillState.portfolio}"
    }
  },
  "work_authorization": {
    "us_authorized": true,
    "requires_sponsorship": false
  },
  "ai_runtime": {
    "provider": "ollama",
    "endpoint": "http://localhost:11434",
    "model": "mistral:latest"
  }
}`}
                  </pre>
                </div>
              )}
            </div>

            {/* Bottom notification strip */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Phase 1 Architecture Preview • Zero backend dependencies</span>
              </span>
              <a
                href="#how-it-works"
                className="hover:text-emerald-400 text-slate-400 inline-flex items-center gap-1 text-[11px]"
              >
                Learn how it works <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
