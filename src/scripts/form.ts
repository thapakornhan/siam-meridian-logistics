/* Client logic for the quote and contact forms: validation, submit, success/error states. */
type Msgs = Record<string, string>;

function initForm(form: HTMLFormElement) {
  const wrap = form.closest<HTMLElement>('[data-form-wrap]')!;
  const okBox = wrap.querySelector<HTMLElement>('[data-success]')!;
  const errBox = wrap.querySelector<HTMLElement>('[data-error]')!;
  const errText = errBox.querySelector<HTMLElement>('[data-error-text]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const msgs: Msgs = JSON.parse(form.dataset.msgs || '{}');
  const submitLabel = submit.textContent || '';
  const started = form.elements.namedItem('started') as HTMLInputElement;
  started.value = String(Date.now());

  // Prefill from ?service=&origin=&destination= (quick-quote card and CTA links)
  if (form.dataset.kind === 'quote') {
    const q = new URLSearchParams(location.search);
    for (const k of ['service', 'origin', 'destination']) {
      const el = form.elements.namedItem(k) as HTMLInputElement | null;
      const v = q.get(k);
      if (el && v) el.value = v.slice(0, 160);
    }
  }

  const fieldErr = (el: Element) => {
    const id = el.getAttribute('aria-describedby');
    return id ? document.getElementById(id) : null;
  };
  const clear = (el: Element) => { el.removeAttribute('aria-invalid'); const e = fieldErr(el); if (e) e.textContent = ''; };
  form.addEventListener('input', (e) => clear(e.target as Element));
  form.addEventListener('change', (e) => clear(e.target as Element));

  const showError = (text: string, withEmail = false) => {
    errText.textContent = text + ' ';
    if (withEmail) {
      const a = document.createElement('a');
      a.href = `mailto:${msgs.email}`; a.textContent = msgs.email;
      errText.append(a);
    }
    errBox.hidden = false; errBox.focus();
  };
  const resetCaptcha = () => (window as any).turnstile?.reset?.();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errBox.hidden = true;

    // Client-side validation with inline messages
    let firstBad: HTMLElement | null = null;
    for (const el of Array.from(form.elements) as HTMLInputElement[]) {
      if (!el.name || el.type === 'hidden') continue;
      clear(el);
      if (!el.checkValidity()) {
        el.setAttribute('aria-invalid', 'true');
        const box = fieldErr(el); if (box) box.textContent = el.validationMessage;
        firstBad ??= el;
      }
    }
    if (firstBad) { showError(msgs.validation); firstBad.focus(); return; }

    const body = Object.fromEntries(new FormData(form).entries());
    const token = body['cf-turnstile-response'];
    if (!token) { showError(msgs.captchaMissing); return; }

    submit.disabled = true; submit.textContent = msgs.sending;
    try {
      const res = await fetch(form.dataset.endpoint!, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok) {
        form.hidden = true; okBox.hidden = false; okBox.focus();
        form.reset(); started.value = String(Date.now());
      } else if (out.code === 'validation') {
        for (const name of out.fields ?? []) {
          const el = form.elements.namedItem(name) as HTMLInputElement | null;
          if (el) { el.setAttribute('aria-invalid', 'true'); const b = fieldErr(el); if (b) b.textContent = msgs.validation; }
        }
        showError(msgs.validation); resetCaptcha();
      } else {
        const code = out.code as string;
        showError(msgs[code] ?? msgs.server, code === 'server' || !msgs[code]);
        resetCaptcha();
      }
    } catch {
      showError(msgs.network, true); resetCaptcha();
    } finally {
      submit.disabled = false; submit.textContent = submitLabel;
    }
  });

  wrap.querySelector('[data-reset]')?.addEventListener('click', () => {
    okBox.hidden = true; form.hidden = false; resetCaptcha();
    (form.querySelector('input:not([type=hidden])') as HTMLElement)?.focus();
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach(initForm);
