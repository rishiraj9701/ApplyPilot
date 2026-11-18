# ApplyPilot Privacy & Data Sovereignty Specification

ApplyPilot is designed from first principles as a **local-first, zero-telemetry, user-sovereign application**. This document outlines how candidate data is handled, stored, and protected.

---

## 1. Core Privacy Commitments

1. **Zero Remote Servers**: ApplyPilot does not operate an application backend, database, or analytics proxy. No user data is ever transmitted to ApplyPilot creators, maintainers, or third parties.
2. **Zero Analytics & Tracking**: There are no Google Analytics, PostHog, Mixpanel, Sentry, or tracking beacons bundled into the codebase.
3. **No Mandatory Accounts**: Users never sign up, log in, or authenticate with an ApplyPilot service.
4. **Local Data Persistence**: 100% of parsed resumes, candidate profiles, saved Q&A answers, and job application tracking histories reside exclusively in `chrome.storage.local` on your local device.
5. **Human-in-the-Loop**: The extension never submits job applications autonomously. The user maintains sole control over final reviews and submissions.

---

## 2. Data Storage Boundaries

All data structures are kept in your browser's private extension storage sandbox:

```text
Local Machine Storage: chrome.storage.local
├── applypilot_profiles            <-- Candidate names, emails, skills, work histories
├── applypilot_active_profile_id   <-- Selected profile variant pointer
├── applypilot_ai_settings         <-- AI provider choice, local endpoint, or user API key
├── applypilot_preferences         <-- Autofill preferences & privacy toggles
├── applypilot_applications        <-- History of applied jobs (titles, companies, dates)
└── applypilot_saved_qa            <-- Custom saved screening answers
```

- Data stored in `chrome.storage.local` is segregated by browser profile and extension ID. Other extensions, websites, or external applications cannot read this storage.
- Uninstalling the extension completely purges all local storage entries from the browser disk.

---

## 3. AI Privacy Model: Local vs. Cloud BYOK

ApplyPilot provides two pathways for AI-assisted screening answers:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        AI Architecture Comparison                      │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Feature                  │ Local Ollama (Default / Recommended)        │ Cloud Provider (Google Gemini)
├──────────────────────────┼─────────────────────────────────────────────┼─────────────────────────────┤
│ Network Egress           │ 0 bytes outside localhost                   │ Direct HTTPS to Google API  │
│ Cloud Storage            │ None                                        │ Governed by Google API Terms│
│ API Key Required         │ No                                          │ Yes (Personal BYOK)         │
│ Cost                     │ 100% Free                                   │ Free / Paid Tier via User   │
│ Telemetry / Intermediate │ None                                        │ None (Direct from browser)  │
└──────────────────────────┴─────────────────────────────────────────────┴─────────────────────────────┘
```

### Pathway A: Ollama (100% Offline & Private)
- When using Ollama, requests are dispatched directly to `http://localhost:11434/api/generate`.
- Packets never leave your physical workstation.
- Completely isolated from WAN connectivity, cloud model logging, or training pipelines.

### Pathway B: Google Gemini (User BYOK)
- Direct client-to-API communication: When configured, the background service worker communicates directly with `https://generativelanguage.googleapis.com`.
- No intermediate server or proxy intercepts your API key or prompt content.
- Users provide their own API key and retain full governance over their Google Cloud project data handling policies.

---

## 4. Prompt Injection & Anti-Hallucination Protections

When screening answers are generated, untrusted text from the target job posting is strictly sanitized and quarantined:

1. **Explicit Data Delimiters**: Candidate profiles and job descriptions are enclosed within separate XML tags (`<CANDIDATE_PROFILE>` and `<JOB_DESCRIPTION>`).
2. **Instruction Isolation**: The AI system prompt explicitly instructs the LLM that content inside `<JOB_DESCRIPTION>` represents unverified third-party content and must not override core system instructions.
3. **Anti-Hallucination Directive**: Models are instructed never to invent employers, dates, credentials, or skills not present in the candidate profile.

---

## 5. User Data Sovereignty & Portability

Under the **Privacy & Data Management** tab in the Options Dashboard, candidates have immediate access to:
- **One-Click Backup Export**: Exports all candidate profiles, application histories, and saved Q&A answers into a single, clean JSON file (`applypilot_backup_<timestamp>.json`).
- **Backup Import**: Validates and restores complete datasets with comprehensive Zod schema verification.
- **Permanent Local Wipe**: Empties all `chrome.storage.local` keys, resetting the extension to a completely clean, unconfigured state.
