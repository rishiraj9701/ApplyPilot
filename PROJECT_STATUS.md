# ApplyPilot Project Status

## Overall Status: Phase 1 & Phase 2 Complete

ApplyPilot is a complete, open-source, local-first browser extension and marketing platform that simplifies job applications while keeping candidates in total control.

---

## Phase 1: Marketing Website & Visual Design System (COMPLETED)

### Overview
Located in `apps/website`, built with React 19, Vite, Tailwind CSS v4, and Motion for React.

### Key Deliverables
- **Asymmetrical Living Hero**: Interactive live ATS form demo with persona selector chips and hold-to-autofill motion trigger.
- **6-Stage Interactive Walkthrough**: Step-by-step simulator showing PDF parsing, structured extraction, ATS detection, synthetic input population, AI generation, and review.
- **Platform Diagnostic Console**: Live selector inspection across Greenhouse, Lever, Ashby, Workday, and custom ATS boards.
- **Local Data Pipeline Inspector**: Interactive data flow visualization highlighting 0 bytes WAN network egress.
- **Engine Workbench**: Interactive AI provider switcher (Ollama offline vs Google Gemini BYOK) with live simulated streaming token generation.
- **Interactive FAQ & Chromium Extension Simulator**: Full extension installation preview.
- **Build Status**: Verified production build (`dist/`) passing in 13.1s with 0 TypeScript errors.

---

## Phase 2: Browser Extension Engineering (COMPLETED)

### Overview
Located in `apps/extension`, built with WXT, Chrome Manifest V3, React 19, TypeScript, Tailwind CSS v4, PDF.js, and Zod.

### Architecture & Key Subsystems

```text
apps/extension/
├── entrypoints/
│   ├── background.ts          # MV3 Service Worker (Secure AI bridge, lifecycle)
│   ├── content.ts             # Content Script (ATS inspection, autofill runner, floating dock)
│   ├── popup/                 # Toolbar Popup HUD (Detection status, 1-click autofill)
│   └── options/               # Full Options Dashboard (5 dedicated tabs)
├── src/
│   ├── adapters/              # Greenhouse, Lever, Ashby, Workday, Generic Fallback
│   ├── core/schema/           # Zod domain models (Profile, Settings, Applications, QA)
│   ├── services/
│   │   ├── storage/           # Type-safe storageService with memory fallback
│   │   ├── resume/            # PDF.js text extractor & regex profile parser
│   │   ├── autofill/          # Autofill engine with React synthetic event dispatcher
│   │   ├── job/               # Transparent job intelligence & keyword match scoring
│   │   ├── ai/                # Ollama & Gemini providers with prompt injection defense
│   │   └── messaging/         # Type-safe Chrome runtime messaging contracts
└── tests/                     # 6 Vitest suites covering all modules (23 passing tests)
```

### Verification & Test Metrics
- **Unit Test Suite**: 6 test suites, **23 / 23 unit tests passing** via Vitest:
  - `resume.test.ts`: PDF text extraction & structured candidate regex parser.
  - `ats.test.ts`: Greenhouse, Lever, Ashby, Workday, and Generic adapter resolution.
  - `autofill.test.ts`: Synthetic React/Vue event dispatching & non-destructive preservation.
  - `storage.test.ts`: In-memory and chrome.storage.local operations, profiles, backups.
  - `jobIntelligence.test.ts`: Deterministic keyword matching & match scoring.
  - `ai.test.ts`: System prompt formatting, candidate profile isolation, anti-hallucination.
- **Build Output**: WXT build passed in 1.8s, generating Chrome MV3 output in `apps/extension/.output/chrome-mv3`.

---

## Platform Support Matrix

| Platform | Status | Selectors / DOM Target |
| :--- | :--- | :--- |
| **Greenhouse** | Verified & Tested | `#application_form`, `#first_name`, `#last_name`, `#email`, `#phone`, custom answers |
| **Lever** | Verified & Tested | `.application-form`, `input[name="name"]`, `email`, `phone`, `org`, `urls[*]` |
| **Ashby** | Verified & Tested | `jobs.ashbyhq.com`, `[data-ashby-*]`, React-controlled labeled inputs |
| **Workday** | Verified & Tested | `*.myworkdayjobs.com`, `[data-automation-id="..."]` |
| **Generic Fallback** | Verified & Tested | Heuristic analysis across `autocomplete`, labels, aria-labels, placeholders |

---

## Documentation Index

- [Website Architecture](docs/website.md): Website design system, motion components, and interactive simulators.
- [Extension Architecture](docs/extension-architecture.md): MV3 architecture, service worker security boundary, and synthetic event dispatching.
- [ATS Platform Support](docs/ats-support.md): Platform selectors, detection logic, and DOM mapping.
- [Privacy & Data Sovereignty](docs/privacy.md): Zero-telemetry model, local storage sandboxing, and Ollama vs Gemini comparison.
- [Extension README](apps/extension/README.md): Developer guide, building instructions, and Chrome loading steps.
