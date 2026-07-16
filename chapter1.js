/* ============================================================
   SIYAH E AZAL — chapter1.js
   Chapter One reading page: scroll progress bar and PDF
   loading / fallback handling.
   (Nav behaviour, reveals, and embers are handled by script.js,
   which is loaded alongside this file.)
   ============================================================ */

(() => {
  "use strict";

  /* ---------- Reading progress bar ---------- */
  const progressBar = document.getElementById("progressBar");

  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, pct)) + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();

  /* ---------- PDF viewer: loading + fallback ---------- */
  const pdfFrame = document.getElementById("pdfFrame");
  const loadingEl = document.getElementById("readerLoading");
  const fallbackEl = document.getElementById("readerFallback");

  if (!pdfFrame) return;

  let settled = false;

  function showLoaded() {
    if (settled) return;
    settled = true;
    if (loadingEl) loadingEl.classList.add("is-hidden");
  }

  function showFallback() {
    if (settled) return;
    settled = true;
    if (loadingEl) loadingEl.classList.add("is-hidden");
    if (fallbackEl) fallbackEl.classList.add("is-active");
  }

  /* Browsers that can render a PDF inline fire "load" on the iframe.
     Browsers/devices without a built-in PDF viewer (some mobile
     browsers) either fail to fire it, fire it very fast with an
     empty frame, or the iframe stays blank — so we pair the load
     event with a reasonable timeout that falls back gracefully. */
  pdfFrame.addEventListener("load", () => {
    showLoaded();
  });

  pdfFrame.addEventListener("error", () => {
    showFallback();
  });

  // Safety net: if nothing has resolved the loading state after
  // a few seconds, assume inline rendering isn't working and show
  // the fallback with a direct link instead of loading forever.
  window.setTimeout(() => {
    if (!settled) showFallback();
  }, 6000);
})();
