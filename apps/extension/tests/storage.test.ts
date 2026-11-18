import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../src/services/storage/storageService';
import { CandidateProfile } from '../src/core/schema';

const testProfile: CandidateProfile = {
  id: 'prof_test_1',
  name: 'Primary Profile',
  category: 'Fullstack',
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personal: {
    fullName: 'Alex Morgan',
    email: 'alex@example.com',
  },
  summary: 'Staff engineer',
  skills: ['TypeScript', 'Node.js', 'React'],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
  customFields: {},
};

describe('StorageService', () => {
  beforeEach(async () => {
    await StorageService.clearAllData();
  });

  it('saves and retrieves candidate profiles', async () => {
    await StorageService.saveProfile(testProfile);
    const profiles = await StorageService.getProfiles();

    expect(profiles.length).toBe(1);
    expect(profiles[0].id).toBe('prof_test_1');
    expect(profiles[0].personal.fullName).toBe('Alex Morgan');
  });

  it('manages default and active profile', async () => {
    await StorageService.saveProfile(testProfile);

    const secondProfile: CandidateProfile = {
      ...testProfile,
      id: 'prof_test_2',
      name: 'Secondary Variant',
      isDefault: false,
    };
    await StorageService.saveProfile(secondProfile);

    const active = await StorageService.getActiveProfile();
    expect(active?.id).toBe('prof_test_1');

    await StorageService.setActiveProfileId('prof_test_2');
    const newActive = await StorageService.getActiveProfile();
    expect(newActive?.id).toBe('prof_test_2');
  });

  it('detects duplicate applications within window', async () => {
    await StorageService.saveApplication({
      id: 'app_1',
      company: 'Stripe',
      jobTitle: 'Backend Engineer',
      jobUrl: 'https://jobs.lever.co/stripe/backend',
      appliedAt: new Date().toISOString(),
      resumeProfileId: 'prof_1',
      resumeProfileName: 'Backend',
      atsPlatform: 'Lever',
      status: 'applied',
    });

    const dup = await StorageService.checkDuplicate('Stripe', 'Backend Engineer');
    expect(dup).not.toBeNull();
    expect(dup?.company).toBe('Stripe');

    const noDup = await StorageService.checkDuplicate('Airbnb', 'Backend Engineer');
    expect(noDup).toBeNull();
  });

  it('exports and restores complete backup with schema validation', async () => {
    await StorageService.saveProfile(testProfile);
    await StorageService.saveQA({
      id: 'qa_1',
      question: 'What is your notice period?',
      answer: '2 weeks',
      category: 'Availability',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const backup = await StorageService.exportAllData();
    expect(backup.profiles.length).toBe(1);
    expect(backup.savedQA.length).toBe(1);

    await StorageService.clearAllData();
    expect((await StorageService.getProfiles()).length).toBe(0);

    const restoreRes = await StorageService.importAllData(backup);
    expect(restoreRes.success).toBe(true);

    const restoredProfiles = await StorageService.getProfiles();
    expect(restoredProfiles.length).toBe(1);
    expect(restoredProfiles[0].personal.fullName).toBe('Alex Morgan');
  });
});
