import { ATSAdapter, ApplicationField, JobDetails, setNativeValue } from './base';

export class WorkdayAdapter implements ATSAdapter {
  readonly name = 'Workday';

  detect(doc: Document, url: string): boolean {
    const isUrl = url.includes('myworkdayjobs.com') || url.includes('workday.com');
    const hasDom = !!doc.querySelector('[data-automation-id="workdayApplication"], [data-automation-id*="jobPosting"]');
    return isUrl || hasDom;
  }

  extractJobDetails(doc: Document, url: string): JobDetails {
    const titleEl = doc.querySelector('[data-automation-id="jobPostingHeader"], h2[data-automation-id="jobTitle"], h1');
    const compEl = doc.querySelector('[data-automation-id="companyName"]');
    const locEl = doc.querySelector('[data-automation-id="locations"], [data-automation-id="location"]');
    const descEl = doc.querySelector('[data-automation-id="jobPostingDescription"]');

    let company = compEl?.textContent?.trim() || '';
    if (!company) {
      const match = url.match(/https?:\/\/([^.]+)\.wd\d+\.myworkdayjobs\.com/);
      if (match) company = match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }

    return {
      title: titleEl?.textContent?.trim() || 'Software Engineer',
      company: company || 'Company',
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
      const automationId = el.getAttribute('data-automation-id') || '';
      const name = el.getAttribute('name') || '';
      const id = el.id || automationId || name;
      const placeholder = el.getAttribute('placeholder') || '';
      const required = el.hasAttribute('required') || el.getAttribute('aria-required') === 'true';

      let labelText = '';
      if (el.id) {
        const label = doc.querySelector(`label[for="${el.id}"]`);
        if (label) labelText = label.textContent || '';
      }
      if (!labelText) {
        const parent = el.closest('[data-automation-id*="formField"], .form-group');
        if (parent) {
          const l = parent.querySelector('label, [data-automation-id="formLabel"]');
          if (l) labelText = l.textContent || '';
        }
      }
      if (!labelText) labelText = automationId || placeholder || name;

      labelText = labelText.replace(/[*:]/g, '').trim();
      const combined = `${automationId} ${name} ${id} ${labelText}`.toLowerCase();

      let semanticRole: ApplicationField['semanticRole'] = 'unknown';
      let confidence = 0.5;

      if (combined.includes('firstname') || combined.includes('first_name') || combined.includes('legalnamesection_firstname')) {
        semanticRole = 'firstName';
        confidence = 0.98;
      } else if (combined.includes('lastname') || combined.includes('last_name') || combined.includes('legalnamesection_lastname')) {
        semanticRole = 'lastName';
        confidence = 0.98;
      } else if (combined.includes('email')) {
        semanticRole = 'email';
        confidence = 0.98;
      } else if (combined.includes('phone')) {
        semanticRole = 'phone';
        confidence = 0.95;
      } else if (combined.includes('linkedin')) {
        semanticRole = 'linkedin';
        confidence = 0.95;
      } else if (combined.includes('website')) {
        semanticRole = 'website';
        confidence = 0.9;
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
