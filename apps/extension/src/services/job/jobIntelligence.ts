import { CandidateProfile } from '../../core/schema';
import { JobDetails } from '../../adapters';

export interface SkillMatchResult {
  overallScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch: {
    candidateYears: number;
    requiredYears: number | null;
    isMatch: boolean;
  };
  explanation: string;
}

// Common tech keywords to extract from job descriptions
const KEYWORDS_DICTIONARY = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'go', 'rust',
  'ruby', 'php', 'swift', 'kotlin', 'sql', 'nosql', 'react', 'vue', 'angular',
  'node', 'express', 'next.js', 'django', 'fastapi', 'spring boot', 'graphql', 'rest',
  'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'ci/cd', 'git', 'kafka',
  'redis', 'postgresql', 'mysql', 'mongodb', 'linux', 'distributed systems', 'microservices',
  'agile', 'scrum', 'system design', 'machine learning', 'pytorch', 'tensorflow',
];

export class JobIntelligenceService {
  static extractKeywords(text: string): string[] {
    const lower = text.toLowerCase();
    const found: string[] = [];

    for (const kw of KEYWORDS_DICTIONARY) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:$|[^a-zA-Z0-9])`, 'i');
      if (regex.test(lower)) {
        found.push(kw);
      }
    }

    return Array.from(new Set(found));
  }

  static calculateCandidateExperienceYears(profile: CandidateProfile): number {
    let totalMonths = 0;
    const now = new Date();

    for (const exp of profile.experience) {
      if (!exp.startDate) continue;
      const startYear = parseInt(exp.startDate.match(/\d{4}/)?.[0] || '0', 10);
      if (!startYear) continue;

      let endYear = now.getFullYear();
      if (!exp.current && exp.endDate) {
        const parsedEnd = parseInt(exp.endDate.match(/\d{4}/)?.[0] || '0', 10);
        if (parsedEnd) endYear = parsedEnd;
      }

      totalMonths += Math.max(0, (endYear - startYear) * 12);
    }

    return Math.max(1, Math.round(totalMonths / 12));
  }

  static extractRequiredExperienceYears(jobDescription: string): number | null {
    const regex = /(\d+)\+?\s*(?:-\s*\d+)?\s*(?:years|yrs)(?:\s+of)?(?:\s+experience)?/i;
    const match = jobDescription.match(regex);
    if (match) {
      return parseInt(match[1], 10);
    }
    return null;
  }

  static analyzeMatch(job: JobDetails, profile: CandidateProfile): SkillMatchResult {
    const jobText = `${job.title} ${job.description || ''}`;
    const jobKeywords = this.extractKeywords(jobText);

    // Normalize candidate skills
    const candidateSkillsLower = new Set(
      profile.skills.map((s) => s.toLowerCase().trim())
    );

    // Also check skills mentioned in profile experience and project highlights
    for (const exp of profile.experience) {
      for (const sk of exp.skills) candidateSkillsLower.add(sk.toLowerCase().trim());
      const expText = `${exp.title} ${exp.description || ''} ${exp.highlights.join(' ')}`.toLowerCase();
      for (const kw of KEYWORDS_DICTIONARY) {
        if (expText.includes(kw)) candidateSkillsLower.add(kw);
      }
    }

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const kw of jobKeywords) {
      if (candidateSkillsLower.has(kw)) {
        matchedSkills.push(kw);
      } else {
        missingSkills.push(kw);
      }
    }

    const candidateYears = this.calculateCandidateExperienceYears(profile);
    const requiredYears = this.extractRequiredExperienceYears(job.description || '');

    let expScore = 1.0;
    let isMatch = true;
    if (requiredYears !== null) {
      if (candidateYears >= requiredYears) {
        expScore = 1.0;
        isMatch = true;
      } else {
        expScore = Math.max(0.4, candidateYears / requiredYears);
        isMatch = false;
      }
    }

    let skillScore = 0.8;
    if (jobKeywords.length > 0) {
      skillScore = matchedSkills.length / jobKeywords.length;
    }

    // Weighted match: 70% skills, 30% experience duration
    const overallScore = Math.min(100, Math.round((skillScore * 0.7 + expScore * 0.3) * 100));

    const explanation = jobKeywords.length === 0
      ? 'Score based on profile experience history (no specific keywords extracted from job text).'
      : `Matched ${matchedSkills.length} of ${jobKeywords.length} identified keywords (${Math.round(skillScore * 100)}% keyword match)${
          requiredYears !== null ? ` and ${candidateYears} years experience vs ${requiredYears} required.` : '.'
        }`;

    return {
      overallScore,
      matchedSkills,
      missingSkills,
      experienceMatch: {
        candidateYears,
        requiredYears,
        isMatch,
      },
      explanation,
    };
  }
}
