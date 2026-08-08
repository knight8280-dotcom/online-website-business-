# Knight Web Studio — business website

A complete, production-ready marketing website for a web design & development
business. Plain HTML, CSS and JavaScript — **no build step, no dependencies, no
npm install**. Open `index.html` and it works.

## What's included

| Section | Purpose |
| --- | --- |
| Hero | Headline, positioning, two calls to action, CSS-drawn browser mockup |
| Stats | Animated credibility numbers |
| Services | Six service cards (design, e-commerce, SEO, care, redesigns, branding) |
| Work | Six case-study cards with a results line — the part that sells |
| Process | Four-step "no surprises" explainer |
| Pricing | Three tiers with a highlighted recommended plan |
| Testimonials | Three client quotes |
| FAQ | Seven accordion answers to the objections that stall a sale |
| Contact | Validated enquiry form with spam honeypot |
| Footer | Navigation, contact details, social links |

Also built in: dark/light theme toggle (remembers the visitor's choice), sticky
header with active-section highlighting, mobile menu, scroll reveal animations,
`prefers-reduced-motion` support, keyboard accessibility, skip link, Open Graph
tags for link previews, and JSON-LD structured data for Google.

## File layout

```
index.html              All page content
404.html                Not-found page
assets/css/styles.css   All styling (design tokens at the top)
assets/js/main.js       Theme, nav, reveals, form handling
robots.txt              Search engine directives
sitemap.xml             Sitemap for search engines
.nojekyll               Tells GitHub Pages to serve the files as-is
```

## Make it yours

Everything you need to change is marked `EDIT ME` in the source.

### 1. Business name

Find-and-replace `Knight Web Studio` in `index.html`. The header and footer
logo splits it into two parts — search for `brand-name` and edit both.

### 2. Contact details

Replace these placeholders everywhere they appear in `index.html` **and** in
`assets/js/main.js` (the email is used in the form's fallback message):

- `hello@example.com`
- `+1 (555) 000-0000` and `+15550000000` (the `tel:` link)
- `https://example.com/` in the `canonical`, Open Graph and JSON-LD blocks
- The `href="#"` values on the three footer social links

### 3. Make the contact form actually send email

The form posts to a form-handling service, which is what lets a static site
receive email without a server. Free tiers are plenty for a small business.

1. Sign up at [Formspree](https://formspree.io) (or Getform, Basin, Web3Forms).
2. Create a form and copy your endpoint URL.
3. In `index.html`, replace `https://formspree.io/f/YOUR_FORM_ID` in the
   `<form action="...">` attribute.

Until you do this, submitting the form opens the visitor's email client
pre-filled instead — so no enquiry is ever silently dropped.

### 4. Colours

Open `assets/css/styles.css` and edit the four brand variables at the top:

```css
--brand:        #6d8bff;   /* primary */
--brand-strong: #4f6ef7;   /* gradient end, hover states */
--brand-soft:   #a5b8ff;   /* eyebrow text, icons */
--accent:       #46e0c0;   /* ticks, highlights, stats */
```

The light theme has its own overrides in the `[data-theme="light"]` block just
below.

### 5. Your real work and prices

The first project card is **Corbel Books** (corbelbooks.com) — a real, live
project, marked `Featured`, with a link out to the site. It's described
factually rather than with invented metrics, since it's a site you actually own.

The other five project cards, the three testimonials and the three price tiers
are realistic placeholders. Swap them for real ones before launch — the results
line on each card (`↑ 210% online orders`) is the single most persuasive element
on the page, so make those true and specific. If you don't have five more
projects yet, delete the extra cards; three real ones beat six half-invented
ones.

To use real screenshots instead of the coloured gradient thumbnails, replace
the `<div class="work-thumb thumb-a">` element with an image:

```html
<img class="work-thumb" src="assets/img/bloom-vine.jpg" alt="Bloom & Vine homepage" loading="lazy" width="800" height="500">
```

### 6. Social preview image

Create a 1200×630px image at `assets/img/og-image.png` — that's what shows up
when someone shares your link on LinkedIn, WhatsApp or Slack.

## Run it locally

Just open `index.html` in a browser. If you'd rather use a local server (which
matches production more closely):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages + knightwebstudio.com

The repo is already configured for this: the `CNAME` file names the domain, and
`index.html`, `sitemap.xml` and `robots.txt` all point at `knightwebstudio.com`.
Two steps remain, and only the first needs the GitHub UI.

### Step 1 — turn Pages on

Repo **Settings → Pages → Source: "Deploy from a branch"** → branch `main`,
folder `/ (root)` → **Save**.

Because `CNAME` is committed, GitHub reads `knightwebstudio.com` from it and
fills in the Custom domain field automatically. Nothing to type.

### Step 2 — add the DNS records at IONOS

In IONOS: **Domains & SSL → knightwebstudio.com → DNS**. Delete any existing
A records or IONOS parking records for `@` first, then add:

**Four A records**, host `@`:

| Type | Host | Points to |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

**One CNAME record**, host `www`:

| Type | Host | Points to |
| --- | --- | --- |
| CNAME | `www` | `knight8280-dotcom.github.io` |

The CNAME target is the *user* domain — no repository name, no `https://`, no
trailing slash. That is the single most common mistake.

Optionally add four AAAA records on `@` for IPv6: `2606:50c0:8000::153`,
`2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

### Step 3 — enforce HTTPS

Once DNS propagates (30 minutes to a few hours), return to Settings → Pages and
tick **Enforce HTTPS**. The certificate is issued automatically and free.

**Do not use IONOS "Domain Forwarding"/redirect.** It appears to be the simpler
option and it breaks both HTTPS and search rankings. Use the DNS records above.

### Other hosts

Netlify, Cloudflare Pages and Vercel all work too — connect the repo with an
empty build command and publish directory `.`, then follow that host's own DNS
instructions instead of the records above.

## Before you launch — checklist

- [ ] Email and phone replaced everywhere (still `hello@example.com` / `+1 555…`)
- [ ] Form endpoint configured and a test enquiry received
- [ ] Real projects, prices and testimonials in place
- [x] Domain wired through `CNAME`, `index.html`, `sitemap.xml`, `robots.txt`
- [ ] GitHub Pages enabled and IONOS DNS records added
- [ ] Social preview image added
- [ ] Checked on a real phone
- [ ] Google Search Console set up and sitemap submitted
- [ ] Analytics added (Plausible or Fathom if you'd rather skip a cookie banner)

## Browser support

Current Chrome, Edge, Firefox and Safari. Uses `color-mix()` and
`backdrop-filter`; on older browsers the layout and content stay fully intact,
only some visual polish falls away.
