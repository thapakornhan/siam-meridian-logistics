/**
 * Cloudflare Pages Function: POST /api/submit
 * Handles the Get a Quote and Contact forms.
 *
 * Protection: same-origin check, Cloudflare Turnstile, honeypot, minimum fill time, strict server-side
 * validation, field length limits, and HTML escaping. Secrets are read from environment bindings only.
 *
 * Delivery: email through Resend (primary) and, optionally, a copy stored in Cloudflare KV.
 * The request only succeeds if at least one delivery method worked, so no enquiry is silently lost.
 */

interface KV { put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void> }
interface Env {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  MAIL_TO?: string;
  MAIL_FROM?: string;
  SUBMISSIONS?: KV; // optional KV namespace binding
}
type Ctx = { request: Request; env: Env };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const SERVICES = ['air-freight', 'sea-freight', 'land-freight', 'international-logistics', 'other'];
const SERVICE_LABEL: Record<string, string> = {
  'air-freight': 'Air Freight', 'sea-freight': 'Sea Freight', 'land-freight': 'Land Freight',
  'international-logistics': 'International Logistics Solutions', other: 'Not sure yet'
};

type Rule = { max: number; required?: boolean };
const RULES: Record<'quote' | 'contact', Record<string, Rule>> = {
  quote: {
    name: { max: 120, required: true }, company: { max: 160, required: true }, email: { max: 160, required: true },
    phone: { max: 40, required: true }, service: { max: 40, required: true }, origin: { max: 160, required: true },
    destination: { max: 160, required: true }, cargo: { max: 2000, required: true }, weight: { max: 80 },
    volume: { max: 80 }, extra: { max: 2000 }
  },
  contact: {
    name: { max: 120, required: true }, company: { max: 160 }, email: { max: 160, required: true },
    phone: { max: 40 }, message: { max: 3000, required: true }
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  // 1. Same-origin only (blocks cross-site form posts)
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ ok: false, code: 'origin' }, 403);

  // 2. Parse
  let raw: Record<string, unknown>;
  try { raw = await request.json(); } catch { return json({ ok: false, code: 'validation', fields: [] }, 400); }
  const str = (k: string) => (typeof raw[k] === 'string' ? (raw[k] as string).trim() : '');

  // 3. Honeypot and minimum fill time: pretend success so bots learn nothing
  const started = Number(str('started'));
  if (str('website') !== '' || !started || Date.now() - started < 2500) return json({ ok: true });

  // 4. Validate
  const kind = str('kind') === 'contact' ? 'contact' : 'quote';
  const lang = str('lang') === 'th' ? 'th' : 'en';
  const rules = RULES[kind];
  const data: Record<string, string> = {};
  const bad: string[] = [];
  for (const [field, rule] of Object.entries(rules)) {
    const v = str(field);
    data[field] = v;
    if ((rule.required && !v) || v.length > rule.max) bad.push(field);
  }
  if (data.email && !EMAIL_RE.test(data.email)) bad.push('email');
  if (data.phone && data.phone.replace(/\D/g, '').length < 6) bad.push('phone');
  if (kind === 'quote' && !SERVICES.includes(data.service)) bad.push('service');
  if (bad.length) return json({ ok: false, code: 'validation', fields: [...new Set(bad)] }, 400);

  // 5. Turnstile (fails closed if the secret is not configured)
  if (!env.TURNSTILE_SECRET_KEY) return json({ ok: false, code: 'server' }, 500);
  const token = str('cf-turnstile-response');
  if (!token) return json({ ok: false, code: 'captcha' }, 400);
  try {
    const form = new FormData();
    form.append('secret', env.TURNSTILE_SECRET_KEY);
    form.append('response', token);
    const ip = request.headers.get('CF-Connecting-IP');
    if (ip) form.append('remoteip', ip);
    const v = (await (await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form })).json()) as { success: boolean };
    if (!v.success) return json({ ok: false, code: 'captcha' }, 400);
  } catch { return json({ ok: false, code: 'server' }, 502); }

  // 6. Build message
  const label: Record<string, string> = {
    name: 'Name', company: 'Company', email: 'Email', phone: 'Phone', service: 'Service', origin: 'Origin', destination: 'Destination',
    cargo: 'Cargo description', weight: 'Estimated weight', volume: 'Estimated volume', extra: 'Additional requirements', message: 'Message'
  };
  const rows = Object.keys(rules).filter((k) => data[k]).map((k) => [label[k], k === 'service' ? SERVICE_LABEL[data[k]] : data[k]] as const);
  const subject = oneLine(kind === 'quote'
    ? `[Quote request] ${SERVICE_LABEL[data.service]} – ${data.company} (${data.origin} → ${data.destination})`
    : `[Website contact] ${data.name}${data.company ? ' – ' + data.company : ''}`).slice(0, 200);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nLanguage: ${lang}\nSubmitted: ${new Date().toISOString()}`;
  const html = `<table cellpadding="8" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="border-bottom:1px solid #dde3ec;font-weight:bold;vertical-align:top">${escapeHtml(k)}</td><td style="border-bottom:1px solid #dde3ec;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
    .join('')}</table>`;

  let delivered = false;

  // 7a. Optional KV copy (kept 1 year)
  if (env.SUBMISSIONS) {
    try {
      await env.SUBMISSIONS.put(`${Date.now()}-${crypto.randomUUID()}`, JSON.stringify({ kind, lang, ...data, at: new Date().toISOString() }), { expirationTtl: 31536000 });
      delivered = true;
    } catch { /* fall through to email */ }
  }

  // 7b. Email via Resend
  if (env.RESEND_API_KEY && env.MAIL_TO && env.MAIL_FROM) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: env.MAIL_FROM, to: env.MAIL_TO.split(',').map((s) => s.trim()), reply_to: data.email, subject, text, html })
      });
      if (res.ok) delivered = true;
    } catch { /* handled below */ }
  }

  return delivered ? json({ ok: true }) : json({ ok: false, code: 'server' }, 502);
};

// Anything other than POST is rejected
export const onRequest = async ({ request }: Ctx): Promise<Response> =>
  request.method === 'POST' ? json({ ok: false }, 500) : new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
