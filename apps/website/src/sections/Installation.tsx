import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  FolderOpen,
  ToggleRight,
  ExternalLink,
  CheckCircle2,
  Info,
  Clock,
  Sparkles,
  Check,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { ChromeIcon } from '../components/BrandIcons';
import { SITE_CONFIG } from '../config/site';
import { SectionHeader } from '../components/SectionHeader';

export function Installation() {
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  const [extensionLoaded, setExtensionLoaded] = useState(false);

  const handleSimulateLoad = () => {
    if (!devModeEnabled) {
      setDevModeEnabled(true);
    }
    setExtensionLoaded(true);
  };

  const resetSimulator = () => {
    setDevModeEnabled(false);
    setExtensionLoaded(false);
  };

  return (
    <section id="install" className="py-24 sm:py-32 bg-[#090b10] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="GETTING STARTED"
          badgeIcon={<Download className="w-3.5 h-3.5" />}
          title="Direct, Open-Source Distribution"
          subtitle="ApplyPilot is distributed freely through GitHub Releases as an unpacked Chromium extension. No centralized app stores, no tracking identifiers, and no paywalls."
        />

        {/* Phase 1 Status Banner */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="p-6 sm:p-8 rounded-3xl border border-emerald-500/35 bg-[#0c0f17] shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Phase 1: Marketing & Technical Architecture
                  </h3>
                  <div className="text-xs font-mono text-emerald-400 mt-0.5">
                    Extension Build Scheduled for Phase 2
                  </div>
                </div>
              </div>

              <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 self-start sm:self-auto">
                In Active Development
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              We believe in complete transparency: the browser extension binary is currently in Phase 1 engineering. Pre-compiled release archives will be published to GitHub Releases once test suites pass in Phase 2. No fake download files or mock ZIPs are distributed on this site.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Follow Progress on GitHub</span>
              </a>

              <a
                href={SITE_CONFIG.links.githubReleases}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium text-xs sm:text-sm transition-colors"
              >
                <span>View Releases Page</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Chromium Extension Manager Simulator */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-[#0a0d14] overflow-hidden shadow-2xl mb-12">
          {/* Top Browser Bar */}
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-700" />
                <span className="w-3 h-3 rounded-full bg-slate-700" />
                <span className="w-3 h-3 rounded-full bg-slate-700" />
              </div>
              <span className="text-slate-400 flex items-center gap-1.5">
                <ChromeIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>chrome://extensions</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400">Developer mode</span>
              <button
                onClick={() => setDevModeEnabled(!devModeEnabled)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                  devModeEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <motion.div
                  animate={{ x: devModeEnabled ? 16 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSimulateLoad}
                disabled={extensionLoaded}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-colors cursor-pointer ${
                  extensionLoaded
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
                }`}
              >
                {extensionLoaded ? 'Extension Loaded' : 'Click: Load unpacked'}
              </button>

              <button
                onClick={resetSimulator}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                Reset
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Interactive Installation Simulator
            </span>
          </div>

          {/* Simulator Content Area */}
          <div className="p-6 sm:p-8 min-h-[180px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {extensionLoaded ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-lg p-5 rounded-2xl border border-emerald-500/40 bg-[#0c1018] shadow-xl space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          ApplyPilot
                          <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                            v0.1.0 (unpacked)
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Local-first job application assistant
                        </div>
                      </div>
                    </div>

                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>ID: ckmdfkgmalkfnqweuinvj</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Enabled & Ready
                    </span>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center space-y-2 text-slate-400 font-mono text-xs">
                  <div>No unpacked extension loaded in simulator.</div>
                  <div className="text-slate-500 text-[11px]">
                    Click "Load unpacked" above to simulate adding ApplyPilot to Chromium.
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
