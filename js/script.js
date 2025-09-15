/* Feature: reduced motion */
const prefersReduced =
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/* Footer year */
(() => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* Smooth scroll for same-page anchors */
(() => {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const target = document.querySelector(href);
      const samePage =
        this.pathname === location.pathname &&
        this.hostname === location.hostname;
      if (!samePage || !target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

/* Reveal system (no FOUC): prepare, mark in-view, then enable animations */
document.addEventListener("DOMContentLoaded", () => {
  const inViewport = (el, offset = 0.1) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    return (
      r.top <= vh * (1 - offset) &&
      r.bottom >= vh * 0 &&
      r.left < vw &&
      r.right > 0
    );
  };

  const observe = (
    targets,
    options = { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
  ) => {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("visible"));
      return null;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, options);
    targets.forEach((t) => io.observe(t));
    return io;
  };

  // Cards
  const cards = Array.from(document.querySelectorAll(".fade-in"));
  const grid = document.querySelector(".services");
  if (grid)
    grid
      .querySelectorAll(".fade-in")
      .forEach((el, i) => (el.style.transitionDelay = `${i * 100}ms`));
  cards.forEach((el) => {
    if (inViewport(el, 0.15) || prefersReduced) el.classList.add("visible");
  });
  observe(cards, { threshold: 0.1, rootMargin: "0px 0px -10% 0px" });

  // Section titles
  const titles = Array.from(document.querySelectorAll("h2"));
  titles.forEach((t, i) => {
    t.classList.add("reveal");
    t.style.transitionDelay = `${i * 80}ms`;
    if (inViewport(t, 0.15) || prefersReduced) t.classList.add("visible");
  });
  observe(titles, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

  // Paragraphs per section
  document.querySelectorAll("section").forEach((section) => {
    const paras = Array.from(section.querySelectorAll("p"));
    const baseAfterH2 = 40;
    const perPara = 120;
    paras.forEach((p, i) => {
      p.classList.add("reveal-p");
      p.style.transitionDelay = `${baseAfterH2 + i * perPara}ms`;
      if (inViewport(p, 0.1) || prefersReduced) p.classList.add("visible");
    });
    observe(paras, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
  });

  // List items
  document.querySelectorAll("section ul, section ol").forEach((list) => {
    const bullets = Array.from(list.querySelectorAll("li"));
    bullets.forEach((li, i) => {
      li.classList.add("reveal-li");
      li.style.transitionDelay = `${i * 90}ms`;
      if (inViewport(li, 0.08) || prefersReduced) li.classList.add("visible");
    });
    observe(bullets, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
  });

  // Hero image
  const heroImg = document.querySelector(".hero-media img.fade-hero");
  if (heroImg) {
    if (inViewport(heroImg, 0.05) || prefersReduced)
      heroImg.classList.add("visible");
    else heroImg.style.transitionDelay = "200ms";
    observe([heroImg], { threshold: 0.05, rootMargin: "0px 0px -5% 0px" });
  }

  // Finally enable animation CSS rules
  document.documentElement.classList.add("animate-init");
});

/* Hamburger */
(() => {
  const btn = document.getElementById("nav-toggle");
  const menu = document.getElementById("primary-nav");
  if (!btn || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  };
  const openMenu = () => {
    menu.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  };

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    expanded ? closeMenu() : openMenu();
  });
  menu
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();

/* Theme toggle (Auto → Light → Dark) */
(() => {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const KEY = "site-theme"; // 'auto' | 'light' | 'dark'
  const get = () => localStorage.getItem(KEY) || "auto";
  const apply = (mode) => {
    if (mode === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      btn.textContent = "Theme: Light";
    } else if (mode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      btn.textContent = "Theme: Dark";
    } else {
      document.documentElement.removeAttribute("data-theme");
      btn.textContent = "Theme: Auto";
    }
  };

  apply(get());
  btn.addEventListener("click", () => {
    const current = get();
    const next =
      current === "auto" ? "light" : current === "light" ? "dark" : "auto";
    localStorage.setItem(KEY, next);
    apply(next);
  });

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener?.("change", () => {
    if (get() === "auto") apply("auto");
  });
})();

/* Contact form toast */
(() => {
  const form = document.querySelector('form[aria-label="Contact form"]');
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thanks — I will get back to you soon.");
    form.reset();
  });
})();
