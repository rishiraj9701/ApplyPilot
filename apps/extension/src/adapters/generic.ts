import { ATSAdapter, ApplicationField, JobDetails, setNativeValue } from './base';

export class GenericAdapter implements ATSAdapter {
  readonly name = 'Generic Application';

  detect(_doc: Document, _url: string): boolean {
    return true; // Fallback matches any page with forms
  }

  extractJobDetails(doc: Document, url: string): JobDetails {
    const titleEl = doc.querySelector('h1, h2, title');
    const compEl = doc.querySelector('meta[property="og:site_name"], [class*="company"], [class*="employer"]');

    let title = titleEl?.textContent?.trim() || doc.title || 'Job Opening';
    title = title.replace(/\s*[-–—|]\s*.*$/, ''); // clean out brand suffix from title

    let company = compEl?.textContent?.trim() || compEl?.getAttribute('content') || '';
    if (!company) {
      try {
        const u = new URL(url);
        company = u.hostname.replace(/^www\./, '').split('.')[0];
        company = company.charAt(0).toUpperCase() + company.slice(1);
      } catch {
        company = 'Company';
      }
    }

    const descEl = doc.querySelector('article, main, [class*="description"], [class*="job-details"]');

    return {
      title: title || 'Job Opening',
      company: company || 'Company',
      description: descEl?.textContent?.trim().slice(0, 3000) || '',
      url,
      atsPlatform: this.name,
    };
  }

  getApplicationFields(doc: Document): ApplicationField[] {
    const fields: ApplicationField[] = [];
    const inputs = Array.from(
      doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select')
    ) as HTMLElement[];

    for (const el of inputs) {
      const name = el.getAttribute('name') || '';
      const id = el.id || name;
      const placeholder = el.getAttribute('placeholder') || '';
      const ariaLabel = el.getAttribute('aria-label') || '';
      const autocomplete = el.getAttribute('autocomplete') || '';
      const required = el.hasAttribute('required') || el.getAttribute('aria-required') === 'true';

      let labelText = '';
      if (el.id) {
        const l = doc.querySelector(`label[for="${el.id}"]`);
        if (l) labelText = l.textContent || '';
      }
      if (!labelText) {
        const parentL = el.closest('label');
        if (parentL) labelText = parentL.textContent || '';
      }
      if (!labelText) {
        const parent = el.closest('.form-group, .field, .input-container, div');
        const l = parent?.querySelector('label, .label, span.title');
        if (l) labelText = l.textContent || '';
      }
      if (!labelText) labelText = ariaLabel || placeholder || name || id;

      labelText = labelText.replace(/[*:]/g, '').trim();
      const combined = `${autocomplete} ${name} ${id} ${labelText} ${placeholder} ${ariaLabel}`.toLowerCase();

      let semanticRole: ApplicationField['semanticRole'] = 'unknown';
      let confidence = 0.5;

      if (autocomplete === 'given-name' || combined.includes('first name') || combined.includes('firstname')) {
        semanticRole = 'firstName';
        confidence = 0.95;
      } else if (autocomplete === 'family-name' || combined.includes('last name') || combined.includes('lastname')) {
        semanticRole = 'lastName';
        confidence = 0.95;
      } else if (autocomplete === 'name' || (combined.includes('full name') || (combined.includes('name') && !combined.includes('company') && !combined.includes('file')))) {
        semanticRole = 'fullName';
        confidence = 0.85;
      } else if (autocomplete === 'email' || combined.includes('email') || (el as HTMLInputElement).type === 'email') {
        semanticRole = 'email';
        confidence = 0.98;
      } else if (autocomplete === 'tel' || combined.includes('phone') || combined.includes('mobile') || (el as HTMLInputElement).type === 'tel') {
        semanticRole = 'phone';
        confidence = 0.95;
      } else if (combined.includes('linkedin')) {
        semanticRole = 'linkedin';
        confidence = 0.95;
      } else if (combined.includes('github')) {
        semanticRole = 'github';
        confidence = 0.95;
      } else if (combined.includes('portfolio') || combined.includes('website') || (el as HTMLInputElement).type === 'url') {
        semanticRole = 'website';
        confidence = 0.9;
      } else if (combined.includes('city') || combined.includes('location') || combined.includes('address')) {
        semanticRole = 'location';
        confidence = 0.8;
      } else if (el instanceof HTMLTextAreaElement || combined.includes('why') || combined.includes('cover letter') || combined.includes('question')) {
        semanticRole = 'screeningQuestion';
        confidence = 0.75;
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
