# ApplyPilot Project Status

## Current Phase: Phase 1 (Website Development) — COMPLETED

### Summary
Phase 1 delivers the complete public-facing marketing and architectural website for ApplyPilot as an independent static application in `apps/website`.

---

## 1. Workspace Inventory
- **`apps/website`**: Complete React 19 + TypeScript + Vite + Tailwind CSS v4 application.
- **`apps/extension`**: Reserved placeholder directory for Phase 2 browser extension.
- **`docs/website.md`**: Architectural, design, and deployment documentation.
- **`.github/workflows/website.yml`**: Automated continuous integration build pipeline.
- **`README.md`**: Project overview, quickstart instructions, and stack details.
- **`PROJECT_STATUS.md`**: Active development status tracker.

---

## 2. Completed Website Sections

| Section | Component | Description & Features |
|---|---|---|
| **A. Navigation** | `Navbar.tsx` | Responsive header, sticky backdrop blur, keyboard accessible, mobile slide-down drawer, magnetic CTA. |
| **B. Hero** | `Hero.tsx` | Main value proposition, kinetic typography, and high-fidelity interactive product mockup with live simulation. |
| **C. Walkthrough** | `Walkthrough.tsx` | 6-step interactive workflow simulation (Import, Extract, Detect, Populate, AI Draft, Human Review) with autoplay. |
| **D. Problem & Solution** | `ProblemSolution.tsx` | Side-by-side comparative analysis of manual job application fatigue versus deterministic automation. |
| **E. Features** | `Features.tsx` | 10 planned core capabilities with category filters and interactive capability inspector. |
| **F. ATS Compatibility** | `ATSCompatibility.tsx` | Matrix of target ATS platforms (Greenhouse, Lever, Ashby, Workday, Generic) with detection heuristics. |
| **G. How It Works** | `HowItWorks.tsx` | 7-step chronological workflow from release download to manual application submission. |
| **H. Privacy** | `Privacy.tsx` | Local-first architectural manifesto, cloud scraper comparison, and technical disclosures. |
| **I. AI Providers** | `AIProviders.tsx` | Comparison of local offline Ollama inference versus Google Gemini API via user-supplied keys. |
| **J. Installation** | `Installation.tsx` | Step-by-step unpacked Chromium installation guide and Phase 1 development progress notice. |
| **K. Open Source** | `OpenSource.tsx` | MIT licensing, source code transparency, issue tracking, and community contribution channels. |
| **L. FAQ** | `FAQ.tsx` | 10-question animated accessible accordion with honest technical answers. |
| **M. Footer** | `Footer.tsx` | Navigation columns, GitHub links, dynamic year, and back-to-top button. |

---

## 3. Technology Stack & Verification

- **React 19**: `react@^19.0.0`, `react-dom@^19.0.0`
- **TypeScript**: `typescript@^5.7.3` with strict typing and bundler resolution.
- **Vite**: `vite@^6.2.0` with `@vitejs/plugin-react`
- **Tailwind CSS v4**: `tailwindcss@^4.0.9` with `@tailwindcss/vite`
- **Motion for React**: `motion@^12.4.7` with reduced-motion support
- **Icons**: `lucide-react` plus custom SVG brand icons

### Build Verification Results
- **TypeScript Compilation**: Clean pass (`tsc -b`), 0 errors.
- **Production Bundle**:
  - `dist/index.html`: 2.50 kB
  - `dist/assets/index-*.css`: 58.14 kB (gzip: 9.51 kB)
  - `dist/assets/index-*.js`: 485.91 kB (gzip: 143.35 kB)
- **Build Duration**: Under 5.0 seconds.

---

## 4. Key Design Decisions

1. **Independent Workspace Architecture**:
   The website is completely decoupled from any future extension code, allowing independent builds, previews, and static hosting without monorepo overhead.
2. **Restrained Engineering Aesthetic**:
   Adopted a dark graphite and slate baseline (`#090a0f`) with precision emerald accents (`#10b981`), monospace accents, and fine 1px gridlines rather than generic AI gradients or floating blobs.
3. **Motion with Intent**:
   Motion transitions are physical and calibrated with `motion/react`, respecting `prefers-reduced-motion` across all components.
4. **Technical Honesty**:
   No fake stars, no fake download counts, no mock ZIP downloads, and no false claims of universal ATS compatibility.

---

## 5. Next Steps for Phase 2 (Awaiting Approval)
- Initialize WXT browser extension framework inside `apps/extension`.
- Implement client-side PDF/DOCX resume extraction via local Web Workers.
- Build local candidate schema and storage layer using `chrome.storage.local`.
- Develop DOM mutation observers and selector definitions for Greenhouse and Lever.
- Implement Ollama localhost HTTP connector and Gemini API client.
