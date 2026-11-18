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

        <label for="phone">Phone *</label>
        <input id="phone" name="phone" type="tel" required />

        <label for="job_application_answers_attributes_0_text_value">Why Acme?</label>
        <textarea id="job_application_answers_attributes_0_text_value" name="question_1"></textarea>
      </form>
    `;

    const adapter = new GreenhouseAdapter();
    const fields = adapter.getApplicationFields(document);

    expect(fields.length).toBe(5);
    expect(fields[0].semanticRole).toBe('firstName');
    expect(fields[1].semanticRole).toBe('lastName');
    expect(fields[2].semanticRole).toBe('email');
    expect(fields[3].semanticRole).toBe('phone');
    expect(fields[4].semanticRole).toBe('screeningQuestion');
  });

  it('extracts input fields from Lever form structure', () => {
    document.body.innerHTML = `
      <form class="application-form">
        <div class="application-question">
          <div class="text">Full Name *</div>
          <input name="name" type="text" required />
        </div>
        <div class="application-question">
          <div class="text">Email *</div>
          <input name="email" type="email" required />
        </div>
        <div class="application-question">
          <div class="text">Phone</div>
          <input name="phone" type="tel" />
        </div>
        <div class="application-question">
          <div class="text">LinkedIn URL</div>
          <input name="urls[LinkedIn]" type="text" />
        </div>
        <div class="application-question">
          <div class="text">Additional Info</div>
          <textarea name="comments"></textarea>
        </div>
      </form>
    `;

    const adapter = new LeverAdapter();
    const fields = adapter.getApplicationFields(document);

    expect(fields.length).toBe(5);
    expect(fields[0].semanticRole).toBe('fullName');
    expect(fields[1].semanticRole).toBe('email');
    expect(fields[2].semanticRole).toBe('phone');
    expect(fields[3].semanticRole).toBe('linkedin');
    expect(fields[4].semanticRole).toBe('screeningQuestion');
  });

  it('extracts input fields from Ashby form structure', () => {
    document.body.innerHTML = `
      <div class="_ashby_applicationForm">
        <div>
          <label>Full Name</label>
          <input name="candidateName" id="ashby_name" type="text" />
        </div>
        <div>
          <label>Email Address</label>
          <input name="email" id="ashby_email" type="email" />
        </div>
        <div>
          <label>Phone Number</label>
          <input name="phoneNumber" id="ashby_phone" type="tel" />
        </div>
        <div>
          <label>LinkedIn Profile</label>
          <input name="linkedinUrl" id="ashby_linkedin" type="url" />
        </div>
      </div>
    `;

    const adapter = new AshbyAdapter();
    const fields = adapter.getApplicationFields(document);

    expect(fields.length).toBe(4);
    expect(fields[0].semanticRole).toBe('fullName');
    expect(fields[1].semanticRole).toBe('email');
    expect(fields[2].semanticRole).toBe('phone');
    expect(fields[3].semanticRole).toBe('linkedin');
  });

  it('extracts input fields from Workday candidate form structure', () => {
    document.body.innerHTML = `
      <div data-automation-id="workdayApplication">
        <div data-automation-id="formField">
          <label data-automation-id="formLabel">Legal First Name</label>
          <input data-automation-id="legalNameSection_firstName" type="text" />
        </div>
        <div data-automation-id="formField">
          <label data-automation-id="formLabel">Legal Last Name</label>
          <input data-automation-id="legalNameSection_lastName" type="text" />
        </div>
        <div data-automation-id="formField">
          <label data-automation-id="formLabel">Email Address</label>
          <input data-automation-id="email" type="email" />
        </div>
        <div data-automation-id="formField">
          <label data-automation-id="formLabel">Phone Number</label>
          <input data-automation-id="phone" type="tel" />
        </div>
      </div>
    `;

    const adapter = new WorkdayAdapter();
    const fields = adapter.getApplicationFields(document);

    expect(fields.length).toBe(4);
    expect(fields[0].semanticRole).toBe('firstName');
    expect(fields[1].semanticRole).toBe('lastName');
    expect(fields[2].semanticRole).toBe('email');
    expect(fields[3].semanticRole).toBe('phone');
  });

  it('extracts input fields from Generic Fallback form with HTML5 autocomplete', () => {
    document.body.innerHTML = `
      <form action="/apply">
        <label for="custom_fn">Your Given Name</label>
        <input id="custom_fn" name="fn" autocomplete="given-name" type="text" />

        <label for="custom_ln">Your Family Name</label>
        <input id="custom_ln" name="ln" autocomplete="family-name" type="text" />

        <label for="custom_email">Contact Email</label>
        <input id="custom_email" name="user_email" autocomplete="email" type="email" />

        <label for="custom_tel">Mobile Phone</label>
        <input id="custom_tel" name="phone_num" autocomplete="tel" type="tel" />

        <label for="custom_portfolio">Portfolio Link</label>
        <input id="custom_portfolio" name="website" type="url" placeholder="https://..." />
      </form>
    `;

    const adapter = new GenericAdapter();
    const fields = adapter.getApplicationFields(document);

    expect(fields.length).toBe(5);
    expect(fields[0].semanticRole).toBe('firstName');
    expect(fields[1].semanticRole).toBe('lastName');
    expect(fields[2].semanticRole).toBe('email');
    expect(fields[3].semanticRole).toBe('phone');
    expect(fields[4].semanticRole).toBe('website');
  });
});
