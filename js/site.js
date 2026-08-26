(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- status line / section count ---------- */
  document.querySelectorAll("[data-machine-count]").forEach((el) => {
    el.textContent = String(PROJECTS.length);
  });
  document.querySelectorAll("[data-plugin-count]").forEach((el) => {
    el.textContent = String(typeof PLUGINS !== "undefined" ? PLUGINS.length : 0);
  });

  /* ---------- render cards ---------- */
  const grid = document.getElementById("grid");

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function cardTemplate(p) {
    const techChips = p.tech.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
    const note = p.note ? `<p class="card-note">${escapeHtml(p.note)}</p>` : "";
    const launch = p.liveUrl
      ? `<a class="btn btn-primary" href="${p.liveUrl}" target="_blank" rel="noopener" aria-label="Launch ${escapeHtml(p.title)}">Launch</a>`
      : `<span class="btn-disabled" aria-disabled="true">Not yet published</span>`;

    return `
      <article class="card js-pre-reveal" style="--card-accent:${p.accent}">
        <a class="card-media" href="${p.liveUrl || p.repoUrl}" target="_blank" rel="noopener" aria-label="Open ${escapeHtml(p.title)}">
          <img src="${p.screenshot}" alt="Screenshot of ${escapeHtml(p.title)} running in the browser, showing its full control panel" loading="lazy" width="1200" height="686" />
          <span class="card-category">${escapeHtml(p.category)}</span>
          <span class="card-indicator" aria-hidden="true"></span>
        </a>
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(p.title)}</h3>
          <p class="card-tagline">${escapeHtml(p.tagline)}</p>
          <p class="card-description">${escapeHtml(p.description)}</p>
          <ul class="card-tech">${techChips}</ul>
          ${note}
          <div class="card-actions">
            ${launch}
            <a class="btn btn-secondary" href="${p.repoUrl}" target="_blank" rel="noopener" aria-label="View source for ${escapeHtml(p.title)}">Source</a>
          </div>
        </div>
      </article>
    `;
  }

  if (grid) {
    grid.innerHTML = PROJECTS.map(cardTemplate).join("");
  }

  /* ---------- render plugin download rows ---------- */
  const pluginGrid = document.getElementById("plugin-grid");

  function pluginTemplate(p) {
    const formats = p.formats.map((f) => `<li>${escapeHtml(f)}</li>`).join("");
    // The browser original this was ported from, so the pair can be compared.
    const web = PROJECTS.find((proj) => proj.slug === p.webSlug);
    const webLink = web && web.liveUrl
      ? `<a class="plugin-weblink" href="${web.liveUrl}" target="_blank" rel="noopener">Play the browser version &rarr;</a>`
      : "";
    const size = p.size ? ` <span class="plugin-size">${escapeHtml(p.size)}</span>` : "";

    return `
      <article class="plugin" style="--card-accent:${p.accent}">
        <div class="plugin-head">
          <span class="plugin-indicator" aria-hidden="true"></span>
          <h3 class="plugin-title">${escapeHtml(p.title)}</h3>
          <span class="plugin-category">${escapeHtml(p.category)}</span>
        </div>
        <p class="plugin-description">${escapeHtml(p.description)}</p>
        <ul class="plugin-formats">${formats}</ul>
        <div class="plugin-actions">
          <a class="btn btn-primary" href="${p.file}" download
             aria-label="Download ${escapeHtml(p.title)} ${escapeHtml(p.version)} for macOS${p.size ? ", " + escapeHtml(p.size) : ""}">
            Download${size}
          </a>
          ${webLink}
        </div>
        <p class="plugin-meta">v${escapeHtml(p.version)} &middot; macOS 10.15+ &middot; Universal (Apple Silicon + Intel)</p>
      </article>
    `;
  }

  if (pluginGrid && typeof PLUGINS !== "undefined") {
    pluginGrid.innerHTML = PLUGINS.map(pluginTemplate).join("");
  }

  /* ---------- reveal-on-scroll (restrained, off entirely under reduced motion) ---------- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("js-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".card").forEach((card, i) => {
      card.style.transitionDelay = `${Math.min(i, 6) * 40}ms`;
      io.observe(card);
    });
  } else {
    document.querySelectorAll(".js-pre-reveal").forEach((el) => el.classList.remove("js-pre-reveal"));
  }

  /* ---------- oscilloscope trace ---------- */
  const canvas = document.getElementById("scope-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function drawGraticule() {
      ctx.strokeStyle = "rgba(126, 224, 168, 0.08)";
      ctx.lineWidth = 1;
      const cols = 16;
      for (let i = 1; i < cols; i++) {
        const x = (width / cols) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    }

    function drawTrace(t) {
      const midY = height / 2;
      ctx.beginPath();
      const points = Math.floor(width / 2);
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        const phase = (i / points) * Math.PI * 2;
        const y =
          midY +
          Math.sin(phase * 3 + t) * (height * 0.22) +
          Math.sin(phase * 7 + t * 1.7) * (height * 0.08) +
          Math.sin(phase * 1.3 - t * 0.6) * (height * 0.06);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#7ee0a8";
      ctx.lineWidth = 1.6;
      ctx.shadowColor = "rgba(126, 224, 168, 0.55)";
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    function frame(ts) {
      ctx.clearRect(0, 0, width, height);
      drawGraticule();
      drawTrace(ts / 900);
      if (!reduceMotion) requestAnimationFrame(frame);
    }

    if (reduceMotion) {
      ctx.clearRect(0, 0, width, height);
      drawGraticule();
      drawTrace(1.4);
    } else {
      let visible = true;
      document.addEventListener("visibilitychange", () => {
        visible = document.visibilityState === "visible";
        if (visible) requestAnimationFrame(frame);
      });
      requestAnimationFrame(frame);
    }
  }

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
