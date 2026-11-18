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
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { FadeIn } from '../animations/MotionPrims';

interface StepData {
  step: number;
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: any;
  techBadge: string;
  previewTitle: string;
  previewContent: {
    statusBadge: string;
    details: Array<{ label: string; value: string; isHighlight?: boolean }>;
    codePreview?: string;
    actionLabel?: string;
  };
}

const STEPS: StepData[] = [
  {
    step: 1,
    id: 'import',
    title: 'Import Resume',
    shortDesc: 'Client-side PDF / DOCX parse',
    fullDesc:
      'Drop your existing resume directly into ApplyPilot. The file is parsed strictly inside your browser tab using WebAssembly-based PDF text extractors. Zero files are ever transmitted to a cloud server.',
    icon: FileUp,
    techBadge: 'WASM PDF EXTRACTOR',
    previewTitle: 'Local File Importer',
    previewContent: {
      statusBadge: '100% Client-Side Processing',
      details: [
        { label: 'Selected File', value: 'Sarah_Chen_Staff_Engineer_2026.pdf' },
        { label: 'File Size', value: '142 KB (Local memory)' },
        { label: 'Network Destination', value: 'None (Offline Web Worker)' },
        { label: 'Extraction Mode', value: 'Structured text & semantic sectioning' },
      ],
      actionLabel: 'Extracting profile blocks...',
    },
  },
  {
    step: 2,
    id: 'extract',
    title: 'Extract Profile',
    shortDesc: 'Structured local candidate schema',
    fullDesc:
      'ApplyPilot categorizes your experience, education, key metrics, technical skills, and links into a queryable local candidate profile. You can tweak, update, or create multiple role-specific variants anytime.',
    icon: FileCode2,
    techBadge: 'CHROME.STORAGE.LOCAL',
    previewTitle: 'Local Candidate Schema',
    previewContent: {
      statusBadge: 'Saved to chrome.storage.local',
      details: [
        { label: 'Identified Roles', value: '3 Companies (FinScale, CloudCore, HyperDev)' },
        { label: 'Verified Skills', value: 'TypeScript, Go, React, Distributed Systems, Kubernetes' },
        { label: 'Portfolio Repos', value: 'github.com/sarahchen-dev (14 public repos)' },
        { label: 'Candidate Variants', value: 'Primary, Infra-Lead, FullStack' },
      ],
      codePreview: `{
  "candidate": "Sarah Chen",
  "years_exp": 6,
  "skills": ["Distributed Systems", "TypeScript", "React"],
  "variant": "Infrastructure Lead"
}`,
    },
  },
  {
    step: 3,
    id: 'detect',
    title: 'Detect ATS Platform',
    shortDesc: 'Greenhouse, Lever, Ashby, Workday',
    fullDesc:
      'When you navigate to a job opening, the extension inspects page signatures, DOM element patterns, and URL patterns to identify the underlying Applicant Tracking System and its input field hierarchy.',
    icon: Scan,
    techBadge: 'DOM PATTERN MATCHER',
    previewTitle: 'ATS Detection Engine',
    previewContent: {
      statusBadge: 'Greenhouse.io Signature Verified',
      details: [
        { label: 'Active Domain', value: 'boards.greenhouse.io' },
        { label: 'Detected ATS', value: 'Greenhouse Careers v2.4' },
        { label: 'Form Elements', value: '18 total inputs (14 standard, 4 custom)' },
        { label: 'Compatibility', value: 'Full field mapping available' },
      ],
      actionLabel: 'Ready for deterministic injection',
    },
  },
  {
    step: 4,
    id: 'populate',
    title: 'Populate Fields',
    shortDesc: 'Simulated human input dispatch',
    fullDesc:
      'ApplyPilot matches and fills form fields: personal information, work authorizations, education dates, and profile links. It fires synthetic input, change, and blur events so modern single-page frameworks recognize the updates.',
    icon: Zap,
    techBadge: 'SYNTHETIC EVENT DISPATCH',
    previewTitle: 'Autofill Execution Monitor',
    previewContent: {
      statusBadge: '14 Fields Mapped & Populated',
      details: [
        { label: 'Name & Contact', value: 'Sarah Chen / sarah.chen@example.dev', isHighlight: true },
        { label: 'URLs & Portfolios', value: 'LinkedIn, GitHub, Portfolio populated', isHighlight: true },
        { label: 'Work Eligibility', value: 'Yes (US Citizen, No sponsorship needed)', isHighlight: true },
        { label: 'Event Simulation', value: 'Dispatched InputEvent & CustomEvent ("change")' },
      ],
      actionLabel: 'Autofill completed in 84ms',
    },
  },
  {
    step: 5,
    id: 'generate',
    title: 'Generate AI Answers',
    shortDesc: 'Tailored first-person drafts',
    fullDesc:
      'For open-ended questions like "Describe a challenging distributed systems incident you resolved", ApplyPilot synthesizes a concise, compelling answer strictly from your real profile achievements, using Ollama locally or Gemini.',
    icon: Bot,
    techBadge: 'GROUNDED CONTEXT PROMPT',
    previewTitle: 'AI Screening Synthesis',
    previewContent: {
      statusBadge: 'Synthesized via Ollama (mistral:latest)',
      details: [
        { label: 'Prompt Target', value: '"Describe your experience with high-load telemetry."' },
        { label: 'Context Source', value: 'Extracted from FinScale employment history block' },
        { label: 'Drafted Output', value: '"At FinScale, I scaled telemetry ingestion to 120k events/sec using Kafka and ClickHouse, reducing p99 latency by 42%."', isHighlight: true },
        { label: 'Hallucination Check', value: 'Grounded: 0 unverified claims detected' },
      ],
      actionLabel: 'Generated in 1.4s (Offline local inference)',
    },
  },
  {
    step: 6,
    id: 'review',
    title: 'Review & Submit',
    shortDesc: 'Strict human-in-the-loop control',
    fullDesc:
      'ApplyPilot never submits an application automatically. You inspect all auto-filled inputs, review and edit generated text, attach files, solve any CAPTCHAs, and click the final submit button yourself.',
    icon: UserCheck,
    techBadge: 'ZERO AUTO-SUBMISSION',
    previewTitle: 'Human Verification Gate',
    previewContent: {
      statusBadge: 'Awaiting User Confirmation',
      details: [
        { label: 'Pre-filled Inputs', value: 'Reviewed by candidate' },
        { label: 'AI Responses', value: 'Inspected and customized' },
        { label: 'Submission Method', value: 'Manual user click only' },
        { label: 'Architecture Rule', value: 'No programmatic submit trigger exists' },
      ],
      actionLabel: 'Ready for your final review and submission',
    },
  },
];

