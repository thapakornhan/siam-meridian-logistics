import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set PUBLIC_SITE_URL in Cloudflare Pages (Settings → Variables) to your real domain.
const site = process.env.PUBLIC_SITE_URL || 'https://www.sml-th.com';

export default defineConfig({
  site,
  output: 'static',            // fully static; only /api/submit runs as a Cloudflare Pages Function
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-US', th: 'th-TH' } }
    })
  ]
});
