/* ===========================
   Basics
=========================== */

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Basic contact form feedback (if present)
const form = document.querySelector('form[aria-label="Contact form"]');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks — I will get back to you soon.');
    form.reset();
  });
}

/* ===========================
   Smooth scroll (same‑page anchors)
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    const samePage = this.pathname === location.pathname && this.hostname === location.hostname;
    if (!samePage || !target) return; // let browser handle cross‑page links
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===========================
   Reveal on scroll (cards, titles, paragraphs, lists)
=========================== */

const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/* --- Cards (.fade-in) appear with fade + lift, then stagger in grid --- */
(() => {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // reveal once
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    targets.forEach(el => io.observe(el));
  } else {
    targets.forEach(el => el.classList.add('visible'));
  }

  // Stagger within the .services grid
  const grid = document.querySelector('.services');
  if (grid) {
    grid.querySelectorAll('.fade-in').forEach((el, i) => {
      el.style.transitionDelay = `${i * 100}ms`;
    });
  }
})();

/* --- H2 titles reveal --- */
(() => {
  const titles = document.querySelectorAll('h2');
  if (!titles.length) return;

  titles.forEach(t => t.classList.add('reveal'));

  if (!prefersReduced && 'IntersectionObserver' in window) {
    const titleObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    titles.forEach((t, i) => {
      t.style.transitionDelay = `${i * 100}ms`;
      titleObserver.observe(t);
    });
  } else {
    titles.forEach(t => t.classList.add('visible'));
  }
})();

/* --- Paragraphs cascade per section --- */
(() => {
  const paraObserver = (!prefersReduced && 'IntersectionObserver' in window)
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.1 })
    : null;

  document.querySelectorAll('section').forEach(section => {
    const paras = Array.from(section.querySelectorAll('p'));
    if (!paras.length) return;

    const baseAfterH2 = 120; // ms delay after the heading
    paras.forEach((p, i) => {
      p.classList.add('reveal-p');
      p.style.transitionDelay = `${baseAfterH2 + (i * 120)}ms`;
      if (paraObserver) paraObserver.observe(p);
      else p.classList.add('visible');
    });
  });
})();

/* --- Lists start after last paragraph, then stagger bullets --- */
(() => {
  const liObserver = (!prefersReduced && 'IntersectionObserver' in window)
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    : null;

  document.querySelectorAll('section ul, section ol').forEach(list => {
    const section = list.closest('section');
    const paraCount = section ? section.querySelectorAll('p').length : 0;

    const baseAfterH2 = 120;   // delay after h2
    const perParaDelay = 120;  // additional delay per paragraph
    const baseAfterParas = baseAfterH2 + Math.max(0, (paraCount - 1)) * perParaDelay;

    const items = Array.from(list.querySelectorAll('li'));
    items.forEach((li, i) => {
      li.classList.add('reveal-li');
      li.style.transitionDelay = `${baseAfterParas + (i * 90)}ms`;
      if (liObserver) liObserver.observe(li);
      else li.classList.add('visible');
    });
  });
})();

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
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Escape key closes the menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
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

  // Cycle: Auto -> Light -> Dark -> Auto
  btn.addEventListener('click', () => {
    const current = getStored();
    const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
    localStorage.setItem(STORAGE_KEY, next);
    apply(next);
  });

  // If user changes system theme while in Auto, reflect it
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener?.('change', () => {
    if (getStored() === 'auto') apply('auto');
  });
})();
