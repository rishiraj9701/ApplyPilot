# ApplyPilot ATS Platform Support & Adapter Guide

This document details the Applicant Tracking System (ATS) adapters supported by ApplyPilot, their technical detection criteria, field selector maps, dynamic framework handling, and fallback behavior.

---

## 1. Supported Platform Matrix

| Platform | Primary Detection Marker | Field Selectors Targeted | Framework Handling | Support Level |
| :--- | :--- | :--- | :--- | :--- |
| **Greenhouse** | `#application_form`, `boards.greenhouse.io`, `grnh.se` | Explicit IDs (`#first_name`, `#last_name`, `#email`, `#phone`, `#job_application_answers_attributes_*`) | Standard DOM & Dynamic JQuery | Tier 1 (Full) |
| **Lever** | `.application-form`, `jobs.lever.co` | Semantic `input[name="..."]` attributes (`name`, `email`, `phone`, `org`, `urls[LinkedIn]`) | Single-page vanilla/React DOM | Tier 1 (Full) |
| **Ashby** | `jobs.ashbyhq.com`, `ashbyhq.com`, `[data-ashby-*]` | React-controlled custom inputs, labeled field groups | React Synthetic Event dispatching | Tier 1 (Full) |
| **Workday** | `*.myworkdayjobs.com`, `[data-automation-id]` | Explicit `[data-automation-id="..."]` markers across candidate wizard | React/Angular enterprise tree | Tier 1 (Full) |
| **Generic Fallback**| Any URL with `<form>` containing job/application markers | Heuristic matching via `autocomplete`, `aria-label`, placeholder, and labels | Universal native prototype dispatch | Tier 2 (Heuristic) |

---

## 2. Platform Adapter Specifications

### A. Greenhouse (`src/adapters/greenhouse.ts`)
- **URL Matches**: `*://boards.greenhouse.io/*`, `*://*.greenhouse.io/*`, `*://job-boards.greenhouse.io/*`
- **DOM Signatures**: Form element `#application_form` or presence of meta tag `<meta name="gr:url">`
- **Field Mappings**:
  - First Name: `#first_name`
  - Last Name: `#last_name`
  - Email: `#email`
  - Phone: `#phone`
  - LinkedIn: `input[autocomplete="custom-question-linkedin"]`, `input[id*="linkedin"]`, `input[name*="linkedin"]`
  - Website / Portfolio: `input[id*="website"]`, `input[id*="portfolio"]`
  - GitHub: `input[id*="github"]`
  - Custom Screening Questions: `textarea[id*="job_application_answers_attributes_"]`, `input[id*="job_application_answers_attributes_"]`
- **Job Details Extraction**:
  - Title: `.app-title`, `h1.app-title`, `h1`
  - Company: `.company-name`, meta tags

### B. Lever (`src/adapters/lever.ts`)
- **URL Matches**: `*://jobs.lever.co/*`
- **DOM Signatures**: Form element `.application-form` or `#application-form`
- **Field Mappings**:
  - Full Name: `input[name="name"]`
  - Email: `input[name="email"]`
  - Phone: `input[name="phone"]`
  - Current Company / Organization: `input[name="org"]`
  - LinkedIn URL: `input[name="urls[LinkedIn]"]`
  - GitHub URL: `input[name="urls[GitHub]"]`
  - Portfolio / URL: `input[name="urls[Portfolio]"]`, `input[name="urls[Other]"]`
  - Additional Information: `textarea[name="comments"]`
- **Job Details Extraction**:
  - Title: `.posting-headline h2`, `h2`
  - Company: Logo title or page subtitle

### C. Ashby (`src/adapters/ashby.ts`)
- **URL Matches**: `*://jobs.ashbyhq.com/*`, `*://*.ashbyhq.com/*`
- **DOM Signatures**: Elements with attributes matching `[data-ashby-*]` or presence of Ashby React container roots
- **Field Mappings**:
  - Scans labeled form groups where labels match `/name/i`, `/email/i`, `/phone/i`, `/linkedin/i`, `/github/i`, `/website/i`.
  - Dispatches native property setter overrides to notify Ashby's internal React 18/19 state management.
- **Job Details Extraction**:
  - Title: `h1`
  - Company: Breadcrumbs or header organization branding

### D. Workday (`src/adapters/workday.ts`)
- **URL Matches**: `*://*.myworkdayjobs.com/*`, `*://*.wd1.myworkday.com/*`, `*://*.wd5.myworkday.com/*`
- **DOM Signatures**: Presence of elements possessing `data-automation-id` attributes
- **Field Mappings**:
  - First Name: `[data-automation-id="legalNameSection_firstName"]`, `[data-automation-id="firstName"]`
  - Last Name: `[data-automation-id="legalNameSection_lastName"]`, `[data-automation-id="lastName"]`
  - Email: `[data-automation-id="email"]`
  - Phone: `[data-automation-id="phone-number"]`, `[data-automation-id="phoneNumber"]`
  - Address / Postal Code: `[data-automation-id="addressSection_postalCode"]`
  - Country: `[data-automation-id="countryDropdown"]`
- **Multi-Step Wizard Handling**:
  - Workday uses a multi-page wizard format. ApplyPilot fills the fields available on the currently active wizard step without attempting premature page transitions.

### E. Generic Fallback (`src/adapters/generic.ts`)
- **Scope**: Applied when no specialized ATS signature is recognized on a page containing job application forms.
- **Scanning Algorithm**:
  - Inspects every visible, enabled `<input>`, `<textarea>`, and `<select>` element.
  - Computes semantic relevance by analyzing in order of priority:
    1. HTML5 `autocomplete` attributes (`given-name`, `family-name`, `email`, `tel`, `url`).
    2. Associated `<label for="...">` text content.
    3. Element `aria-label` or `aria-labelledby`.
    4. Element `placeholder` text.
    5. Element `name` and `id` tokens.
- **Safety**: Only touches fields with high-confidence pattern matches, skipping untrusted or ambiguous form structures.

---

## 3. Human-in-the-Loop Safeguards

1. **Zero Auto-Submissions**: ApplyPilot does not locate or click "Submit", "Apply Now", or "Send Application" buttons. The user must manually review all pre-filled content and initiate submission.
2. **Field Highlighting**: Fields populated by ApplyPilot receive a subtle visual focus indicator so the user can immediately audit what was modified.
3. **Field Preservation**: Existing text in any input is preserved by default to prevent unintentional overwrites.
