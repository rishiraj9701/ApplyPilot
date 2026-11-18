import { CandidateProfile } from '../../core/schema';
import { ATSAdapter, ApplicationField, FillResult } from '../../adapters';

export class AutofillService {
  static resolveValueForField(field: ApplicationField, profile: CandidateProfile): string | null {
    const { personal, summary, customFields } = profile;

    switch (field.semanticRole) {
      case 'firstName':
        return personal.firstName || personal.fullName.split(' ')[0] || null;
      case 'lastName':
        return personal.lastName || personal.fullName.split(' ').slice(1).join(' ') || null;
      case 'fullName':
        return personal.fullName || null;
      case 'email':
        return personal.email || null;
      case 'phone':
        return personal.phone || null;
      case 'location':
        return personal.location || null;
      case 'linkedin':
        return personal.linkedin || null;
      case 'github':
        return personal.github || null;
      case 'website':
        return personal.website || null;
      case 'summary':
        return summary || null;
      default:
        // Check custom fields or label matches
        const lowerLabel = field.label.toLowerCase();
        for (const [key, val] of Object.entries(customFields)) {
          if (lowerLabel.includes(key.toLowerCase())) {
            return val;
          }
        }
        return null;
    }
  }

  static async executeAutofill(
    adapter: ATSAdapter,
    doc: Document,
    profile: CandidateProfile,
    overwrite = false
  ): Promise<FillResult> {
    const fields = adapter.getApplicationFields(doc);
    const summaries: FillResult['fieldSummaries'] = [];

    let filled = 0;
    let skipped = 0;
    let failed = 0;

    for (const field of fields) {
      const targetValue = this.resolveValueForField(field, profile);

      if (!targetValue) {
        skipped++;
        summaries.push({
          label: field.label,
          role: field.semanticRole,
          value: '',
          status: 'skipped',
          reason: 'No matching profile value found',
        });
        continue;
      }

      if (field.currentValue && field.currentValue.trim().length > 0 && !overwrite) {
        skipped++;
        summaries.push({
          label: field.label,
          role: field.semanticRole,
          value: field.currentValue,
          status: 'skipped',
          reason: 'Non-empty field protected by user preference',
        });
        continue;
      }

      try {
        const success = await adapter.fillField(field, targetValue, overwrite);
        // Verify value was registered in DOM
        const actualValue = (field.element as HTMLInputElement).value || '';
        if (success && (actualValue.length > 0 || targetValue.length === 0)) {
          filled++;
          summaries.push({
            label: field.label,
            role: field.semanticRole,
            value: targetValue,
            status: 'filled',
          });
        } else {
          failed++;
          summaries.push({
            label: field.label,
            role: field.semanticRole,
            value: targetValue,
            status: 'failed',
            reason: 'Element did not retain input value after event dispatch',
          });
        }
      } catch (err: any) {
        failed++;
        summaries.push({
          label: field.label,
          role: field.semanticRole,
          value: targetValue,
          status: 'failed',
          reason: err?.message || 'Error executing fill',
        });
      }
    }

    return {
      totalDetected: fields.length,
      filled,
      skipped,
      failed,
      fieldSummaries: summaries,
    };
  }
}
