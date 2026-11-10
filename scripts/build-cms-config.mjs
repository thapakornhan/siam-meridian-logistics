/**
 * Generates public/admin/config.yml (the Decap CMS configuration).
 * Why a generator? Every page has English + Thai fields. Writing them once here keeps both
 * languages identical and produces a plain YAML file (no anchors) that Decap Turbo can parse reliably.
 *
 * Edit this file (or cms.settings.json), then run:  npm run cms:config
 * The build runs it automatically (see "prebuild" in package.json).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { stringify } from 'yaml';

const settings = JSON.parse(readFileSync(new URL('../cms.settings.json', import.meta.url), 'utf8'));

/* ---------- field helpers ---------- */
const s = (name, label, o = {}) => ({ name, label, widget: 'string', ...o });
const t = (name, label, o = {}) => ({ name, label, widget: 'text', ...o });
const img = (name, label, o = {}) => ({ name, label, widget: 'image', required: false, ...o });
const list = (name, label, fields, o = {}) => ({ name, label, widget: 'list', fields, summary: '{{fields.title}}', ...o });
const pair = (n = 'title', b = 'body') => [s(n, 'Title'), t(b, 'Text')];
const both = (fieldsFn, extra = {}) => [
  { name: 'en', label: 'English', widget: 'object', collapsed: false, fields: fieldsFn(), ...extra },
  { name: 'th', label: 'ไทย (Thai)', widget: 'object', collapsed: true, fields: fieldsFn(), ...extra }
];
const photoAlt = () => s('image_alt', 'Photo description', { required: false, hint: 'Describe the photo in one short sentence. Used by screen readers and Google. Only needed if you add a photo.' });
const photoField = () => img('image', 'Photo (optional)', { hint: 'Shown with the text. Landscape, about 1600 x 1000 px, under 300 KB (JPG or WebP). Leave empty for no photo. Add the description in both language sections.' });
const seo = () => [
  s('seo_title', 'Page title for Google and browser tab', { hint: 'Keep it under about 60 characters. The company name is added automatically.' }),
  t('seo_description', 'Page description for Google', { hint: 'One or two sentences, up to about 160 characters.' })
];

/* ---------- page definitions ---------- */
const home = () => [
  ...seo(),
  s('hero_label', 'Small line above the headline'),
  s('hero_line1', 'Headline, line 1'), s('hero_line2', 'Headline, line 2 (shown dimmed)'), s('hero_line3', 'Headline, line 3'),
  t('hero_intro', 'Introduction under the headline'),
  s('hero_cta_primary', 'Main button text'), s('hero_cta_secondary', 'Second button text'),
  s('services_title', 'Services section: title'), t('services_intro', 'Services section: introduction'),
  s('solutions_title', 'International logistics band: title'), t('solutions_body', 'International logistics band: text'), s('solutions_cta', 'International logistics band: button text'),
  s('why_title', 'Why choose us: title'), list('why_items', 'Why choose us: points', pair(), { min: 1, max: 6 }),
  s('process_title', 'How it works: title'), list('process_steps', 'How it works: steps', pair(), { min: 2, max: 6 }),
  s('cta_title', 'Get a Quote band: title'), t('cta_body', 'Get a Quote band: text'), s('cta_button', 'Get a Quote band: button text'),
  s('contact_title', 'Contact section: title')
];
const about = () => [
  ...seo(), photoAlt(), s('title', 'Page title'), t('intro', 'Introduction (top of page)'), t('body', 'Company introduction', { hint: 'Separate paragraphs with a blank line.' }),
  s('vision_title', 'Vision: heading'), t('vision', 'Vision'), s('mission_title', 'Mission: heading'), t('mission', 'Mission'),
  s('philosophy_title', 'Business philosophy: heading'), list('philosophy_items', 'Business philosophy: values', pair(), { min: 1, max: 6 }),
  s('why_title', 'Why work with us: heading'), list('why_items', 'Why work with us: points', pair(), { min: 1, max: 6 }),
  s('cta_title', 'Bottom band: title'), s('cta_button', 'Bottom band: button text')
];
const service = () => [
  ...seo(), photoAlt(), s('title', 'Service name'), t('summary', 'One-line summary', { hint: 'Shown on cards and at the top of the page.' }),
  t('overview', 'Overview', { hint: 'Separate paragraphs with a blank line.' }),
  list('benefits', 'Key benefits', pair(), { min: 1, max: 6 }),
  list('process', 'Service process (in order)', pair(), { min: 2, max: 6 }),
  s('suitable_title', 'Heading for the "suitable for" list'),
  { name: 'suitable', label: 'Suitable customer requirements', widget: 'list', field: s('item', 'Item') },
  s('cta_title', 'Bottom band: title'), s('cta_button', 'Button text')
];
const contact = () => [...seo(), s('title', 'Page title'), t('intro', 'Introduction'), t('address', 'Company address'), s('hours', 'Business hours note')];
const quotePage = () => [...seo(), s('title', 'Page title'), t('intro', 'Introduction')];
const newsPage = () => [...seo(), s('title', 'Page title'), t('intro', 'Introduction'), s('empty', 'Message shown when there are no articles')];
const privacy = () => [
  ...seo(), s('title', 'Page title'),
  list('sections', 'Sections', [s('heading', 'Heading'), t('body', 'Text')], { summary: '{{fields.heading}}' })
];

