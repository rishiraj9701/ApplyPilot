import { z } from 'zod';

export const AISettingsSchema = z.object({
  provider: z.enum(['none', 'ollama', 'gemini']).default('none'),
  ollamaEndpoint: z.string().url().default('http://localhost:11434'),
  ollamaModel: z.string().default('llama3.2:3b'),
  geminiApiKey: z.string().default(''),
  geminiModel: z.string().default('gemini-2.5-flash'),
  answerStyle: z.enum(['professional', 'concise', 'conversational', 'technical']).default('professional'),
  autoDraft: z.boolean().default(false),
  temperature: z.number().min(0).max(1).default(0.4),
});

export const PreferencesSchema = z.object({
  overwriteNonEmpty: z.boolean().default(false),
  duplicateWarningDays: z.number().min(1).max(365).default(90),
  showFloatingAssistant: z.boolean().default(true),
  theme: z.enum(['dark', 'system']).default('dark'),
  autoExtractJobDetails: z.boolean().default(true),
});

export type AISettings = z.infer<typeof AISettingsSchema>;
export type Preferences = z.infer<typeof PreferencesSchema>;
