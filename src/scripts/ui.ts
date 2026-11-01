/* Header behaviour: scroll shadow, services submenu, mobile menu, sticky quote bar. */
const header = document.getElementById('site-header');
const onScroll = () => header?.classList.toggle('is-scrolled', scrollY > 24);
onScroll(); addEventListener('scroll', onScroll, { passive: true });

// Services dropdown (click/keyboard; closes on outside click and Escape)
const toggle = document.querySelector<HTMLButtonElement>('[data-submenu-toggle]');
const submenu = document.getElementById('svc-menu');
const setSub = (open: boolean) => { submenu?.classList.toggle('open', open); toggle?.setAttribute('aria-expanded', String(open)); };
toggle?.addEventListener('click', () => setSub(!submenu?.classList.contains('open')));
toggle?.parentElement?.addEventListener('mouseenter', () => matchMedia('(hover:hover)').matches && setSub(true));
toggle?.parentElement?.addEventListener('mouseleave', () => matchMedia('(hover:hover)').matches && setSub(false));
document.addEventListener('click', (e) => { if (!toggle?.parentElement?.contains(e.target as Node)) setSub(false); });

// Mobile menu
const menu = document.getElementById('mobile-menu');
const opener = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const setMenu = (open: boolean) => {
  menu?.classList.toggle('open', open);
  opener?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) menu?.querySelector<HTMLElement>('[data-menu-close]')?.focus(); else opener?.focus();
};
opener?.addEventListener('click', () => setMenu(true));
menu?.querySelector('[data-menu-close]')?.addEventListener('click', () => setMenu(false));
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape') { setSub(false); if (menu?.classList.contains('open')) setMenu(false); } });

// Sticky quote bar (mobile): appears after the first screen
const bar = document.querySelector<HTMLElement>('[data-quote-bar]');
if (bar) {
  const check = () => bar.classList.toggle('show', scrollY > innerHeight * 0.7);
  check(); addEventListener('scroll', check, { passive: true });
}
