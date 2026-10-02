// ==========================================================================
// Pasand Khan — Teaching Internship Portfolio
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  setupMobileNav();
  setupScrollSpy();
  setupThemeToggle();
  setupScrollProgress();
  setupBackToTop();
  setupRevealAnimations();
  setupEvalBarAnimation();
  setupPrintButton();
  setupContactForm();
});

/* ---------- Footer year ---------- */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Mobile nav toggle ---------- */
function setupMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

/* ---------- Scroll-spy for the desktop spec rail ---------- */
function setupScrollSpy() {
  const railItems = document.querySelectorAll('.spec-rail li');
  if (!railItems.length) return;

  const sections = Array.from(railItems)
    .map((li) => document.getElementById(li.dataset.target))
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || !sections.length) return;

  const setActive = (id) => {
    railItems.forEach((li) => {
      li.classList.toggle('active', li.dataset.target === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length) setActive(visible[0].target.id);
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: [0.1, 0.25, 0.5, 0.75] }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Light (whiteboard) / dark (chalkboard) theme toggle ---------- */
function setupThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const themeColorMeta = document.getElementById('theme-color-meta');
  if (!toggle) return;

  const THEME_KEY = 'pasand-theme';
  const DARK_BG = '#16231C';
  const LIGHT_BG = '#F7F5EF';

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      toggle.setAttribute('aria-pressed', 'true');
      toggle.setAttribute('aria-label', 'Switch to chalkboard (dark) mode');
      if (themeColorMeta) themeColorMeta.setAttribute('content', LIGHT_BG);
    } else {
      document.documentElement.removeAttribute('data-theme');
      toggle.setAttribute('aria-pressed', 'false');
      toggle.setAttribute('aria-label', 'Switch to whiteboard (light) mode');
      if (themeColorMeta) themeColorMeta.setAttribute('content', DARK_BG);
    }
  };

  // Sync the toggle's own state with whatever the anti-flash inline
  // script already applied before this file loaded.
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  applyTheme(current);

  toggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
  });
}

/* ---------- Scroll progress bar ---------- */
function setupScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  let ticking = false;
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* ---------- Back-to-top button ---------- */
function setupBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Scroll-reveal for section content ---------- */
function setupRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Evaluation bars fill in once scrolled into view ---------- */
function setupEvalBarAnimation() {
  const bars = document.querySelectorAll('.eval-fill');
  if (!bars.length) return;

  if (!('IntersectionObserver' in window)) {
    bars.forEach((bar) => { bar.style.width = `${bar.dataset.width || 0}%`; });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const list = entry.target.querySelectorAll('.eval-fill');
        list.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = `${bar.dataset.width || 0}%`;
          }, i * 80);
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  const container = document.querySelector('.eval-bars');
  if (container) observer.observe(container);
}

/* ---------- Print / save as PDF ---------- */
function setupPrintButton() {
  const btn = document.getElementById('print-btn');
  if (!btn) return;
  btn.addEventListener('click', () => window.print());
}

/* ---------- Contact form ---------- */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in every field before sending.';
      return;
    }

    // No backend is wired up yet — this opens the visitor's own email client
    // with the message pre-filled. Replace with a real fetch() call once a
    // form endpoint (Formspree, a small API route, etc.) is in place.
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    const mailtoLink = form
      .closest('.contact')
      .querySelector('.contact-links a[href^="mailto:"]');
    const address = mailtoLink ? mailtoLink.getAttribute('href').replace('mailto:', '') : 'hello@example.com';

    window.location.href = `mailto:${address}?subject=${subject}&body=${body}`;
    status.textContent = 'Opening your email client…';
    form.reset();
  });
}
