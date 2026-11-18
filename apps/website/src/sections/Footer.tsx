import { ArrowUp, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../components/BrandIcons';
import { SITE_CONFIG } from '../config/site';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05070a] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12L20 4L14 20L11 13L4 12Z"
                    fill="currentColor"
                    fillOpacity="0.25"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <circle cx="11" cy="13" r="1.5" fill="#34d399" />
                </svg>
              </div>
              <span className="font-extrabold tracking-tight text-white text-lg">
                ApplyPilot
              </span>
            </a>

            <p className="text-slate-400 leading-relaxed text-xs sm:text-sm max-w-sm font-sans">
              The free, open-source, local-first browser extension created to eliminate repetitive job application forms while keeping candidates in total control.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Phase 1 Complete
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Phase 2 Extension Next
              </span>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-slate-200 uppercase tracking-wider text-xs font-semibold">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#walkthrough" className="hover:text-emerald-400 transition-colors">
                  Walkthrough
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#ats-compatibility" className="hover:text-emerald-400 transition-colors">
                  ATS Support
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                  Lifecycle
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture & Privacy Column */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-slate-200 uppercase tracking-wider text-xs font-semibold">
              Architecture
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#privacy" className="hover:text-emerald-400 transition-colors">
                  Local-First Security
                </a>
              </li>
              <li>
                <a href="#ai-providers" className="hover:text-emerald-400 transition-colors">
                  Ollama & Gemini
                </a>
              </li>
              <li>
                <a href="#install" className="hover:text-emerald-400 transition-colors">
                  Installation Guide
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Open Source Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-slate-200 uppercase tracking-wider text-xs font-semibold">
              Open Source
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={SITE_CONFIG.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.links.githubReleases}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Releases (GitHub)</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.links.githubIssues}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Issue Tracker</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.links.license}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  MIT License
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <span>© {currentYear} ApplyPilot Contributors.</span>
            <span>•</span>
            <span>Free & Open Source under the MIT License.</span>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-mono"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
