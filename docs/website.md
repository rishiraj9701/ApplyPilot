# ApplyPilot Website Architecture & Documentation

## Overview
This documentation describes the architecture, component structure, design system, motion choreography, and deployment procedures for the ApplyPilot marketing website (`apps/website`).

ApplyPilot is an open-source, local-first browser extension designed to eliminate repetitive manual entry on job applications while preserving user privacy and candidate control.

---

## Workspace Structure

```text
applypilot/
├── apps/
│   ├── website/                      # Independent static Vite + React 19 application
│   │   ├── public/
│   │   │   ├── favicon.svg           # Branded aerodynamic vector favicon
│   │   │   └── og-image.png          # Social preview placeholder
│   │   ├── src/
│   │   │   ├── animations/
│   │   │   │   └── MotionPrims.tsx   # Reusable Motion for React primitives
│   │   │   ├── components/
│   │   │   │   ├── BrandIcons.tsx    # SVG brand icons (GitHub, Chromium)
│   │   │   │   ├── CodeBlock.tsx     # Syntax window with copy button
│   │   │   │   ├── Navbar.tsx        # Responsive header with mobile drawer
│   │   │   │   ├── SectionHeader.tsx # Semantic section headings
│   │   │   │   └── StatusBadge.tsx   # Semantic implementation pills
│   │   │   ├── config/
│   │   │   │   └── site.ts           # Centralized configuration & copy
│   │   │   ├── sections/
│   │   │   │   ├── Hero.tsx          # Product presentation & interactive form preview
│   │   │   │   ├── Walkthrough.tsx   # 6-step interactive workflow simulator
│   │   │   │   ├── ProblemSolution.tsx# Pain vs. ApplyPilot architecture comparison
│   │   │   │   ├── Features.tsx      # 10 core capabilities with technical inspector
│   │   │   │   ├── ATSCompatibility.tsx# ATS platform matrix & detection breakdown
│   │   │   │   ├── HowItWorks.tsx    # 7-step chronological timeline
│   │   │   │   ├── Privacy.tsx       # Local-first security & cloud scraper diff
│   │   │   │   ├── AIProviders.tsx   # Ollama vs. Google Gemini comparison
│   │   │   │   ├── Installation.tsx  # Unpacked GitHub release guide
│   │   │   │   ├── OpenSource.tsx    # MIT license & transparency manifesto
│   │   │   │   ├── FAQ.tsx           # Accessible animated accordion
│   │   │   │   └── Footer.tsx        # Dynamic navigation & status footer
│   │   │   ├── styles/
│   │   │   │   └── index.css         # Tailwind CSS v4 directives & patterns
│   │   │   ├── App.tsx               # Root view composition
│   │   │   └── main.tsx              # React 19 entry point
│   │   ├── index.html                # Semantic HTML5 shell with OpenGraph metadata
│   │   ├── package.json              # Website dependencies & scripts
│   │   ├── tsconfig.json             # TypeScript compiler settings
│   │   └── vite.config.ts            # Vite 6 + Tailwind v4 plugin configuration
│   └── extension/
│       └── README.md                 # Reserved placeholder for Phase 2
├── docs/
│   └── website.md                    # Architecture and developer guide
├── .github/
│   └── workflows/
│       └── website.yml               # GitHub Actions CI workflow
├── README.md                         # Project-level developer readme
├── LICENSE                           # Permissive MIT open-source license
└── PROJECT_STATUS.md                 # Phase 1 tracking and verification report
```

---

## Design System & Tokens

### Palette
The visual identity uses a restrained dark slate/graphite architectural palette with precision emerald accents to signal local-first privacy, technical integrity, and determinism:

- **Surface Base**: `#090a0f` (Deep obsidian dark background)
- **Surface Elevation 1**: `#0c0e14` (Container background)
- **Surface Elevation 2**: `#0f172a` (Slate 900 input and card background)
- **Hairline Borders**: `#1e2430` (Slate 800 borders with 1px precision)
- **Primary Accent**: `#10b981` (Emerald 500)
- **Secondary Accent**: `#06b6d4` (Cyan 500)
- **Text High-Contrast**: `#f8fafc` (Slate 50)
- **Text Body**: `#cbd5e1` (Slate 300)
- **Text Muted**: `#94a3b8` (Slate 400)

### Typography
- **Sans-Serif Display & Body**: `Plus Jakarta Sans`, system-ui, -apple-system, sans-serif
- **Monospace Telemetry & Code**: `Geist Mono`, ui-monospace, Menlo, Consolas, monospace

---

## Motion & Interaction Architecture

All motion is implemented with `motion/react` (Motion v12) and native CSS transitions following consistent physical constraints:

1. **Reduced Motion**:
   All motion components (`FadeIn`, `StaggerContainer`, `WordReveal`, `MagneticButton`) check `useReducedMotion()`. If preferred, animations instantly resolve without layout shifts or animated movement.

2. **Timing Curves**:
   - Micro-interactions (hover, magnetic pull): 120ms–200ms spring with stiffness 220, damping 18.
   - Expandable Accordion: 250ms with custom cubic-bezier easing `[0.16, 1, 0.3, 1]`.
   - Scroll-triggered entrances: 450ms–500ms viewport entrances with `once: true`.

3. **Performance Safeguards**:
   - Only GPU-accelerated transforms (`transform: translate3d`, `opacity`, `scale`) are animated.
   - No expensive layout properties (`width`, `height`, `margin`) are animated continuously.

---

## Centralized Configuration (`site.ts`)

All repository links, documentation routes, ATS platform matrices, feature statuses, and FAQ answers are centralized in `apps/website/src/config/site.ts`:

- `SITE_CONFIG.links.github`: Target GitHub repository URL.
- `SITE_CONFIG.links.githubReleases`: Direct link to GitHub Releases.
- `SITE_CONFIG.links.githubIssues`: Issue tracker destination.
- `SITE_CONFIG.isReleaseAvailable`: Feature flag toggling between "Phase 1: In Development" and direct download buttons when Phase 2 binary releases are published.

---

## Static Deployment

The website builds to pure static HTML, CSS, and JavaScript with zero backend dependencies:

### Local Development
```bash
cd apps/website
npm run dev
```

### Production Build
```bash
cd apps/website
npm run build
```
Output directory: `apps/website/dist/`.

### Deployment to GitHub Pages / Cloudflare Pages
- **Cloudflare Pages**: Set build command to `npm --prefix apps/website run build` and output directory to `apps/website/dist`.
- **GitHub Pages**: Output directory `apps/website/dist` can be deployed using the official GitHub Pages action or static workflow.
