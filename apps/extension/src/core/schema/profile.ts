import { z } from 'zod';

export const PersonalDetailsSchema = z.object({
  fullName: z.string().default('Candidate'),
  firstName: z.string().optional().default(''),
  lastName: z.string().optional().default(''),
  email: z.string().email('Invalid email address').or(z.literal('')).default(''),
  phone: z.string().optional().default(''),
  location: z.string().optional().default(''),
  website: z.string().url().optional().or(z.literal('')).default(''),
  linkedin: z.string().optional().default(''),
  github: z.string().optional().default(''),
  customLinks: z.record(z.string()).optional().default({}),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company name is required'),
  title: z.string().min(1, 'Job title is required'),
  location: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  current: z.boolean().default(false),
  description: z.string().optional().default(''),
  highlights: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
});

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().optional().default(''),
  fieldOfStudy: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  gpa: z.string().optional().default(''),
  highlights: z.array(z.string()).default([]),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional().default(''),
  role: z.string().optional().default(''),
  url: z.string().optional().default(''),
  repoUrl: z.string().optional().default(''),
  skills: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
});

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().optional().default(''),
  issueDate: z.string().optional().default(''),
  expiryDate: z.string().optional().default(''),
  credentialId: z.string().optional().default(''),
  url: z.string().optional().default(''),
});

export const CandidateProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Profile name is required'),
  category: z.string().default('General'),
  isDefault: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
  personal: PersonalDetailsSchema,
  summary: z.string().optional().default(''),
  skills: z.array(z.string()).default([]),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  certifications: z.array(CertificationSchema).default([]),
  languages: z.array(z.string()).default([]),
  customFields: z.record(z.string()).default({}),
});

export type PersonalDetails = z.infer<typeof PersonalDetailsSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type CandidateProfile = z.infer<typeof CandidateProfileSchema>;
