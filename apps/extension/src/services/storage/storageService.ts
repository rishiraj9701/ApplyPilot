import {
  CandidateProfile,
  CandidateProfileSchema,
  AISettings,
  AISettingsSchema,
  Preferences,
  PreferencesSchema,
  ApplicationRecord,
  ApplicationRecordSchema,
  SavedQA,
  SavedQASchema,
  ApplyPilotBackup,
  ApplyPilotBackupSchema,
  ApplicationStatus,
} from '../../core/schema';

const STORAGE_KEYS = {
  PROFILES: 'applypilot_profiles',
  ACTIVE_PROFILE_ID: 'applypilot_active_profile_id',
  AI_SETTINGS: 'applypilot_ai_settings',
  PREFERENCES: 'applypilot_preferences',
  APPLICATIONS: 'applypilot_applications',
  SAVED_QA: 'applypilot_saved_qa',
  SCHEMA_VERSION: 'applypilot_schema_version',
};

// Fallback in-memory store for unit tests or environments where chrome.storage is unavailable
const memoryStore: Record<string, any> = {};

async function getItem<T>(key: string, defaultValue: T): Promise<T> {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] !== undefined ? result[key] : defaultValue;
    } catch {
      return memoryStore[key] !== undefined ? memoryStore[key] : defaultValue;
    }
  }
  return memoryStore[key] !== undefined ? memoryStore[key] : defaultValue;
}

async function setItem<T>(key: string, value: T): Promise<void> {
  memoryStore[key] = value;
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (err) {
      console.warn('chrome.storage.local.set fallback to memory:', err);
    }
  }
}

export class StorageService {
  // --- PROFILES ---
  static async getProfiles(): Promise<CandidateProfile[]> {
    const raw = await getItem<any[]>(STORAGE_KEYS.PROFILES, []);
    return raw.map((item) => {
      const parsed = CandidateProfileSchema.safeParse(item);
      return parsed.success ? parsed.data : null;
    }).filter((p): p is CandidateProfile => p !== null);
  }

  static async getProfileById(id: string): Promise<CandidateProfile | null> {
    const profiles = await this.getProfiles();
    return profiles.find((p) => p.id === id) || null;
  }

  static async getActiveProfile(): Promise<CandidateProfile | null> {
    const activeId = await getItem<string | null>(STORAGE_KEYS.ACTIVE_PROFILE_ID, null);
    const profiles = await this.getProfiles();
    if (activeId) {
      const found = profiles.find((p) => p.id === activeId);
      if (found) return found;
    }
    const defaultProfile = profiles.find((p) => p.isDefault);
    return defaultProfile || profiles[0] || null;
  }

  static async setActiveProfileId(id: string): Promise<void> {
    await setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
  }

  static async saveProfile(profile: CandidateProfile): Promise<void> {
    const valid = CandidateProfileSchema.parse(profile);
    const profiles = await this.getProfiles();
    const index = profiles.findIndex((p) => p.id === valid.id);

    if (valid.isDefault) {
      // Ensure other profiles are not marked default
      for (const p of profiles) {
        if (p.id !== valid.id) p.isDefault = false;
      }
    }

    if (index >= 0) {
      profiles[index] = valid;
    } else {
      profiles.push(valid);
      // If it's the first profile, make it default & active
      if (profiles.length === 1) {
        valid.isDefault = true;
        await this.setActiveProfileId(valid.id);
      }
    }

    await setItem(STORAGE_KEYS.PROFILES, profiles);
  }

