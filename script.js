/* ===========================
   Helper: feature flags
=========================== */
const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/* ===========================
   Basic niceties
=========================== */

// Footer year
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Contact form (optional)
(() => {
  const form = document.querySelector('form[aria-label="Contact form"]');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks — I will get back to you soon.');
    form.reset();
  });
})();

/* ===========================
   Smooth scroll (same-page anchors)
=========================== */
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      const samePage = this.pathname === location.pathname && this.hostname === location.hostname;
      if (!samePage || !target) return; // let browser handle cross-page links
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ===========================
   Reveal system WITHOUT FOUC
   - Prepare all targets
   - Immediately mark in-viewport items as visible
   - Attach observers
   - THEN flip <html>.classList.add('animate-init')
=========================== */

document.addEventListener('DOMContentLoaded', () => {
  // Enable animation-hiding rules immediately so elements can fade in
  document.documentElement.classList.add('animate-init');

  const inViewport = (el, offset = 0.1) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth  || document.documentElement.clientWidth;
    return r.top <= vh * (1 - offset) && r.bottom >= vh * 0 && r.left < vw && r.right > 0;
  };

  const observe = (targets, options = { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }) => {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      targets.forEach(t => t.classList.add('visible'));
      return null;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, options);
    targets.forEach(t => io.observe(t));
    return io;
  };
  /* ----- Generic reveals outside <section> ----- */
  const manualTargets = Array.from(document.querySelectorAll('.reveal, .reveal-p, .reveal-li'))
    .filter(el => !el.closest('section'));
  observe(manualTargets, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  /* ----- Cards (.fade-in) ----- */
  const cardTargets = Array.from(document.querySelectorAll('.fade-in'));
  // Stagger within the .services grid
  const grid = document.querySelector('.services');
  if (grid) {
    grid.querySelectorAll('.fade-in').forEach((el, i) => {
      el.style.transitionDelay = `${i * 100}ms`;
    });
  }
  observe(cardTargets, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  /* ----- Section titles (all <h2>) ----- */
  const titles = Array.from(document.querySelectorAll('h2'));
  titles.forEach((t, i) => {
    t.classList.add('reveal');
    t.style.transitionDelay = `${i * 80}ms`;
  });
  observe(titles, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  /* ----- Paragraphs under each section (cascade) ----- */
  document.querySelectorAll('section').forEach(section => {
    const paras = Array.from(section.querySelectorAll('p'));
    const baseAfterH2 = 40;          // small base delay so it appears quickly
    const perParaDelay = 120;        // cascade amount
    paras.forEach((p, i) => {
      p.classList.add('reveal-p');
      p.style.transitionDelay = `${baseAfterH2 + (i * perParaDelay)}ms`;
    });
    observe(paras, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
  });

  /* ----- List items start after paragraphs (per section) ----- */
  document.querySelectorAll('section ul, section ol').forEach(list => {
    const section = list.closest('section');
    const paraCount = section ? section.querySelectorAll('p').length : 0;
    const baseAfterH2 = 40;
    const perParaDelay = 120;
    const bullets = Array.from(list.querySelectorAll('li'));
    const baseAfterParas = baseAfterH2 + (paraCount > 0 ? (paraCount - 1) * perParaDelay + perParaDelay : 0);
    bullets.forEach((li, i) => {
      li.classList.add('reveal-li');
      li.style.transitionDelay = `${baseAfterParas + (i * 90)}ms`;
    });
    observe(bullets, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
  });

  /* ----- Hero image fade (if present) ----- */
  const heroImg = document.querySelector('.hero-media img.fade-hero');
  if (heroImg) {
    if (!inViewport(heroImg, 0.05)) {
      // nice entry on load when not already in view
      heroImg.style.transitionDelay = '200ms';
    }
    observe([heroImg], { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
  }
});

/* ===========================
   Hamburger (mobile menu)
=========================== */
(() => {
  const btn = document.getElementById('nav-toggle');
  const menu = document.getElementById('primary-nav');
  if (!btn || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  };
  const openMenu = () => {
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  };

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });

  // Close when clicking a link (mobile UX)
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  // Escape closes
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
})();

/* ===========================
   Theme toggle (Light / Dark / Auto)
=========================== */
(() => {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const STORAGE_KEY = 'site-theme'; // 'light' | 'dark' | 'auto'
  const getStored = () => localStorage.getItem(STORAGE_KEY) || 'auto';
  const apply = (mode) => {
    if (mode === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      btn.textContent = 'Theme: Light';
    } else if (mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      btn.textContent = 'Theme: Dark';
    } else {
      document.documentElement.removeAttribute('data-theme'); // follow system
      btn.textContent = 'Theme: Auto';
    }
  };

  // Init
  apply(getStored());

  // Cycle Auto -> Light -> Dark -> Auto
  btn.addEventListener('click', () => {
    const current = getStored();
    const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  });

  // Reflect system changes when in Auto
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener?.('change', () => { if (getStored() === 'auto') apply('auto'); });
})();
