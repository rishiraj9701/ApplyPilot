import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  FileText,
  UserCheck2,
  Globe2,
  Zap,
  CheckCircle2,
  MousePointerClick,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';

interface WorkflowStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  timeEstimate: string;
  technicalGuarantee: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: '01',
    title: 'Download Release ZIP',
    subtitle: 'GitHub Releases Channel',
    description: 'Download the unpacked extension archive directly from GitHub Releases without requiring Chrome Web Store telemetry.',
    icon: Download,
    timeEstimate: '30 seconds',
    technicalGuarantee: 'Zero tracking IDs installed',
  },
  {
    number: '02',
    title: 'Import Candidate Resume',
    subtitle: 'Local In-Memory Extraction',
    description: 'Drop your PDF or DOCX file. Client-side WebAssembly extractors parse credentials directly inside your browser tab.',
    icon: FileText,
    timeEstimate: '3 seconds',
    technicalGuarantee: 'No cloud server uploads',
  },
  {
    number: '03',
    title: 'Configure Profile Variants',
    subtitle: 'Local chrome.storage.local',
    description: 'Review your parsed career history, verify contact links, and save recurring responses for visas, notice periods, and salary.',
    icon: UserCheck2,
    timeEstimate: '2 minutes (once)',
    technicalGuarantee: 'Persists in local browser storage',
  },
  {
    number: '04',
    title: 'Navigate to Job Opening',
    subtitle: 'Active ATS Heuristic Probe',
    description: 'Browse to any open role on Greenhouse, Lever, Ashby, or Workday. ApplyPilot recognizes form containers non-intrusively.',
    icon: Globe2,
    timeEstimate: 'Instant',
    technicalGuarantee: 'Passive DOM observation only',
  },
  {
    number: '05',
    title: 'Execute Field Autofill',
    subtitle: 'Synthetic Event Dispatch',
    description: 'ApplyPilot populates inputs with verified profile values and dispatches native change events so modern SPAs register the updates.',
    icon: Zap,
    timeEstimate: '< 150ms',
    technicalGuarantee: 'React & Vue state compatible',
  },
  {
    number: '06',
    title: 'Review Grounded AI Answers',
    subtitle: 'Local Ollama / Gemini BYOK',
    description: 'Inspect drafted answers to open-ended prompts like "Why this role?". Refine or regenerate using your local LLM model.',
    icon: CheckCircle2,
    timeEstimate: '10–20 seconds',
    technicalGuarantee: 'Zero unverified hallucinations',
  },
  {
    number: '07',
    title: 'Submit Manually',
    subtitle: 'Human in the Loop Guarantee',
    description: 'Verify attachments, solve any CAPTCHA, and click Submit. ApplyPilot has no automated submit scripts, keeping you in complete control.',
    icon: MousePointerClick,
    timeEstimate: 'Final review',
    technicalGuarantee: 'Zero automated submissions',
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-[#090b10] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="EXECUTION LIFECYCLE"
          badgeIcon={<Clock className="w-3.5 h-3.5" />}
          title="From Download to Submission in Seven Steps"
          subtitle="A predictable, transparent pipeline designed to save you hours while keeping you in complete control of every application."
        />

        {/* Chronological Vertical Flow */}
        <div className="max-w-4xl mx-auto space-y-4">
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`group p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0c0f17] border-emerald-500/50 shadow-xl shadow-emerald-950/25 ring-1 ring-emerald-500/30'
                    : 'bg-[#0c0f17]/40 border-slate-800/80 hover:border-slate-700 hover:bg-[#0c0f17]/70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Number Badge */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-mono text-sm font-bold flex-shrink-0 transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-emerald-400'
                      }`}
                    >
                      {step.number}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {step.title}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                          • {step.subtitle}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Guarantee & Time pill */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60 font-mono text-xs">
                    <span className="text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/40">
                      {step.timeEstimate}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">
                      {step.technicalGuarantee}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
