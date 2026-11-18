import { describe, it, expect } from 'vitest';
import { ResumeExtractor } from '../src/services/resume/resumeExtractor';

const sampleResumeText = `
Sarah Chen
San Francisco, CA • (555) 019-2834 • sarah.chen@example.com
https://linkedin.com/in/sarahchen-eng • https://github.com/sarahchen-dev • https://sarahchen.dev

Professional Summary
Staff Infrastructure Engineer with 7 years of experience building distributed streaming platforms.

Technical Skills
Distributed Systems, Go, TypeScript, React, Kubernetes, Kafka, ClickHouse, Docker, PostgreSQL, Linux

Work Experience
FinScale Systems | Senior Infrastructure Architect
2023 - Present
• Scaled telemetry ingestion to 120k events/sec using Kafka and ClickHouse.
• Reduced p99 query latency by 42% through partition index tuning.

CloudCore Inc | Systems Engineer
2020 - 2023
• Automated multi-cluster Kubernetes deployments using ArgoCD.
• Maintained 99.99% availability for core microservices.

Education
University of California, Berkeley
Bachelor of Science in Computer Science
2016 - 2020 • GPA: 3.85 / 4.0

Certifications
• Certified Kubernetes Administrator (CKA)
`;

describe('ResumeExtractor', () => {
  it('extracts candidate personal details accurately', () => {
    const profile = ResumeExtractor.extractFromText(sampleResumeText, 'Test Resume', 'Infrastructure');

    expect(profile.personal.fullName).toBe('Sarah Chen');
    expect(profile.personal.email).toBe('sarah.chen@example.com');
    expect(profile.personal.phone).toBe('(555) 019-2834');
    expect(profile.personal.location).toContain('San Francisco, CA');
    expect(profile.personal.linkedin).toBe('https://linkedin.com/in/sarahchen-eng');
    expect(profile.personal.github).toBe('https://github.com/sarahchen-dev');
    expect(profile.personal.website).toBe('https://sarahchen.dev');
  });

  it('parses technical skills into deduplicated array', () => {
    const profile = ResumeExtractor.extractFromText(sampleResumeText);

    expect(profile.skills).toContain('Go');
    expect(profile.skills).toContain('Kubernetes');
    expect(profile.skills).toContain('Kafka');
    expect(profile.skills).toContain('TypeScript');
    expect(profile.skills.length).toBeGreaterThan(5);
  });

  it('parses employment history into structured records', () => {
    const profile = ResumeExtractor.extractFromText(sampleResumeText);

    expect(profile.experience.length).toBe(2);
    expect(profile.experience[0].company).toContain('FinScale');
    expect(profile.experience[0].current).toBe(true);
    expect(profile.experience[0].highlights.length).toBeGreaterThan(0);
    expect(profile.experience[1].company).toContain('CloudCore');
  });

  it('parses education and GPA', () => {
    const profile = ResumeExtractor.extractFromText(sampleResumeText);

    expect(profile.education.length).toBeGreaterThan(0);
    expect(profile.education[0].institution).toContain('University of California');
    expect(profile.education[0].degree).toContain('Bachelor of Science');
    expect(profile.education[0].gpa).toContain('3.85');
  });

  it('parses certifications', () => {
    const profile = ResumeExtractor.extractFromText(sampleResumeText);

    expect(profile.certifications.length).toBe(1);
    expect(profile.certifications[0].name).toContain('Certified Kubernetes Administrator');
  });

  it('handles resume with missing optional fields without fabricating data', () => {
    const minimalResume = `
      David Kim
      
      Technical Skills
      Python, Django, PostgreSQL
    `;

    const profile = ResumeExtractor.extractFromText(minimalResume, 'Minimal Resume');
    expect(profile.personal.fullName).toBe('David Kim');
    expect(profile.personal.email).toBe(''); // Never fabricate candidate@example.com!
    expect(profile.personal.phone).toBe('');
    expect(profile.personal.location).toBe('');
    expect(profile.personal.website).toBe('');
    expect(profile.skills).toContain('Python');
    expect(profile.experience.length).toBe(0);
    expect(profile.education.length).toBe(0);
  });

  it('handles empty or scanned resume text gracefully', () => {
    const emptyText = '   \n\n  \t  ';
    const profile = ResumeExtractor.extractFromText(emptyText, 'Scanned Resume');

    expect(profile.personal.fullName).toBe('Candidate');
    expect(profile.personal.email).toBe('');
    expect(profile.skills.length).toBe(0);
    expect(profile.experience.length).toBe(0);
  });

  it('handles unusual section ordering (Education before Experience)', () => {
    const invertedResume = `
      Elena Rostova
      elena.rostova@example.com

      Education
      Massachusetts Institute of Technology
      Master of Science in Artificial Intelligence
      2021 - 2023

      Skills
      PyTorch, CUDA, Python, C++

      Work Experience
      OpenRobotics | AI Research Fellow
      Jan 2023 - Present
      • Developed visual navigation models.
    `;

    const profile = ResumeExtractor.extractFromText(invertedResume);
    expect(profile.personal.fullName).toBe('Elena Rostova');
    expect(profile.personal.email).toBe('elena.rostova@example.com');
    expect(profile.education.length).toBe(1);
    expect(profile.education[0].institution).toContain('Massachusetts Institute of Technology');
    expect(profile.experience.length).toBe(1);
    expect(profile.experience[0].company).toContain('OpenRobotics');
    expect(profile.skills).toContain('PyTorch');
  });

  it('picks first email and phone when multiple exist', () => {
    const multiContact = `
      Marcus Vance
      marcus.work@example.com • marcus.personal@gmail.com
      (555) 123-4567 / (555) 987-6543
      
      Skills
      JavaScript
    `;

    const profile = ResumeExtractor.extractFromText(multiContact);
    expect(profile.personal.email).toBe('marcus.work@example.com');
    expect(profile.personal.phone).toBe('(555) 123-4567');
  });
});
