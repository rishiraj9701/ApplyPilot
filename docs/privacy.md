# ApplyPilot Privacy & Data Sovereignty Specification

ApplyPilot is designed from first principles as a **local-first, zero-telemetry, user-sovereign application**. This document outlines how candidate data is handled, stored, and protected.

---

## 1. Core Privacy Commitments

1. **Zero Remote Backend**: ApplyPilot does not operate an application backend, database, or analytics proxy. No user data is ever transmitted to ApplyPilot creators, maintainers, or central infrastructure.
2. **Zero Analytics & Tracking**: There are no Google Analytics, PostHog, Mixpanel, Sentry, or tracking beacons bundled into the codebase.
3. **No Mandatory Accounts**: Users never sign up, log in, or authenticate with an ApplyPilot service.
4. **Local Data Persistence**: 100% of candidate profiles, saved Q&A answers, and job application tracking histories reside in `chrome.storage.local` on your local device.
5. **Human-in-the-Loop**: The extension never submits job applications autonomously. The user maintains sole control over final reviews and submissions. Autofilling a form does NOT automatically mark an application as submitted.

---

## 2. Data Storage Boundaries & Security Model

All data structures are kept in your browser's extension storage sandbox:

```text
Local Machine Storage: chrome.storage.local
├── applypilot_profiles            <-- Candidate names, emails, skills, work histories
├── applypilot_active_profile_id   <-- Selected profile variant pointer
├── applypilot_ai_settings         <-- AI provider choice, local endpoint, or user API key
├── applypilot_preferences         <-- Autofill preferences & duplicate window
├── applypilot_applications        <-- History of logged applications (titles, companies, dates)
└── applypilot_saved_qa            <-- Custom saved screening answers
```

### Storage Security Limitations:
- **Plaintext Storage**: Data stored in `chrome.storage.local` is **not cryptographically encrypted at rest**. It relies on operating system filesystem permissions and Chromium's per-profile sandbox.
- **Physical Machine Access**: Anyone with administrative access to your local machine filesystem or Chromium user profile folder can read `chrome.storage.local` LevelDB files directly.
- **Extension Isolation**: Web pages you visit and other browser extensions cannot access ApplyPilot's `chrome.storage.local` sandbox.
- **Purge on Uninstall**: Uninstalling the extension completely deletes all associated local storage data from the browser disk.

---

## 3. Network Communication & AI Model Comparison

ApplyPilot's network communication depends on user configuration:

| Configuration | Network Communication | External Destination | Data Sent |
| :--- | :--- | :--- | :--- |
| **AI Disabled (Default)** | **None** (Zero network sockets opened) | None | None |
| **Local Ollama** | **Local Loopback Only** (`http://localhost:11434`) | None (Zero WAN egress) | Prompt + Candidate Profile Excerpt to local daemon |
| **Google Gemini (BYOK)** | **Direct External HTTPS** | `https://generativelanguage.googleapis.com` | Prompt + Candidate Profile Excerpt directly to Google API |

### Pathway A: Ollama (100% Local & Private)
- Requests are dispatched strictly to `http://localhost:11434` or user-defined local LAN endpoint.
- Packets never cross your local network interface.
- Completely isolated from cloud model logging, remote monitoring, or external training pipelines.

### Pathway B: Google Gemini (User BYOK)
- When configured, the MV3 background service worker communicates directly with Google's API using the user's personal API key.
- The user's API key is stored only in local browser storage and is passed via `x-goog-api-key` request headers (never in URL query parameters).
- Untrusted web page DOMs and content scripts never have access to the user's API key.
- The user is subject to Google's standard developer API terms and privacy policies.

---

## 4. Prompt Injection & Anti-Hallucination Protections

When screening answers are generated, untrusted text from the target job posting is quarantined:

1. **Explicit Data Delimiters**: Candidate profiles and job descriptions are enclosed within separate XML boundary tags (`<VERIFIED_CANDIDATE_FACTS>`, `<TARGET_ROLE>`, `<UNTRUSTED_JOB_DESCRIPTION>`, and `<APPLICATION_QUESTION>`).
2. **Instruction Isolation**: The system prompt explicitly commands the model that content inside `<UNTRUSTED_JOB_DESCRIPTION>` is third-party unverified text and must not override core system directives.
3. **Anti-Hallucination Directive**: Models are instructed strictly to answer from verified facts in the candidate profile, and to state what related experience exists rather than inventing metrics or credentials.

---

## 5. User Data Sovereignty & Portability

Under the **Privacy & Data Management** tab in the Options Dashboard, candidates have access to:
- **One-Click Backup Export**: Exports all candidate profiles, application histories, and saved Q&A answers into a single structured JSON file (`applypilot_backup_<timestamp>.json`).
- **Backup Import**: Validates and restores complete datasets with Zod schema verification.
- **Permanent Local Wipe**: Empties all `chrome.storage.local` keys, resetting the extension to a completely clean state.
