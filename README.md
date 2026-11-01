# Siam Meridian Logistics – Website

Bilingual (English / Thai) corporate website for **Siam Meridian Logistics Co., Ltd.**

| Layer | Tool |
|---|---|
| Website | [Astro](https://astro.build) (static output) |
| Content editing | [Decap CMS](https://decapcms.org) at `/admin` |
| CMS login | Decap Turbo (Free plan, 1 site / 1 seat) |
| Code and content storage | GitHub |
| Hosting, forms, DNS | Cloudflare Pages, Pages Functions, Cloudflare DNS |
| Spam protection | Cloudflare Turnstile |
| Form email delivery | Resend (free tier) to your Microsoft 365 mailbox, optional Cloudflare KV copy |

No WordPress, PHP or database. Everything below is free-tier.

## Quick start (local)

```bash
npm install
cp .env.example .env            # test Turnstile key is pre-filled
npm run dev                     # http://localhost:4321
```

Test the form function locally (needs Cloudflare Turnstile reachable from your machine):

```bash
cp .dev.vars.example .dev.vars  # fill RESEND_API_KEY if you want real email
npm run pages:dev               # http://localhost:8788
```

Production build: `npm run build` → output in `dist/`.

## Project structure

```
public/admin/            CMS entry (index.html) and generated config.yml
public/brand/            logo, emblem, social image (processed from the supplied logo)
public/uploads/          images uploaded through the CMS
src/data/*.json          page text, English + Thai (edited by the CMS)
src/content/news/en|th/  news articles as Markdown (edited by the CMS)
src/views/               one template per page, shared by EN and TH
src/pages/               routes: / (EN) and /th/ (TH), 404, robots.txt
src/components/          header, footer, forms, cards, hero graphics
src/i18n/ui.ts           fixed interface strings (buttons, form labels, errors) in EN + TH
src/styles/global.css    design system (brand colours, type, components)
functions/api/submit.ts  form handler (Cloudflare Pages Function)
scripts/build-cms-config.mjs   generates public/admin/config.yml
cms.settings.json        GitHub repo, branch and Turbo site ID
```

## URLs

English at the root, Thai under `/th/`: `/`, `/about/`, `/services/`, `/services/air-freight/`, `/services/sea-freight/`, `/services/land-freight/`, `/services/international-logistics/`, `/get-a-quote/`, `/contact/`, `/news/`, `/privacy/`. Each page carries `hreflang` links, canonical URLs, Open Graph tags and appears in `sitemap-index.xml`.

## How content editing works

1. Open `https://your-domain/admin/` and sign in with Turbo.
2. Edit a page, article or setting. Each page has an **English** and a **ไทย (Thai)** section.
3. Click **Publish**. The change is committed to GitHub and Cloudflare Pages rebuilds automatically (about 1 to 2 minutes).

News articles: use the same *Web address name* in the English and Thai collections so the language switch links them. Articles are drafts until **Publish on website** is switched on.

Editing the CMS structure (adding fields): change `scripts/build-cms-config.mjs`, run `npm run cms:config`, commit `public/admin/config.yml`. The build also regenerates it.

## Things you still need to supply or confirm

- Native Thai review of all Thai copy (placeholder quality), including the Thai address transcription.
- Final company profile text for About, plus real photos (optional homepage background in the CMS).
- Business hours, privacy policy wording (review for Thailand's PDPA), and a Google Maps **embed** address if you want an inline map instead of the "View on Google Maps" button.
- The service pages and benefits are deliberately generic. No coverage, certifications, transit times or statistics are claimed. Add only what is true.

See **DEPLOYMENT.md** for the full setup guide.
