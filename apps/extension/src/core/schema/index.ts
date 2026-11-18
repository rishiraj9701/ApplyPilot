import { z } from 'zod';
import { CandidateProfileSchema } from './profile';
import { AISettingsSchema, PreferencesSchema } from './settings';
import { ApplicationRecordSchema } from './application';
import { SavedQASchema } from './qa';

export * from './profile';
export * from './settings';
export * from './application';
export * from './qa';

export const ApplyPilotBackupSchema = z.object({
  version: z.number().default(1),
  exportedAt: z.string(),
  profiles: z.array(CandidateProfileSchema).default([]),
  activeProfileId: z.string().nullable().default(null),
  settings: AISettingsSchema.default({}),
  preferences: PreferencesSchema.default({}),
  applications: z.array(ApplicationRecordSchema).default([]),
  savedQA: z.array(SavedQASchema).default([]),
});

export type ApplyPilotBackup = z.infer<typeof ApplyPilotBackupSchema>;
