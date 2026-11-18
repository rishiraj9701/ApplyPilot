import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  Cloud,
  Terminal,
  Key,
  ShieldCheck,
  Check,
  AlertCircle,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { CodeBlock } from '../components/CodeBlock';
import { FadeIn } from '../animations/MotionPrims';

export function AIProviders() {
  const [activeProvider, setActiveProvider] = useState<'ollama' | 'gemini'>('ollama');

  return (
    <section id="ai-providers" className="py-20 sm:py-28 bg-[#090a0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="AI RUNTIME OPTIONS"
          badgeIcon={<Cpu className="w-3.5 h-3.5" />}
          title="Choose Your AI Engine: Local or Cloud"
          subtitle="AI is completely optional in ApplyPilot. When you need AI-assisted screening answers, choose between 100% private local inference or high-speed cloud models."
        />

        {/* Side-by-Side Provider Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Ollama: Local AI Card */}
          <div
            onClick={() => setActiveProvider('ollama')}
            className={`rounded-2xl border p-6 sm:p-8 transition-all cursor-pointer ${
              activeProvider === 'ollama'
                ? 'bg-[#0c0e14] border-emerald-500/50 shadow-xl shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                : 'bg-[#0c0e14]/50 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Ollama (Local AI)</h3>
                  <span className="text-xs font-mono text-emerald-400">Recommended for Privacy</span>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                100% Offline
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Connect ApplyPilot directly to an Ollama daemon running on your machine. Generates tailored screening answers with zero internet connection, zero API fees, and zero data leakage.
            </p>

            <div className="space-y-3 mb-6 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero telemetry or third-party cloud data transmission</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>No API keys or credit card registration required</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Works with Llama 3.2, Mistral, Gemma 2, DeepSeek-R1</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 mb-2">Example CLI setup:</div>
              <CodeBlock
                language="bash"
                code={`# Install and pull your preferred lightweight model
ollama run llama3.2:3b`}
              />
            </div>
          </div>

          {/* Google Gemini: Cloud AI Card */}
          <div
            onClick={() => setActiveProvider('gemini')}
            className={`rounded-2xl border p-6 sm:p-8 transition-all cursor-pointer ${
              activeProvider === 'gemini'
                ? 'bg-[#0c0e14] border-cyan-500/50 shadow-xl shadow-cyan-950/20 ring-1 ring-cyan-500/30'
                : 'bg-[#0c0e14]/50 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Google Gemini</h3>
                  <span className="text-xs font-mono text-cyan-400">High Speed / Lightweight</span>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Bring Your Own Key
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Use Google's Gemini models (such as Gemini 2.5 Flash) via your personal Google AI Studio API key. Perfect for laptops with limited RAM or without dedicated GPUs.
            </p>

            <div className="space-y-3 mb-6 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Ultra-fast generation speeds (&lt; 1 second responses)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Zero local GPU or high RAM requirements</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>User-configured API key stored solely in local extension</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 mb-2">Security notice:</div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Your API key and prompt payloads travel directly from your browser to Google API endpoints. ApplyPilot has no intermediary proxy servers and never logs your keys.
              </div>
            </div>
          </div>
        </div>

        {/* Feature Matrix / Comparison Table */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-[#0c0e14] overflow-hidden">
          <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="font-semibold">Technical Specifications Comparison</span>
            <span className="text-emerald-400">100% User-Controlled</span>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            <div className="grid grid-cols-12 p-3.5 items-center">
              <div className="col-span-4 font-medium text-slate-400">Hardware Requirement</div>
              <div className="col-span-4 font-mono text-emerald-300">8GB+ RAM & modern CPU/GPU</div>
              <div className="col-span-4 font-mono text-cyan-300">Any low-power computer</div>
            </div>

            <div className="grid grid-cols-12 p-3.5 items-center">
              <div className="col-span-4 font-medium text-slate-400">Network Dependency</div>
              <div className="col-span-4 font-mono text-emerald-300">None (100% offline)</div>
              <div className="col-span-4 font-mono text-cyan-300">Requires Internet connection</div>
            </div>

            <div className="grid grid-cols-12 p-3.5 items-center">
              <div className="col-span-4 font-medium text-slate-400">API Key Required</div>
              <div className="col-span-4 font-mono text-emerald-300">No</div>
              <div className="col-span-4 font-mono text-cyan-300">Yes (User-supplied key)</div>
            </div>

            <div className="grid grid-cols-12 p-3.5 items-center">
              <div className="col-span-4 font-medium text-slate-400">Candidate Data Destination</div>
              <div className="col-span-4 font-mono text-emerald-300">Local device only</div>
              <div className="col-span-4 font-mono text-cyan-300">Sent directly to Google API</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