  static async deleteProfile(id: string): Promise<void> {
    let profiles = await this.getProfiles();
    profiles = profiles.filter((p) => p.id !== id);
    await setItem(STORAGE_KEYS.PROFILES, profiles);

    const activeId = await getItem<string | null>(STORAGE_KEYS.ACTIVE_PROFILE_ID, null);
    if (activeId === id) {
      const nextActive = profiles[0]?.id || null;
      await setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, nextActive);
    }
  }

  // --- AI SETTINGS ---
  static async getAISettings(): Promise<AISettings> {
    const raw = await getItem<any>(STORAGE_KEYS.AI_SETTINGS, {});
    const parsed = AISettingsSchema.safeParse(raw);
    return parsed.success ? parsed.data : AISettingsSchema.parse({});
  }

  static async saveAISettings(settings: Partial<AISettings>): Promise<AISettings> {
    const current = await this.getAISettings();
    const updated = AISettingsSchema.parse({ ...current, ...settings });
    await setItem(STORAGE_KEYS.AI_SETTINGS, updated);
    return updated;
  }

  // --- PREFERENCES ---
  static async getPreferences(): Promise<Preferences> {
    const raw = await getItem<any>(STORAGE_KEYS.PREFERENCES, {});
    const parsed = PreferencesSchema.safeParse(raw);
    return parsed.success ? parsed.data : PreferencesSchema.parse({});
  }

  static async savePreferences(prefs: Partial<Preferences>): Promise<Preferences> {
    const current = await this.getPreferences();
    const updated = PreferencesSchema.parse({ ...current, ...prefs });
    await setItem(STORAGE_KEYS.PREFERENCES, updated);
    return updated;
  }

  // --- APPLICATIONS ---
  static async getApplications(): Promise<ApplicationRecord[]> {
    const raw = await getItem<any[]>(STORAGE_KEYS.APPLICATIONS, []);
    return raw.map((item) => {
      const parsed = ApplicationRecordSchema.safeParse(item);
      return parsed.success ? parsed.data : null;
    }).filter((a): a is ApplicationRecord => a !== null);
  }

  static async saveApplication(app: ApplicationRecord): Promise<void> {
    const valid = ApplicationRecordSchema.parse(app);
    const apps = await this.getApplications();
    const index = apps.findIndex((a) => a.id === valid.id);
    if (index >= 0) {
      apps[index] = valid;
    } else {
      apps.unshift(valid);
    }
    await setItem(STORAGE_KEYS.APPLICATIONS, apps);
  }

  static async deleteApplication(id: string): Promise<void> {
    const apps = (await this.getApplications()).filter((a) => a.id !== id);
    await setItem(STORAGE_KEYS.APPLICATIONS, apps);
  }

  static async updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string): Promise<void> {
    const apps = await this.getApplications();
    const found = apps.find((a) => a.id === id);
    if (found) {
      found.status = status;
      if (notes !== undefined) found.notes = notes;
      await setItem(STORAGE_KEYS.APPLICATIONS, apps);
    }
  }

  static async checkDuplicate(company: string, jobTitle: string, jobUrl?: string): Promise<ApplicationRecord | null> {
    const apps = await this.getApplications();
    const prefs = await this.getPreferences();
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - prefs.duplicateWarningDays);

    const normCompany = company.trim().toLowerCase();
    const normTitle = jobTitle.trim().toLowerCase();
    const normUrl = jobUrl?.trim().toLowerCase();

    return apps.find((a) => {
      const appDate = new Date(a.appliedAt);
      if (appDate < thresholdDate) return false;

      if (normUrl && a.jobUrl && a.jobUrl.toLowerCase() === normUrl) {
        return true;
      }

      const matchCompany = a.company.toLowerCase().includes(normCompany) || normCompany.includes(a.company.toLowerCase());
      const matchTitle = a.jobTitle.toLowerCase() === normTitle;

      return matchCompany && matchTitle;
    }) || null;
  }

  // --- SAVED Q&A ---
  static async getSavedQA(): Promise<SavedQA[]> {
    const raw = await getItem<any[]>(STORAGE_KEYS.SAVED_QA, []);
    return raw.map((item) => {
      const parsed = SavedQASchema.safeParse(item);
      return parsed.success ? parsed.data : null;
    }).filter((q): q is SavedQA => q !== null);
  }

  static async saveQA(qa: SavedQA): Promise<void> {
    const valid = SavedQASchema.parse(qa);
    const list = await this.getSavedQA();
    const index = list.findIndex((q) => q.id === valid.id);
    if (index >= 0) {
      list[index] = valid;
    } else {
      list.unshift(valid);
    }
    await setItem(STORAGE_KEYS.SAVED_QA, list);
  }

  static async deleteQA(id: string): Promise<void> {
    const list = (await this.getSavedQA()).filter((q) => q.id !== id);
    await setItem(STORAGE_KEYS.SAVED_QA, list);
  }

  // --- BACKUP & RESTORE ---
  static async exportAllData(): Promise<ApplyPilotBackup> {
    const [profiles, activeProfileId, settings, preferences, applications, savedQA] = await Promise.all([
      this.getProfiles(),
      getItem<string | null>(STORAGE_KEYS.ACTIVE_PROFILE_ID, null),
      this.getAISettings(),
      this.getPreferences(),
      this.getApplications(),
      this.getSavedQA(),
    ]);

    return ApplyPilotBackupSchema.parse({
      version: 1,
      exportedAt: new Date().toISOString(),
      profiles,
      activeProfileId,
      settings,
      preferences,
      applications,
      savedQA,
    });
  }

  static async importAllData(data: unknown): Promise<{ success: boolean; profileCount: number }> {
    const parsed = ApplyPilotBackupSchema.parse(data);

    await Promise.all([
      setItem(STORAGE_KEYS.PROFILES, parsed.profiles),
      setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, parsed.activeProfileId),
      setItem(STORAGE_KEYS.AI_SETTINGS, parsed.settings),
      setItem(STORAGE_KEYS.PREFERENCES, parsed.preferences),
      setItem(STORAGE_KEYS.APPLICATIONS, parsed.applications),
      setItem(STORAGE_KEYS.SAVED_QA, parsed.savedQA),
      setItem(STORAGE_KEYS.SCHEMA_VERSION, parsed.version),
    ]);

    return {
      success: true,
      profileCount: parsed.profiles.length,
    };
  }

  static async clearAllData(): Promise<void> {
    for (const key of Object.values(STORAGE_KEYS)) {
      delete memoryStore[key];
    }
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.clear();
    }
  }
}
