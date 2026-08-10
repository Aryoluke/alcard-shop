# Tagmi — Storefront (review copy)

The shop for **Tagmi**, affordable NFC business cards (UK).

This repo exists so the storefront can be reviewed live before it goes to
Cloudflare Pages. The production copy lives in the main project at
`storefront/` — the deploy guide is `hosting/README-deploy-shop.md` there.

## Files

- `index.html` — home page (hero, how it works, includes, guarantee, CTA)
- `cards.html` — cards & pricing (tiers, add-ons, compare table)
- `order.html` — order form (quantities, live total, custom domain, WhatsApp)
- `faq.html` — questions people ask
- `privacy.html` — privacy policy (linked from the footer)
- `style.css` — shared stylesheet for all pages

## Order flow

No backend: the order form opens WhatsApp with a pre-filled message
(breakdown + total), offers payment by PayPal or card (config at the top of
`order.html`: `PAYPAL_USERNAME`, `STRIPE_LINK`), and optionally writes every
order to a Google Sheet via Sheety (`SHEETY_ENDPOINT`). Change
`WHATSAPP_NUMBER` in `order.html` to the real business number before launch.

Tiers (plain card + NFC sticker attached — decided Aug 2026; digital QR, not a QR card):
- Basic £6.99 — PVC card + sticker
- Standard £9.99 — metal card + sticker (most popular)
- Premium £14.99 — metal + custom domain
- Business — custom cards for companies, contact for a quote

Add-ons: extra sticker 50p, extra card £1, custom domain +£5 (included in Premium).
