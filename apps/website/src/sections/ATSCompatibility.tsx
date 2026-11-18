import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Check,
  AlertTriangle,
  Info,
  Layers,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { SITE_CONFIG, ATSPlatform } from '../config/site';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/StatusBadge';
import { FadeIn } from '../animations/MotionPrims';

export function ATSCompatibility() {
  const [selectedATS, setSelectedATS] = useState<ATSPlatform>(SITE_CONFIG.atsPlatforms[0]);

  return (
    <section id="ats-compatibility" className="py-20 sm:py-28 bg-[#0c0e14] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="ATS PLATFORM COMPATIBILITY"
          badgeIcon={<Globe className="w-3.5 h-3.5" />}
          title="Targeted Support for Modern Recruiting Infrastructure"
          subtitle="ApplyPilot analyzes the active page DOM to recognize ATS field signatures. Support is built progressively platform by platform."
        />

        {/* ATS Platform Horizontal Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {SITE_CONFIG.atsPlatforms.map((platform) => {
            const isSelected = selectedATS.id === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() => setSelectedATS(platform)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/50 shadow-md shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                    : 'bg-[#090a0f] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">{platform.category}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      platform.status === 'In Development' ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
                    }`}
                  />
                </div>
                <div className="text-base font-bold text-white mb-1">{platform.name}</div>
                <StatusBadge status={platform.status} />
              </button>
            );
          })}
        </div>

        {/* Deep Dive Matrix Display */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#090a0f] p-6 sm:p-8 lg:p-10 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedATS.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-white">{selectedATS.name}</h3>
                    <StatusBadge status={selectedATS.status} size="md" />
                  </div>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Classification: {selectedATS.category}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
                    Target Selector Mapping
                  </span>
                </div>
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Detection Logic */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                    Detection Signature
                  </div>
                  <p className="text-xs font-mono text-emerald-300 break-words leading-relaxed">
                    {selectedATS.detectionMethod}
                  </p>
                </div>

                {/* Technical Notes */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    Architecture Notes
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedATS.notes}
                  </p>
                </div>
              </div>

              {/* Supported Fields Checklist */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wide mb-3">
                  Mapped Field Targets
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedATS.supportedFields.map((field, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-medium"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Honesty Callout */}
              <div className="p-4 rounded-xl bg-amber-950/15 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-amber-300">
                    Real-world compatibility disclaimer:
                  </span>
                  <p className="text-amber-200/80 leading-normal">
                    We do not claim 100% universal compatibility. Recruiting portals often change input IDs, introduce dynamic iframe embeddings, or use custom client-side validation rules. When an unmapped field is encountered, ApplyPilot falls back to manual candidate input without crashing.
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
