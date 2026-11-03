# Deployment & Maintenance Guide

Flow: **GitHub → Cloudflare Pages → custom domain**. Allow about 1 to 2 hours the first time.

## 0. What you need

Accounts (all free): GitHub, Cloudflare, Decap Turbo (decapcms.org/turbo), Resend (resend.com). Node 20+ if building locally.

## 1. Create the GitHub repository

1. On github.com: **New repository** → name `siam-meridian-logistics` → **Private** → create (empty, no README).
2. In the project folder:
   ```bash
   git init && git add . && git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/siam-meridian-logistics.git
   git push -u origin main
   ```
3. Never commit `.env` or `.dev.vars` (already in `.gitignore`).

## 2. Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
2. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: add variable `NODE_VERSION` = `20` (or `22`)
3. Environment variables (**Settings → Variables and Secrets**, Production):

| Name | Type | Value |
|---|---|---|
| `PUBLIC_SITE_URL` | Plain | `https://www.siam-meridian-logistics.com` (your real address, no trailing slash) |
| `PUBLIC_TURNSTILE_SITE_KEY` | Plain | Turnstile site key (step 5) |
| `TURNSTILE_SECRET_KEY` | **Secret** | Turnstile secret key (step 5) |
| `RESEND_API_KEY` | **Secret** | from Resend (step 5) |
| `MAIL_TO` | Plain | `Export@sml-th.com` (comma-separate for several) |
| `MAIL_FROM` | Plain | `Siam Meridian Website <website@sml-th.com>` |

`PUBLIC_*` values are build-time and safe to be public. Secrets are only read by the server function and never reach the browser. After changing `PUBLIC_*` values, trigger a new deployment.

4. Save and deploy. You get a `https://<project>.pages.dev` address to test with.

## 3. Connect the company domain (protect your email!)

Your Microsoft 365 email depends on DNS records. **Do not change, delete or proxy them.**

If the domain's DNS is **not yet on Cloudflare**:
1. Cloudflare → **Add a site** → enter the domain → Free plan. Cloudflare imports existing records.
2. **Before changing nameservers**, compare Cloudflare's list with your current DNS provider and confirm these exist exactly as before: `MX`, the SPF `TXT` (`v=spf1 include:spf.protection.outlook.com …`), DKIM `CNAME`s (`selector1._domainkey`, `selector2._domainkey`), DMARC `TXT` (`_dmarc`), `autodiscover` CNAME, and the Microsoft verification `TXT`. Set all email records to **DNS only** (grey cloud).
3. Change nameservers at your registrar to the two Cloudflare gives you. Wait until the site shows **Active**.

Then: Pages project → **Custom domains → Set up a custom domain** → `www.sml-th.com`. Cloudflare adds the needed `CNAME` automatically. For the bare domain (`sml-th.com`), add it as a second custom domain, or add a redirect rule to `www`. HTTPS certificates are issued automatically; set SSL/TLS mode to **Full (strict)**.

Adding the website records never requires editing MX, SPF, DKIM or DMARC.

## 4. Build command and variables

Covered in step 2. Local equivalents: `.env` (public values) and `.dev.vars` (secrets), based on `.env.example` and `.dev.vars.example`.

## 5. Forms: Turnstile, Resend, optional KV

**Turnstile (spam protection):** Cloudflare → **Turnstile → Add widget** → hostname = your domain (and `*.pages.dev` for testing) → Managed mode. Copy the Site key and Secret key into the variables above.

**Resend (email delivery):** Create an API key. Add your domain in Resend → it shows a few DNS records, usually on a `send` subdomain. Add them in Cloudflare DNS (they do not touch your M365 records). Wait for "Verified", then use an address on that domain as `MAIL_FROM`. Until verified, Resend only lets you send test mail to your own account address. Replies go to the customer automatically (Reply-To is set to their email).

**Optional safety copy (KV):** Workers & Pages → KV → create namespace `submissions` → Pages project → Settings → Bindings → add KV binding named `SUBMISSIONS`. Every enquiry is then also stored (kept 1 year). The function reports success only if email **or** KV storage worked; if both fail, the visitor sees an error with your email address, so no enquiry is silently lost.

