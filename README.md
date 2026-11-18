# ApplyPilot

ApplyPilot is a free, open-source, local-first browser extension and marketing platform designed to eliminate repetitive manual entry on online job applications while keeping candidates in complete control of their data.

---

## Core Philosophy

- **Local-First & Private**: Resumes, candidate profiles, saved screening answers, and application tracking histories remain strictly within your browser's local sandbox (`chrome.storage.local`). Zero remote databases, zero tracking beacons, and zero telemetry.
- **Deterministic ATS Autofill**: Purpose-built Document Object Model (DOM) adapters tailored for major Applicant Tracking Systems (Greenhouse, Lever, Ashby, Workday, and generic job boards).
- **Modern Framework Compatibility**: Uses synthetic native prototype setters to reliably update state across React 16+, Vue, and Angular application portals without values being wiped upon submission.
- **Human-in-the-Loop**: ApplyPilot **never** submits an application automatically. It populates fields for visual audit and preserves existing non-empty inputs by default.
- **Optional AI Integrations**: Operates 100% offline with zero external network access. For open-ended screening questions, candidates can connect a local **Ollama** instance (100% offline, zero egress) or provide their own **Google Gemini** API key (BYOK).
- **Prompt Injection Defense**: Untrusted job descriptions are quarantined inside explicit boundary delimiters with strict anti-hallucination directives preventing the invention of unlisted skills, employers, or dates.

---

## Workspace Structure

ApplyPilot is organized as a lightweight monorepo containing two independent applications:

```text
applypilot/
├── apps/
│   ├── website/              # Phase 1: Public marketing & documentation website
│   │   ├── src/              # React 19, Tailwind v4, Motion interactive components
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── extension/            # Phase 2: Complete Chrome Manifest V3 browser extension
│       ├── entrypoints/      # Popup HUD, Options Dashboard, Background Worker, Content Script
│       ├── src/
│       │   ├── adapters/     # Greenhouse, Lever, Ashby, Workday, Generic adapters
│       │   ├── core/schema/  # Zod schemas (Profile, Settings, Applications, QA)
│       │   └── services/     # Storage, PDF.js parser, Autofill engine, AI providers
│       ├── tests/            # Vitest unit test suite (23 passing tests)
│       ├── package.json
│       └── wxt.config.ts
├── docs/                     # Architectural, ATS support, and privacy documentation
│   ├── website.md
│   ├── extension-architecture.md
│   ├── ats-support.md
│   └── privacy.md
├── .github/workflows/        # CI automation workflows
├── PROJECT_STATUS.md         # Comprehensive phase delivery & verification logs
├── LICENSE                   # MIT License
├── package.json              # Workspace root scripts
└── README.md
```

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Website (Phase 1)** | React 19, TypeScript 5.7, Vite 6, Tailwind CSS v4, Motion for React, Lucide React |
| **Extension (Phase 2)** | WXT 0.21.5, Chrome Manifest V3, React 19, TypeScript 5.7, Tailwind CSS v4, Lucide React |
| **Resume Extraction** | PDF.js (`pdfjs-dist` 4.10.38), heuristic regex parser |
| **Schema Validation** | Zod 3.24 |
| **Testing Engine** | Vitest 3.2 with `jsdom` DOM simulation |

---

## Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v20+
- npm v10+
- Google Chrome, Brave, Arc, or any Chromium-based browser

---

### 1. Website Development (Phase 1)

Navigate to the website workspace or run from the repository root:

```bash
# Run local development server (http://localhost:3000)
npm run dev:website

# Build production static website (dist/)
npm run build:website

# Preview production build locally
npm run preview
```

---

### 2. Browser Extension Development (Phase 2)

Navigate to the extension workspace or run from the repository root:

```bash
# Run extension in live development mode
npm run dev:extension

# Run comprehensive Vitest unit test suite (23 tests)
npm run test:extension

# Build production Manifest V3 extension bundle (.output/chrome-mv3/)
npm run build:extension
```

---

### 3. Loading the Extension in Chromium (Developer Mode)

To run the compiled extension in your browser:

1. Open your browser and navigate to `chrome://extensions`.
2. Enable the **Developer mode** toggle in the top-right corner.
3. Click the **Load unpacked** button in the top-left toolbar.
4. Select the output directory:
   ```text
   applypilot/apps/extension/.output/chrome-mv3
   ```
5. ApplyPilot will appear in your extensions list. Pin it to your toolbar to access the popup HUD, or open `chrome-extension://<extension-id>/options.html` to configure candidate profiles, AI engines, and view the application ledger.

---

## Supported ATS Platforms

| Platform | Status | Targeted DOM Selectors |
| :--- | :--- | :--- |
| **Greenhouse** | Verified & Tested | `#application_form`, `#first_name`, `#last_name`, `#email`, `#phone`, `#job_application_answers_attributes_*` |
| **Lever** | Verified & Tested | `.application-form`, `input[name="name"]`, `email`, `phone`, `org`, `urls[*]` |
| **Ashby** | Verified & Tested | `jobs.ashbyhq.com`, `[data-ashby-*]`, React-controlled input wrappers |
| **Workday** | Verified & Tested | `*.myworkdayjobs.com`, `[data-automation-id="..."]` across wizard steps |
| **Generic Fallback** | Verified & Tested | Heuristic analysis across `autocomplete`, labels, aria-labels, and placeholders |

---

## Documentation

Detailed architectural specifications and engineering guides are available in the [docs/](file:///c:/Users/ragha/Desktop/apply/docs/) directory:
- [Extension Architecture](file:///c:/Users/ragha/Desktop/apply/docs/extension-architecture.md): Manifest V3 lifecycle, secure AI background bridge, storage schemas, and synthetic event dispatching.
- [ATS Platform Support](file:///c:/Users/ragha/Desktop/apply/docs/ats-support.md): Complete platform selector matrix, detection logic, and React state reconciliation.
- [Privacy & Data Sovereignty](file:///c:/Users/ragha/Desktop/apply/docs/privacy.md): Zero-telemetry model, local storage sandboxing, Ollama offline vs Gemini BYOK comparison, and data portability.
- [Website Architecture](file:///c:/Users/ragha/Desktop/apply/docs/website.md): Website design system, motion components, and interactive simulators.

---

## Current Status & Verification

- **Phase 1 (Marketing Website)**: **COMPLETED**. Fully responsive, motion-rich editorial website with interactive simulators and zero TypeScript errors.
- **Phase 2 (Browser Extension)**: **COMPLETED**. Full Manifest V3 extension with PDF resume parser, ATS adapters, non-destructive autofill engine, Ollama/Gemini integration, application tracking ledger, saved Q&A vault, and 23/23 passing unit tests.

---

## License

This project is licensed under the [MIT License](file:///c:/Users/ragha/Desktop/apply/LICENSE).
