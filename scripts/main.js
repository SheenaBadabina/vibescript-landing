/* VibeScript Landing – reveal + safety fallback */
/* Makes .reveal blocks visible when in view, with graceful degrade. */
(() => {
  // Ensure CSS has a visible state even if globals.css missed it.
  const style = document.createElement("style");
  style.textContent = `
    .reveal.show{opacity:1 !important; transform:none !important;}
  `;
  document.head.appendChild(style);

  const nodes = Array.from(document.querySelectorAll(".reveal"));
  if (!nodes.length) return;

  // If IntersectionObserver exists, animate-in as they enter viewport.
  const show = (el) => el.classList.add("show");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

    nodes.forEach((n) => io.observe(n));
  } else {
    // Fallback: no IO support → just show everything after paint.
    window.requestAnimationFrame(() => nodes.forEach(show));
  }

  // Extra guard: if nothing became visible after 1.5s (e.g., CSS hiding),
  // force-show to avoid a blank page.
  setTimeout(() => {
    const anyShown = nodes.some((n) => n.classList.contains("show"));
    if (!anyShown) nodes.forEach(show);
  }, 1500);
})();
