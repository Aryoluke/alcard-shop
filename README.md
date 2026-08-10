# Tagmi — NFC Business Card Business

The complete kit for selling affordable NFC business cards:

| What | Where |
|---|---|
| Business plan & pricing | `business-plan.md` |
| Profile page generator | `generator/build.py` + `generator/template/` |
| Customer configs | `generator/customers/*.json` |
| Generated profiles (deploy these) | `profiles/<slug>/` |
| Order website (multi-page) | `storefront/` — `index.html` (home, live demo), `cards.html` (pricing), `order.html` (order form), `faq.html`, `privacy.html`, `model.html` (demo profile), `style.css`, `site.js` |

---

## 1. Taking an order (your workflow)

1. Customer orders via WhatsApp or the storefront form.
2. Collect their details: name, photo, job title, email(s), phone(s), socials, accent colour (optional), music (optional).
3. Save a config JSON: copy `generator/customers/example.json` to `generator/customers/<name>.json` and fill it in. Drop their photo next to it.
4. Build the profile:

   ```
   cd generator
   python build.py customers/jane-smith.json
   ```

   → creates `profiles/jane-smith/` (index.html, tracker.js, photo, vCard). Takes 1 second.

5. Deploy (see section 3), then programme their NFC sticker (see section 4).
6. Post the card + email them their digital QR code, tell them "tap your phone on the card and approve the prompt — you'll see your page".

**Time per order: ~30 minutes of actual work.** Charge them, keep the page URL, done.

---

## 2. Editing a customer's profile later ("free updates")

1. Change the values in their config JSON.
2. Re-run `python build.py customers/jane-smith.json`.
3. Push the updated `profiles/jane-smith/` folder to the hosting repo (same URL, content updates instantly).

---

## 3. Deploying customer profiles (recommended: one private repo)

**One private GitHub repo holds every customer's profile; Cloudflare Pages deploys it.**

Why this beats one-public-repo-per-customer (the old `chaitalimehta-info` pattern):
- The repo is **private** → your Telegram bot token in `tracker.js` stays secret
- One deploy, one place to manage, cleaner URLs: `tagmi.is-a.dev/jane-smith/`
- GitHub Pages cannot do this (it only serves public repos on the free tier)

Setup (one time):

1. Create a **private** repo on GitHub, e.g. `tagmi-profiles` (or `profiles`).
2. Clone it locally, then copy every customer folder from `profiles/` into it:
   ```
   cd tagmi-profiles
   robocopy "C:\Users\Aryan Mehta\PawWork\nfc-business\profiles" . /E
   git add .
   git commit -m "Jane Smith profile"
   git push origin main
   ```
3. In Cloudflare Pages: **Create → Pages → Connect to Git → GitHub → tagmi-profiles**.
   Build settings: framework = None, root directory = leave empty.
   Site name: `tagmi` → customer URLs are `https://tagmi.pages.dev/jane-smith/`
   (once the is-a.dev domain is attached: `https://tagmi.is-a.dev/jane-smith/`).

Every `git push` auto-redeploys. New customer = build with the generator, copy the
folder in, push. Done.

> Your two live models (`nfc-page`, `chaitalimehta-info`) can keep running as-is;
> just don't create any more public repos for customer pages.

**Test before shipping (this is your quality check):**
- iPhone: Settings → make sure NFC is on; hold card to the top of the phone.
- Android: hold card to the back. Tap opens the page.
- Also scan the digital QR code once — same page.

---

## 4. Programming the NFC sticker

1. Install **NFC Tools** (free, iOS + Android) on a phone that can *write* NFC (most Androids; iPhones can write only with the NFC Tools app on iPhone 7+).
2. Open the app → **Write → Add a record → URL** → paste the customer's profile URL
   (e.g. `https://tagmi.pages.dev/jane-smith/`).
3. Hold the sticker against the writer phone until it writes.
4. Done. Test with a *different* phone (writing phone can't read its own tag).

> **iPhone tip:** iPhones want a direct URL. Do NOT use URL shorteners or
> redirects — write the full `github.io` URL directly, or iOS may refuse.

---

## 5. Brand & launch checklist (do before selling)

- [ ] **New Telegram bot** — create a fresh bot at @BotFather (do NOT reuse the token
      in your old public repos — it is exposed). Put the new token at the top of
      `generator/tracker.js`. Every tap then pings your Telegram.
- [ ] **WhatsApp business number** — change `WHATSAPP_NUMBER` in `storefront/order.html`
      (placeholder: 447777940152).
- [x] **Brand name** — **Tagmi** chosen (tag + me). Verified: no NFC company
      of that name exists, and `tagmi.is-a.dev` is free. Nearest neighbours
      avoided: TapID, TapMate, Tago, Kartatek, Kardone, OneKard.
- [ ] **Privacy policy** — one page, plain English: what the tracker collects
      (device type, country, page views — nothing else), no cookies, contact email.
      Link it from the storefront footer and profile pages.
- [ ] **Refund policy** — "if it doesn't work on your phone we fix or refund".
- [ ] Decide hosting: customer profiles on GitHub Pages is free, but URLs look like
      `github.io/jane-smith`. Phase 3 of the plan: buy a domain (~£10/yr) and use
      subdomains (card.yourbrand.co.uk/jane) — looks far more premium.

---

## 6. Deploying the storefront

The order site is a static multi-page site (home / cards & pricing / order / FAQ /
privacy) with WhatsApp ordering — no backend, no subscriptions.

**Free & permanent setup (recommended): Cloudflare Pages + is-a.dev domain.**
Everything is prepared in the `hosting/` folder — follow
[`hosting/README-deploy-shop.md`](hosting/README-deploy-shop.md):

1. Upload `hosting/storefront-upload.zip` to Cloudflare Pages (free, unlimited bandwidth, no card) → live instantly at `tagmi.pages.dev`
2. Submit `hosting/tagmi.is-a.dev.json` as a PR to the is-a.dev registry (free custom domain, `tagmi.is-a.dev`)
3. Link the domain to the project via the official helper at cf-pages.is-a.dev

Fallback: push the `storefront/` folder to a GitHub Pages repo (free, URL is
`https://<YOU>.github.io/<repo>/`).

---

## 7. Files explained

| File | Purpose |
|---|---|
| `generator/template/index.html` | Profile page design (based on your nfc-page) with `__PLACEHOLDERS__` |
| `generator/tracker.js` | GDPR-safe tap analytics → Telegram (no autofill capture, no fingerprinting) |
| `generator/build.py` | Fills the template from a config JSON, writes vCard, copies photo + tracker |
| `generator/customers/example.json` | Template customer config |
| `storefront/` | Order site (multi-page): home, cards & pricing, order form with live total, FAQ, privacy, `model.html` (your live demo profile) |
| `business-plan.md` | Full plan: pricing, margins, market, roadmap, risks |

> **Security note:** your old repos (`nfc-page`, `chaitalimehta-info`) contain a
> Telegram bot token in plain text in public files. Rotate it (BotFather) or
> delete those repos when you're done with them. The clean `tracker.js` in this
> project is the replacement — use it from now on.
