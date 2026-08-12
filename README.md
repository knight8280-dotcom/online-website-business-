# Knight Web Studio — business website

A complete, production-ready marketing website for a web design & development
business. Plain HTML, CSS and JavaScript — **no build step, no dependencies, no
npm install**. Open `index.html` and it works.

## What's included

| Section | Purpose |
| --- | --- |
| Hero | Headline, two calls to action, and a Live work panel of real projects |
| Services | Six service cards (design, e-commerce, SEO, care, redesigns, branding) |
| Work | Three real, live projects with screenshots and links out |
| Process | Four-step "no surprises" explainer |
| Pricing | Three project tiers, automation add-ons, three care tiers |
| FAQ | Eight accordion answers to the objections that stall a sale |
| Contact | Validated enquiry form with spam honeypot |
| Footer | Navigation, contact details, privacy policy link |
| Privacy | `privacy.html` — accurate to what the site actually collects |

Also built in: dark/light theme toggle (remembers the visitor's choice), sticky
header with active-section highlighting, mobile menu, scroll reveal animations,
`prefers-reduced-motion` support, keyboard accessibility, skip link, Open Graph
tags for link previews, and JSON-LD structured data for Google.

## File layout

```
index.html                All page content
privacy.html              Privacy policy (linked from the footer)
404.html                  Not-found page
favicon.ico               Fallback favicon (16/32/48 px) for older browsers
assets/css/styles.css     All styling (design tokens at the top)
assets/js/main.js         Theme, nav, reveals, form handling
assets/img/               Project screenshots (work-*.jpg), logo, icons
.well-known/security.txt  Standard contact point for security reports
robots.txt                Search engine directives
sitemap.xml               Sitemap for search engines (both pages)
.nojekyll                 Tells GitHub Pages to serve the files as-is
```

## Make it yours

Everything you need to change is marked `EDIT ME` in the source.

### 1. Business name and logo

The wordmark reads **Knight Web Studio** in full, in one weight and one colour,
in the header and footer — search for `brand-name` and edit both occurrences.

The logo is a shield containing a K: *knight* for the name, and protection for
the care plans. It lives in three places:

- inline SVG in the header and footer, themed through `--brand` (shield) and
  `--on-brand` (the K), so it inverts correctly in light and dark
- `assets/img/logo.svg` — standalone, used for the SVG favicon
- `assets/img/apple-touch-icon.png` — 180×180 PNG for iOS home-screen
  bookmarks (iOS does not accept SVG here), on a `#0b1020` background
- `favicon.ico` — 16/32/48 px fallback for browsers without SVG favicon support
- baked into `assets/img/og-image.png`

If the logo changes, regenerate the PNG and ICO from `logo.svg` (any SVG
rasteriser works — e.g. `cairosvg`), keeping the sizes above.

It stays legible down to 16px. If you change `--brand`, the inline mark follows
automatically, but `logo.svg` has its colours hard-coded and needs editing.

### 2. Contact details

The contact address is `knightwebsitesllc@gmail.com`. It appears in
`index.html` (contact list, footer, JSON-LD) and in `assets/js/main.js` (the
form's mailto fallback and its error message) — change it in both files if it
ever moves.

There is deliberately no phone number: the placeholder `555` one was removed
rather than shipped. To add a real one, put it back in the contact list and
footer, and add `"telephone"` to the JSON-LD block.

The footer social icons were **removed** rather than shipped pointing at
`href="#"` — dead links undercut a studio selling professionalism. When real
profiles exist, restore the `.socials` block from git history (search for
`aria-label="LinkedIn"`); its CSS is still in `styles.css`. Add the profile
URLs to the JSON-LD `sameAs` array at the same time.

### 3. The contact form

The form posts to [Web3Forms](https://web3forms.com), which relays submissions
to `knightwebsitesllc@gmail.com`. Three hidden inputs configure it in
`index.html`:

```html
<input type="hidden" name="access_key" value="…">
<input type="hidden" name="subject"    value="New enquiry from knightwebstudio.com">
<input type="hidden" name="from_name"  value="Knight Web Studio website">
```

The access key is **public by design** — it sits in the page source, which is
how a static site receives mail without a server. It is not a credential.

**Spam protection**, in three layers:

1. A `botcheck` honeypot checkbox — hidden from people, and Web3Forms discards
   any submission where it is set.
2. Web3Forms' own server-side spam checks, on by default.
3. **hCaptcha**, using Web3Forms' shared zero-config sitekey
   (`50b2fe65-b00b-4b9e-ad62-3ba471098be2`) — no account or keys needed.
   It is loaded **on demand** (when the contact section nears the viewport, or
   on first focus in the form), not with the page. A captcha iframe present at
   load can take focus and drag the scroll position down the page, and it also
   put a third-party request on the critical path for every visitor.

> **hCaptcha must also be switched on in the Web3Forms dashboard.** The widget
> on the page stops casual bots, but only the dashboard setting makes the
> server *reject* submissions without a valid token. Without it, a bot posting
> straight to the API still gets through.

If hCaptcha's script fails to load, the form still submits rather than trapping
a real prospect behind a broken widget — the server-side check remains the
authority.

**If the POST fails for any reason** — bad key, network drop, service outage —
`assets/js/main.js` opens the visitor's email client with the enquiry
pre-filled and *deliberately does not clear the form*, so nothing they typed is
lost.

Note that Web3Forms only accepts submissions from a browser. Testing with curl
returns HTTP 403 ("use our API in client side"); that is expected, not a
misconfiguration. Test from the live site instead.

To switch providers, change the `action` URL and remove the three hidden
inputs. Basin and Formspree work with the existing JavaScript unchanged.

### 4. Colours

Open `assets/css/styles.css` and edit the four brand variables at the top:

```css
--brand:        #6d8bff;   /* primary */
--brand-strong: #2c46c4;   /* button hover, deep accents */
--brand-soft:   #a5b8ff;   /* eyebrow text, icons */
--accent:       #46e0c0;   /* ticks, prices, result lines */
```

The light theme has its own overrides in the `[data-theme="light"]` block just
below. Three tokens differ deliberately between themes and are easy to break:

- `--brand-soft` and `--accent` are *darker* in light theme — their dark-theme
  values fail contrast on a light background.
- `--on-brand` is the text colour used **on** brand-filled surfaces (buttons,
  the logo mark, the "Most popular" flag). It is dark ink in dark theme,
  because white on the dark theme's brand blue is only 3.1:1.
- `--band` is the CTA band's background, deep enough to carry white in both.

If you change the brand colour, re-check all three.

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

### 5b. Pricing

Current prices, set against 2026 market research:

| Item | Price | Market position |
| --- | --- | --- |
| Starter | from $2,000 | Freelancers charge $300–$3,500 *per page* |
| Business | from $4,000 | Most professional builds land $3,000–$15,000 |
| Commerce | from $8,000 | Configured store builds run $3,000–$10,000 |
| Automation add-ons | from $750 | Booking/CRM integration runs $500–$3,000 |
| Care — Essential | $200/mo | Quality care plans band at $199–$599/mo |
| Care — Growth | $350/mo | |
| Care — Commerce | $600/mo | |

Starter was raised from $1,500 because three pages for $1,500 undercut what
freelancers charge for one. Each price appears once in `index.html`; the care
figures also appear in the FAQ answer about care plans.

### 6. Social preview image

`assets/img/og-image.png` (1200×630) is what appears when someone shares your
link on LinkedIn, WhatsApp or Slack. It carries the logo, the headline and the
domain. To regenerate it after a copy or brand change, rebuild it from the same
markup used to produce it and re-export at 1200×630.

## Run it locally

Just open `index.html` in a browser. If you'd rather use a local server (which
matches production more closely):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages + knightwebstudio.com

**This is already done and live at https://knightwebstudio.com** with a
Let's Encrypt certificate. The steps below are recorded for reference, or for
setting the same thing up on another domain.

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

- [ ] Add a phone number, or leave it off — the fake one was removed
- [ ] Form endpoint configured and a test enquiry received
- [x] Domain wired through `CNAME`, `index.html`, `sitemap.xml`, `robots.txt`
- [ ] GitHub Pages enabled and IONOS DNS records added
- [x] Social preview image added
- [x] Privacy policy page (`privacy.html`), linked from the footer
- [x] Favicon fallback (`favicon.ico`) and Apple touch icon (PNG)
- [x] FAQ structured data (`FAQPage` JSON-LD) for rich results
- [ ] Checked on a real phone
- [ ] Google Search Console set up and sitemap submitted
- [ ] Analytics added (Plausible or Fathom if you'd rather skip a cookie banner)

## Worth adding next (needs real-world input)

These can't be faked and are the highest-value gaps left:

1. **Testimonials** — one sentence from each live client, with a name.
   Strongest possible addition to the page.
2. **An "about" block** — who you'll be working with, with a photo. Anonymous
   studios lose work to freelancers with a face.
3. **Email on your own domain** — e.g. `hello@knightwebstudio.com` (Google
   Workspace or Zoho). A Gmail address on a custom domain is a trust leak.
4. **A real scheduler** — the "Book a discovery call" CTA should open
   Cal.com/Calendly, not the contact form.
5. **Social profiles** — then restore the footer icons (see above).

## Browser support

Current Chrome, Edge, Firefox and Safari. Uses `color-mix()` and
`backdrop-filter`; on older browsers the layout and content stay fully intact,
only some visual polish falls away.
