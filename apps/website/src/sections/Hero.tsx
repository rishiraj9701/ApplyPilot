import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Zap,
  Bot,
  Terminal,
  RefreshCw,
  ExternalLink,
  Layers,
  FileCheck2,
  Lock,
  ArrowRight,
  Database,
} from 'lucide-react';
import { GithubIcon } from '../components/BrandIcons';
import { SITE_CONFIG } from '../config/site';
import {
  MagneticButton,
  FadeIn,
  ScrambleText,
  StreamingText,
  HoldButton,
} from '../animations/MotionPrims';

interface Persona {
  id: string;
  label: string;
  role: string;
  name: string;
  email: string;
  linkedin: string;
  portfolio: string;
  yearsExp: string;
  screeningPrompt: string;
  streamingAnswer: string;
}

const PERSONAS: Persona[] = [
  {
    id: 'infra',
    label: 'Infrastructure Lead',
    role: 'Staff Infrastructure Engineer',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.dev',
    linkedin: 'linkedin.com/in/sarahchen-eng',
    portfolio: 'sarahchen.dev',
    yearsExp: '7 years • Distributed Systems, Go, Kubernetes',
    screeningPrompt: 'Describe a complex systems issue you investigated and resolved under load.',
    streamingAnswer:
      'At FinScale, I diagnosed a p99 latency spike caused by TCP connection churn in our Kafka broker pool. By implementing connection pooling and tuning epoll buffers, I reduced tail latency by 44% under 140k events/sec peak traffic.',
  },
  {
    id: 'fullstack',
    label: 'Full-Stack Specialist',
    role: 'Lead Full-Stack Developer',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.dev',
    linkedin: 'linkedin.com/in/alexrivera-tech',
    portfolio: 'alexrivera.io',
    yearsExp: '6 years • React 19, TypeScript, Node.js, PostgreSQL',
    screeningPrompt: 'Why are you the right fit for this product engineering position?',
    streamingAnswer:
      'I specialize in building reactive, high-density web applications. Previously at CloudCore, I led the migration of a legacy dashboard to optimistic UI updates, cutting user-perceived interaction delay from 480ms to under 50ms.',
  },
  {
    id: 'ai-eng',
    label: 'AI Systems Engineer',
    role: 'Senior Machine Learning Systems Engineer',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.dev',
    linkedin: 'linkedin.com/in/elena-rostova-ai',
    portfolio: 'rostova-ai.dev',
    yearsExp: '5 years • PyTorch, CUDA, vLLM, Distributed Inference',
    screeningPrompt: 'What experience do you have with low-latency local inference pipelines?',
    streamingAnswer:
      'I engineered quantized local model pipelines using Ollama and vLLM with KV-cache paging. We achieved 82 tokens/sec on consumer GPUs with 4-bit AWQ quantization while preserving 99.1% factual alignment on domain benchmarks.',
  },
];

