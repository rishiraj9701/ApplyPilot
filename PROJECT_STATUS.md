# ApplyPilot Project Status

## Overall Status: Phase 1 & Phase 2 Complete — Phase 2.1 Technical Audit Complete

ApplyPilot is a complete, open-source, local-first browser extension and marketing platform that simplifies job applications while keeping candidates in total control.

---

## Phase 1: Marketing Website & Visual Design System (COMPLETED)

### Overview
Located in `apps/website`, built with React 19, Vite, Tailwind CSS v4, and Motion for React.

### Key Deliverables
- **Asymmetrical Living Hero**: Interactive live ATS form demo with persona selector chips and hold-to-autofill motion trigger.
- **6-Stage Interactive Walkthrough**: Step-by-step simulator showing PDF parsing, structured extraction, ATS detection, synthetic input population, AI generation, and review.
- **Platform Diagnostic Console**: Live selector inspection across Greenhouse, Lever, Ashby, Workday, and custom ATS boards.
- **Local Data Pipeline Inspector**: Interactive data flow visualization highlighting 0 bytes WAN network egress for local operation.
- **Engine Workbench**: Interactive AI provider switcher (Ollama offline vs Google Gemini BYOK) with live simulated streaming token generation.
- **Interactive FAQ & Chromium Extension Simulator**: Full extension installation preview.
- **Build Status**: Verified production build (`dist/`) passing with 0 TypeScript errors.

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
│   ├── popup/                 # Toolbar Popup HUD (Detection status, explicit ledger logging)
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
└── tests/                     # 6 Vitest suites covering all modules (35 passing tests)
```

---

## Phase 2.1: Technical Audit & Browser Validation (COMPLETED)

### Branch: `audit/phase-2.1`

An independent, evidence-based code and security audit was conducted across all subsystems. Verified defects were remediated and tested.

### Verification Status by Subsystem

| Subsystem | Audit Status | Evidence / Verification Method |
| :--- | :--- | :--- |
| **Manifest V3 CSP Compliance** | **PASS** | Removed remote CDN worker from `pdfParser.ts`. PDF.js now processes text in-thread without violating MV3 CSP. |
| **MV3 Host Permissions** | **PASS** | Added `http://localhost:11434/*`, `http://127.0.0.1:11434/*`, and `https://generativelanguage.googleapis.com/*` to `wxt.config.ts`. Verified in compiled `manifest.json`. |
| **AI Credential Isolation** | **PASS** | Gemini API key sent via `x-goog-api-key` header instead of URL query string. API keys remain isolated in `chrome.storage.local` and background service worker. |
| **AI Network Timeouts** | **PASS** | Added `AbortSignal.timeout(10000)` for health checks and `AbortSignal.timeout(30000)` for answer generation across Ollama and Gemini. |
| **Prompt Injection Boundary Hardening** | **PASS** | Wrapped untrusted job descriptions in `<UNTRUSTED_JOB_DESCRIPTION>` with strict anti-injection system prompt directives. Verified in `tests/ai.test.ts`. |
| **Message Payload Validation** | **PASS** | Added runtime validation guards in `background.ts` and `content.ts` rejecting malformed, null, or unknown message payloads. |
| **Human-in-the-Loop Application Logging** | **PASS** | Removed automatic application creation during autofill. Candidates must now click explicit `[I Have Submitted — Save to Ledger]` action in popup. |
| **Candidate Data Integrity** | **PASS** | Removed fallback fabrication of `candidate@example.com` and default names. Resumes with missing contact fields preserve empty strings. |
| **HTMLSelectElement Synthetic Events** | **PASS** | Enhanced `setNativeValue` to resolve `HTMLSelectElement.prototype.value` setter and dispatch synthetic change events. |
| **Greenhouse DOM Adapter** | **PASS** (Unit & Fixture) | Verified on representative DOM fixture in `tests/ats.test.ts`. |
| **Lever DOM Adapter** | **PASS** (Unit & Fixture) | Verified on representative DOM fixture in `tests/ats.test.ts`. |
| **Ashby DOM Adapter** | **PASS** (Unit & Fixture) | Resolved container-level label scoping bug. Verified on representative DOM fixture in `tests/ats.test.ts`. |
| **Workday DOM Adapter** | **PASS** (Unit & Fixture) | Verified `data-automation-id` mapping on representative DOM fixture in `tests/ats.test.ts`. |
| **Generic Fallback Adapter** | **PASS** (Unit & Fixture) | Verified HTML5 autocomplete, aria-label, and placeholder heuristics in `tests/ats.test.ts`. |
| **Live ATS Site Submissions** | **NOT TESTED** | Enterprise ATS deployments often utilize dynamic CSS classes, reCAPTCHA, and iframe wrappers. Live submissions were intentionally not executed. |
| **Extension Options Dashboard** | **PASS** (Build & Render) | 5 dedicated tabs, profile editor, backup export/import, AI configuration validated. |
| **Storage Security Limitations** | **PASS** (Documented) | Corrected misleading "encrypted" storage claims. `chrome.storage.local` is plaintext local storage sandboxed by the browser profile. |

---

## Verification & Test Metrics

- **Unit Test Suite**: 6 test suites, **35 / 35 unit tests passing** via Vitest:
  - `resume.test.ts`: 9 tests passed (typical resume, missing fields, empty/scanned resume, unusual section ordering, multi-contact).
  - `ats.test.ts`: 10 tests passed (Greenhouse, Lever, Ashby, Workday, Generic detection and representative form fixtures).
  - `autofill.test.ts`: 4 tests passed (empty fill, non-empty preservation, overwrite toggle, `HTMLSelectElement` dispatch).
  - `storage.test.ts`: 5 tests passed (profiles, default variants, duplicate detection, backup export/restore, status updates & deletion).
  - `jobIntelligence.test.ts`: 2 tests passed (keyword extraction and score calculation).
  - `ai.test.ts`: 5 tests passed (provider instantiation, offline Ollama handling, missing key handling, endpoint normalization, prompt injection boundary quarantine).
- **Extension Build**: WXT build passed in 1.97s (`apps/extension/.output/chrome-mv3`).
- **Website Build**: Vite build passed in 5.15s (`apps/website/dist`).

---

## Documentation Index

- [Website Architecture](docs/website.md): Website design system, motion components, and interactive simulators.
- [Extension Architecture](docs/extension-architecture.md): MV3 architecture, service worker security boundary, and synthetic event dispatching.
- [ATS Platform Support](docs/ats-support.md): Platform selectors, detection logic, and DOM mapping.
- [Privacy & Data Sovereignty](docs/privacy.md): Zero-telemetry model, local storage sandboxing, and Ollama vs Gemini comparison.
- [Extension README](apps/extension/README.md): Developer guide, building instructions, and Chrome loading steps.