const file = (name, label, path, fields) => ({ name, label, file: path, fields });
const toggle = (name, label, req) => ({ name, label, widget: 'object', collapsed: false, summary: '{{fields.show}}', fields: [
  { name: 'show', label: 'Show this field', widget: 'boolean', default: true },
  { name: 'required', label: 'Customer must fill it in', widget: 'boolean', default: req }
] });
const svcFile = (slug, label) => file(slug, label, `src/data/service-${slug}.json`, [
  { name: 'slug', label: 'Page address (do not change)', widget: 'hidden', default: slug },
  { name: 'icon', label: 'Icon (do not change)', widget: 'hidden', default: { 'air-freight': 'plane', 'sea-freight': 'ship', 'land-freight': 'truck', 'international-logistics': 'globe' }[slug] },
  photoField(),
  { name: 'visible', label: 'Show this service on the website', widget: 'boolean', default: true, hint: 'Turn OFF to hide the page everywhere (menu, homepage, footer, quote form, Google). The text is kept so you can turn it back on.' },
  ...both(service)
]);

const newsFields = [
  s('title', 'Title'),
  s('slug', 'Web address name', { hint: 'English lowercase letters, numbers and hyphens only, e.g. new-year-schedule. Use the SAME name for the English and Thai versions so the language switch links them.', pattern: ['^[a-z0-9]+(-[a-z0-9]+)*$', 'Use lowercase English letters, numbers and hyphens only'] }),
  { name: 'date', label: 'Date', widget: 'datetime', date_format: 'YYYY-MM-DD', time_format: false, format: 'YYYY-MM-DD' },
  { name: 'published', label: 'Publish on website', widget: 'boolean', default: false, hint: 'Off = draft (hidden from visitors). Turn on and save to publish.' },
  t('summary', 'Short summary', { hint: 'Shown on the news list and in search results.' }),
  img('image', 'Cover image'),
  s('seo_description', 'Page description for Google', { required: false }),
  { name: 'body', label: 'Article', widget: 'markdown' }
];
const newsCollection = (lang, label) => ({
  name: `news_${lang}`, label, label_singular: 'article', folder: `src/content/news/${lang}`, create: true, extension: 'md', format: 'frontmatter',
  slug: '{{fields.slug}}', summary: '{{title}} ({{date}}){{published | ternary(, - DRAFT)}}', sortable_fields: ['date', 'title'], fields: newsFields
});

