import { z } from 'zod';

export const QACategorySchema = z.enum([
  'Personal introduction',
  'Motivation',
  'Projects',
  'Technical experience',
  'Education',
  'Availability',
  'Salary expectations',
  'Relocation',
  'Custom',
]);

export const SavedQASchema = z.object({
  id: z.string(),
  question: z.string().min(1, 'Question text is required'),
  answer: z.string().min(1, 'Answer text is required'),
  category: QACategorySchema.default('Custom'),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type QACategory = z.infer<typeof QACategorySchema>;
export type SavedQA = z.infer<typeof SavedQASchema>;
