export interface JobDetails {
  title: string;
  company: string;
  location?: string;
  employmentType?: string;
  description?: string;
  requirements?: string[];
  skills?: string[];
  url: string;
  atsPlatform: string;
}

export type FieldType = 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'unknown';

export interface ApplicationField {
  id: string;
  element: HTMLElement;
  label: string;
  name?: string;
  type: FieldType;
  required: boolean;
  currentValue: string;
  placeholder?: string;
  options?: string[];
  semanticRole?: 'firstName' | 'lastName' | 'fullName' | 'email' | 'phone' | 'location' | 'linkedin' | 'github' | 'website' | 'summary' | 'screeningQuestion' | 'workAuth' | 'unknown';
  confidence: number;
}

export interface FillResult {
  totalDetected: number;
  filled: number;
  skipped: number;
  failed: number;
  fieldSummaries: Array<{
    label: string;
    role?: string;
    value: string;
    status: 'filled' | 'skipped' | 'failed';
    reason?: string;
  }>;
}

export interface ATSAdapter {
  readonly name: string;
  detect(doc: Document, url: string): boolean;
  extractJobDetails(doc: Document, url: string): JobDetails;
  getApplicationFields(doc: Document): ApplicationField[];
  fillField(field: ApplicationField, value: string, overwrite: boolean): Promise<boolean>;
}

// Utility to dispatch events that work on React, Vue, Angular, and vanilla DOM
export function setNativeValue(element: HTMLElement, value: string): void {
  const valueSetter = Object.getOwnPropertyDescriptor(
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype,
    'value'
  )?.set;

  if (valueSetter) {
    valueSetter.call(element, value);
  } else if ('value' in element) {
    (element as any).value = value;
  }

  element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
}
