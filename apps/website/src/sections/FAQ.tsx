import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '../config/site';
import { SectionHeader } from '../components/SectionHeader';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#0c0e14] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="FAQ"
          badgeIcon={<HelpCircle className="w-3.5 h-3.5" />}
          title="Frequently Asked Questions"
          subtitle="Honest, technical answers to common questions about architecture, privacy, AI, and installation."
        />

        {/* Accordion Container */}
        <div className="max-w-3xl mx-auto space-y-3">
          {SITE_CONFIG.faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                    : 'bg-[#090a0f] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-emerald-400 font-bold select-none">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="text-sm sm:text-base font-bold text-white">
                      {faq.question}
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
