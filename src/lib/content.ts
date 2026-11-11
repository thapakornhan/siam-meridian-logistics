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
import zhHome from '../data/zh/home.json';
import zhAbout from '../data/zh/about.json';
import zhContact from '../data/zh/contact.json';
import zhQuote from '../data/zh/quote.json';
import zhNews from '../data/zh/news.json';
import zhPrivacy from '../data/zh/privacy.json';
import zhSettings from '../data/zh/settings.json';
import zhAir from '../data/zh/service-air-freight.json';
import zhSea from '../data/zh/service-sea-freight.json';
import zhLand from '../data/zh/service-land-freight.json';
import zhIntl from '../data/zh/service-international-logistics.json';

// English and Thai live in one file per page; Chinese lives in src/data/zh/ and is merged in here.
export const data = {
  home: { ...home, zh: zhHome }, about: { ...about, zh: zhAbout }, contact: { ...contact, zh: zhContact },
  quote: { ...quote, zh: zhQuote }, news: { ...news, zh: zhNews }, privacy: { ...privacy, zh: zhPrivacy },
  settings: { ...settings, zh: zhSettings }
};
const allServices = [{ ...air, zh: zhAir }, { ...sea, zh: zhSea }, { ...land, zh: zhLand }, { ...intl, zh: zhIntl }];
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
      const [, l, file] = path.match(/news\/(en|th|zh)\/(.+)\.md$/) ?? [];
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
  return new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : lang === 'zh' ? 'zh-CN' : 'en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(d);
}
