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
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { FadeIn } from '../animations/MotionPrims';

interface WorkflowStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  timeEstimate: string;
  detail: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: '01',
    title: 'Download ApplyPilot',
    subtitle: 'GitHub Release Archive',
    description: 'Get the latest release ZIP from the official repository and load it as an unpacked extension in any Chromium browser.',
    icon: Download,
    timeEstimate: '30 seconds',
    detail: 'Zero store sign-ups or telemetry trackers installed.',
  },
  {
    number: '02',
    title: 'Import Your Resume',
    subtitle: 'Local In-Memory Parsing',
    description: 'Drop your PDF or DOCX file. WebAssembly parses work history, technical skills, and credentials directly in your tab.',
    icon: FileText,
    timeEstimate: '3 seconds',
    detail: 'Never uploaded to any server or cloud API.',
  },
  {
    number: '03',
    title: 'Review Local Profile',
    subtitle: 'Configure Variant Personas',
    description: 'Fine-tune your personal information, links, and pre-saved answers for recurring questions (visas, salary, notice period).',
    icon: UserCheck2,
    timeEstimate: '2 minutes once',
    detail: 'Persists securely in chrome.storage.local.',
  },
  {
    number: '04',
    title: 'Open Job Application',
    subtitle: 'Automatic Signature Match',
    description: 'Browse to any job opening on Greenhouse, Lever, Ashby, or Workday. The extension activates when an ATS form is recognized.',
    icon: Globe2,
    timeEstimate: 'Instant',
    detail: 'Runs non-intrusively in the background until needed.',
  },
  {
    number: '05',
    title: 'Autofill Form Fields',
    subtitle: '1-Click Precision Injection',
    description: 'ApplyPilot populates contact fields, work history, links, and screening responses with proper DOM change events.',
    icon: Zap,
    timeEstimate: '< 150 ms',
    detail: 'Supports single-page apps like React and Vue.',
  },
  {
    number: '06',
    title: 'Review AI Answers',
    subtitle: 'First-Person Fact Grounding',
    description: 'Inspect drafted answers to open-ended questions. Edit or regenerate using local Ollama or your own Gemini key.',
    icon: CheckCircle2,
    timeEstimate: '10–20 seconds',
    detail: 'Grounded strictly in your actual employment track record.',
  },
  {
    number: '07',
    title: 'Submit Manually',
    subtitle: 'Human-in-the-Loop Always',
    description: 'Verify attachments, answer any final CAPTCHA, and click Submit. You retain 100% control over every single submission.',
    icon: MousePointerClick,
    timeEstimate: 'Final review',
    detail: 'No accidental submissions or algorithmic bans.',
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#090a0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="WORKFLOW"
          badgeIcon={<Clock className="w-3.5 h-3.5" />}
          title="From Download to Submission in Seven Steps"
          subtitle="A predictable, transparent workflow that prioritizes your autonomy, security, and time."
        />

        {/* Interactive Timeline Flow */}
        <div className="max-w-5xl mx-auto space-y-4">
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`group p-5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0c0e14] border-emerald-500/50 shadow-xl shadow-emerald-950/20'
                    : 'bg-[#0c0e14]/50 border-slate-800/80 hover:border-slate-700 hover:bg-[#0c0e14]/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Number Badge */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm font-bold flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
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
                        <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
                          • {step.subtitle}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Time Badge and Indicator */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                    <span className="text-xs font-mono text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/40">
                      {step.timeEstimate}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 mt-1">
                      {step.detail}
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
