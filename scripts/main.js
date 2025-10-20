/* ==========================================================================
   VibeScript Landing — Minimal Interactions
   - Reveal-on-scroll animations
   - Sticky CTA behavior safeguards
   - (Optional hook) Basic click tracking console logs
   Updated: 2025-10-20
   ========================================================================== */

(function () {
  // Helper: add .is-in when element enters viewport
  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  // Sticky CTA: nothing fancy, but ensure it never overlaps focused inputs (future-proof)
  function initStickyCTA() {
    const bar = document.querySelector('.sticky-cta');
    if (!bar) return;

    // Manage viewport units and iOS keyboard
    const inputs = Array.from(document.querySelectorAll('input, textarea'));
    inputs.forEach((el) => {
      el.addEventListener('focus', () => bar.style.transform = 'translateY(100%)');
      el.addEventListener('blur',  () => bar.style.transform = 'translateY(0)');
    });
  }

  // Optional: basic click log (replace with analytics later)
  function initCTAAnalytics() {
    document.querySelectorAll('[data-cta]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (window.console && console.info) {
          console.info('[VibeScript] CTA clicked:', btn.textContent.trim());
        }
      });
    });
  }

  // Prefetch builder once the user scrolls/engages (hedge against cold start)
  function warmBuilder() {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'https://builder.vibescript.online';
    link.as = 'document';
    document.head.appendChild(link);
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initStickyCTA();
    initCTAAnalytics();

    // Warm after a short idle or first interaction
    let warmed = false;
    const doWarm = () => { if (!warmed) { warmed = true; warmBuilder(); } };
    setTimeout(doWarm, 1200);
    window.addEventListener('scroll', doWarm, { once: true, passive: true });
    window.addEventListener('pointerdown', doWarm, { once: true, passive: true });
  });
})();
