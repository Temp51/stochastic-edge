# The Stochastic Edge

Quantitative finance blog — static HTML/CSS/JS, zero framework, zero build step, zero hosting cost required.

## Status

**Core site: complete and navigable.** 3 published articles (Monte Carlo Retirement, Kelly Criterion, Markov Chain Regime Detection), 4 category hubs, all legal pages, newsletter capture page, 404, SEO files (robots.txt, sitemap.xml, manifest.json). 19 more articles queued in the Fedora Launch Lab PDF's Part B backlog.

**Not yet wired:** the newsletter form is front-end only — it shows a fake success message but does not send data anywhere yet. See "Connect a real email provider" below before you rely on it.

## Folder structure

```
stochastic-edge/
├── index.html                              → homepage
├── 404.html                                → error page
├── manifest.json                           → PWA manifest
├── robots.txt                              → crawler rules
├── sitemap.xml                             → SEO sitemap
├── README.md                               → this file
├── src/
│   ├── css/main.css                        → entire design system (one file, ~30 sections)
│   ├── js/main.js                          → entire JS engine (nav, theme, Monte Carlo calc, TOC, etc.)
│   └── images/                             → empty — add real images here (see below)
├── articles/
│   ├── template.html                       → copy this to start a new article
│   └── monte-carlo-retirement-simulation.html   → published article #1
├── categories/
│   ├── index.html                          → Strategies hub
│   ├── ai-tools.html
│   ├── theory.html
│   └── python.html
└── pages/
    ├── newsletter.html                     → lead magnet / email capture
    ├── about.html                          → author bio (⚠ edit before publishing, see below)
    ├── contact.html
    ├── privacy-policy.html                 → template, needs legal review
    ├── affiliate-disclosure.html
    └── disclaimer.html
```

## Run it locally

No build step. No `npm install`. It's plain HTML/CSS/JS — open it or serve it.

```bash
cd stochastic-edge
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Before you publish — 3 things that need your real information

1. **`pages/about.html`** — contains a placeholder callout telling you to replace it with your real, honest background. Financial content lives or dies on trust; don't skip this.
2. **`pages/contact.html`** — replace `hello@thestochasticedge.com` with a real inbox you check.
3. **`pages/privacy-policy.html`** — marked as a template. Have it reviewed (a generator like Termly, or a lawyer) before collecting real visitor data at any scale, especially if you'll have EU or California traffic.

## Connect a real email provider

Right now, submitting the newsletter form just shows a fake "you're subscribed" message (see `App.newsletterForms` in `src/js/main.js`). To actually collect subscribers:

1. Create a free account at [beehiiv.com](https://www.beehiiv.com) or [convertkit.com](https://convertkit.com).
2. Get your embed form's API endpoint or embed code from their dashboard.
3. In `src/js/main.js`, find the `newsletterForms` function and replace the simulated `setTimeout` with a real `fetch()` call to that endpoint.

## Add real images

`src/images/` is currently empty — article cards use a CSS placeholder (a large math symbol on a gradient background) instead of photos. To add real images:

- Drop files into `src/images/articles/`, `src/images/authors/`, or `src/images/icons/`
- Replace `<div class="article-card__thumb article-card__thumb--placeholder">` blocks with `<img src="..." alt="...">` inside `.article-card__thumb`
- For the PWA icons referenced in `manifest.json` (`icon-192.png`, `icon-512.png`), generate them from a logo using [realfavicongenerator.net](https://realfavicongenerator.net) and place in `src/images/icons/`

## Deployment

This is a static site — it does not need PHP, a database, or WordPress. Recommended free hosts, in order of simplicity:

- **GitHub Pages** — free, connects directly to a `git push`, custom domain supported.
- **Cloudflare Pages** — free, fastest global CDN, drag-and-drop or git-connected.
- **Netlify** — free tier, drag-and-drop deploy is genuinely drag-and-drop.

Do not migrate this to WordPress. WordPress adds hosting cost ($5–15/mo minimum), a database, plugin maintenance, and security patching — none of which this project needs, and all of which slow down the page speed that SEO rankings partly depend on.

## Adding a new article

1. Copy `articles/template.html` to `articles/your-new-slug.html`
2. Fill in the `<title>`, meta description, canonical URL, and JSON-LD schema block at the top
3. Replace the placeholder sections in `<article class="prose">` with real content
4. Add a card for it to `index.html`, the relevant `categories/*.html` page, and `sitemap.xml`

## License

All code in this repository is yours to use, modify, and deploy without restriction.
