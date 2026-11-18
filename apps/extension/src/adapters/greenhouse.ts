import { ATSAdapter, ApplicationField, JobDetails, setNativeValue } from './base';

export class GreenhouseAdapter implements ATSAdapter {
  readonly name = 'Greenhouse';

  detect(doc: Document, url: string): boolean {
    const isUrl = url.includes('greenhouse.io') || url.includes('gh_jid=');
    const hasDom = !!doc.querySelector('#application_form, #app_body, form#application, [id*="greenhouse"]');
    return isUrl || hasDom;
  }

  extractJobDetails(doc: Document, url: string): JobDetails {
    const titleEl = doc.querySelector('.app-title, h1.app-title, .job-title, h1');
    const companyEl = doc.querySelector('.company-name, [data-qa="company-name"]');
    const locationEl = doc.querySelector('.location, [data-qa="location"]');
    const descEl = doc.querySelector('#content, .content, #app_body, .job-description');

    const title = titleEl?.textContent?.trim() || 'Software Engineer';
    const company = companyEl?.textContent?.trim() || 'Company';
    const location = locationEl?.textContent?.trim() || '';
    const description = descEl?.textContent?.trim() || '';

    return {
      title,
      company,
      location,
      description,
      url,
      atsPlatform: this.name,
    };
  }

  getApplicationFields(doc: Document): ApplicationField[] {
    const fields: ApplicationField[] = [];
    const form = doc.querySelector('#application_form, form') || doc;

    const inputs = Array.from(
      form.querySelectorAll('input:not([type="hidden"]):not([type="submit"]), textarea, select')
    ) as HTMLElement[];

    for (const el of inputs) {
      const id = el.id || el.getAttribute('name') || '';
      const name = el.getAttribute('name') || '';
      const placeholder = el.getAttribute('placeholder') || '';
      const required = el.hasAttribute('required') || el.getAttribute('aria-required') === 'true';

      // Find label
      let labelText = '';
      if (el.id) {
        const labelEl = doc.querySelector(`label[for="${el.id}"]`);
        if (labelEl) labelText = labelEl.textContent || '';
      }
      if (!labelText) {
        const parentLabel = el.closest('label');
        if (parentLabel) labelText = parentLabel.textContent || '';
      }
      if (!labelText && el.parentElement) {
        const prev = el.parentElement.querySelector('label, .label, .field-label');
        if (prev) labelText = prev.textContent || '';
      }
      if (!labelText) labelText = placeholder || name || id;

      labelText = labelText.replace(/[*:]/g, '').trim();

      const combined = `${id} ${name} ${labelText} ${placeholder}`.toLowerCase();
      let semanticRole: ApplicationField['semanticRole'] = 'unknown';
      let confidence = 0.5;

      if (combined.includes('first_name') || combined.includes('firstname')) {
        semanticRole = 'firstName';
        confidence = 0.95;
      } else if (combined.includes('last_name') || combined.includes('lastname')) {
        semanticRole = 'lastName';
        confidence = 0.95;
      } else if (combined.includes('name') && !combined.includes('company')) {
        semanticRole = 'fullName';
        confidence = 0.85;
      } else if (combined.includes('email')) {
        semanticRole = 'email';
        confidence = 0.98;
      } else if (combined.includes('phone') || combined.includes('mobile')) {
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
      } else if (combined.includes('location') || combined.includes('city')) {
        semanticRole = 'location';
        confidence = 0.8;
      } else if (el instanceof HTMLTextAreaElement || combined.includes('question') || combined.includes('why')) {
        semanticRole = 'screeningQuestion';
        confidence = 0.75;
      }

      const currentValue = (el as HTMLInputElement).value || '';
      const type = (el.getAttribute('type') || (el instanceof HTMLTextAreaElement ? 'textarea' : 'text')) as any;

      fields.push({
        id: id || `field_${fields.length}`,
        element: el,
        label: labelText,
        name,
        type,
        required,
        currentValue,
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
      return false; // protect existing data
    }

    setNativeValue(field.element, value);
    return true;
  }
}
