import {
  Download,
  FolderOpen,
  ToggleRight,
  ExternalLink,
  CheckCircle2,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ChromeIcon } from '../components/BrandIcons';
import { SITE_CONFIG } from '../config/site';
import { SectionHeader } from '../components/SectionHeader';
import { CodeBlock } from '../components/CodeBlock';
import { FadeIn, MagneticButton } from '../animations/MotionPrims';

interface InstallStep {
  step: string;
  title: string;
  instruction: string;
  badge: string;
  icon: any;
}

const INSTALL_STEPS: InstallStep[] = [
  {
    step: '01',
    title: 'Download Release Archive',
    instruction: 'Grab the latest applypilot-extension-v*.zip archive from the verified GitHub Releases page.',
    badge: 'RELEASE ASSET',
    icon: Download,
  },
  {
    step: '02',
    title: 'Extract Files Locally',
    instruction: 'Unzip the archive to a permanent folder on your computer (e.g. ~/applypilot-extension).',
    badge: 'LOCAL DIRECTORY',
    icon: FolderOpen,
  },
  {
    step: '03',
    title: 'Open Extension Manager',
    instruction: 'Navigate to chrome://extensions in Chrome, Brave, Arc, Edge, or any Chromium browser.',
    badge: 'CHROME://EXTENSIONS',
    icon: ChromeIcon,
  },
  {
    step: '04',
    title: 'Enable Developer Mode',
    instruction: 'Toggle the "Developer mode" switch located in the top-right corner of the Extensions dashboard.',
    badge: 'ONE-TIME TOGGLE',
    icon: ToggleRight,
  },
  {
    step: '05',
    title: 'Load Unpacked Extension',
    instruction: 'Click "Load unpacked" in the top-left corner and select your unzipped extension directory.',
    badge: 'READY TO RUN',
    icon: CheckCircle2,
  },
];

export function Installation() {
  return (
    <section id="install" className="py-20 sm:py-28 bg-[#0c0e14] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="GETTING STARTED"
          badgeIcon={<Download className="w-3.5 h-3.5" />}
          title="Direct, Open-Source Distribution"
          subtitle="ApplyPilot is distributed freely through GitHub Releases as an unpacked Chromium extension. No centralized app stores, no tracking identifiers, and no paywalls."
        />

        {/* Phase 1 Status Banner / Coming Soon Callout */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-slate-900/90 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Phase 1: Marketing & Technical Preview
                  </h3>
                  <span className="text-xs font-mono text-emerald-400">
                    Extension Build Scheduled for Phase 2
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 self-start sm:self-auto">
                In Active Development
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              We believe in complete transparency: the browser extension binary is currently in Phase 1 engineering. Pre-compiled release archives will be published to GitHub Releases once test suites pass in Phase 2. No fake download files or mock ZIPs are distributed on this site.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs sm:text-sm transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Follow Progress on GitHub</span>
              </a>

              <a
                href={SITE_CONFIG.links.githubReleases}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs sm:text-sm transition-colors"
              >
                <span>View Releases Page</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Step-by-Step Installation Cards */}
        <div className="max-w-4xl mx-auto space-y-4 mb-12">
          <h3 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-2">
            Standard Unpacked Installation Procedure:
          </h3>

          <div className="grid grid-cols-1 gap-3.5">
            {INSTALL_STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="p-4 sm:p-5 rounded-xl border border-slate-800 bg-[#090a0f] hover:border-slate-700 transition-colors flex items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-emerald-400 flex-shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white mb-0.5">
                        {s.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 leading-normal">
                        {s.instruction}
                      </p>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 flex-shrink-0">
                    {s.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Developer Mode Explanation Notice */}
        <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-200">
              Why Developer Mode installation?
            </span>
            <p className="text-slate-400 leading-relaxed">
              Distributing via Developer Mode allows ApplyPilot to stay 100% free and open-source without requiring commercial Chrome Web Store registration accounts or mandatory platform telemetry. Updates are performed by downloading newer release ZIPs or pulling latest tags.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
