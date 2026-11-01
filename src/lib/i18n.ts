import type { Lang } from '../i18n/ui';

/** Build a localized path. Lang 'en' lives at the root, 'th' under /th. */
export function href(lang: Lang, path = '/'): string {
  const clean = path === '/' ? '' : path.replace(/^\/|\/$/g, '');
  const base = lang === 'th' ? '/th' : '';
  const full = `${base}/${clean}`.replace(/\/+/g, '/');
  return full === '' ? '/' : full.endsWith('/') ? full : `${full}/`;
}

/** Path without language prefix, always with leading and trailing slash. */
export function stripLang(pathname: string): string {
  const p = pathname.replace(/^\/th(?=\/|$)/, '') || '/';
  return p.endsWith('/') ? p : `${p}/`;
}

export function langFromPath(pathname: string): Lang {
  return /^\/th(\/|$)/.test(pathname) ? 'th' : 'en';
}

/** Split CMS text into paragraphs on blank lines. */
export function paragraphs(text = ''): string[] {
  return text.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
}