/* ---------- final config ---------- */
const config = {
  backend: { name: 'turbo-github', repo: settings.repo, branch: settings.branch, turbo_site_id: settings.turbo_site_id },
  local_backend: true,
  site_url: 'https://www.siam-meridian-logistics.com',
  logo_url: '/brand/logo-sm.png',
  media_folder: 'public/uploads',
  public_folder: '/uploads',
  locale: 'en',
  editor: { preview: false },
  collections: [
    {
      name: 'pages', label: 'Website pages', description: 'Edit the text of each page in English and Thai.',
      files: [
        file('home', 'Homepage', 'src/data/home.json', [img('hero_image', 'Homepage background photo (optional)', { hint: 'Leave empty to keep the brand graphic. Use a wide landscape photo, at least 2000 px wide, under 500 KB.' }), ...both(home)]),
        file('about', 'About Us', 'src/data/about.json', [photoField(), ...both(about)]),
        file('quote', 'Get a Quote page', 'src/data/quote.json', both(quotePage)),
        file('contact', 'Contact Us (details and text)', 'src/data/contact.json', [
          s('phone_display', 'Phone number (as shown)'), s('phone_link', 'Phone number (for tap-to-call)', { hint: 'No spaces, with country code, e.g. +66830345538' }),
          s('email', 'Email address'), s('maps_url', 'Google Maps link'),
          s('maps_embed_url', 'Google Maps embed address (optional)', { required: false, hint: 'In Google Maps: Share → Embed a map → copy ONLY the address inside src="…". Leave empty to show a "View on Google Maps" button instead.' }),
          ...both(contact)
        ]),
        file('form', 'Quote & contact form fields', 'src/data/form.json', [
          { name: 'quote', label: 'Get a Quote form', widget: 'object', collapsed: false, hint: 'Name and email are always required. If a field is hidden, it is not asked and not required.', fields: [
            toggle('company', 'Company name', true), toggle('phone', 'Phone number', true), toggle('service', 'Service type', true),
            toggle('origin', 'Origin', true), toggle('destination', 'Destination', true), toggle('cargo', 'Cargo description', true),
            toggle('weight', 'Estimated cargo weight', false), toggle('volume', 'Estimated cargo volume', false), toggle('extra', 'Additional requirements', false)
          ] },
          { name: 'contact', label: 'Contact Us form', widget: 'object', collapsed: true, hint: 'Name, email and message are always required.', fields: [toggle('company', 'Company name', false), toggle('phone', 'Phone number', false)] }
        ]),
        file('news_page', 'News page text', 'src/data/news.json', both(newsPage)),
        file('privacy', 'Privacy policy', 'src/data/privacy.json', both(privacy))
      ]
    },
    {
      name: 'services', label: 'Services', description: 'The four service pages.',
      files: [
        svcFile('air-freight', 'Air Freight'), svcFile('sea-freight', 'Sea Freight'), svcFile('land-freight', 'Land Freight'),
        svcFile('international-logistics', 'International Logistics Solutions')
      ]
    },
    newsCollection('en', 'News & Updates (English)'),
    newsCollection('th', 'News & Updates (Thai)'),
    {
      name: 'settings', label: 'Site settings',
      files: [file('site', 'General', 'src/data/settings.json', [
        s('site_name', 'Company name (English)'), s('site_name_th', 'Company name (Thai)'),
        img('default_og_image', 'Default social sharing image', { required: false, hint: 'Shown when pages are shared on social media. 1200 × 630 px.' }),
        ...both(() => [s('tagline', 'Footer tagline'), s('footer_note', 'Copyright line (year is added automatically)')])
      ])]
    }
  ]
};

const header = `# AUTO-GENERATED by scripts/build-cms-config.mjs. Do not edit by hand.\n# Change the script or cms.settings.json, then run: npm run cms:config\n\n`;
writeFileSync(new URL('../public/admin/config.yml', import.meta.url), header + stringify(config, { lineWidth: 0 }));
console.log('✓ public/admin/config.yml generated');
