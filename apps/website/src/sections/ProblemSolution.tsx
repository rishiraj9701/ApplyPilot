import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  XCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Clock,
  FileSpreadsheet,
  Lock,
  ArrowRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { FadeIn } from '../animations/MotionPrims';

interface ProblemPoint {
  problemTitle: string;
  problemDesc: string;
  timeSpent: string;
  solutionTitle: string;
  solutionDesc: string;
  impactMetric: string;
}

const COMPARISONS: ProblemPoint[] = [
  {
    problemTitle: 'Re-typing the same 30+ form inputs',
    problemDesc: 'Every career portal asks for your name, phone, address, education dates, GPA, LinkedIn, GitHub, portfolio URL, and visa status over and over again.',
    timeSpent: '12–18 mins per form',
    solutionTitle: 'Deterministic ATS-Aware Autofill',
    solutionDesc: 'ApplyPilot maps and injects your verified local candidate attributes into standard ATS DOM inputs in under 150 milliseconds.',
    impactMetric: '90% faster initial fill',
  },
  {
    problemTitle: 'Re-crafting custom screening answers',
    problemDesc: 'Questions like "Describe your experience with Kubernetes" or "Why Acme Corp?" require context switching and repetitive typing from scratch.',
    timeSpent: '15–25 mins drafting',
    solutionTitle: 'Fact-Grounded AI Assistance',
    solutionDesc: 'Generates tailored first-person answers grounded strictly in your real employment history and current job requirements. Fully editable before submitting.',
    impactMetric: 'Drafted in 2 seconds',
  },
  {
    problemTitle: 'Chaotic resume versions & links',
    problemDesc: 'Juggling "Resume_v3_Final_Frontend.pdf" and "Resume_Backend_Updated.pdf" leads to accidental mismatches and lost credentials.',
    timeSpent: 'Frequent confusion',
    solutionTitle: 'Variant Profile Switcher',
    solutionDesc: 'Store multiple targeted personas (e.g. Infrastructure, Fullstack, Frontend) in your browser and switch between them with one click.',
    impactMetric: 'Instant persona matching',
  },
  {
    problemTitle: 'Losing track of where & what was applied',
    problemDesc: 'Applying to dozens of roles across LinkedIn, Lever, and Greenhouse makes it impossible to remember which specific version or answers you sent.',
    timeSpent: 'Messy manual spreadsheets',
    solutionTitle: 'Local Application Ledger',
    solutionDesc: 'Automatically records company, role, ATS platform, timestamp, and submitted answers into a private local ledger you can export anytime.',
    impactMetric: 'Zero spreadsheet maintenance',
  },
  {
    problemTitle: 'Fatigue and burnout before the interview',
    problemDesc: 'Job seekers spend 80% of their energy on clerical data entry and portal acrobatics instead of interview preparation and technical practice.',
    timeSpent: 'Severe job-search exhaustion',
    solutionTitle: 'Frictionless Momentum',
    solutionDesc: 'Reclaim your focus. Spend your time talking to engineering teams, mastering system design, and building projects that stand out.',
    impactMetric: '100% focus on interview prep',
  },
];

export function ProblemSolution() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const current = COMPARISONS[activeTab];

  return (
    <section className="py-20 sm:py-28 bg-[#0c0e14] border-t border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="THE APPLICATION BOTTLENECK"
          badgeIcon={<AlertCircle className="w-3.5 h-3.5" />}
          title="Why Applying for Jobs Feels Like Clerical Homework"
          subtitle="Modern hiring portals force candidates to repeatedly copy-paste their life story. ApplyPilot replaces tedious repetitive typing with local-first automation."
        />

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto">
          {COMPARISONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === idx
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'bg-slate-900/40 text-slate-400 hover:text-slate-200 border border-slate-800/60'
              }`}
            >
              <span className="font-mono text-emerald-400 mr-1.5">0{idx + 1}.</span>
              {item.problemTitle.split(' ').slice(0, 3).join(' ')}...
            </button>
          ))}
        </div>

        {/* Comparative Side-by-Side Visual Card */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#090a0f] p-6 sm:p-8 lg:p-10 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
            >
              {/* Left Box: The Status Quo Pain */}
              <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-500/20">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-400 font-semibold uppercase">
                      <XCircle className="w-4 h-4" /> The Repetitive Reality
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      {current.timeSpent}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                    {current.problemTitle}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {current.problemDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-rose-500/20 text-xs font-mono text-rose-300/80 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>Cost: Wasted cognitive energy before interviews</span>
                </div>
              </div>

              {/* Right Box: The ApplyPilot Solution */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-500/20">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-semibold uppercase">
                      <CheckCircle2 className="w-4 h-4" /> The ApplyPilot Approach
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {current.impactMetric}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
                    {current.solutionTitle}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {current.solutionDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-emerald-500/20 text-xs font-mono text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Always local & 100% human-approved</span>
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

        {/* Quantitative summary banner */}
        <FadeIn delay={0.2} direction="up" className="mt-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl border border-slate-800 bg-[#0c0e14] text-center">
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-1">Local Browser Storage</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">0</div>
              <div className="text-xs text-slate-400 mt-1">Cloud Resume Uploads</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">&lt; 150ms</div>
              <div className="text-xs text-slate-400 mt-1">DOM Autofill Dispatch</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">Manual</div>
              <div className="text-xs text-slate-400 mt-1">Final Submission Gate</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
