import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  SlidersHorizontal,
  Info,
  Check,
  AlertTriangle,
  Cpu,
  Layers,
  Terminal,
  Activity,
} from 'lucide-react';
import { SITE_CONFIG, ATSPlatform } from '../config/site';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/StatusBadge';

export function ATSCompatibility() {
  const [selectedATS, setSelectedATS] = useState<ATSPlatform>(SITE_CONFIG.atsPlatforms[0]);

  return (
    <section id="ats-compatibility" className="py-24 sm:py-32 bg-[#07090e] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="ATS RECOGNITION MATRIX"
          badgeIcon={<Globe className="w-3.5 h-3.5" />}
          title="Engineered for Modern Recruiting Portals"
          subtitle="ApplyPilot analyzes the active page DOM to recognize applicant tracking system hierarchies. Support is engineered platform by platform."
        />

        {/* Console Platform Switcher */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800">
            {SITE_CONFIG.atsPlatforms.map((platform) => {
              const isSelected = selectedATS.id === platform.id;
              return (
                <button
                  key={platform.id}
                  onClick={() => setSelectedATS(platform)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium transition-colors cursor-pointer ${
                    isSelected ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="ats-active-pill"
                      className="absolute inset-0 bg-slate-800/90 rounded-xl border border-emerald-500/40 shadow-md shadow-emerald-950/20"
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        platform.status === 'In Development'
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-cyan-400'
                      }`}
                    />
                    {platform.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetrical Diagnostic Console Deck */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-[#0c0f17] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedATS.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Console Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {selectedATS.name}
                    </h3>
                    <StatusBadge status={selectedATS.status} size="md" />
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    Classification: {selectedATS.category}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300">
                    Target Selector Mapping Engine
                  </span>
                </div>
              </div>

              {/* Technical Inspection Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wide flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Detection Heuristic
                  </div>
                  <p className="text-xs font-mono text-emerald-300 break-words leading-relaxed">
                    {selectedATS.detectionMethod}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wide flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    Architecture Notes
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedATS.notes}
                  </p>
                </div>
              </div>

              {/* Mapped Fields Badges */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                  Verified Field Selectors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedATS.supportedFields.map((field, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-medium"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Disclaimer Box */}
              <div className="p-4 rounded-2xl bg-amber-950/15 border border-amber-500/25 text-xs text-amber-200/90 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-amber-300">
                    Real-World Compatibility Notice:
                  </span>
                  <p className="text-amber-200/80 leading-normal font-sans">
                    Universal 100% compatibility across all internet forms is technically impossible due to iframe sandboxes, anti-bot captcha gates, and custom company styling. When an unfamiliar selector is encountered, ApplyPilot leaves the field untouched for manual entry rather than injecting corrupted data.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
