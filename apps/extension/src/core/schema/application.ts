import { z } from 'zod';

export const ApplicationStatusSchema = z.enum([
  'interested',
  'preparing',
  'ready',
  'applied',
  'interview',
  'rejected',
  'offer',
  'withdrawn',
]);

export const ApplicationRecordSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobUrl: z.string().url().or(z.literal('')).default(''),
  location: z.string().optional().default(''),
  appliedAt: z.string(),
  resumeProfileId: z.string(),
  resumeProfileName: z.string(),
  atsPlatform: z.string().default('Generic'),
  status: ApplicationStatusSchema.default('applied'),
  notes: z.string().optional().default(''),
  matchScore: z.number().min(0).max(100).optional(),
  submittedAnswers: z.record(z.string()).optional().default({}),
  salaryRequested: z.string().optional().default(''),
});

export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;
export type ApplicationRecord = z.infer<typeof ApplicationRecordSchema>;
