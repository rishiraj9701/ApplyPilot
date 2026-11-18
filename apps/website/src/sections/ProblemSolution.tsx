import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  XCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock,
  ArrowRight,
  TrendingUp,
  FileQuestion,
  FileSpreadsheet,
  Layers,
  Terminal,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { FadeIn } from '../animations/MotionPrims';

interface ProblemPoint {
  id: string;
  category: string;
  problemTitle: string;
  problemSnippet: string;
  problemTime: string;
  solutionTitle: string;
  solutionSnippet: string;
  solutionMetric: string;
  codeDiff: {
    chaos: string;
    clarity: string;
  };
}

const COMPARISONS: ProblemPoint[] = [
  {
    id: 'data-entry',
    category: 'Form Redundancy',
    problemTitle: 'Re-typing the same 35+ fields across 40 career portals',
    problemSnippet:
      'Every portal demands your name, phone, address, universities, GPAs, start/end dates, work history bullet points, LinkedIn, GitHub, and visa status.',
    problemTime: '15–20 minutes per application',
    solutionTitle: 'Deterministic In-Process Autofill',
    solutionSnippet:
      'ApplyPilot detects the active ATS DOM structure and injects your verified local candidate attributes with proper synthetic events in 120ms.',
    solutionMetric: '90% reduction in clerical time',
    codeDiff: {
      chaos: `// The Manual Nightmare
for (let job = 0; job < 50; job++) {
  copyPaste(name, email, phone, bio);
  retypeExperienceHistory(2019, 2026);
  reanswerVisasAndSalaryRequirements();
  // 18 minutes wasted per form
}`,
      clarity: `// The ApplyPilot Architecture
await applypilot.detectATS();
// Mapped: Greenhouse (14 fields)
applypilot.injectVerifiedProfile();
// Completed in 118ms • User verifies`,
    },
  },
  {
    id: 'screening-answers',
    category: 'Custom Screening',
    problemTitle: 'Rewriting repetitive "Why us?" and situational answers',
    problemSnippet:
      'Questions like "Describe your experience with high-concurrency systems" force you to repeatedly re-draft answers from scratch across different ATS portals.',
    problemTime: '20–30 minutes drafting',
    solutionTitle: 'Fact-Grounded Local AI Tailoring',
    solutionSnippet:
      'Prompts local Ollama or user-owned Gemini using strictly your verified accomplishments to draft coherent, first-person answers ready for review.',
    solutionMetric: 'Drafted in under 2 seconds',
    codeDiff: {
      chaos: `// Rewriting screening answers
const answer = typeFromScratch({
  stress: "High",
  hallucinationRisk: "High",
  consistency: "Fragmented"
});`,
      clarity: `// Grounded Local AI Synthesis
const answer = await ollama.draft({
  groundingFacts: candidate.verifiedRoles,
  prompt: job.screeningQuestion,
  allowExternalTelemetry: false
});`,
    },
  },
  {
    id: 'resume-sprawl',
    category: 'Variant Sprawl',
    problemTitle: 'Juggling 10 conflicting versions of PDF resumes',
    problemSnippet:
      'Accidentally applying with "Resume_Final_v2_Frontend.pdf" to a Backend role because files are scattered across Downloads folders.',
    problemTime: 'Accidental mismatches',
    solutionTitle: 'Unified Variant Persona Switcher',
    solutionSnippet:
      'Maintain separate target personas (e.g. Infrastructure, Fullstack, Machine Learning) in local browser storage and switch with a single click.',
    solutionMetric: 'Instant persona switching',
    codeDiff: {
      chaos: `// Chaos in ~/Downloads/
Resume_Final_2026.pdf
Resume_Frontend_v3_NEW.pdf
Resume_FullStack_FinalFINAL.pdf`,
      clarity: `// ApplyPilot Local Persona Switcher
applypilot.setActiveVariant("Staff-Infra");
// Selectors instantly updated to Infra persona`,
    },
  },
  {
    id: 'tracking-blackhole',
    category: 'Application Blackhole',
    problemTitle: 'Losing track of where, when, and what you submitted',
    problemSnippet:
      'Manual spreadsheets that quickly fall out of date. You get a recruiter screening call but cannot remember which specific answers you sent.',
    problemTime: 'Messy manual spreadsheets',
    solutionTitle: 'Local Submission Ledger',
    solutionSnippet:
      'Automatically logs company, role, ATS platform, timestamp, and submitted answers into a private local ledger you can export anytime as CSV or JSON.',
    solutionMetric: 'Zero spreadsheet maintenance',
    codeDiff: {
      chaos: `// Outdated spreadsheet row
Acme Corp | Engineer | Applied ??? | Notes: "Forgot which answers I sent"`,
      clarity: `// Immutable Local Ledger
{
  "company": "Acme Corp",
  "ats": "Greenhouse",
  "submittedAt": "2026-11-18",
  "answers": { "q1": "Scaled Kafka to 120k/s" }
}`,
    },
  },
];