export function Hero() {
  const [activePersona, setActivePersona] = useState<Persona>(PERSONAS[0]);
  const [activeView, setActiveView] = useState<'form' | 'json'>('form');
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [streamKey, setStreamKey] = useState(0);

  const triggerAutofill = () => {
    setIsSimulating(true);
    setToastMessage('Parsing candidate schema & matching ATS DOM selectors...');

    setTimeout(() => {
      setStreamKey((k) => k + 1);
      setToastMessage('Mapped 4/4 fields & streaming tailored response');
    }, 400);

    setTimeout(() => {
      setIsSimulating(false);
    }, 1800);

    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#07090e]">
      {/* Editorial background texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.22] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-emerald-500/10 via-emerald-950/5 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-cyan-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Editorial Typographic Row */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          {/* Engineering Pill */}
          <FadeIn delay={0.05} direction="down">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-mono border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.12)]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LOCAL-FIRST EXTENSION</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300">DETERMINISTIC FORM INJECTION</span>
              <span className="text-slate-600">/</span>
              <span className="text-emerald-400 font-bold">ZERO CLOUD RESUME LEAKS</span>
            </div>
          </FadeIn>

          {/* Grand Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-extrabold tracking-tight text-white mb-6 leading-[1.05]">
            Job applications.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
              Less repetition.
            </span>{' '}
            More momentum.
          </h1>

          {/* Subtitle */}
          <FadeIn delay={0.15} direction="up">
            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-10">
              Your resume, your rules. ApplyPilot automatically fills repetitive job application forms using your local candidate profile and optional AI. No subscriptions. No backend. Completely open source.
            </p>
          </FadeIn>

          {/* Action Row */}
          <FadeIn delay={0.25} direction="up">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <a
                  href="#install"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get ApplyPilot</span>
                  <span className="text-xs font-mono font-medium opacity-80 px-1.5 py-0.5 rounded bg-emerald-600/30">
                    Phase 1 Preview
                  </span>
                </a>
              </MagneticButton>

              <MagneticButton>
                <a
                  href={SITE_CONFIG.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all hover:text-white active:scale-[0.98]"
                >
                  <GithubIcon className="w-4 h-4 text-slate-400" />
                  <span>Explore on GitHub</span>
                </a>
              </MagneticButton>
            </div>
          </FadeIn>

          {/* Telemetry Chips */}
          <FadeIn delay={0.35} direction="up">
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                No subscriptions
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Local browser memory
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Ollama / Gemini optional
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Human-in-the-loop submission
              </span>
            </div>
          </FadeIn>
        </div>

        {/* Living Product Demonstration (Asymmetrical Layered Stage) */}
        <FadeIn delay={0.4} direction="up">
          <div className="max-w-6xl mx-auto rounded-2xl border border-slate-800/90 bg-[#0a0d14] shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden relative">
            {/* Stage Window Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#0d1017] border-b border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[11px] truncate max-w-[280px] sm:max-w-sm">
                  <span className="text-emerald-400">https://</span>
                  <span>boards.greenhouse.io/acme-systems/jobs/49821</span>
                </div>
              </div>

              {/* Persona Switcher Chips */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-500 hidden md:inline mr-1">
                  Candidate Persona:
                </span>
                {PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePersona(p);
                      setStreamKey((k) => k + 1);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                      activePersona.id === p.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Toast (Animated when simulating) */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-14 right-6 z-30 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-emerald-500/50 text-emerald-300 text-xs font-mono shadow-2xl flex items-center gap-2 backdrop-blur-md"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage Body Grid */}
            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#0a0d14] to-[#07090e]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Target ATS Form In Browser Tab */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                          Detected: Greenhouse ATS
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">DOM Mapped: 100%</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                        {activePersona.role}
                      </h3>
                      <p className="text-xs text-slate-400">Acme Cloud Infrastructure • San Francisco, CA</p>
                    </div>

                    <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                      <button
                        onClick={() => setActiveView('form')}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                          activeView === 'form'
                            ? 'bg-slate-800 text-white font-medium'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Form Inputs
                      </button>
                      <button
                        onClick={() => setActiveView('json')}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                          activeView === 'json'
                            ? 'bg-slate-800 text-white font-medium'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Local Schema
                      </button>
                    </div>
                  </div>

                  {activeView === 'form' ? (
                    /* Real Simulated ATS Form */
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-300 font-medium">
                            Full Name <span className="text-rose-400">*</span>
                          </label>
                          <span className="text-[10px] font-mono text-emerald-400">
                            #applicant_name → matched
                          </span>
                        </div>
                        <div
                          className={`px-3.5 py-2.5 rounded-lg bg-slate-900 border transition-all duration-300 ${
                            isSimulating
                              ? 'border-emerald-400 bg-emerald-950/20 ring-1 ring-emerald-400'
                              : 'border-slate-800 text-slate-200'
                          }`}
                        >
                          {activePersona.name}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-300 font-medium">
                              Email <span className="text-rose-400">*</span>
                            </label>
                          </div>
                          <div
                            className={`px-3.5 py-2.5 rounded-lg bg-slate-900 border transition-all truncate ${
                              isSimulating
                                ? 'border-emerald-400 bg-emerald-950/20 ring-1 ring-emerald-400'
                                : 'border-slate-800 text-slate-200'
                            }`}
                          >
                            {activePersona.email}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-300 font-medium">LinkedIn / Portfolio</label>
                          </div>
                          <div
                            className={`px-3.5 py-2.5 rounded-lg bg-slate-900 border transition-all truncate ${
                              isSimulating
                                ? 'border-emerald-400 bg-emerald-950/20 ring-1 ring-emerald-400'
                                : 'border-slate-800 text-slate-200'
                            }`}
                          >
                            {activePersona.linkedin}
                          </div>
                        </div>
                      </div>

                      {/* AI Generated Question */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-300 font-medium">
                            {activePersona.screeningPrompt}
                          </label>
                          <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                            <Bot className="w-3 h-3" /> AI Tailored
                          </span>
                        </div>
                        <div
                          className={`p-3.5 rounded-lg bg-slate-900/90 border transition-all text-slate-200 leading-relaxed text-[11px] ${
                            isSimulating
                              ? 'border-cyan-400 bg-cyan-950/20 ring-1 ring-cyan-400'
                              : 'border-slate-800'
                          }`}
                        >
                          <StreamingText
                            key={`${activePersona.id}-${streamKey}`}
                            text={activePersona.streamingAnswer}
                            speed={14}
                            isStreaming={true}
                          />
                        </div>
                      </div>

                      {/* Manual Submission Enforcement */}
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Human verification required before submit</span>
                        </span>

                        <button
                          type="button"
                          disabled
                          className="px-4 py-2 rounded-lg bg-slate-800/80 text-slate-400 text-xs font-semibold cursor-not-allowed border border-slate-700/60"
                        >
                          Submit Application (Manual)
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Local Schema JSON View */
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                          ~/.applypilot/profiles/{activePersona.id}.json
                        </span>
                        <span className="text-emerald-400">chrome.storage.local</span>
                      </div>
                      <pre className="text-slate-200 leading-relaxed">
{`{
  "persona_id": "${activePersona.id}",
  "candidate": "${activePersona.name}",
  "email": "${activePersona.email}",
  "verified_credentials": {
    "role": "${activePersona.role}",
    "years_experience": "${activePersona.yearsExp}",
    "urls": {
      "linkedin": "https://${activePersona.linkedin}",
      "portfolio": "https://${activePersona.portfolio}"
    }
  },
  "ai_runtime": {
    "mode": "ollama_local",
    "endpoint": "http://localhost:11434",
    "model": "mistral:latest"
  }
}`}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Right Side: ApplyPilot Live Inspector HUD Dock */}
                <div className="lg:col-span-5 rounded-2xl border border-emerald-500/35 bg-[#0e121b]/95 p-5 shadow-2xl relative">
                  {/* Extension Header */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">ApplyPilot Overlay</span>
                        <span className="text-[10px] font-mono text-emerald-400">Active DOM Hook</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-slate-300">v0.1.0</span>
                    </div>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <div className="text-[10px] font-mono text-slate-400">Match Confidence</div>
                      <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                        100% (4/4)
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                      <div className="text-[10px] font-mono text-slate-400">AI Privacy Mode</div>
                      <div className="text-xs font-bold text-cyan-300 font-mono mt-1 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5" /> Ollama Local
                      </div>
                    </div>
                  </div>

                  {/* Field Mapping Checklist */}
                  <div className="space-y-2 mb-5 text-xs font-mono">
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider">
                      DOM Selector Pipeline
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800/60 flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        input[name*="name"]
                      </span>
                      <span className="text-emerald-400 text-[11px]">Injected</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800/60 flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        input[type="email"]
                      </span>
                      <span className="text-emerald-400 text-[11px]">Injected</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-800/60 flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        textarea[id*="question"]
                      </span>
                      <span className="text-cyan-400 text-[11px]">AI Streaming</span>
                    </div>
                  </div>

                  {/* Hold Button / Quick Trigger Simulation */}
                  <div className="space-y-2">
                    <HoldButton
                      label="Simulate Autofill Injection"
                      holdDuration={1000}
                      onTrigger={triggerAutofill}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                    />

                    <div className="text-center text-[10px] font-mono text-slate-500">
                      Simulates synthetic change events & local Ollama response
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="px-6 py-2.5 bg-[#0d1017] border-t border-slate-800/90 flex flex-wrap items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Phase 1 Architecture Preview • Zero cloud database dependencies</span>
              </span>
              <a
                href="#walkthrough"
                className="hover:text-emerald-400 text-slate-400 inline-flex items-center gap-1 text-[11px] font-mono"
              >
                Inspect 6-step walkthrough <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