**Extra spam control (optional):** Cloudflare → Security → WAF → Rate limiting rule for `/api/submit` (Free plan allows one rule).

## 6. CMS authentication (Decap Turbo)

Checked against the current official Decap docs: Decap CMS **3.17.0+** includes the `turbo-github` backend; the Free plan includes 1 site and 1 seat, matching your single-user setup. Turbo handles sign-in; GitHub calls are made server-side by Turbo's GitHub App, so no GitHub token or secret is ever in this repository or the browser.

1. Sign up at Decap Turbo (the docs currently describe access as invite-only or early access in places; if signup is not open to you yet, join the waitlist. Fallback in the last section).
2. **Connect Git provider:** install the **Decap Turbo GitHub App** on your account, limited to the `siam-meridian-logistics` repository.
3. **Create a site:** repository `thapakornhan/siam-meridian-logistics`, branch `main`, config path `public/admin/config.yml`, admin URL `https://www.siam-meridian-logistics.com/admin/` (exact: protocol, host and path must match what you use; add the `pages.dev` admin URL too if you test there).
4. Copy the **Site ID**.
5. Edit `cms.settings.json`:
   ```json
   { "repo": "thapakornhan/siam-meridian-logistics", "branch": "main", "turbo_site_id": "THE-SITE-ID" }
   ```
6. `npm run cms:config`, commit and push (the build regenerates it too).
7. Invite yourself under the site's members.

The Site ID is not a secret (it appears in the public config file); access is controlled by your Turbo login and membership.

## 7. Admin URL

`/admin/` is a static page (`public/admin/index.html`) served by Cloudflare Pages. It is excluded from `robots.txt` and sent with `noindex` and `no-store` headers. Public visitors can open the page but cannot sign in or change anything without being a member of the Turbo site. Optional extra layer: **Cloudflare Zero Trust → Access** (free up to 50 users) protecting `/admin/*`. Test sign-in afterwards, since an extra login in front of Turbo's popup flow needs checking.

## 8. Test publishing and deployment

1. Open `/admin/` → sign in → **News & Updates (English)** → open the sample article → switch on **Publish on website** → Save/Publish.
2. GitHub shows a new commit; Cloudflare Pages shows a build (1 to 2 minutes).
3. `/news/` now lists the article. Switch it back off to hide it again.
4. Edit the homepage headline in the CMS → confirm it changes after the build.
5. Upload an image in an article → confirm it appears and loads (stored in `public/uploads`).
6. Submit the **Get a Quote** form → confirm the email arrives at `MAIL_TO` and, if configured, the KV entry exists. Submit with the Thai site too.
7. Check `/sitemap-index.xml`, `/robots.txt`, a nonsense URL (custom 404), and share a link to see the Open Graph preview.
8. Run PageSpeed Insights on the live URL.

## 9. Maintenance

- **Content:** use `/admin/`. Keep uploaded photos under about 500 KB (resize before upload).
- **Code/dependencies:** a few times a year, `npm update`, `npm run build`, then push. Pin changes via GitHub pull requests if you want previews (Cloudflare builds a preview per branch).
- **Rollback:** Pages project → Deployments → pick an earlier one → **Rollback**.
- **Decap version:** pinned in `public/admin/index.html`. Update deliberately and test sign-in.
- **Secrets:** rotate `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` in Pages settings if ever exposed.
- **Adding a new service page** needs a developer (new data file, CMS entry, route entry).

## If Decap Turbo is not available to you yet

Do not use the plain `github` backend alone: it requires each editor to have their own GitHub account and an OAuth proxy. Options: wait for Turbo access, or run a small free OAuth proxy on Cloudflare (more setup, you maintain it). Change `backend.name` in `scripts/build-cms-config.mjs` only after choosing one.

## Known limits of what was verified before handover

Verified in a sandbox: production build (23 pages), layouts at desktop and mobile, Thai rendering, navigation, client validation and prefill, API validation, same-origin and honeypot checks, fail-closed behaviour, sitemap/robots. **Not verifiable here and to be checked on first deploy:** real Turnstile challenge, Resend delivery, Decap Turbo sign-in and publishing, Cloudflare domain setup.