export function Walkthrough() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-advance walkthrough when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const current = STEPS[activeStep];
  const StepIcon = current.icon;

  return (
    <section id="walkthrough" className="py-20 sm:py-28 bg-[#090a0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="CONCEPTUAL USER JOURNEY"
          badgeIcon={<Layers className="w-3.5 h-3.5" />}
          title="How ApplyPilot Accelerates Every Application"
          subtitle="An illustrative step-by-step walkthrough of the planned extension workflow. From local resume parsing to human-controlled submission."
        />

        {/* Step Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setActiveStep(idx);
                  setIsPlaying(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono ${
                    isActive ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {s.step}
                </div>
                <span className="hidden sm:inline">{s.title}</span>
                <span className="sm:hidden">{s.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Walkthrough Card */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#0c0e14] shadow-2xl overflow-hidden">
          {/* Top Progress & Playback Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-900/70 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-emerald-400 font-semibold">
                STEP {current.step} OF {STEPS.length}
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wide">
                {current.techBadge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                aria-label={isPlaying ? 'Pause walkthrough autoplay' : 'Play walkthrough autoplay'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3 text-amber-400" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>Auto-advance</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setActiveStep((prev) => (prev > 0 ? prev - 1 : STEPS.length - 1));
                    setIsPlaying(false);
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveStep((prev) => (prev + 1) % STEPS.length);
                    setIsPlaying(false);
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                  aria-label="Next step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Progress Indicator line */}
          <div className="w-full bg-slate-900 h-1">
            <div
              className="bg-emerald-500 h-1 transition-all duration-500 ease-out"
              style={{ width: `${((current.step) / STEPS.length) * 100}%` }}
            />
          </div>

          {/* Main Step Content Area */}
          <div className="p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left Description */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
                        Phase 1 Simulation
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{current.title}</h3>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {current.fullDesc}
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-2">
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Key Guarantee:
                    </div>
                    <p className="text-slate-300 leading-normal">
                      {current.step === 1 && 'Files never touch any external server; parsed directly in local WASM memory.'}
                      {current.step === 2 && 'Structured JSON candidate data resides strictly in your browser.'}
                      {current.step === 3 && 'Form detection runs non-destructively without modifying ATS submission logic.'}
                      {current.step === 4 && 'Fires standard DOM change events to support React, Angular, and Vue forms.'}
                      {current.step === 5 && 'Context is bound strictly to factual employment records to prevent hallucinations.'}
                      {current.step === 6 && 'No programmatic click handler exists for submission buttons. You stay in control.'}
                    </p>
                  </div>
                </div>

                {/* Right Interactive Simulator Box */}
                <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-inner">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono font-medium text-slate-200">
                        {current.previewTitle}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {current.previewContent.statusBadge}
                    </span>
                  </div>

                  {/* Detail Rows */}
                  <div className="space-y-3 mb-4 text-xs font-mono">
                    {current.previewContent.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border transition-all ${
                          detail.isHighlight
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="text-[10px] text-slate-500 mb-0.5">{detail.label}</div>
                        <div className="font-sans text-xs sm:text-sm font-medium text-slate-200">
                          {detail.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Code snippet if present */}
                  {current.previewContent.codePreview && (
                    <div className="p-3 rounded-lg bg-black/60 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto mb-3">
                      <pre>{current.previewContent.codePreview}</pre>
                    </div>
                  )}

                  {/* Footer Action Label */}
                  {current.previewContent.actionLabel && (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">
                        {current.previewContent.actionLabel}
                      </span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                        Verified <Check className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom disclaimer */}
          <div className="px-6 py-3 bg-slate-900/40 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Illustrative walkthrough demonstrating the planned extension workflow. The website itself does not upload or process your files.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
