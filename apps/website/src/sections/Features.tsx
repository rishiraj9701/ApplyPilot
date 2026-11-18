import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Database,
  Zap,
  Bot,
  Layers,
  BookmarkCheck,
  ScanSearch,
  History,
  ShieldAlert,
  CheckCircle2,
  Cpu,
  Terminal,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { SITE_CONFIG, FeatureItem } from '../config/site';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/StatusBadge';
import { CardGlowBorder, FadeIn } from '../animations/MotionPrims';

const ICON_MAP: Record<string, any> = {
  FileText,
  Database,
  Zap,
  Bot,
  Layers,
  BookmarkCheck,
  ScanSearch,
  History,
  ShieldAlert,
  CheckCircle2,
};

export function Features() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeFeature, setActiveFeature] = useState<FeatureItem>(SITE_CONFIG.features[0]);

  const categories = ['All', 'Profile', 'Automation', 'AI Intelligence', 'Privacy'];

  const filteredFeatures =
    selectedCategory === 'All'
      ? SITE_CONFIG.features
      : SITE_CONFIG.features.filter((f) => f.category === selectedCategory);

  return (
    <section id="features" className="py-20 sm:py-28 bg-[#090a0f] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="PRODUCT CAPABILITIES"
          badgeIcon={<Cpu className="w-3.5 h-3.5" />}
          title="Engineered for Deterministic Autofill and Privacy"
          subtitle="Explore the 10 core capabilities being engineered into ApplyPilot. Each feature is designed to put the candidate in total control."
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feature Grid with Interactive Detail Modal / Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Feature List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredFeatures.map((feat) => {
              const Icon = ICON_MAP[feat.iconName] || Zap;
              const isSelected = activeFeature.id === feat.id;

              return (
                <div
                  key={feat.id}
                  onClick={() => setActiveFeature(feat)}
                  className={`group p-4 sm:p-5 rounded-xl border transition-all cursor-pointer text-left relative ${
                    isSelected
                      ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                      : 'bg-[#0c0e14]/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800/60 text-slate-400 group-hover:text-emerald-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <StatusBadge status={feat.status} />
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {feat.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{feat.category}</span>
                    <span className="flex items-center gap-0.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Inspect <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Technical Inspector */}
          <div className="lg:col-span-5 sticky top-28">
            <CardGlowBorder active={true} className="p-6">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-slate-300 uppercase tracking-wide">
                    Capability Inspector
                  </span>
                </div>
                <StatusBadge status={activeFeature.status} />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1">
                    {activeFeature.category} Engine
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{activeFeature.title}</h3>
                  <p className="text-xs font-mono text-slate-400 mb-3">{activeFeature.tagline}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeFeature.description}
                  </p>
                </div>

                {/* Technical Architecture Note */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    Technical Implementation Spec
                  </div>
                  <p className="text-xs font-mono text-emerald-300/90 leading-normal">
                    {activeFeature.technicalDetail}
                  </p>
                </div>

                {/* Architectural Safeguard */}
                <div className="p-3.5 rounded-lg bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200 block mb-1">
                    Architectural Boundary:
                  </span>
                  {activeFeature.id === 'user-control'
                    ? 'No submit automation exists in code. The user always retains the trigger.'
                    : activeFeature.id === 'ai-answers'
                    ? 'AI prompt templates require explicit user confirmation before pasting into form fields.'
                    : 'Runs in-process inside the browser extension. No external telemetry relays.'}
                </div>
              </div>
            </CardGlowBorder>
          </div>
        </div>
      </div>
    </section>
  );
}
