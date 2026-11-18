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
  Lock,
  Search,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/StatusBadge';
import { FadeIn } from '../animations/MotionPrims';

export function Features() {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [vaultSearch, setVaultSearch] = useState('');
  const [copiedQA, setCopiedQA] = useState<string | null>(null);

  const variants = [
    {
      title: 'Infrastructure & Systems Lead',
      badge: 'Variant A',
      focus: 'Distributed Systems, Kafka, Go, Kubernetes, Cloud Scale',
      metrics: '7 Years Exp • 14 Projects • Primary Variant',
    },
    {
      title: 'Lead Full-Stack Developer',
      badge: 'Variant B',
      focus: 'React 19, TypeScript, GraphQL, Node.js, High Density UI',
      metrics: '6 Years Exp • 22 Repositories • Web Focus',
    },
    {
      title: 'AI Platform Systems Engineer',
      badge: 'Variant C',
      focus: 'vLLM, Ollama, CUDA, Local Quantization, Python',
      metrics: '5 Years Exp • 8 Published Models • ML Track',
    },
  ];

  const qaItems = [
    {
      q: 'Are you legally authorized to work in the US?',
      a: 'Yes, US Citizen with no current or future visa sponsorship required.',
      tag: 'Work Auth',
    },
    {
      q: 'What is your preferred notice period?',
      a: 'Standard 2 weeks notice period from final offer acceptance.',
      tag: 'Availability',
    },
    {
      q: 'What are your target compensation expectations?',
      a: 'Targeting $185k - $210k base salary commensurate with role scope and responsibilities.',
      tag: 'Compensation',
    },
  ];

  const filteredQA = qaItems.filter(
    (item) =>
      item.q.toLowerCase().includes(vaultSearch.toLowerCase()) ||
      item.tag.toLowerCase().includes(vaultSearch.toLowerCase())
  );

  const handleCopyQA = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQA(id);
    setTimeout(() => setCopiedQA(null), 2000);
  };

  return (
    <section id="features" className="py-24 sm:py-32 bg-[#090b10] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="PRODUCT CAPABILITIES"
          badgeIcon={<Cpu className="w-3.5 h-3.5" />}
          title="Engineered for Autonomy, Precision, and Privacy"
          subtitle="Explore ApplyPilot's 10 architectural capabilities. Built from the ground up to give candidates deterministic automation without sacrificing privacy."
        />

        {/* Asymmetrical Bento Grid Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto mb-12">
          {/* Bento Item 1: Fan Cards for Multiple Resume Variants (8 Columns) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-[#0c0f17] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Multiple Resume Variants</h3>
                    <span className="text-xs font-mono text-emerald-400">Interactive Fan Cards Deck</span>
                  </div>
                </div>
                <StatusBadge status="Planned" />
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Store multiple specialized candidate profiles directly in your browser. Switch personas in one click to map different achievements without managing multiple PDF files.
              </p>

              {/* Fan Cards Interactive Deck */}
              <div className="relative h-44 sm:h-48 my-4 flex items-center justify-center">
                {variants.map((variant, idx) => {
                  const isSelected = selectedVariantIndex === idx;
                  const offset = (idx - selectedVariantIndex) * 22;
                  const rotation = (idx - selectedVariantIndex) * 5;

                  return (
                    <motion.div
                      key={variant.badge}
                      onClick={() => setSelectedVariantIndex(idx)}
                      animate={{
                        x: offset,
                        y: isSelected ? -10 : 8,
                        rotate: rotation,
                        scale: isSelected ? 1 : 0.94,
                        zIndex: isSelected ? 20 : 10 - Math.abs(idx - selectedVariantIndex),
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      className={`absolute w-11/12 sm:w-4/5 p-4 rounded-2xl border transition-colors cursor-pointer select-none shadow-xl ${
                        isSelected
                          ? 'bg-slate-900 border-emerald-500/60 shadow-emerald-950/40 ring-1 ring-emerald-500/40'
                          : 'bg-slate-950/90 border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-mono text-emerald-400 font-bold">
                          {variant.badge}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {variant.metrics}
                        </span>
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white truncate">
                        {variant.title}
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-1">{variant.focus}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Click cards to cycle personas</span>
              <span className="text-emerald-400">Active: {variants[selectedVariantIndex].badge}</span>
            </div>
          </div>

          {/* Bento Item 2: Saved Q&A Library Vault (5 Columns) */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-[#0c0f17] p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <BookmarkCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Saved Q&A Vault</h3>
                    <span className="text-xs font-mono text-cyan-400">Instant Keyword Match</span>
                  </div>
                </div>
                <StatusBadge status="In Development" />
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Maintain reusable answers for salary, notice periods, and work authorization. Never retype standard answers.
              </p>

              {/* Search filter input */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter saved answers..."
                  value={vaultSearch}
                  onChange={(e) => setVaultSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Q&A List */}
              <div className="space-y-2 mb-4">
                {filteredQA.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-cyan-400">{item.tag}</span>
                      <button
                        onClick={() => handleCopyQA(`qa-${idx}`, item.a)}
                        className="text-slate-400 hover:text-white inline-flex items-center gap-1 text-[10px] font-mono cursor-pointer"
                      >
                        {copiedQA === `qa-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="font-semibold text-slate-200 truncate">{item.q}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.a}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
              chrome.storage.local index • Zero cloud relays
            </div>
          </div>

          {/* Bento Item 3: Deterministic ATS Engine (Wide Row: 12 Columns) */}
          <div className="lg:col-span-12 rounded-3xl border border-slate-800 bg-[#0c0f17] p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-bold text-white">ATS-Aware Autofill Engine</h3>
                  <StatusBadge status="In Development" />
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Recognizes standard and custom recruiting forms. Dispatches native DOM synthetic events so single-page applications register populated inputs seamlessly.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400 pt-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                    Greenhouse
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                    Lever
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                    Ashby
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                    Workday
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-500 text-[11px]">
                  <span>DOM Selector Dispatch Trace</span>
                  <span className="text-emerald-400">&lt; 120ms execution</span>
                </div>
                <pre className="text-slate-200 text-[11px] leading-relaxed">
{`const target = document.querySelector('input[id*="email"]');
target.value = profile.personal.email;
target.dispatchEvent(new Event('input', { bubbles: true }));
target.dispatchEvent(new Event('change', { bubbles: true }));
// Status: Synced to React component state`}
                </pre>
              </div>
            </div>
          </div>

          {/* Bento Item 4: Duplicate Guard (6 Columns) */}
          <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-[#0c0f17] p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Duplicate Submission Guard
                </h3>
              </div>
              <StatusBadge status="Planned" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Prevents accidental multiple submissions to the same company. ApplyPilot checks your local submission log and alerts you if you already applied within 90 days.
            </p>
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center justify-between">
              <span>Domain: jobs.lever.co/stripe/*</span>
              <span className="text-amber-400 font-bold">Applied 18d ago</span>
            </div>
          </div>

          {/* Bento Item 5: Zero Auto-Submit Keylock (6 Columns) */}
          <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-[#0c0f17] p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Physical Submission Keylock
                </h3>
              </div>
              <StatusBadge status="In Development" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ApplyPilot strictly prohibits auto-submission bots. The extension has zero automation handlers for final submit buttons, guaranteeing that only the candidate can trigger submission.
            </p>
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center justify-between">
              <span>Programmatic submit trigger:</span>
              <span className="text-emerald-400 font-bold">DISABLED (Hardcoded)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
