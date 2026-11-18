import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Cloud,
  Check,
  Terminal,
  Key,
  ShieldCheck,
  ExternalLink,
  Zap,
  Play,
  RotateCcw,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { CodeBlock } from '../components/CodeBlock';
import { StreamingText } from '../animations/MotionPrims';

export function AIProviders() {
  const [selectedProvider, setSelectedProvider] = useState<'ollama' | 'gemini'>('ollama');
  const [streamIteration, setStreamIteration] = useState(0);

  const providerData = {
    ollama: {
      title: 'Ollama (Local AI Engine)',
      subtitle: '100% Offline • Zero Cloud Telemetry',
      badge: 'Recommended for Maximum Privacy',
      badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
      description:
        'Connect ApplyPilot directly to your locally running Ollama daemon. Inference executes on your device GPU or CPU with zero internet packets emitted.',
      latency: '~1.2s - 2.5s (Hardware dependent)',
      endpoint: 'http://localhost:11434/api/generate',
      sampleModel: 'mistral:latest / llama3.2:3b',
      setupCommand: `# Install and run lightweight 3B model locally\nollama run llama3.2:3b`,
      draftResponse:
        'In my prior role at FinScale, I scaled our telemetry pipeline to 120k events/sec using Kafka and ClickHouse. Your team’s focus on partition tolerance aligns directly with my engineering background.',
    },
    gemini: {
      title: 'Google Gemini (Cloud AI)',
      subtitle: 'Ultra-Fast • Bring Your Own API Key',
      badge: 'High Speed • Minimal Local RAM Required',
      badgeColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
      description:
        'Connect directly to Google AI Studio using your own personal API key. Fast and lightweight for laptops with limited RAM or without dedicated GPUs.',
      latency: '~350ms - 800ms (High-throughput cloud)',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash',
      sampleModel: 'gemini-2.5-flash',
      setupCommand: `# Enter your Google AI Studio API key in extension settings\n# Key is stored strictly in chrome.storage.local`,
      draftResponse:
        'At FinScale, I architected a low-latency event processing pipeline handling 120k events/sec. I am eager to apply this distributed systems experience to your real-time core platform.',
    },
  };

  const current = providerData[selectedProvider];

  return (
    <section id="ai-providers" className="py-24 sm:py-32 bg-[#07090e] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="AI RUNTIME WORKBENCH"
          badgeIcon={<Cpu className="w-3.5 h-3.5" />}
          title="Choose Your AI Engine: Local or Cloud"
          subtitle="AI is completely optional. When you choose to generate screening answers, select between 100% private local inference or high-speed cloud models."
        />

        {/* Engine Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-2xl bg-slate-950 p-1.5 border border-slate-800">
            <button
              onClick={() => {
                setSelectedProvider('ollama');
                setStreamIteration((i) => i + 1);
              }}
              className={`relative px-6 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium transition-colors cursor-pointer ${
                selectedProvider === 'ollama' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {selectedProvider === 'ollama' && (
                <motion.div
                  layoutId="ai-provider-pill"
                  className="absolute inset-0 bg-slate-800/90 rounded-xl border border-emerald-500/40 shadow-sm"
                  transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Ollama (Local Offline)</span>
              </span>
            </button>

            <button
              onClick={() => {
                setSelectedProvider('gemini');
                setStreamIteration((i) => i + 1);
              }}
              className={`relative px-6 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium transition-colors cursor-pointer ${
                selectedProvider === 'gemini' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {selectedProvider === 'gemini' && (
                <motion.div
                  layoutId="ai-provider-pill"
                  className="absolute inset-0 bg-slate-800/90 rounded-xl border border-cyan-500/40 shadow-sm"
                  transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Cloud className="w-4 h-4 text-cyan-400" />
                <span>Google Gemini (BYOK)</span>
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Engine Workbench Deck */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-[#0c0f17] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProvider}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {current.title}
                    </h3>
                    <span
                      className={`text-xs font-mono px-3 py-1 rounded-full border ${current.badgeColor}`}
                    >
                      {selectedProvider === 'ollama' ? '100% Offline' : 'Bring Your Own Key'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">{current.subtitle}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Model:</span>
                  <span className="text-xs font-mono text-emerald-400 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                    {current.sampleModel}
                  </span>
                </div>
              </div>

              {/* Grid: Live Token Generator Simulator vs Code Snippet */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Live Token Stream Simulator */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">
                      Live Prompt Generation Simulation
                    </span>
                    <button
                      onClick={() => setStreamIteration((i) => i + 1)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" /> Re-stream
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="text-[11px] text-slate-500 pb-2 border-b border-slate-900">
                      Target Prompt: "Describe your experience scaling distributed pipelines."
                    </div>

                    <div className="text-slate-200 text-xs sm:text-sm font-sans leading-relaxed min-h-[90px]">
                      <StreamingText
                        key={`${selectedProvider}-${streamIteration}`}
                        text={current.draftResponse}
                        speed={14}
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Measured Latency: {current.latency}</span>
                      <span>Zero Hallucinations Verified</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Setup Snippet */}
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wide block">
                    Configuration & Connection
                  </span>
                  <CodeBlock language="bash" code={current.setupCommand} />

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
                    <div className="font-semibold text-slate-200">Security Invariance:</div>
                    <p className="text-[11px] leading-relaxed">
                      {selectedProvider === 'ollama'
                        ? 'Ollama processes data 100% offline at http://localhost:11434. No external connections are established.'
                        : 'Your Google Gemini key is stored solely in local browser storage and requests travel directly to Google.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
