import { ATSAdapter } from './base';
import { GreenhouseAdapter } from './greenhouse';
import { LeverAdapter } from './lever';
import { AshbyAdapter } from './ashby';
import { WorkdayAdapter } from './workday';
import { GenericAdapter } from './generic';

export * from './base';
export * from './greenhouse';
export * from './lever';
export * from './ashby';
export * from './workday';
export * from './generic';

const registry: ATSAdapter[] = [
  new GreenhouseAdapter(),
  new LeverAdapter(),
  new AshbyAdapter(),
  new WorkdayAdapter(),
];

const fallbackAdapter = new GenericAdapter();

export function resolveATSAdapter(doc: Document, url: string): ATSAdapter {
  for (const adapter of registry) {
    if (adapter.detect(doc, url)) {
      return adapter;
    }
  }
  return fallbackAdapter;
}
