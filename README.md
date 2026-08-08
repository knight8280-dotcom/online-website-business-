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

## Deploy

Any static host works. Three easy options:

**GitHub Pages** — Settings → Pages → Source: *Deploy from a branch* → pick your
branch and `/ (root)`. Live in about a minute at
`https://<username>.github.io/<repo>/`.

**Netlify** — drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop),
or connect the repo. No build command, publish directory `.`.

**Cloudflare Pages / Vercel** — connect the repo, leave the build settings empty.

Then point your own domain at it in the host's dashboard, and update the URLs in
`sitemap.xml`, `robots.txt` and the `<head>` of `index.html`.

## Before you launch — checklist

- [ ] Business name, email and phone replaced everywhere
- [ ] Form endpoint configured and a test enquiry received
- [ ] Real projects, prices and testimonials in place
- [ ] `https://example.com/` replaced in `index.html`, `sitemap.xml`, `robots.txt`
- [ ] Social preview image added
- [ ] Checked on a real phone
- [ ] Google Search Console set up and sitemap submitted
- [ ] Analytics added (Plausible or Fathom if you'd rather skip a cookie banner)

## Browser support

Current Chrome, Edge, Firefox and Safari. Uses `color-mix()` and
`backdrop-filter`; on older browsers the layout and content stay fully intact,
only some visual polish falls away.
