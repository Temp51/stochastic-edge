/**
 * THE STOCHASTIC EDGE — Main JavaScript Engine v1.0.0
 * =====================================================
 * Modules:
 *  01. Core & Init
 *  02. Navigation (sticky, mobile hamburger)
 *  03. Theme Toggle (dark / light)
 *  04. Hero Canvas (Brownian motion math symbols)
 *  05. Counter Animations
 *  06. Intersection Observer (fade-in, TOC, counters)
 *  07. Reading Progress Bar
 *  08. Table of Contents (auto-generate + highlight)
 *  09. Back To Top
 *  10. Cookie Banner
 *  11. Code Block Copy Button
 *  12. Share Buttons
 *  13. Monte Carlo Retirement Simulator
 *  14. Newsletter Form Handler
 *  15. Simple Article Search / Filter
 *  16. Utilities
 */

/* ─── 01. CORE & INIT ────────────────────────────────────────────────── */
(function () {
  'use strict';

  const App = {
    init() {
      this.nav();
      this.themeToggle();
      this.heroCanvas();
      this.observeAnimations();
      this.readingProgress();
      this.tableOfContents();
      this.backToTop();
      this.cookieBanner();
      this.codeBlockCopy();
      this.shareButtons();
      this.monteCarloCalc();
      this.kellyExplorer();
      this.kellyMultiExplorer();
      this.newsletterForms();
      this.articleFilter();
      this.counterAnimations();
    },

    $: (sel, ctx = document) => ctx.querySelector(sel),
    $$: (sel, ctx = document) => [...ctx.querySelectorAll(sel)],
    on: (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts),
  };


  /* ─── 02. NAVIGATION ──────────────────────────────────────────────── */
  App.nav = function () {
    const header   = App.$('#site-header');
    const toggle   = App.$('#mobile-toggle');
    const menu     = App.$('#mobile-menu');
    const closeBtn = App.$('#mobile-close');

    // Sticky header shadow on scroll
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (header) {
        header.classList.toggle('scrolled', y > 40);
        header.classList.toggle('hidden-nav', y > 300 && y > lastY + 5);
        header.classList.toggle('show-nav',   y < lastY - 5);
      }
      lastY = Math.max(0, y);
    }, { passive: true });

    // Mobile menu
    App.on(toggle, 'click', () => {
      const open = menu?.classList.toggle('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    App.on(closeBtn, 'click', closeMenu);
    App.on(menu, 'click', (e) => {
      if (e.target.tagName === 'A') closeMenu();
    });

    function closeMenu() {
      menu?.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    // Trap focus in mobile menu when open
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Highlight current page in nav
    const current = window.location.pathname;
    App.$$('.nav-links a, .mobile-menu a').forEach(a => {
      const href = new URL(a.href, window.location.href).pathname;
      if (href === current || (current !== '/' && href !== '/' && current.startsWith(href))) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });
  };


  /* ─── 03. THEME TOGGLE ────────────────────────────────────────────── */
  App.themeToggle = function () {
    const btn  = App.$('#theme-toggle');
    const html = document.documentElement;
    const PREF = 'tse-theme';

    const saved  = localStorage.getItem(PREF);
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme  = saved || system;

    html.setAttribute('data-theme', theme);
    updateIcon(theme);

    App.on(btn, 'click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem(PREF, next);
      updateIcon(next);
    });

    function updateIcon(t) {
      if (!btn) return;
      btn.innerHTML = t === 'dark'
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      btn.setAttribute('aria-label', `Switch to ${t === 'dark' ? 'light' : 'dark'} mode`);
    }
  };


  /* ─── 04. HERO CANVAS (Brownian Motion Math Symbols) ─────────────── */
  App.heroCanvas = function () {
    const canvas = App.$('#hero-canvas');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const SYMBOLS = ['∫', '∂', '∑', 'μ', 'σ', 'λ', 'π', 'Ω', 'θ', 'ρ', 'φ', 'β', '∇', 'Δ', 'α', 'ψ', 'ε', 'ζ', 'η', 'κ'];
    let particles = [];
    let animId;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function makeParticle() {
      return {
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        vx:      (Math.random() - 0.5) * 0.25,
        vy:      (Math.random() - 0.5) * 0.25,
        sym:     SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        size:    14 + Math.random() * 22,
        opacity: 0.02 + Math.random() * 0.055,
        phase:   Math.random() * Math.PI * 2,
        speed:   0.004 + Math.random() * 0.008,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: 45 }, makeParticle);
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;

      for (const p of particles) {
        // Brownian-style drift
        p.vx += (Math.random() - 0.5) * 0.015;
        p.vy += (Math.random() - 0.5) * 0.015;
        p.vx *= 0.98; // damping
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.speed;

        // Wrap
        if (p.x < -60) p.x = canvas.width  + 60;
        if (p.x > canvas.width  + 60) p.x = -60;
        if (p.y < -60) p.y = canvas.height + 60;
        if (p.y > canvas.height + 60) p.y = -60;

        const op = p.opacity + Math.sin(p.phase) * 0.012;
        ctx.save();
        ctx.globalAlpha = Math.max(0, op);
        ctx.font = `${p.size}px 'EB Garamond', Georgia, serif`;
        ctx.fillStyle = '#E8A500';
        ctx.fillText(p.sym, p.x, p.y);
        ctx.restore();
      }

      animId = requestAnimationFrame(tick);
    }

    init();
    tick();

    window.addEventListener('resize', () => {
      resize();
      particles.forEach(p => {
        p.x = Math.min(p.x, canvas.width);
        p.y = Math.min(p.y, canvas.height);
      });
    }, { passive: true });

    // Pause on visibility change to save battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else tick();
    });
  };


  /* ─── 05. COUNTER ANIMATIONS ──────────────────────────────────────── */
  App.counterAnimations = function () {
    App.$$('[data-count]').forEach(el => {
      const target   = +el.dataset.count;
      const suffix   = el.dataset.suffix || '';
      const duration = 1400;
      let start = null;
      let started = false;

      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
        const current  = Math.round(eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !started) {
            started = true;
            requestAnimationFrame(step);
            obs.disconnect();
          }
        });
      }, { threshold: 0.5 });

      obs.observe(el);
    });
  };


  /* ─── 06. INTERSECTION OBSERVER (Fade-ins) ────────────────────────── */
  App.observeAnimations = function () {
    if (!('IntersectionObserver' in window)) {
      App.$$('.animate-in').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    App.$$('.animate-in').forEach(el => obs.observe(el));
  };


  /* ─── 07. READING PROGRESS ────────────────────────────────────────── */
  App.readingProgress = function () {
    const bar  = App.$('#reading-progress-fill');
    const prog = App.$('#reading-progress');
    if (!bar || !prog) return;

    function update() {
      const article = App.$('article') || App.$('.article-body');
      if (!article) return;

      const rect   = article.getBoundingClientRect();
      const total  = rect.height;
      const scroll = Math.max(0, -rect.top);
      const pct    = Math.min(100, (scroll / (total - window.innerHeight)) * 100);
      bar.style.width = pct + '%';
      prog.style.opacity = (pct > 0 && pct < 100) ? '1' : '0';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  };


  /* ─── 08. TABLE OF CONTENTS ───────────────────────────────────────── */
  App.tableOfContents = function () {
    const toc      = App.$('#toc-list');
    const article  = App.$('.prose');
    if (!toc || !article) return;

    const headings = App.$$('h2, h3', article);
    if (headings.length === 0) return;

    // Build TOC
    const frag = document.createDocumentFragment();
    headings.forEach((h, i) => {
      if (!h.id) h.id = `heading-${i}`;
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      a.className = h.tagName === 'H3' ? 'toc-h3' : '';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${h.id}`);
      });
      li.appendChild(a);
      frag.appendChild(li);
    });
    toc.appendChild(frag);

    // Highlight active heading on scroll
    const links = App.$$('#toc-list a');

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = toc.querySelector(`a[href="#${id}"]`);
        if (link) link.classList.toggle('active', entry.isIntersecting);
      });
    }, { rootMargin: '-20% 0% -75% 0%' });

    headings.forEach(h => obs.observe(h));
  };


  /* ─── 09. BACK TO TOP ─────────────────────────────────────────────── */
  App.backToTop = function () {
    const btn = App.$('#back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };


  /* ─── 10. COOKIE BANNER ───────────────────────────────────────────── */
  App.cookieBanner = function () {
    const banner  = App.$('#cookie-banner');
    const acceptBtn = App.$('#cookie-accept');
    const dismissBtn = App.$('#cookie-dismiss');
    if (!banner) return;

    const KEY = 'tse-cookie-consent';
    if (localStorage.getItem(KEY)) {
      banner.classList.add('hidden');
      return;
    }

    setTimeout(() => banner.classList.remove('hidden'), 1200);

    function dismiss() {
      banner.classList.add('hidden');
      localStorage.setItem(KEY, '1');
    }

    App.on(acceptBtn, 'click', dismiss);
    App.on(dismissBtn, 'click', dismiss);
  };


  /* ─── 11. CODE BLOCK COPY BUTTON ─────────────────────────────────── */
  App.codeBlockCopy = function () {
    App.$$('.code-block__copy').forEach(btn => {
      App.on(btn, 'click', async () => {
        const pre  = btn.closest('.code-block')?.querySelector('pre');
        const code = pre?.querySelector('code')?.textContent || pre?.textContent || '';
        try {
          await navigator.clipboard.writeText(code.trim());
          btn.textContent = '✓ Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          btn.textContent = 'Error';
        }
      });
    });
  };


  /* ─── 12. SHARE BUTTONS ───────────────────────────────────────────── */
  App.shareButtons = function () {
    const url   = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    const twBtn = App.$('[data-share="twitter"]');
    const rdBtn = App.$('[data-share="reddit"]');
    const liBtn = App.$('[data-share="linkedin"]');
    const cpBtn = App.$('[data-share="copy"]');

    App.on(twBtn, 'click', () => window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      '_blank', 'width=550,height=450'
    ));

    App.on(rdBtn, 'click', () => window.open(
      `https://reddit.com/submit?url=${url}&title=${title}`,
      '_blank', 'width=600,height=600'
    ));

    App.on(liBtn, 'click', () => window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank', 'width=600,height=500'
    ));

    App.on(cpBtn, 'click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (cpBtn) {
          const orig = cpBtn.textContent;
          cpBtn.textContent = '✓ Copied!';
          setTimeout(() => cpBtn.textContent = orig, 2000);
        }
      } catch (e) {}
    });
  };


  /* ─── 13. MONTE CARLO RETIREMENT SIMULATOR ────────────────────────── */
  App.monteCarloCalc = function () {
    const widget = App.$('#mc-calc');
    if (!widget) return;

    const inputs = {
      portfolio:  App.$('#mc-portfolio'),
      monthly:    App.$('#mc-monthly'),
      returnPct:  App.$('#mc-return'),
      years:      App.$('#mc-years'),
    };

    const displays = {
      portfolio: App.$('#mc-portfolio-val'),
      monthly:   App.$('#mc-monthly-val'),
      return:    App.$('#mc-return-val'),
      years:     App.$('#mc-years-val'),
    };

    const runBtn   = App.$('#mc-run');
    const results  = App.$('#mc-results');
    const simCount = 1000;

    // Update display values on range change
    function updateDisplays() {
      if (displays.portfolio) displays.portfolio.textContent = '$' + (+inputs.portfolio.value).toLocaleString();
      if (displays.monthly)   displays.monthly.textContent   = '$' + (+inputs.monthly.value).toLocaleString();
      if (displays.return)    displays.return.textContent    = inputs.returnPct.value + '%';
      if (displays.years)     displays.years.textContent     = inputs.years.value + ' yrs';
    }

    Object.values(inputs).forEach(inp => {
      if (inp) inp.addEventListener('input', updateDisplays);
    });
    updateDisplays();

    // Run simulation
    App.on(runBtn, 'click', () => {
      const P  = +inputs.portfolio.value  || 100000;
      const C  = +inputs.monthly.value    || 1000;
      const R  = +inputs.returnPct.value  || 7;
      const Y  = +inputs.years.value      || 30;

      runBtn.disabled = true;
      runBtn.textContent = 'Simulating…';

      // Run async to avoid blocking UI
      setTimeout(() => {
        const res = simulate(P, C, R, Y, simCount);
        renderResults(res, P);
        runBtn.disabled = false;
        runBtn.textContent = '▶ Run Simulations';
      }, 20);
    });

    function simulate(portfolio, monthly, annualReturn, years, N) {
      const mu    = annualReturn / 100 / 12;  // monthly drift
      const sigma = 0.15 / Math.sqrt(12);      // ~15% annual vol, monthly
      const months = years * 12;
      const out    = [];

      for (let s = 0; s < N; s++) {
        let val = portfolio;
        for (let m = 0; m < months; m++) {
          // GBM step: V(t+1) = V(t) * exp((mu - 0.5*sigma^2)*dt + sigma*sqrt(dt)*Z)
          const z = randNormal();
          const r = Math.exp((mu - 0.5 * sigma * sigma) + sigma * z);
          val = val * r + monthly;
        }
        out.push(val);
      }

      out.sort((a, b) => a - b);

      return {
        p10: out[Math.floor(N * 0.10)],
        p25: out[Math.floor(N * 0.25)],
        p50: out[Math.floor(N * 0.50)],
        p75: out[Math.floor(N * 0.75)],
        p90: out[Math.floor(N * 0.90)],
        pFail: out.filter(v => v < portfolio * 0.5).length / N, // P(major loss)
        mean: out.reduce((a, b) => a + b, 0) / N,
      };
    }

    function randNormal() {
      // Box-Muller transform
      const u1 = 1 - Math.random();
      const u2 = 1 - Math.random();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    function fmt(n) {
      if (n >= 1e6)  return '$' + (n / 1e6).toFixed(2) + 'M';
      if (n >= 1e3)  return '$' + (n / 1e3).toFixed(0) + 'K';
      return '$' + Math.round(n).toLocaleString();
    }

    function renderResults(res, initial) {
      if (!results) return;
      const maxVal = res.p90;

      const rows = [
        { label: 'P10',  val: res.p10,  cls: 'red'   },
        { label: 'P25',  val: res.p25,  cls: 'orange' },
        { label: 'P50',  val: res.p50,  cls: 'yellow' },
        { label: 'P75',  val: res.p75,  cls: 'green'  },
        { label: 'P90',  val: res.p90,  cls: 'sky'    },
      ];

      results.innerHTML = `
        <div class="calc-results__title">Simulation Results (${simCount.toLocaleString()} paths)</div>
        <div class="percentile-rows">
          ${rows.map(r => `
            <div class="percentile-row">
              <span class="pct-label">${r.label}</span>
              <div class="pct-bar-track">
                <div class="pct-bar-fill" style="width:${(r.val/maxVal*100).toFixed(1)}%"></div>
              </div>
              <span class="pct-value" style="color:var(--${r.cls === 'red' ? 'red' : r.cls === 'orange' ? 'orange' : r.cls === 'yellow' ? 'gold' : r.cls === 'green' ? 'green' : 'sky'})">${fmt(r.val)}</span>
            </div>`).join('')}
        </div>
        <div class="calc-cta">
          Median outcome: <strong style="color:var(--green)">${fmt(res.p50)}</strong> · 
          Mean: <strong>${fmt(res.mean)}</strong>
          <br><br>
          <a href="pages/newsletter.html" class="btn btn--primary btn--sm">Get Full Python Model →</a>
        </div>
      `;

      // Animate bars in
      requestAnimationFrame(() => {
        results.querySelectorAll('.pct-bar-fill').forEach(b => {
          const w = b.style.width;
          b.style.width = '0';
          setTimeout(() => { b.style.transition = 'width 0.8s ease'; b.style.width = w; }, 50);
        });
      });
    }
  };


  /* ─── 13b. KELLY FRACTION EXPLORER (single-asset) ─────────────────── */
  App.kellyExplorer = function () {
    const widget = App.$('#kelly-single-calc');
    if (!widget) return;

    const muInput    = App.$('#ks-mu');
    const sigmaInput = App.$('#ks-sigma');
    const cInput     = App.$('#ks-c');

    const muVal    = App.$('#ks-mu-val');
    const sigmaVal = App.$('#ks-sigma-val');
    const cVal     = App.$('#ks-c-val');

    const fullKellyOut = App.$('#ks-full-kelly');
    const usedOut       = App.$('#ks-used');
    const growthValOut  = App.$('#ks-growth-val');
    const varValOut      = App.$('#ks-var-val');
    const growthBar      = App.$('#ks-growth-bar');
    const varBar         = App.$('#ks-var-bar');
    const marker      = App.$('#ks-marker');
    const markerLine  = App.$('#ks-marker-line');

    function render() {
      const mu    = +muInput.value / 100;
      const sigma = +sigmaInput.value / 100;
      const c     = +cInput.value;

      muVal.textContent    = muInput.value + '%';
      sigmaVal.textContent = sigmaInput.value + '%';
      cVal.textContent     = c.toFixed(2) + '×';

      const fullKelly  = mu / (sigma * sigma);       // f* = μ/σ²
      const used       = c * fullKelly;
      const growthRatio = c * (2 - c);                // g(c)/g_max, derived in article
      const varRatio    = c * c;

      fullKellyOut.textContent = (fullKelly * 100).toFixed(1) + '%';
      usedOut.textContent      = (used * 100).toFixed(1) + '%';
      growthValOut.textContent = (Math.max(0, growthRatio) * 100).toFixed(0) + '%';
      varValOut.textContent    = (varRatio * 100).toFixed(0) + '%';

      growthBar.style.width = Math.max(0, Math.min(100, growthRatio * 100)) + '%';
      varBar.style.width    = Math.min(100, varRatio * 100) + '%';

      // SVG marker follows the precomputed g(c)/g_max curve exactly
      const xPx = 40 + (c / 2.0) * 520;
      const yPx = 200 - Math.max(0, growthRatio) * 180;
      marker.setAttribute('cx', xPx.toFixed(1));
      marker.setAttribute('cy', yPx.toFixed(1));
      markerLine.setAttribute('x1', xPx.toFixed(1));
      markerLine.setAttribute('x2', xPx.toFixed(1));
    }

    [muInput, sigmaInput, cInput].forEach(inp => App.on(inp, 'input', render));
    App.$$('[data-preset]', widget).forEach(btn => {
      App.on(btn, 'click', () => { cInput.value = btn.dataset.preset; render(); });
    });

    render();
  };


  /* ─── 13c. MULTI-ASSET KELLY PORTFOLIO EXPLORER ───────────────────── */
  App.kellyMultiExplorer = function () {
    const widget = App.$('#kelly-multi-calc');
    if (!widget) return;

    // Gauss-Jordan inverse — verified against numpy.linalg.inv to 4 decimal
    // places on the exact example used here before shipping.
    function invertMatrix(M) {
      const n = M.length;
      const A = M.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
      for (let col = 0; col < n; col++) {
        let pivotRow = col;
        for (let r = col + 1; r < n; r++) {
          if (Math.abs(A[r][col]) > Math.abs(A[pivotRow][col])) pivotRow = r;
        }
        [A[col], A[pivotRow]] = [A[pivotRow], A[col]];
        const pivot = A[col][col];
        if (Math.abs(pivot) < 1e-12) return null;
        for (let j = 0; j < 2 * n; j++) A[col][j] /= pivot;
        for (let r = 0; r < n; r++) {
          if (r === col) continue;
          const factor = A[r][col];
          for (let j = 0; j < 2 * n; j++) A[r][j] -= factor * A[col][j];
        }
      }
      return A.map(row => row.slice(n));
    }

    function matVec(M, v) {
      return M.map(row => row.reduce((sum, val, j) => sum + val * v[j], 0));
    }

    // Fixed vol + correlation — matches the article's Python example exactly
    const vol  = [0.22, 0.15, 0.08];
    const corr = [
      [1.00, 0.40, 0.10],
      [0.40, 1.00, 0.05],
      [0.10, 0.05, 1.00],
    ];
    const cov     = vol.map((vi, i) => vol.map((vj, j) => vi * vj * corr[i][j]));
    const covInv  = invertMatrix(cov);
    const riskFree = 0.04;
    const labels   = ['stocks', 'bonds', 'cash'];

    const inputs = {
      stocks: App.$('#km-mu-stocks'),
      bonds:  App.$('#km-mu-bonds'),
      cash:   App.$('#km-mu-cash'),
      c:      App.$('#km-c'),
    };

    function render() {
      if (!covInv) return; // singular matrix guard, should never trigger with fixed inputs
      App.$('#km-mu-stocks-val').textContent = inputs.stocks.value + '%';
      App.$('#km-mu-bonds-val').textContent  = inputs.bonds.value + '%';
      App.$('#km-mu-cash-val').textContent   = inputs.cash.value + '%';
      App.$('#km-c-val').textContent = (+inputs.c.value).toFixed(2) + '×';

      const mu = [+inputs.stocks.value / 100, +inputs.bonds.value / 100, +inputs.cash.value / 100];
      const c  = +inputs.c.value;
      const excess    = mu.map(m => m - riskFree);
      const fullKelly = matVec(covInv, excess);
      const w         = fullKelly.map(x => x * c);

      const maxAbs = Math.max(...w.map(Math.abs), 0.01);
      w.forEach((wi, i) => {
        const pctEl = App.$(`#km-w-${labels[i]}-val`);
        const barEl = App.$(`#km-w-${labels[i]}`);
        pctEl.textContent = (wi * 100).toFixed(1) + '%';
        pctEl.style.color = wi < 0 ? 'var(--red)' : 'var(--text-primary)';
        barEl.style.width = Math.min(100, Math.abs(wi) / maxAbs * 100) + '%';
        barEl.style.opacity = wi < 0 ? '0.55' : '1';
      });

      App.$('#km-total').textContent = (w.reduce((a, b) => a + b, 0) * 100).toFixed(1) + '%';
    }

    Object.values(inputs).forEach(inp => App.on(inp, 'input', render));
    render();
  };


  /* ─── 14. NEWSLETTER FORMS ────────────────────────────────────────── */
  App.newsletterForms = function () {
    App.$$('.newsletter-form, #hero-form').forEach(form => {
      App.on(form, 'submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]')?.value?.trim();
        const btn   = form.querySelector('button[type="submit"]');
        if (!email || !btn) return;

        const orig = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Subscribing…';

        // In production: replace this with your actual Beehiiv / ConvertKit endpoint
        // await fetch('https://your-api.com/subscribe', { method:'POST', body: JSON.stringify({email}) })

        await new Promise(r => setTimeout(r, 800)); // simulate network

        // Show success
        form.innerHTML = `
          <div style="text-align:center; padding: 1rem 0; color: var(--green); font-weight:600;">
            ✓ You're subscribed! Check your inbox for the Quant Toolkit.
          </div>`;
      });
    });
  };


  /* ─── 15. ARTICLE FILTER (Category Pages) ─────────────────────────── */
  App.articleFilter = function () {
    const filterBtns = App.$$('[data-filter]');
    const cards      = App.$$('[data-category]');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
      App.on(btn, 'click', () => {
        const cat = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        cards.forEach(card => {
          const show = cat === 'all' || card.dataset.category === cat;
          card.style.display = show ? '' : 'none';
          card.style.animation = show ? 'fadeIn 0.3s ease' : '';
        });
      });
    });
  };


  /* ─── 16. UTILITIES ───────────────────────────────────────────────── */
  // Smooth anchor links
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Lazy-load images
  if ('loading' in HTMLImageElement.prototype) {
    App.$$('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  } else {
    const imgObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObs.unobserve(img);
        }
      });
    });
    App.$$('img[data-src]').forEach(img => imgObs.observe(img));
  }

  // Reading time estimator
  App.$$('[data-reading-time]').forEach(el => {
    const article = document.querySelector(el.dataset.readingTime);
    if (!article) return;
    const words = article.textContent.trim().split(/\s+/).length;
    const mins  = Math.max(1, Math.ceil(words / 220));
    el.textContent = `${mins} min read`;
  });

  // DOMContentLoaded — boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }

})();
