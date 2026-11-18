import { ATSAdapter, ApplicationField, JobDetails, setNativeValue } from './base';

export class LeverAdapter implements ATSAdapter {
  readonly name = 'Lever';

  detect(doc: Document, url: string): boolean {
    const isUrl = url.includes('jobs.lever.co');
    const hasDom = !!doc.querySelector('form.application-form, form#application-form, .postings-btn-wrapper');
    return isUrl || hasDom;
  }

  extractJobDetails(doc: Document, url: string): JobDetails {
    const titleEl = doc.querySelector('.posting-headline h2, h2.posting-headline, h2');
    const companyEl = doc.querySelector('.main-header-logo img, .posting-headline .org');
    const locationEl = doc.querySelector('.posting-categories .location, .location');
    const descEl = doc.querySelector('.section-wrapper, .posting-description, [data-qa="job-description"]');

    const title = titleEl?.textContent?.trim() || 'Software Engineer';
    let company = companyEl?.getAttribute('alt') || companyEl?.textContent?.trim() || '';
    if (!company) {
      // Lever URLs are often jobs.lever.co/<company>/<jobId>
      const match = url.match(/jobs\.lever\.co\/([^/]+)/);
      if (match) company = match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }

    return {
      title,
      company: company || 'Company',
      location: locationEl?.textContent?.trim() || '',
      description: descEl?.textContent?.trim() || '',
      url,
      atsPlatform: this.name,
    };
  }

  getApplicationFields(doc: Document): ApplicationField[] {
    const fields: ApplicationField[] = [];
    const form = doc.querySelector('form.application-form, form') || doc;

    const inputs = Array.from(
      form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), textarea, select')
    ) as HTMLElement[];

    for (const el of inputs) {
      const name = el.getAttribute('name') || '';
      const id = el.id || name;
      const placeholder = el.getAttribute('placeholder') || '';
      const required = el.hasAttribute('required') || el.getAttribute('aria-required') === 'true';

      let labelText = '';
      const parentBlock = el.closest('.application-question, .application-field, .form-group');
      if (parentBlock) {
        const textEl = parentBlock.querySelector('.text, .label, label');
        if (textEl) labelText = textEl.textContent || '';
      }
      if (!labelText && el.id) {
        const label = doc.querySelector(`label[for="${el.id}"]`);
        if (label) labelText = label.textContent || '';
      }
      if (!labelText) labelText = placeholder || name;

      labelText = labelText.replace(/[*:]/g, '').trim();
      const combined = `${name} ${id} ${labelText} ${placeholder}`.toLowerCase();

      let semanticRole: ApplicationField['semanticRole'] = 'unknown';
      let confidence = 0.5;

      if (name === 'name' || combined.includes('full name') || combined.includes('fullname')) {
        semanticRole = 'fullName';
        confidence = 0.95;
      } else if (name === 'email' || combined.includes('email')) {
        semanticRole = 'email';
        confidence = 0.98;
      } else if (name === 'phone' || combined.includes('phone')) {
        semanticRole = 'phone';
        confidence = 0.95;
      } else if (name.includes('LinkedIn') || combined.includes('linkedin')) {
        semanticRole = 'linkedin';
        confidence = 0.95;
      } else if (name.includes('GitHub') || combined.includes('github')) {
        semanticRole = 'github';
        confidence = 0.95;
      } else if (name.includes('Portfolio') || combined.includes('website') || combined.includes('portfolio')) {
        semanticRole = 'website';
        confidence = 0.92;
      } else if (name.includes('org') || combined.includes('company')) {
        semanticRole = 'unknown';
        confidence = 0.6;
      } else if (name === 'comments' || el instanceof HTMLTextAreaElement) {
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