export function ProblemSolution() {
  const [activeTab, setActiveTab] = useState(0);

  const current = COMPARISONS[activeTab];

  return (
    <section className="py-24 sm:py-32 bg-[#07090e] border-t border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="THE APPLICATION BOTTLENECK"
          badgeIcon={<AlertCircle className="w-3.5 h-3.5" />}
          title="Why the Job Search Feels Like Clerical Homework"
          subtitle="Modern applicant tracking systems force candidates to repeatedly copy-paste their career history. ApplyPilot replaces friction with deterministic local automation."
        />

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-4xl mx-auto">
          {COMPARISONS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium font-mono transition-all cursor-pointer ${
                activeTab === idx
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 border border-slate-800/70'
              }`}
            >
              <span className="text-emerald-400 mr-2">0{idx + 1}.</span>
              {item.category}
            </button>
          ))}
        </div>

        {/* Full-Width Asymmetrical Editorial Split */}
        <div className="max-w-6xl mx-auto rounded-3xl border border-slate-800 bg-[#0a0d14] overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
              className="grid grid-cols-1 lg:grid-cols-12 items-stretch"
            >
              {/* Left Column: The Manual Friction */}
              <div className="lg:col-span-6 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-800 bg-rose-950/[0.07] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-rose-500/20">
                    <span className="inline-flex items-center gap-2 text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
                      <XCircle className="w-4 h-4" /> The Status Quo
                    </span>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      {current.problemTime}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    {current.problemTitle}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {current.problemSnippet}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-950/90 border border-rose-500/20 font-mono text-xs text-rose-300/80 overflow-x-auto">
                    <pre className="text-[11px] leading-relaxed">{current.codeDiff.chaos}</pre>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-rose-500/15 text-xs font-mono text-rose-400/90 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span>Cognitive cost: Exhaustion before the interview begins</span>
                </div>
              </div>

              {/* Right Column: The ApplyPilot Solution */}
              <div className="lg:col-span-6 p-6 sm:p-10 bg-emerald-950/[0.08] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-emerald-500/20">
                    <span className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" /> ApplyPilot Architecture
                    </span>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {current.solutionMetric}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    {current.solutionTitle}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {current.solutionSnippet}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 font-mono text-xs text-emerald-300 overflow-x-auto">
                    <pre className="text-[11px] leading-relaxed">{current.codeDiff.clarity}</pre>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-emerald-500/20 text-xs font-mono text-emerald-400 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Always local • 100% human-approved</span>
                  </span>
                  <a
                    href="#features"
                    className="hover:underline flex items-center gap-1 text-[11px]"
                  >
                    View capability <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quantitative Grounded Metrics Ribbon */}
        <FadeIn delay={0.2} direction="up" className="mt-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-slate-800 bg-[#0a0d14] text-center">
            <div className="p-3 border-r border-slate-800/80 last:border-none">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">100%</div>
              <div className="text-xs font-mono text-slate-400 mt-1">Local Browser Storage</div>
            </div>
            <div className="p-3 border-r border-slate-800/80 last:border-none">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">0</div>
              <div className="text-xs font-mono text-slate-400 mt-1">Cloud Resume Relays</div>
            </div>
            <div className="p-3 border-r border-slate-800/80 last:border-none">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">&lt; 150ms</div>
              <div className="text-xs font-mono text-slate-400 mt-1">Autofill Execution</div>
            </div>
            <div className="p-3 last:border-none">
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">Manual</div>
              <div className="text-xs font-mono text-slate-400 mt-1">Submission Gate</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
