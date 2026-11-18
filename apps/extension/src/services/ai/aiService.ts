import { CandidateProfile, AISettings } from '../../core/schema';

export interface GenerateAnswerInput {
  question: string;
  jobTitle: string;
  company: string;
  jobDescription?: string;
  profile: CandidateProfile;
  style: 'professional' | 'concise' | 'conversational' | 'technical';
}

export interface GenerateAnswerResult {
  answer: string;
  provider: 'ollama' | 'gemini' | 'none';
  model: string;
  generationTimeMs: number;
}

export interface ProviderStatus {
  ok: boolean;
  message: string;
  models?: string[];
}

export interface AIProvider {
  readonly name: string;
  testConnection(): Promise<ProviderStatus>;
  generateAnswer(input: GenerateAnswerInput): Promise<GenerateAnswerResult>;
}

function buildGroundedPrompt(input: GenerateAnswerInput): string {
  const { question, jobTitle, company, jobDescription, profile, style } = input;

  const experienceSnippet = profile.experience
    .slice(0, 3)
    .map((e) => `- ${e.title} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'}): ${e.highlights.join('; ') || e.description}`)
    .join('\n');

  const educationSnippet = profile.education
    .map((e) => `- ${e.degree} in ${e.fieldOfStudy} from ${e.institution}`)
    .join('\n');

  const skillsSnippet = profile.skills.slice(0, 15).join(', ');

  return `You are a job application assistant drafting a screening question response on behalf of the candidate.

CRITICAL INSTRUCTIONS:
1. Write in the first person ("I", "my").
2. Answer the specific question directly, concisely, and compellingly.
3. STRICT FACTUAL GROUNDING: Rely strictly on the verified candidate facts provided below. NEVER invent, fabricate, or embellish companies, metrics, roles, projects, or credentials not explicitly mentioned in the candidate profile.
4. If the candidate profile does not mention specific relevant experience, state what related experience they DO have or answer cautiously.
5. Tone: ${style}.
6. Do NOT output conversational filler like "Here is my answer:" or quotation marks. Output ONLY the response text itself.

VERIFIED CANDIDATE FACTS:
Name: ${profile.personal.fullName}
Skills: ${skillsSnippet}
Experience:
${experienceSnippet || 'Not provided'}
Education:
${educationSnippet || 'Not provided'}

JOB CONTEXT:
Target Role: ${jobTitle}
Company: ${company}
Job Description Context:
${(jobDescription || '').slice(0, 1000)}

SCREENING QUESTION TO ANSWER:
"${question}"`;
}

export class OllamaProvider implements AIProvider {
  readonly name = 'Ollama';
  private endpoint: string;
  private model: string;

  constructor(endpoint = 'http://localhost:11434', model = 'llama3.2:3b') {
    this.endpoint = endpoint.replace(/\/+$/, '');
    this.model = model;
  }

  async testConnection(): Promise<ProviderStatus> {
    try {
      const res = await fetch(`${this.endpoint}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        return { ok: false, message: `Ollama returned HTTP ${res.status}` };
      }

      const data = await res.json();
      const models = Array.isArray(data.models) ? data.models.map((m: any) => m.name) : [];
      return {
        ok: true,
        message: `Connected successfully! Found ${models.length} local models.`,
        models,
      };
    } catch (err: any) {
      return {
        ok: false,
        message: `Could not connect to Ollama at ${this.endpoint}. Please ensure Ollama is running ('ollama serve').`,
      };
    }
  }

  async generateAnswer(input: GenerateAnswerInput): Promise<GenerateAnswerResult> {
    const prompt = buildGroundedPrompt(input);
    const startTime = Date.now();

    const res = await fetch(`${this.endpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
        options: {
          temperature: 0.3, // low temperature to reduce hallucination
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama generation failed with HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    const answer = (data.response || '').trim();

    return {
      answer,
      provider: 'ollama',
      model: this.model,
      generationTimeMs: Date.now() - startTime,
    };
  }
}

export class GeminiProvider implements AIProvider {
  readonly name = 'Google Gemini';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'gemini-2.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async testConnection(): Promise<ProviderStatus> {
    if (!this.apiKey) {
      return { ok: false, message: 'Google Gemini API key is missing. Please configure it in settings.' };
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with the word "pong".' }] }],
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return {
          ok: false,
          message: errJson?.error?.message || `Gemini API returned status ${res.status}`,
        };
      }

      return {
        ok: true,
        message: `Connected successfully to Google Gemini (${this.model}).`,
      };
    } catch (err: any) {
      return {
        ok: false,
        message: `Network error connecting to Gemini: ${err?.message || 'Check your connection'}`,
      };
    }
  }

  async generateAnswer(input: GenerateAnswerInput): Promise<GenerateAnswerResult> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured.');
    }

    const prompt = buildGroundedPrompt(input);
    const startTime = Date.now();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gemini API error ${res.status}`);
    }

    const data = await res.json();
    const textPart = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const answer = textPart.trim();

    return {
      answer,
      provider: 'gemini',
      model: this.model,
      generationTimeMs: Date.now() - startTime,
    };
  }
}

export function createAIProvider(settings: AISettings): AIProvider | null {
  if (settings.provider === 'ollama') {
    return new OllamaProvider(settings.ollamaEndpoint, settings.ollamaModel);
  }
  if (settings.provider === 'gemini') {
    return new GeminiProvider(settings.geminiApiKey, settings.geminiModel);
  }
  return null;
}
