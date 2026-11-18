// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { AutofillService } from '../src/services/autofill/autofillService';
import { GreenhouseAdapter, setNativeValue } from '../src/adapters';
import { CandidateProfile } from '../src/core/schema';

const mockProfile: CandidateProfile = {
  id: 'prof_test',
  name: 'Test Profile',
  category: 'Engineering',
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  personal: {
    fullName: 'Jane Doe',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '555-0199',
    location: 'Austin, TX',
    website: 'https://janedoe.dev',
    linkedin: 'https://linkedin.com/in/janedoe',
    github: 'https://github.com/janedoe',
    customLinks: {},
  },
  summary: 'Experienced engineer',
  skills: ['TypeScript', 'React'],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
  customFields: {},
};

describe('AutofillService', () => {
  it('fills empty fields and dispatches change events', async () => {
    document.body.innerHTML = `
      <form id="application_form">
        <label for="first_name">First Name</label>
        <input id="first_name" name="first_name" type="text" />

        <label for="email">Email</label>
        <input id="email" name="email" type="email" />
      </form>
    `;

    const adapter = new GreenhouseAdapter();
    const result = await AutofillService.executeAutofill(adapter, document, mockProfile, false);

    expect(result.filled).toBe(2);
    expect(result.skipped).toBe(0);

    const fnInput = document.getElementById('first_name') as HTMLInputElement;
    const emInput = document.getElementById('email') as HTMLInputElement;

    expect(fnInput.value).toBe('Jane');
    expect(emInput.value).toBe('jane.doe@example.com');
  });

  it('protects non-empty fields when overwrite is false', async () => {
    document.body.innerHTML = `
      <form id="application_form">
        <label for="first_name">First Name</label>
        <input id="first_name" name="first_name" type="text" value="AlreadyTyped" />

        <label for="email">Email</label>
        <input id="email" name="email" type="email" />
      </form>
    `;

    const adapter = new GreenhouseAdapter();
    const result = await AutofillService.executeAutofill(adapter, document, mockProfile, false);

    expect(result.filled).toBe(1);
    expect(result.skipped).toBe(1);

    const fnInput = document.getElementById('first_name') as HTMLInputElement;
    expect(fnInput.value).toBe('AlreadyTyped'); // Not overwritten!
  });

  it('overwrites non-empty fields when overwrite is explicitly true', async () => {
    document.body.innerHTML = `
      <form id="application_form">
        <label for="first_name">First Name</label>
        <input id="first_name" name="first_name" type="text" value="OldValue" />
      </form>
    `;

    const adapter = new GreenhouseAdapter();
    const result = await AutofillService.executeAutofill(adapter, document, mockProfile, true);

    expect(result.filled).toBe(1);
    const fnInput = document.getElementById('first_name') as HTMLInputElement;
    expect(fnInput.value).toBe('Jane');
  });

  it('updates HTMLSelectElement and dispatches change events using prototype setter', () => {
    document.body.innerHTML = `
      <select id="country">
        <option value="">Select country</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
      </select>
    `;

    const select = document.getElementById('country') as HTMLSelectElement;
    let changeDispatched = false;
    select.addEventListener('change', () => {
      changeDispatched = true;
    });

    setNativeValue(select, 'US');

    expect(select.value).toBe('US');
    expect(changeDispatched).toBe(true);
  });
});
