// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import {
  GreenhouseAdapter,
  LeverAdapter,
  AshbyAdapter,
  WorkdayAdapter,
  GenericAdapter,
  resolveATSAdapter,
} from '../src/adapters';

describe('ATS Adapters Detection & Resolution', () => {
  it('detects Greenhouse URLs and DOM elements', () => {
    const adapter = new GreenhouseAdapter();
    expect(adapter.detect(document, 'https://boards.greenhouse.io/acme/jobs/12345')).toBe(true);
    expect(adapter.detect(document, 'https://example.com/careers?gh_jid=456')).toBe(true);
    expect(adapter.detect(document, 'https://unknown.com')).toBe(false);
  });

  it('detects Lever URLs', () => {
    const adapter = new LeverAdapter();
    expect(adapter.detect(document, 'https://jobs.lever.co/stripe/67890')).toBe(true);
    expect(adapter.detect(document, 'https://greenhouse.io')).toBe(false);
  });

  it('detects Ashby URLs', () => {
    const adapter = new AshbyAdapter();
    expect(adapter.detect(document, 'https://jobs.ashbyhq.com/linear/abc')).toBe(true);
    expect(adapter.detect(document, 'https://google.com')).toBe(false);
  });

  it('detects Workday URLs', () => {
    const adapter = new WorkdayAdapter();
    expect(adapter.detect(document, 'https://target.wd5.myworkdayjobs.com/careers')).toBe(true);
    expect(adapter.detect(document, 'https://example.com')).toBe(false);
  });

  it('resolves correct adapter via registry', () => {
    const gh = resolveATSAdapter(document, 'https://boards.greenhouse.io/acme');
    expect(gh.name).toBe('Greenhouse');

    const lever = resolveATSAdapter(document, 'https://jobs.lever.co/acme');
    expect(lever.name).toBe('Lever');

    const fallback = resolveATSAdapter(document, 'https://randomcompany.com/apply');
    expect(fallback.name).toBe('Generic Application');
  });

  it('extracts input fields from Greenhouse form structure', () => {
    document.body.innerHTML = `
      <form id="application_form">
        <label for="first_name">First Name *</label>
        <input id="first_name" name="first_name" type="text" required />

        <label for="last_name">Last Name *</label>
        <input id="last_name" name="last_name" type="text" required />

        <label for="email">Email Address *</label>
        <input id="email" name="email" type="email" required />

        <label for="job_application_answers_attributes_0_text_value">Why Acme?</label>
        <textarea id="job_application_answers_attributes_0_text_value" name="question_1"></textarea>
      </form>
    `;

    const adapter = new GreenhouseAdapter();
    const fields = adapter.getApplicationFields(document);

    expect(fields.length).toBe(4);
    expect(fields[0].semanticRole).toBe('firstName');
    expect(fields[1].semanticRole).toBe('lastName');
    expect(fields[2].semanticRole).toBe('email');
    expect(fields[3].semanticRole).toBe('screeningQuestion');
  });
});
