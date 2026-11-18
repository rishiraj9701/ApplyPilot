# ApplyPilot

ApplyPilot is an open-source, local-first browser extension created to streamline repetitive online job application forms.

## Core Philosophy
- **Local-First Candidate Profile**: Resumes and profiles are processed and stored locally on your device in browser storage.
- **No Cloud Resume Storage**: Zero backend databases storing personal resumes or credentials.
- **Deterministic ATS Autofill**: Maps profile fields to form inputs across modern ATS platforms (Greenhouse, Lever, Ashby, Workday).
- **Optional AI Assistance**: Support for local inference via Ollama or optional cloud models via Google Gemini.
- **Human in the Loop**: ApplyPilot never auto-submits. The candidate reviews every input and clicks submit manually.

---

## Workspace Structure

ApplyPilot is structured into two independent workspaces:

1. **`apps/website` (Phase 1)**: The public marketing and documentation static website built with React 19, TypeScript, Vite, Tailwind CSS v4, and Motion for React.
2. **`apps/extension` (Phase 2)**: The planned browser extension workspace.

```text
applypilot/
├── apps/
│   ├── website/          # Independent static React 19 + Vite website
│   │   ├── public/       # Static assets and favicon
│   │   ├── src/          # Components, sections, animations, config
│   │   ├── package.json  # Website dependencies
│   │   └── vite.config.ts# Vite and Tailwind v4 configuration
│   └── extension/        # Reserved directory for Phase 2 extension
├── docs/                 # Architectural documentation
├── .github/workflows/    # CI build workflows
├── PROJECT_STATUS.md     # Phase tracking and verification report
└── README.md
```

---

## Website Quickstart

### Prerequisites
- Node.js 20+
- npm 10+

### Installation & Local Development

Run from the website directory:

```bash
cd apps/website
npm install
npm run dev
```

Or run from the repository root:

```bash
npm run dev
```

### Production Build

```bash
cd apps/website
npm run build
```

The production output is placed in `apps/website/dist/` ready for static deployment on GitHub Pages or Cloudflare Pages.

---

## Technology Stack (Website)
- React 19
- TypeScript
- Vite 6
- Tailwind CSS v4
- Motion for React (`motion/react`)
- Lucide React

---

## Status & Roadmap
- **Phase 1 (Completed)**: Marketing website, interactive conceptual walkthrough, architecture documentation, design system, and static build verification.
- **Phase 2 (Upcoming)**: Extension development with client-side resume parser and ATS autofill engine.
