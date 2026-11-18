import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { SITE_CONFIG } from '../config/site';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090a0f]/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-slate-900 border border-emerald-500/30 flex items-center justify-center transition-all group-hover:border-emerald-400 group-hover:scale-105">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12L20 4L14 20L11 13L4 12Z"
                  fill="currentColor"
                  fillOpacity="0.2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <circle cx="11" cy="13" r="1.5" fill="#34d399" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-white text-lg flex items-center gap-1.5">
                ApplyPilot
                <span className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  OSS
                </span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-300">
            {SITE_CONFIG.navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 rounded-md hover:text-white hover:bg-slate-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions & CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <a
              href="#install"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-sm hover:shadow-emerald-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090a0f] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get ApplyPilot</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href="#install"
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-500 text-slate-950"
            >
              Install
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-b border-slate-800 bg-[#0c0e14]/95 backdrop-blur-xl px-4 pt-4 pb-6 overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 mb-6">
              {SITE_CONFIG.navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800/60 hover:text-emerald-400 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
              <a
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-800/60"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View on GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <a
                href="#install"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get ApplyPilot</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
