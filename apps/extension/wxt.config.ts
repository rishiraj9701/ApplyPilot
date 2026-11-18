import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'ApplyPilot — Job Application Assistant',
    description: 'Free, open-source, local-first browser extension for resume intelligence and ATS autofill.',
    version: '0.1.0',
    permissions: ['storage', 'activeTab', 'tabs'],
    host_permissions: [
      '*://*.greenhouse.io/*',
      '*://jobs.lever.co/*',
      '*://*.ashbyhq.com/*',
      '*://*.myworkdayjobs.com/*',
    ],
    action: {
      default_title: 'ApplyPilot',
    },
  },
  vite: () => ({
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['pdfjs-dist'],
    },
  }),
});
