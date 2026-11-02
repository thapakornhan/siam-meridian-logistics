import home from '../data/home.json';
import about from '../data/about.json';
import contact from '../data/contact.json';
import quote from '../data/quote.json';
import news from '../data/news.json';
import privacy from '../data/privacy.json';
import settings from '../data/settings.json';
import formCfg from '../data/form.json';
import air from '../data/service-air-freight.json';
import sea from '../data/service-sea-freight.json';
import land from '../data/service-land-freight.json';
import intl from '../data/service-international-logistics.json';
import type { Lang } from '../i18n/ui';

export const data = { home, about, contact, quote, news, privacy, settings };
const allServices = [air, sea, land, intl];
/** Services switched on in the CMS ("Show this service on the website"). Hidden ones are not built at all. */
export const services = allServices.filter((s) => (s as { visible?: boolean }).visible !== false);
export type Service = (typeof allServices)[number];
export const getService = (slug: string) => allServices.find((s) => s.slug === slug)!;
export const formSettings = formCfg;

/* ---------- News (Markdown files managed by the CMS) ---------- */
type MdModule = { frontmatter: Record<string, any>; Content: any };
const modules = import.meta.glob<MdModule>('/src/content/news/*/*.md', { eager: true });

export interface Article {
  slug: string; lang: Lang; title: string; date: Date; summary: string; image?: string; seoDescription?: string; Content: any;
}

export function getArticles(lang: Lang): Article[] {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const [, l, file] = path.match(/news\/(en|th)\/(.+)\.md$/) ?? [];
      return { l, slug: file, fm: mod.frontmatter, Content: mod.Content };
    })
    .filter((a) => a.l === lang && a.fm.published === true)
    .map((a) => ({
      slug: a.slug, lang, title: a.fm.title, date: new Date(a.fm.date), summary: a.fm.summary ?? '',
      image: a.fm.image || undefined, seoDescription: a.fm.seo_description || undefined, Content: a.Content
    }))
    .sort((x, y) => y.date.getTime() - x.date.getTime());
}

export function formatDate(d: Date, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : 'en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(d);
}
