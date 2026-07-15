/* ============================================================
   SIYAH E AZAL — script.js
   Landing page behaviour: nav state, mobile menu, scroll reveals,
   and a lightweight ember particle field.
   ============================================================ */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: solid background after scroll ---------- */
  const nav = document.getElementById("siteNav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Ember particle field ----------
     A restrained, low-cost canvas animation: a handful of warm
     embers drifting upward and fading, evoking candlelight/ash
     rather than a busy "confetti" particle system.
  ------------------------------------------------- */
  const canvas = document.getElementById("embers");
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  let width, height, dpr;
  let particles = [];
  const PARTICLE_COUNT = 34;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth = window.innerWidth;
    height = canvas.clientHeight = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticle(randomY) {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + Math.random() * 60,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.35 + 0.08,
      drift: Math.random() * 0.6 - 0.3,
      alpha: Math.random() * 0.5 + 0.15,
      flicker: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () =>
      makeParticle(true)
    );
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.y -= p.speed;
      p.x += p.drift * 0.5;
      p.phase += p.flicker;
      const flicker = 0.65 + Math.sin(p.phase) * 0.35;

      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.r * 4
      );
      gradient.addColorStop(0, `rgba(212, 175, 55, ${p.alpha * flicker})`);
      gradient.addColorStop(1, "rgba(212, 175, 55, 0)");
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();

      if (p.y < -20) {
        Object.assign(p, makeParticle(false));
      }
    }

    requestAnimationFrame(step);
  }

  resize();
  initParticles();
  requestAnimationFrame(step);

  let resizeTimer;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
      }, 200);
    },
    { passive: true }
  );
})();
