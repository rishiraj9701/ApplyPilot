import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileUp,
  FileCode2,
  Scan,
  Zap,
  Bot,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Check,
  Layers,
  ShieldAlert,
  ArrowRight,
  Terminal,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { FadeIn, StreamingText } from '../animations/MotionPrims';

interface WalkthroughStage {
  step: number;
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: any;
  pillBadge: string;
  telemetry: {
    runtime: string;
    target: string;
    latency: string;
    status: string;
  };
  mockInterface: React.ReactNode;
}

export function Walkthrough() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stages: WalkthroughStage[] = [
    {
      step: 1,
      id: 'import',
      title: 'Import Resume',
      tagline: 'Client-side WASM parsing directly in memory',
      description:
        'Drop your PDF or DOCX file. WebAssembly text extractors parse work experience, education, projects, and skills directly inside your browser tab. Zero binary files are ever transmitted to external servers.',
      icon: FileUp,
      pillBadge: 'LOCAL_FILE_STREAM',
      telemetry: {
        runtime: 'WASM PDF Worker',
        target: 'Memory Buffer',
        latency: '34ms',
        status: 'Extracted Offline',
      },
      mockInterface: (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border-2 border-dashed border-emerald-500/40 bg-emerald-950/10 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <FileUp className="w-6 h-6 animate-bounce" />
            </div>
            <div className="text-sm font-bold text-white mb-1">
              Sarah_Chen_Staff_Engineer_2026.pdf
            </div>
            <div className="text-xs font-mono text-emerald-400">142 KB • PDF 1.7 Spec</div>
            <div className="mt-3 px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-700/50 text-[11px] font-mono text-emerald-300">
              WebAssembly Text Parser Active
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
            <div className="text-slate-500 text-[10px] uppercase">Extraction Output Stream</div>
            <div className="text-emerald-400">✓ Parsed 3 employment records (FinScale, CloudCore, HyperDev)</div>
            <div className="text-emerald-400">✓ Extracted 14 technical keywords (Go, TS, Kubernetes, Kafka)</div>
            <div className="text-emerald-400">✓ Identified 3 verified URLs (GitHub, LinkedIn, Personal Site)</div>
          </div>
        </div>
      ),
    },
    {
      step: 2,
      id: 'extract',
      title: 'Extract Profile',
      tagline: 'Structured schema in chrome.storage.local',
      description:
        'The parsed attributes are normalized into a queryable, extensible JSON candidate schema. You can create multiple role variants (e.g., Staff Infrastructure vs. Lead Fullstack) and export or edit them at any time.',
      icon: FileCode2,
      pillBadge: 'CHROME_STORAGE_LOCAL',
      telemetry: {
        runtime: 'Local Storage Engine',
        target: 'chrome.storage.local',
        latency: '4ms',
        status: 'Persisted Locally',
      },
      mockInterface: (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-500">
            <span>profile_variant: "infrastructure-lead"</span>
            <span className="text-emerald-400">Schema Validated</span>
          </div>
          <pre className="text-slate-200 text-[11px] leading-relaxed">
{`{
  "candidate": "Sarah Chen",
  "verified_roles": [
    {
      "company": "FinScale Systems",
      "title": "Senior Infrastructure Architect",
      "duration": "2023 - Present",
      "highlights": ["Scaled Kafka to 120k events/sec", "Cut p99 latency 42%"]
    }
  ],
  "saved_screening_answers": {
    "work_auth_us": true,
    "notice_period_weeks": 3
  }
}`}
          </pre>
        </div>
      ),
    },
    {
      step: 3,
      id: 'detect',
      title: 'Detect ATS Platform',
      tagline: 'Heuristic DOM analysis & selector recognition',
      description:
        'When you navigate to any job board, ApplyPilot checks URL signatures and DOM container hierarchies to recognize Greenhouse, Lever, Ashby, or Workday forms without executing tracking scripts.',
      icon: Scan,
      pillBadge: 'DOM_SIGNATURE_PROBE',
      telemetry: {
        runtime: 'DOM Mutation Observer',
        target: 'boards.greenhouse.io',
        latency: '18ms',
        status: 'Signatures Matched',
      },
      mockInterface: (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">Target URL</span>
              <span className="text-emerald-400">Pattern #04 (Greenhouse)</span>
            </div>
            <div className="text-white text-xs truncate">https://boards.greenhouse.io/acme/jobs/48201</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-500 text-[10px]">Inputs Identified</div>
              <div className="text-white font-bold text-sm mt-0.5">14 Target Fields</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-500 text-[10px]">DOM Framework</div>
              <div className="text-emerald-400 font-bold text-sm mt-0.5">React 18 SSR</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            Mapped selectors: <code className="text-slate-200">#first_name, #last_name, #email, #phone, #urls_linkedin</code>
          </div>
        </div>
      ),
    },
    {
      step: 4,
      id: 'populate',
      title: 'Populate Fields',
      tagline: 'Synthetic event injection with native change triggers',
      description:
        'ApplyPilot injects your candidate values and dispatches synthetic input, change, and blur events so reactive frontend frameworks (React, Vue, Angular) register state updates automatically.',
      icon: Zap,
      pillBadge: 'SYNTHETIC_EVENT_DISPATCH',
      telemetry: {
        runtime: 'Event Dispatcher',
        target: 'Active Tab Window',
        latency: '62ms',
        status: 'Populated 14/14',
      },
      mockInterface: (
        <div className="space-y-2.5 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              #applicant_name
            </span>
            <span className="text-[11px] text-slate-400 font-sans">"Sarah Chen"</span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              #applicant_email
            </span>
            <span className="text-[11px] text-slate-400 font-sans">"sarah.chen@example.dev"</span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              #work_auth_status
            </span>
            <span className="text-[11px] text-slate-400 font-sans">"US Citizen (No Visa Needed)"</span>
          </div>

          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
            Event Log: <span className="text-emerald-400">element.dispatchEvent(new Event('input', &#123; bubbles: true &#125;))</span>
          </div>
        </div>
      ),
    },
    {
      step: 5,
      id: 'generate',
      title: 'Generate AI Answers',
      tagline: 'Fact-grounded tailoring with zero external leaks',
      description:
        'For open-ended screening questions, ApplyPilot prompts your local Ollama daemon or Gemini API using only your verified history. No hallucinated qualifications or irrelevant fluff.',
      icon: Bot,
      pillBadge: 'AI_GROUNDED_INFERENCE',
      telemetry: {
        runtime: 'Ollama localhost:11434',
        target: 'mistral:latest',
        latency: '1.2s',
        status: 'Generated 64 tokens',
      },
      mockInterface: (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
            <span className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" /> Ollama Local Inference
            </span>
            <span>mistral:latest</span>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Prompt: "Why are you interested in our high-scale distributed systems team?"
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
            <StreamingText
              text="In my previous role at FinScale, I scaled real-time message streams to 120k events/sec. Your technical challenges around multi-region partition tolerance align directly with my hands-on background."
              speed={16}
            />
          </div>
        </div>
      ),
    },
    {
      step: 6,
      id: 'review',
      title: 'Review & Submit',
      tagline: 'Human in the loop at every single step',
      description:
        'ApplyPilot strictly forbids auto-submission bots. You review all pre-filled fields, inspect drafted screening answers, attach your resume PDF, solve any CAPTCHAs, and click submit yourself.',
      icon: UserCheck,
      pillBadge: 'HUMAN_CONFIRMATION_GATE',
      telemetry: {
        runtime: 'Candidate Review Gate',
        target: 'Submit Action',
        latency: 'Awaiting User',
        status: 'Manual Only',
      },
      mockInterface: (
        <div className="p-5 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <UserCheck className="w-6 h-6" />
          </div>

          <div>
            <h4 className="text-base font-bold text-white mb-1">Human Verification Checkpoint</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All 14 fields populated. You retain 100% control to review, edit, and click "Submit Application" when satisfied.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono">
            <Check className="w-4 h-4 text-emerald-400" /> Ready for Candidate Review
          </div>
        </div>
      ),
    },
  ];

  // Auto-advance
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStage = stages[activeStep];
  const StepIcon = currentStage.icon;

  return (
    <section id="walkthrough" className="py-24 sm:py-32 bg-[#090b10] border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="INTERACTIVE PRODUCT WALKTHROUGH"
          badgeIcon={<Layers className="w-3.5 h-3.5" />}
          title="From Local Resume to Application Submission"
          subtitle="Explore the 6-stage lifecycle engineered into ApplyPilot. An illustrative conceptual simulation of client-side resume intelligence."
        />

        {/* Step Progress Bar & Controls */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-md mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400">
                STAGE {currentStage.step} OF {stages.length}:
              </span>
              <span className="text-xs font-mono text-slate-300 uppercase">
                {currentStage.pillBadge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Auto-advance</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setActiveStep((prev) => (prev > 0 ? prev - 1 : stages.length - 1));
                    setIsPlaying(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveStep((prev) => (prev + 1) % stages.length);
                    setIsPlaying(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                  aria-label="Next step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Step Pill Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {stages.map((st, idx) => {
              const Icon = st.icon;
              const isActive = activeStep === idx;

              return (
                <button
                  key={st.id}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 border-emerald-500/50 shadow-md shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      0{st.step}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  </div>
                  <div
                    className={`text-xs font-bold truncate ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {st.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Presentation Split Deck */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-[#0c0f17] p-6 sm:p-8 lg:p-10 shadow-2xl relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Narrative & Technical Guarantees */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
                      Stage 0{currentStage.step} Pipeline
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {currentStage.title}
                    </h3>
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                  {currentStage.tagline}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentStage.description}
                </p>

                {/* Telemetry Matrix */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Runtime Target</span>
                    <span className="text-slate-200">{currentStage.telemetry.target}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Execution Latency</span>
                    <span className="text-emerald-400">{currentStage.telemetry.latency}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Mockup Interface */}
              <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-[#090b10] p-5 shadow-inner">
                {currentStage.mockInterface}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Disclaimers */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>Illustrative product demonstration of planned Phase 2 extension workflows</span>
            </span>
            <span className="hidden sm:inline text-slate-500">Zero Cloud Uploads</span>
          </div>
        </div>
      </div>
    </section>
  );
}
