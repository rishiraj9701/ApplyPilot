export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface ATSPlatform {
  id: string;
  name: string;
  category: 'Modern ATS' | 'Enterprise ATS' | 'Custom';
  status: 'In Development' | 'Planned' | 'Researching';
  statusColor: string;
  detectionMethod: string;
  supportedFields: string[];
  notes: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  status: 'In Development' | 'Planned';
  iconName: string;
  category: 'Profile' | 'Automation' | 'AI Intelligence' | 'Privacy';
  technicalDetail: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Privacy & Security' | 'AI & Technical' | 'Installation';
}

export const SITE_CONFIG = {
  name: 'ApplyPilot',
  tagline: 'Job applications. Less repetition. More momentum.',
  description:
    'Your resume, your rules. ApplyPilot automatically fills repetitive job application forms using your local profile and optional AI. No subscriptions. No backend. Completely open source.',
  version: '0.1.0-alpha',
  phase: 'Phase 1: Public Marketing & Architecture Preview',

  // Configurable URLs (Using verified official GitHub repository targets)
  links: {
    github: 'https://github.com/applypilot/applypilot',
    githubReleases: 'https://github.com/applypilot/applypilot/releases',
    githubIssues: 'https://github.com/applypilot/applypilot/issues',
    docs: '#docs',
    license: 'https://github.com/applypilot/applypilot/blob/main/LICENSE',
  },

  // State flags
  isReleaseAvailable: false, // Set to true when Phase 2 binary releases are published
  releaseStatusText: 'Phase 1 in progress — Extension build scheduled for Phase 2',

  navItems: [
    { label: 'Walkthrough', href: '#walkthrough' },
    { label: 'Features', href: '#features' },
    { label: 'ATS Support', href: '#ats-compatibility' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'AI Providers', href: '#ai-providers' },
    { label: 'Install', href: '#install' },
    { label: 'FAQ', href: '#faq' },
  ] as NavItem[],

  atsPlatforms: [
    {
      id: 'greenhouse',
      name: 'Greenhouse',
      category: 'Modern ATS',
      status: 'In Development',
      statusColor: 'emerald',
      detectionMethod: 'URL matcher (*.greenhouse.io, boards.greenhouse.io) + DOM signature detection',
      supportedFields: ['First & Last Name', 'Email & Phone', 'Resume upload', 'LinkedIn / GitHub URLs', 'Custom question textareas'],
      notes: 'Most widely used by high-growth tech companies. Standardized form structures with predictable id selectors.',
    },
    {
      id: 'lever',
      name: 'Lever',
      category: 'Modern ATS',
      status: 'In Development',
      statusColor: 'emerald',
      detectionMethod: 'URL matcher (jobs.lever.co/*) + form.application-form selector',
      supportedFields: ['Contact Info', 'Work Authorization radios', 'Custom text fields', 'Salary expectation', 'URLs & Portfolios'],
      notes: 'Single-page application flow with reactive DOM elements. Requires mutation-aware input dispatching.',
    },
    {
      id: 'ashby',
      name: 'Ashby',
      category: 'Modern ATS',
      status: 'Planned',
      statusColor: 'cyan',
      detectionMethod: 'URL matcher (jobs.ashbyhq.com/*) + shadow DOM / React form structure',
      supportedFields: ['Personal Info', 'Experience timeline', 'EEO disclosures', 'Screening prompts', 'Cover note'],
      notes: 'Modern React-based rendering. Autofill hooks into synthetic change events for field state synchronization.',
    },
    {
      id: 'workday',
      name: 'Workday',
      category: 'Enterprise ATS',
      status: 'Planned',
      statusColor: 'amber',
      detectionMethod: 'URL matcher (*.myworkdayjobs.com/*) + dynamic input container detection',
      supportedFields: ['Candidate profile', 'Prior employment records', 'Education credentials', 'Voluntary disclosures'],
      notes: 'Complex multi-step wizard architecture with session verification. Requires progressive step-by-step fill mode.',
    },
    {
      id: 'generic',
      name: 'Generic Career Forms',
      category: 'Custom',
      status: 'Planned',
      statusColor: 'slate',
      detectionMethod: 'Heuristic attribute analysis (autocomplete, name, aria-label, regex label matching)',
      supportedFields: ['Common contact fields', 'Website links', 'Standard short answers'],
      notes: 'Fallback heuristic filling engine for independent career pages and custom recruiting software.',
    },
  ] as ATSPlatform[],

  features: [
    {
      id: 'resume-intel',
      title: 'Resume Intelligence',
      tagline: 'Client-side parsing directly in your browser',
      description: 'Parses your PDF or DOCX resume into a structured, queryable JSON candidate profile without sending documents to third-party servers.',
      status: 'In Development',
      iconName: 'FileText',
      category: 'Profile',
      technicalDetail: 'Runs on local Web Workers using WebAssembly PDF extractors. No binary data ever leaves your computer.',
    },
    {
      id: 'local-profile',
      title: 'Local Candidate Profile',
      tagline: 'Deterministic control over your information',
      description: 'Manage your employment records, education credentials, skill lists, project highlights, and portfolio links in a single local dashboard.',
      status: 'In Development',
      iconName: 'Database',
      category: 'Profile',
      technicalDetail: 'Saved entirely in chrome.storage.local. Clean export and import in standard JSON format anytime.',
    },
    {
      id: 'ats-autofill',
      title: 'ATS-Aware Autofill',
      tagline: 'Precision field matching for recruiting systems',
      description: 'Detects active applicant tracking systems (Greenhouse, Lever, Ashby) and maps your profile values into matching inputs with simulated human events.',
      status: 'In Development',
      iconName: 'Zap',
      category: 'Automation',
      technicalDetail: 'Dispatches synthetic change and input events to ensure frameworks like React and Vue register filled data.',
    },
    {
      id: 'ai-answers',
      title: 'AI-Assisted Answers',
      tagline: 'Tailored first-person screening responses',
      description: 'Generate concise, contextual responses to open-ended screening questions like "Why are you interested in this role?" based on your actual achievements.',
      status: 'In Development',
      iconName: 'Bot',
      category: 'AI Intelligence',
      technicalDetail: 'Zero hallucinated credentials: prompts are grounded strictly in your verified profile facts and the job description.',
    },
    {
      id: 'resume-variants',
      title: 'Multiple Resume Variants',
      tagline: 'Tailor your strengths for different roles',
      description: 'Store distinct profiles for different career tracks (e.g., Frontend Specialist vs. Full-Stack Lead vs. Engineering Manager) and switch in one click.',
      status: 'Planned',
      iconName: 'Layers',
      category: 'Profile',
      technicalDetail: 'Active profile switcher with instant selector re-mapping during active form sessions.',
    },
    {
      id: 'qa-library',
      title: 'Saved Q&A Library',
      tagline: 'Never rewrite answers to standard questions',
      description: 'Maintain an organized vault of your best answers for recurring questions: work authorization, salary expectations, notice period, and project stories.',
      status: 'In Development',
      iconName: 'BookmarkCheck',
      category: 'Profile',
      technicalDetail: 'Fuzzy keyword and semantic embedding index for instant match suggestions on recurring prompts.',
    },
    {
      id: 'jd-intel',
      title: 'Job Description Intelligence',
      tagline: 'Real-time alignment and keyword detection',
      description: 'Inspects the active job posting to highlight required skills, core technologies, and potential gaps against your local profile.',
      status: 'Planned',
      iconName: 'ScanSearch',
      category: 'AI Intelligence',
      technicalDetail: 'Client-side text parsing for key qualification tokens, experience thresholds, and domain keywords.',
    },
    {
      id: 'app-history',
      title: 'Application History Ledger',
      tagline: 'Chronological local record of every submission',
      description: 'Automatically records company name, job title, ATS platform, application date, and submitted answers so you always know what you sent.',
      status: 'Planned',
      iconName: 'History',
      category: 'Automation',
      technicalDetail: 'Immutable append-only local storage ledger with exportable CSV and JSON history.',
    },
    {
      id: 'duplicate-detection',
      title: 'Duplicate Application Guard',
      tagline: 'Prevent accidental multiple submissions',
      description: 'Alerts you before filling an application if you have already applied to this company or URL within a configurable window (e.g., 90 days).',
      status: 'Planned',
      iconName: 'ShieldAlert',
      category: 'Automation',
      technicalDetail: 'Normalized domain and job slug matching against local submission logs.',
    },
    {
      id: 'user-control',
      title: 'User-Controlled Submission',
      tagline: 'Human in the loop at every single step',
      description: 'ApplyPilot never auto-submits. You review every pre-filled input, inspect AI-generated answers, verify attachments, and press submit yourself.',
      status: 'In Development',
      iconName: 'CheckCircle2',
      category: 'Privacy',
      technicalDetail: 'Strict architectural boundary: extension has zero automation handlers for submit buttons.',
    },
  ] as FeatureItem[],

  faqs: [
    {
      category: 'General',
      question: 'Is ApplyPilot free?',
      answer:
        'Yes, ApplyPilot is completely free and open-source under the MIT License. There are no paywalls, no monthly subscription tiers, and no locked features. Anyone can inspect, build, or contribute to the codebase.',
    },
    {
      category: 'General',
      question: 'Does it require an account?',
      answer:
        'No. ApplyPilot requires zero registration, zero accounts, and zero email logins. When the extension is installed, it runs locally in your browser immediately without any authentication handshake.',
    },
    {
      category: 'Privacy & Security',
      question: 'Does ApplyPilot upload my resume to the cloud?',
      answer:
        'No. Resumes are parsed locally on your device using client-side Web Workers. Your extracted candidate profile and files are stored strictly in your browser local storage (`chrome.storage.local`). The ApplyPilot marketing website does not even have a backend to receive files.',
    },
    {
      category: 'AI & Technical',
      question: 'Does it work without AI?',
      answer:
        'Absolutely. ApplyPilot is designed as a fast, deterministic form-filling engine first. Name, email, experience history, education, portfolio links, and saved responses are auto-filled using standard DOM mapping without making any AI calls. AI is purely an optional enhancement for drafting custom screening answers.',
    },
    {
      category: 'AI & Technical',
      question: 'Can I use Ollama for local AI?',
      answer:
        'Yes. ApplyPilot supports Ollama as a first-class local AI runtime. If you have Ollama running locally (e.g., `http://localhost:11434`), ApplyPilot can communicate directly with your local model (such as Llama 3.2 or Mistral) for 100% offline, private answer generation with zero cloud calls.',
    },
    {
      category: 'AI & Technical',
      question: 'Does it support all ATS platforms?',
      answer:
        'No autofill tool can honestly claim 100% universal compatibility across every website. ApplyPilot targets major Applicant Tracking Systems (such as Greenhouse, Lever, Ashby, and Workday) using specialized DOM selectors and adaptive heuristics. Custom or heavily obfuscated job portals may require manual adjustments.',
    },
    {
      category: 'Privacy & Security',
      question: 'Can it automatically submit applications for me?',
      answer:
        'No. By design, ApplyPilot strictly enforces a human-in-the-loop philosophy. The extension will populate form fields and offer drafted answers, but it will never click final "Submit Application" buttons. You retain full review and decision authority over every application.',
    },
    {
      category: 'Installation',
      question: 'How do I install it without the Chrome Web Store?',
      answer:
        'ApplyPilot is distributed through GitHub Releases as an unpacked Chromium extension to avoid developer fees and maintain pure open-source independence. You download the ZIP from GitHub, unzip it, open `chrome://extensions`, enable "Developer mode", click "Load unpacked", and select the unzipped directory.',
    },
    {
      category: 'General',
      question: 'Can I use multiple resumes or career profiles?',
      answer:
        'Yes. The profile architecture is built around variant profiles. You can create different personas (such as "Frontend Engineer", "Full-Stack Developer", or "Technical Product Manager") with specific highlighted projects and skills, switching between them before filling a form.',
    },
    {
      category: 'Privacy & Security',
      question: 'Will my data be synchronized across devices?',
      answer:
        'Because ApplyPilot operates without a central cloud backend or user accounts, there is no automatic cross-device cloud sync. However, you can export your entire profile as an encrypted or plaintext JSON file at any time and import it into another browser or laptop.',
    },
  ] as FAQItem[],
};
