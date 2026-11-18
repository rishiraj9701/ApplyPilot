import { describe, it, expect } from 'vitest';
import { JobIntelligenceService } from '../src/services/job/jobIntelligence';
import { CandidateProfile } from '../src/core/schema';
import { JobDetails } from '../src/adapters';

const testProfile: CandidateProfile = {
  id: 'prof_dev',
  name: 'Dev Profile',
  category: 'Fullstack',
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personal: {
    fullName: 'David Kim',
    email: 'david@example.com',
  },
  summary: 'Fullstack developer',
  skills: ['TypeScript', 'React', 'Node', 'PostgreSQL', 'Docker'],
  experience: [
    {
      id: 'e1',
      company: 'TechCorp',
      title: 'Senior Engineer',
      startDate: '2020',
      endDate: '2024',
      current: false,
      highlights: ['Built apps with React and TypeScript'],
      skills: ['TypeScript', 'React'],
    },
  ],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
  customFields: {},
};

describe('JobIntelligenceService', () => {
  it('extracts technical keywords from job descriptions', () => {
    const desc = 'We are looking for a Senior Engineer with deep knowledge of React, TypeScript, GraphQL, Docker, and Kubernetes.';
    const keywords = JobIntelligenceService.extractKeywords(desc);

    expect(keywords).toContain('react');
    expect(keywords).toContain('typescript');
    expect(keywords).toContain('graphql');
    expect(keywords).toContain('docker');
    expect(keywords).toContain('kubernetes');
  });

  it('calculates transparent match scores and identifies missing skills', () => {
    const job: JobDetails = {
      title: 'Senior Frontend Developer',
      company: 'Vercel',
      description: 'Requirements: React, TypeScript, GraphQL, Kubernetes, Rust. 4+ years of experience.',
      url: 'https://vercel.com/jobs/1',
      atsPlatform: 'Greenhouse',
    };

    const match = JobIntelligenceService.analyzeMatch(job, testProfile);

    expect(match.overallScore).toBeGreaterThan(40);
    expect(match.matchedSkills).toContain('react');
    expect(match.matchedSkills).toContain('typescript');
    expect(match.missingSkills).toContain('rust');
    expect(match.missingSkills).toContain('graphql');
    expect(match.experienceMatch.isMatch).toBe(true);
    expect(match.explanation).toContain('Matched');
  });
});
