import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  CloudOff,
  Cpu,
  EyeOff,
  AlertTriangle,
  Check,
  X,
  HardDrive,
  Network,
  ArrowRight,
  Server,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { FadeIn } from '../animations/MotionPrims';

export function Privacy() {
  const [activeTab, setActiveTab] = useState<'flow' | 'matrix'>('flow');
  const [activeEgressMode, setActiveEgressMode] = useState<'ollama' | 'gemini'>('ollama');

  return (
    <section id="privacy" className="py-24 sm:py-32 bg-[#090b10] border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="LOCAL-FIRST INTEGRITY"
          badgeIcon={<Shield className="w-3.5 h-3.5" />}
          title="Your Career History Stays in Your Browser"
          subtitle="Most application scrapers store your sensitive PDF resumes on external cloud servers. ApplyPilot has zero cloud backends, zero account databases, and zero tracking pixels."
        />

        {/* View Switcher Controls */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-2xl bg-slate-950 p-1.5 border border-slate-800">
            <button
              onClick={() => setActiveTab('flow')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium transition-colors cursor-pointer ${
                activeTab === 'flow' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Data Flow Pipeline
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium transition-colors cursor-pointer ${
                activeTab === 'matrix' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Architecture Comparison
            </button>
          </div>
        </div>

        {activeTab === 'flow' ? (
          /* Interactive Data Flow Visualizer */
          <div className="max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-[#0c0f17] p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Local Memory Boundary
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Tracing candidate resume bytes from import to DOM insertion
                </p>
              </div>

              {/* AI Egress Toggle */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                <span className="text-slate-500 pl-2">AI Egress:</span>
                <button
                  onClick={() => setActiveEgressMode('ollama')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeEgressMode === 'ollama'
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                      : 'text-slate-400'
                  }`}
                >
                  Ollama (0 WAN packets)
                </button>
                <button
                  onClick={() => setActiveEgressMode('gemini')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeEgressMode === 'gemini'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400'
                  }`}
                >
                  Gemini (User API Key)
                </button>
              </div>
            </div>

            {/* Pipeline Step Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">01. Ingestion</div>
                <div className="text-sm font-bold text-white">Resume File Drop</div>
                <p className="text-xs text-slate-400 leading-normal">
                  Read as an in-memory Uint8Array inside a client-side Web Worker.
                </p>
                <div className="text-[10px] font-mono text-emerald-300 pt-2 border-t border-slate-900">
                  Buffer: Local RAM
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">02. Extraction</div>
                <div className="text-sm font-bold text-white">WASM Text Parser</div>
                <p className="text-xs text-slate-400 leading-normal">
                  Sections, employment years, and skills parsed without external dependencies.
                </p>
                <div className="text-[10px] font-mono text-emerald-300 pt-2 border-t border-slate-900">
                  Target: JSON Candidate
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">03. Persistence</div>
                <div className="text-sm font-bold text-white">chrome.storage.local</div>
                <p className="text-xs text-slate-400 leading-normal">
                  Sandboxed to extension origin on your device. Zero cloud sync servers.
                </p>
                <div className="text-[10px] font-mono text-emerald-300 pt-2 border-t border-slate-900">
                  Scope: Local Device
                </div>
              </div>

              {/* Step 4 */}
              <div
                className={`p-4 rounded-2xl border space-y-2 transition-all ${
                  activeEgressMode === 'ollama'
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-cyan-950/20 border-cyan-500/40'
                }`}
              >
                <div
                  className={`text-[10px] font-mono uppercase font-bold ${
                    activeEgressMode === 'ollama' ? 'text-emerald-400' : 'text-cyan-400'
                  }`}
                >
                  04. AI Synthesis
                </div>
                <div className="text-sm font-bold text-white">
                  {activeEgressMode === 'ollama' ? 'Ollama (localhost)' : 'Direct to Google API'}
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  {activeEgressMode === 'ollama'
                    ? 'Requests sent strictly to 127.0.0.1:11434. Zero internet connection required.'
                    : 'Prompt sent directly from browser to Google with your API key. No ApplyPilot relay.'}
                </p>
                <div
                  className={`text-[10px] font-mono pt-2 border-t border-slate-900 ${
                    activeEgressMode === 'ollama' ? 'text-emerald-300' : 'text-cyan-300'
                  }`}
                >
                  {activeEgressMode === 'ollama' ? 'WAN Egress: 0 Bytes' : 'Endpoint: generativelanguage.googleapis.com'}
                </div>
              </div>
            </div>

            {/* Zero Server Guarantee */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CloudOff className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">ApplyPilot Cloud Infrastructure</div>
                  <div className="text-xs text-slate-400 font-mono">
                    Zero application databases • Zero user analytics servers
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
                Hardcoded Architectural Invariance
              </span>
            </div>
          </div>
        ) : (
          /* Architecture Comparison Matrix */
          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-[#0c0f17] overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 bg-slate-950 p-4 text-xs font-mono font-semibold text-slate-300 border-b border-slate-800">
              <div className="col-span-5">Security Dimension</div>
              <div className="col-span-3 text-rose-400">Cloud Job Scrapers</div>
              <div className="col-span-4 text-emerald-400">ApplyPilot (Local-First)</div>
            </div>

            <div className="divide-y divide-slate-800 text-xs">
              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-medium text-slate-200">Resume Storage Target</div>
                <div className="col-span-3 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4 flex-shrink-0" /> Cloud S3 / GCS
                </div>
                <div className="col-span-4 text-emerald-400 font-mono flex items-center gap-1.5">
                  <Check className="w-4 h-4 flex-shrink-0" /> Local browser storage only
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-medium text-slate-200">Mandatory Account Creation</div>
                <div className="col-span-3 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4 flex-shrink-0" /> Required login
                </div>
                <div className="col-span-4 text-emerald-400 font-mono flex items-center gap-1.5">
                  <Check className="w-4 h-4 flex-shrink-0" /> Zero registration required
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-medium text-slate-200">Application Egress Tracking</div>
                <div className="col-span-3 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4 flex-shrink-0" /> Central telemetry logs
                </div>
                <div className="col-span-4 text-emerald-400 font-mono flex items-center gap-1.5">
                  <Check className="w-4 h-4 flex-shrink-0" /> Private local ledger only
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-medium text-slate-200">Offline Operation</div>
                <div className="col-span-3 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4 flex-shrink-0" /> Fails completely
                </div>
                <div className="col-span-4 text-emerald-400 font-mono flex items-center gap-1.5">
                  <Check className="w-4 h-4 flex-shrink-0" /> 100% Functional (Ollama)
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-medium text-slate-200">Recurring Subscription</div>
                <div className="col-span-3 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4 flex-shrink-0" /> $15–$50 / month
                </div>
                <div className="col-span-4 text-emerald-400 font-mono flex items-center gap-1.5">
                  <Check className="w-4 h-4 flex-shrink-0" /> 100% Free & Open Source
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technical Disclosures Card */}
        <div className="mt-12 max-w-4xl mx-auto p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Honest Technical Disclosures</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 leading-relaxed font-sans">
            <li>
              <strong>Browser Storage Security:</strong> Data in <code className="text-slate-300">chrome.storage.local</code> is sandboxed to the extension origin by Chromium. However, standard browser storage is not cryptographically encrypted at rest by default; anyone with access to your unlocked computer account could inspect your local profile files.
            </li>
            <li>
              <strong>Cloud AI Providers:</strong> If you explicitly choose Google Gemini, prompt tokens travel directly from your browser to Google API endpoints under your configured API key. ApplyPilot has no intermediary proxy server.
            </li>
            <li>
              <strong>Website Scope:</strong> The ApplyPilot marketing website is static and does not contain, receive, or store candidate resumes.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
