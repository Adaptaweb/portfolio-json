import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio-alejandro-tamayo.vercel.app',
  // Inline the CSS so the first paint doesn't wait on a stylesheet request (better LCP on mobile).
  build: { inlineStylesheets: 'always' },
})
