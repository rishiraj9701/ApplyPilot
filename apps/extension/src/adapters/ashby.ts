import { ATSAdapter, ApplicationField, JobDetails, setNativeValue } from './base';

export class AshbyAdapter implements ATSAdapter {
  readonly name = 'Ashby';

  detect(doc: Document, url: string): boolean {
    const isUrl = url.includes('ashbyhq.com');
    const hasDom = !!doc.querySelector('[data-ashby-input], [class*="_ashby_"], form[class*="applicationForm"]');
    return isUrl || hasDom;
  }

  extractJobDetails(doc: Document, url: string): JobDetails {
    const titleEl = doc.querySelector('h1, [class*="jobTitle"], [data-qa="job-title"]');
    const compEl = doc.querySelector('[class*="organizationName"], [data-qa="company-name"]');
    const locEl = doc.querySelector('[class*="location"], [data-qa="job-location"]');
    const descEl = doc.querySelector('[class*="jobDescription"], [data-qa="job-description"]');

    return {
      title: titleEl?.textContent?.trim() || 'Software Engineer',
      company: compEl?.textContent?.trim() || 'Company',
      location: locEl?.textContent?.trim() || '',
      description: descEl?.textContent?.trim() || '',
      url,
      atsPlatform: this.name,
    };
  }

  getApplicationFields(doc: Document): ApplicationField[] {
    const fields: ApplicationField[] = [];
    const inputs = Array.from(
      doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), textarea, select')
    ) as HTMLElement[];

    for (const el of inputs) {
      const name = el.getAttribute('name') || el.id || '';
      const id = el.id || name;
      const placeholder = el.getAttribute('placeholder') || '';
      const required = el.hasAttribute('required') || el.getAttribute('aria-required') === 'true';

      let labelText = '';
      const parentLabel = el.closest('label');
      if (parentLabel) labelText = parentLabel.textContent || '';
      if (!labelText) {
        const container = el.closest('div');
        const prev = container?.parentElement?.querySelector('label');
        if (prev) labelText = prev.textContent || '';
      }
      if (!labelText) labelText = placeholder || name;

      labelText = labelText.replace(/[*:]/g, '').trim();
      const combined = `${name} ${id} ${labelText} ${placeholder}`.toLowerCase();

      let semanticRole: ApplicationField['semanticRole'] = 'unknown';
      let confidence = 0.5;

      if (combined.includes('name') && !combined.includes('company')) {
        semanticRole = 'fullName';
        confidence = 0.9;
      } else if (combined.includes('email')) {
        semanticRole = 'email';
        confidence = 0.98;
      } else if (combined.includes('phone')) {
        semanticRole = 'phone';
        confidence = 0.95;
      } else if (combined.includes('linkedin')) {
        semanticRole = 'linkedin';
        confidence = 0.95;
      } else if (combined.includes('github')) {
        semanticRole = 'github';
        confidence = 0.95;
      } else if (combined.includes('website') || combined.includes('portfolio')) {
        semanticRole = 'website';
        confidence = 0.9;
      } else if (el instanceof HTMLTextAreaElement || combined.includes('question')) {
        semanticRole = 'screeningQuestion';
        confidence = 0.8;
      }

      fields.push({
        id: id || `field_${fields.length}`,
        element: el,
        label: labelText,
        name,
        type: (el.getAttribute('type') || (el instanceof HTMLTextAreaElement ? 'textarea' : 'text')) as any,
        required,
        currentValue: (el as HTMLInputElement).value || '',
        placeholder,
        semanticRole,
        confidence,
      });
    }

    return fields;
  }

  async fillField(field: ApplicationField, value: string, overwrite: boolean): Promise<boolean> {
    if (!field.element) return false;
    if (field.currentValue && field.currentValue.trim().length > 0 && !overwrite) {
      return false;
    }
    setNativeValue(field.element, value);
    return true;
  }
}
