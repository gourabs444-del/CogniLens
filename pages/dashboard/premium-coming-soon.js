(function () {
  if (window.__cognilensPremiumSoon) return;
  window.__cognilensPremiumSoon = true;

  const style = document.createElement("style");
  style.textContent = `
    .premium-soon-lock { overflow: hidden; }
    .premium-soon-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(15, 23, 42, 0.58);
      backdrop-filter: blur(16px);
    }
    .premium-soon-overlay.is-open { display: flex; }
    .premium-soon-card {
      width: min(92vw, 560px);
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 28px;
      background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
      box-shadow: 0 30px 90px rgba(15, 23, 42, 0.28);
      padding: 28px;
      color: #0f172a;
      position: relative;
    }
    .premium-soon-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 38px;
      height: 38px;
      border: 1px solid #dbe4f0;
      border-radius: 999px;
      background: #fff;
      color: #475569;
      font-size: 22px;
      line-height: 1;
      cursor: pointer;
    }
    .premium-soon-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 999px;
      background: #eef2ff;
      color: #4f46e5;
      padding: 8px 12px;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    .premium-soon-title {
      margin-top: 18px;
      max-width: 440px;
      font-size: clamp(30px, 5vw, 46px);
      line-height: 1;
      font-weight: 950;
      letter-spacing: -0.02em;
    }
    .premium-soon-copy {
      margin-top: 14px;
      color: #64748b;
      font-size: 15px;
      line-height: 1.7;
      max-width: 480px;
    }
    .premium-soon-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-top: 22px;
    }
    .premium-soon-chip {
      border: 1px solid #e0e7ff;
      border-radius: 16px;
      background: #f8fafc;
      padding: 12px;
      color: #334155;
      font-size: 13px;
      font-weight: 800;
    }
    @media (max-width: 560px) {
      .premium-soon-grid { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.className = "premium-soon-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <section class="premium-soon-card" role="dialog" aria-modal="true" aria-labelledby="premium-soon-title">
      <button class="premium-soon-close" type="button" aria-label="Close premium popup">&times;</button>
      <h2 class="premium-soon-title" id="premium-soon-title">Coming Soon</h2>
    </section>
  `;
  document.body.appendChild(overlay);

  const open = () => {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("premium-soon-lock");
  };

  const close = () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("premium-soon-lock");
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-premium-soon]");
    if (trigger) {
      event.preventDefault();
      open();
      return;
    }
    if (event.target === overlay || event.target.closest(".premium-soon-close")) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
})();