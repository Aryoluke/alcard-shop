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
(breakdown + total). Change `WHATSAPP_NUMBER` in `order.html` to the real
business number before launch.

Tiers (no custom printing — decided Aug 2026; digital QR code, not a QR card):
- Starter £5.99 — NFC sticker
- Standard £9.99 — PVC NFC card
- Premium £14.99 — PVC card + 2 extra stickers

Add-ons: extra sticker 50p, extra card £1, custom domain +£5.
