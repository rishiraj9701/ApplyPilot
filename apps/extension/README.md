# ApplyPilot Browser Extension (Phase 2)

ApplyPilot is a free, open-source, local-first Chromium browser extension that eliminates repetitive manual data entry on job application forms while keeping the candidate in complete control.

---

## Architecture & Core Philosophy

1. **Local-First & Private**: All profile information, parsed resume data, saved answers, and application histories remain strictly within your local browser storage (`chrome.storage.local`). There is no cloud backend, no account creation, and zero tracking or telemetry.
2. **Deterministic & Reliable**: Form filling uses specialized Document Object Model (DOM) adapters tailored for major Applicant Tracking Systems (ATS) rather than fragile fuzzy guessing.
3. **Human-in-the-Loop**: ApplyPilot **never** submits an application automatically. Form fields are populated for review, with non-empty fields protected by default.
4. **Optional AI**: Works 100% offline with full functionality. When AI assistance is desired for open-ended screening questions, users can connect a local **Ollama** instance (100% offline) or provide their own **Google Gemini** API key (BYOK).

---

## Directory Structure

```text
apps/extension/
├── entrypoints/
│   ├── background.ts          # MV3 Background Service Worker (secure AI bridge, lifecycle)
│   ├── content.ts             # Content Script (ATS inspection, autofill runner, floating dock)
│   ├── popup/                 # Extension popup toolbar HUD
│   │   ├── index.html
│   │   ├── main.tsx
│   │   └── App.tsx
│   └── options/               # Full-screen options dashboard
│       ├── index.html
│       ├── main.tsx
│       └── App.tsx
├── public/                    # Manifest icons (16, 32, 48, 128)
├── src/
│   ├── adapters/              # ATS detection and autofill adapters
│   │   ├── base.ts            # Base ATSAdapter interface & React event dispatcher
│   │   ├── greenhouse.ts      # Greenhouse Job Board adapter
│   │   ├── lever.ts           # Lever Postings adapter
│   │   ├── ashby.ts           # Ashby HQ adapter
│   │   ├── workday.ts         # Workday Candidate Experience adapter
│   │   ├── generic.ts         # Heuristic fallback adapter
│   │   └── index.ts           # Adapter registry & resolver
│   ├── core/
│   │   └── schema/            # Zod domain schemas & TypeScript types
│   │       ├── profile.ts     # CandidateProfile, Experience, Education
│   │       ├── settings.ts    # AISettings, UserPreferences
│   │       ├── application.ts # ApplicationRecord & ApplicationStatus
│   │       ├── qa.ts          # SavedQA & QACategory
│   │       └── index.ts       # ApplyPilotBackupSchema export
│   ├── services/
│   │   ├── storage/           # Type-safe storageService with memory fallback
│   │   ├── resume/            # PDF.js text extraction & regex/heuristic parser
│   │   ├── autofill/          # Autofill engine & semantic field mapping
│   │   ├── job/               # Job description analysis & skill match scoring
│   │   ├── ai/                # Ollama & Gemini providers with prompt guards
│   │   └── messaging/         # Type-safe Chrome runtime messaging contracts
│   └── styles/
│       └── globals.css        # Dark architectural theme
├── tests/                     # Comprehensive Vitest test suite (23 unit tests)
│   ├── resume.test.ts
│   ├── ats.test.ts
│   ├── autofill.test.ts
│   ├── storage.test.ts
│   ├── jobIntelligence.test.ts
│   └── ai.test.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── wxt.config.ts              # WXT build configuration & MV3 manifest
```

---

## Technology Stack

