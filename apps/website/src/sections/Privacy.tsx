import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Server,
  CloudOff,
  EyeOff,
  AlertTriangle,
  HardDrive,
  Cpu,
  Check,
  X,
  FileCheck2,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { FadeIn } from '../animations/MotionPrims';

export function Privacy() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'comparison'>('architecture');

  return (
    <section id="privacy" className="py-20 sm:py-28 bg-[#0c0e14] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="LOCAL-FIRST PRIVACY"
          badgeIcon={<Shield className="w-3.5 h-3.5" />}
          title="Your Career History Belongs on Your Device"
          subtitle="Most application scrapers store your sensitive resumes on cloud servers. ApplyPilot has zero cloud backends, zero user accounts, and zero resume telemetry."
        />

        {/* View Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Privacy Pillars
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Architecture Comparison
            </button>
          </div>
        </div>

        {activeTab === 'architecture' ? (
          /* Privacy Pillars Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#090a0f] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CloudOff className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero Cloud Database</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                There is no central database, no user authentication server, and no cloud bucket storing your PDF resumes. Your files never touch ApplyPilot servers because none exist.
              </p>
              <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400">
                Storage: chrome.storage.local
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#090a0f] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Local AI via Ollama</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Run models like Llama 3.2 or Mistral locally on your machine via Ollama. 100% offline text generation with zero network packets leaving your computer.
              </p>
              <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400">
                Offline Endpoint: localhost:11434
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#090a0f] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">No Telemetry Tracking</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We do not track which companies you apply to, which jobs you view, what salary you request, or how many applications you complete. Your search is confidential.
              </p>
              <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-purple-400">
                Analytics: None / Zero trackers
              </div>
            </div>
          </div>
        ) : (
          /* Architecture Comparison Table */
          <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-[#090a0f] overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 bg-slate-900/80 border-b border-slate-800 p-4 text-xs font-mono font-semibold text-slate-300">
              <div className="col-span-5">Security Dimension</div>
              <div className="col-span-3 text-rose-400">Cloud AI Services</div>
              <div className="col-span-4 text-emerald-400">ApplyPilot (Local-First)</div>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs">
              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-medium text-slate-200">
                  Candidate Resume Storage
                </div>
                <div className="col-span-3 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4 flex-shrink-0" /> Cloud S3 / GCS
                </div>
                <div className="col-span-4 text-emerald-400 font-mono flex items-center gap-1.5">
                  <Check className="w-4 h-4 flex-shrink-0" /> Local browser storage only
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-medium text-slate-200">
                  Mandatory Account Creation
                </div>
                <div className="col-span-3 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4 flex-shrink-0" /> Required
                </div>
                <div className="col-span-4 text-emerald-400 font-mono flex items-center gap-1.5">
                  <Check className="w-4 h-4 flex-shrink-0" /> None / Zero login needed
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-medium text-slate-200">
                  Application Activity Tracking
                </div>
                <div className="col-span-3 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4 flex-shrink-0" /> Server analytics logs
                </div>
                <div className="col-span-4 text-emerald-400 font-mono flex items-center gap-1.5">
                  <Check className="w-4 h-4 flex-shrink-0" /> Local device ledger only
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-medium text-slate-200">
                  Offline Operation
                </div>
                <div className="col-span-3 text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4 flex-shrink-0" /> Impossible (Breaks)
                </div>
                <div className="col-span-4 text-emerald-400 font-mono flex items-center gap-1.5">
                  <Check className="w-4 h-4 flex-shrink-0" /> Fully functional (Ollama)
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-medium text-slate-200">
                  Subscription & Paywalls
                </div>
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

        {/* Technical Honesty Disclosure */}
        <div className="mt-12 max-w-4xl mx-auto p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Honest Technical Disclosures</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
            <li>
              <strong>Browser Storage Security:</strong> Data in <code className="text-slate-300">chrome.storage.local</code> is sandboxed to the extension on your machine. However, standard browser storage is not cryptographically encrypted at rest by Chrome; anyone with access to your unlocked computer account could inspect your local browser profile files.
            </li>
            <li>
              <strong>Cloud AI Providers:</strong> If you explicitly choose to configure Google Gemini (instead of Ollama), the specific prompt text (such as your job title and screening question) is sent directly from your browser to Google's API endpoint under your API credentials and their data terms.
            </li>
            <li>
              <strong>Marketing Website Scope:</strong> The ApplyPilot website is purely static documentation and does not contain, receive, or process any candidate resumes or profiles.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
