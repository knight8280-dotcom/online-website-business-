# Knight Web Studio — business website

A complete, production-ready marketing website for a web design & development
business. Plain HTML, CSS and JavaScript — **no build step, no dependencies, no
npm install**. Open `index.html` and it works.

## What's included

| Section | Purpose |
| --- | --- |
| Hero | Headline, positioning, two calls to action, CSS-drawn browser mockup |
| Services | Six service cards (design, e-commerce, SEO, care, redesigns, branding) |
| Work | Three real, live projects with screenshots and links out |
| Process | Four-step "no surprises" explainer |
| Pricing | Three tiers, plus a $200/month care-plan panel |
| FAQ | Eight accordion answers to the objections that stall a sale |
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
assets/img/             Project screenshots (work-*.jpg)
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

The site lists `hello@knightwebstudio.com`, in `index.html` (contact list,
footer, JSON-LD) and in `assets/js/main.js` (the form's fallback message).
**That mailbox does not exist yet** — create it at IONOS, which is free with the
domain, or change the address in those two files.

There is deliberately no phone number: the placeholder `555` one was removed
rather than shipped. To add a real one, put it back in the contact list and
footer, and add `"telephone"` to the JSON-LD block.

Still to replace: the `href="#"` values on the three footer social links.

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
--accent:       #46e0c0;   /* ticks, prices, result lines */
```

The light theme has its own overrides in the `[data-theme="light"]` block just
below. `--brand-soft` and `--accent` are deliberately *darker* there: their dark
theme values fail contrast on a light background. If you change one, change both
and re-check.

### 5. Your work

The Work section holds three real, live projects, each with a screenshot taken
from the site itself, a `Live` badge and a link out:

| Project | Image source |
| --- | --- |
| Corbel Books | its own Open Graph card |
| Smilys Softwash | its own before/after roof photo |
| GamersPulseHQ | its own Open Graph card |

Images live in `assets/img/work-*.jpg`, all 1200px wide and under 90 KB. To add
a fourth project, copy one `<article class="work-card">` block in `index.html`,
drop a matching image in `assets/img/`, and update the text. The grid reflows on
its own.

All descriptions are factual — taken from each site's own copy — with no
invented metrics. Keep it that way: a result line you can't defend is worse than
no result line.

### 5b. Prices are still mine, not yours

The three project tiers (`$1,500` / `$4,000` / `$8,000`) are my suggested
starting points, not numbers you've confirmed. The `$200/month` care plan is
the one figure you set. Review the tiers before you send anyone here.

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

- [ ] Create the `hello@knightwebstudio.com` mailbox (free with the IONOS domain)
- [ ] Confirm the three project price tiers
- [ ] Add a phone number, or leave it off — the fake one was removed
- [ ] Form endpoint configured and a test enquiry received
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
