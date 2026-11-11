import raw from '../data/channels.json';
import { data } from './content';
import type { Lang } from '../i18n/ui';

export type Channel = {
  type: string; label?: string; label_th?: string; label_zh?: string; value: string; link?: string; qr?: string;
  show_contact?: boolean; show_footer?: boolean; show_home?: boolean;
};
const items = ((raw as { items?: Channel[] }).items ?? []).filter((c) => c && c.value);

/** Channels for one place on the site. Edited in the CMS under "Contact channels". */
export function getChannels(where: 'contact' | 'footer' | 'home'): Channel[] {
  const key = `show_${where}` as const;
  return items.filter((c) => c[key] !== false);
}

const digits = (s: string) => s.replace(/[^\d]/g, '');

/** Link for a channel: explicit link wins, otherwise built from the value for phone, email and WhatsApp. */
export function channelHref(c: Channel): string | undefined {
  if (c.link) return c.link;
  if (c.type === 'phone') return `tel:${c.value.trim().startsWith('+') ? '+' : ''}${digits(c.value)}`;
  if (c.type === 'email') return `mailto:${c.value.trim()}`;
  if (c.type === 'whatsapp' && digits(c.value).length >= 6) return `https://wa.me/${digits(c.value)}`;
  return undefined;
}

export const channelLabel = (c: Channel, lang: Lang) => (lang === 'th' ? c.label_th || c.label : lang === 'zh' ? c.label_zh || c.label : c.label) || '';
export const iconFor = (type: string) =>
  ({ phone: 'phone', email: 'mail', wechat: 'chat', line: 'chat', whatsapp: 'chat', telegram: 'chat' } as Record<string, string>)[type] ?? 'link';

const firstOf = (t: string) => items.find((c) => c.type === t)?.value;
export const primaryEmail = firstOf('email') ?? data.contact.email;
export const primaryPhoneLink = (() => {
  const p = items.find((c) => c.type === 'phone');
  return p ? channelHref(p)!.replace('tel:', '') : data.contact.phone_link;
})();