- **Extension Framework**: [WXT](https://wxt.dev/) 0.21.5
- **Manifest Target**: Chrome Manifest V3
- **Frontend UI**: React 19, TypeScript 5.7, Tailwind CSS v4, Lucide React
- **Resume Processing**: PDF.js (`pdfjs-dist` 4.10.38)
- **Data Validation**: Zod 3.24
- **Testing**: Vitest 3.2 + jsdom

---

## Developer Setup & Installation

### Prerequisites
- Node.js 20+
- npm 10+
- Google Chrome, Brave, Arc, or any Chromium-based browser

### 1. Install Dependencies
```bash
cd apps/extension
npm install
```

### 2. Run Unit Tests
To verify all resume parsing, ATS adapters, autofill heuristics, and AI prompt protection:
```bash
npm test
```

### 3. Build the Extension
Build the production unpacked extension bundle:
```bash
npm run build
```
This outputs the compiled extension to `apps/extension/.output/chrome-mv3/`.

### 4. Load into Browser (Developer Mode)
1. Open your Chromium browser and navigate to `chrome://extensions`.
2. Toggle on **Developer mode** in the top-right corner.
3. Click the **Load unpacked** button.
4. Select the output directory:
   ```
   c:\Users\<username>\...\applypilot\apps\extension\.output\chrome-mv3
   ```
5. ApplyPilot will appear in your extensions bar! Click the puzzle icon to pin it.

---

## Permissions & Security

| Permission | Justification |
| :--- | :--- |
| `storage` | Stores profiles, settings, application ledger, and saved answers locally in `chrome.storage.local`. |
| `activeTab` | Inspects and autofills application fields on the currently active ATS tab when triggered by the user. |
| `tabs` | Identifies candidate ATS application pages and renders detection state in the popup. |

### Host Permissions
ApplyPilot requests host permissions strictly for supported ATS job application portals:
- `*://*.greenhouse.io/*`
- `*://*.lever.co/*`
- `*://*.ashbyhq.com/*`
- `*://*.myworkdayjobs.com/*`
- `*://*/*` (Required for generic fallback detection across custom company job boards).

---

## Core Capabilities

### 1. Resume Parsing & Profile Engine
- Native PDF text extraction using PDF.js inside the browser.
- Heuristic regex extractor parses candidate names, emails, phone numbers, location, website/portfolio, LinkedIn, GitHub, categorized skills, work experiences, education degrees, and certifications.
- Multi-variant profile management: maintain distinct targeted profiles (e.g., "Full-Stack Engineer", "Frontend Specialist", "Engineering Manager") and switch active profiles instantly.

### 2. ATS Adapter Suite
- **Greenhouse**: Auto-detects `#application_form` and fills `#first_name`, `#last_name`, `#email`, `#phone`, `#job_application_answers_attributes_*`, and dynamic custom questions.
- **Lever**: Detects `.application-form` and populates `input[name="name"]`, `input[name="email"]`, `input[name="phone"]`, `input[name="org"]`, `input[name="urls[LinkedIn]"]`, and custom questions.
- **Ashby**: Handles React-controlled custom input trees and dynamic data structures.
- **Workday**: Targets `data-automation-id` attributes (`legalNameSection_firstName`, `addressSection_postalCode`, etc.) across multi-step wizard flows.
- **Generic Fallback**: Semantic heuristic scanner matching labels, `aria-label`, placeholder text, and HTML5 `autocomplete` attributes.

### 3. Synthetic React Input Dispatching
Modern web frameworks (React 16+, Vue, Angular) override DOM element setters, causing standard `.value = ...` updates to be discarded on submit. ApplyPilot uses `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set` to invoke native prototype setters followed by `input`, `change`, and `blur` event dispatching.

### 4. Non-Destructive Autofill
Existing non-empty form inputs are protected by default so candidate manual edits are never overwritten unless specifically configured in user preferences.

### 5. Transparent Job Intelligence
- Extracts job titles, company names, and requirements directly from page markup.
- Computes match scores and missing skill keywords based on candidate profile data.
- 100% deterministic keyword matching with zero hidden AI hallucination.

### 6. AI Providers & Prompt Injection Guardrails
- **Ollama**: Connects directly to local instances (`http://localhost:11434`) running Llama 3, Mistral, Gemma, or custom models. 100% offline and zero egress.
- **Google Gemini**: Direct API calls using personal user keys.
- **Security**: System prompts enforce strict anti-hallucination rules ("Use ONLY facts from the provided candidate profile. If an answer cannot be determined, state what is missing rather than inventing facts"). Delimiters and prompt-injection sanitization isolate untrusted job descriptions from system instructions.
- **Credential Isolation**: AI API keys reside solely in `chrome.storage.local` and are processed within the background service worker, never exposed to content scripts or page DOMs.

### 7. Application Ledger & Duplicate Detection
- Logs application submissions, companies, positions, ATS platforms, dates, and match scores.
- Automatically alerts the user if they have already applied to the same position or company within the past 90 days.
- Full JSON export and import for seamless data portability.
