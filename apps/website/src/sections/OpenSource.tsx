import {
  GitPullRequest,
  Bug,
  FileCode,
  Scale,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { GithubIcon } from '../components/BrandIcons';
import { SITE_CONFIG } from '../config/site';
import { SectionHeader } from '../components/SectionHeader';
import { MagneticButton } from '../animations/MotionPrims';

export function OpenSource() {
  return (
    <section className="py-24 sm:py-32 bg-[#090b10] border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="PUBLIC & AUDITABLE"
          badgeIcon={<GitPullRequest className="w-3.5 h-3.5" />}
          title="Built in the Open. Free Forever."
          subtitle="Software that touches your employment history must be open to inspection. ApplyPilot is released under the permissive MIT License with zero telemetry."
        />

        {/* Core Open Source Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {/* Card 1 */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-[#0c0f17] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Full Source Transparency</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every single line of code—from the DOM selector engines to local WebAssembly parsers—is visible in our public repository. No closed-source blobs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-[#0c0f17] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Permissive MIT License</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Fork it, inspect it, adapt it, or contribute back. The MIT License ensures that the tool remains permanently free and accessible to the global developer community.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-[#0c0f17] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bug className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Community Driven Selectors</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              ATS portals evolve over time. Anyone can contribute selector fixes, platform detection heuristics, or support for regional career engines.
            </p>
          </div>
        </div>

        {/* GitHub Repository Banner */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-[#0c0f17] to-slate-950 p-8 sm:p-12 shadow-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300 mb-4">
            <GithubIcon className="w-4 h-4 text-emerald-400" />
            <span>github.com/applypilot/applypilot</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Inspect the Codebase & Join Development
          </h3>

          <p className="text-sm text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed font-sans">
            Report edge cases with ATS layouts, request features, or check out our architecture documentation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton>
              <a
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Visit GitHub Repository</span>
              </a>
            </MagneticButton>

            <MagneticButton>
              <a
                href={SITE_CONFIG.links.githubIssues}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:text-white transition-colors"
              >
                <Bug className="w-4 h-4 text-rose-400" />
                <span>Report an Issue</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
