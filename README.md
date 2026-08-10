# Tagmi — Storefront (review copy)

The shop for **Tagmi**, affordable NFC business cards (UK).

This repo exists so the storefront can be reviewed live before it goes to
Cloudflare Pages. The production copy lives in the main project at
`storefront/` — the deploy guide is `hosting/README-deploy-shop.md` there.

## Files

- `index.html` — the shop (one page: hero, tiers, compare, order via WhatsApp)
- `privacy.html` — privacy policy (linked from the footer)

## Order flow

No backend: the order form opens WhatsApp with a pre-filled message.
Change `WHATSAPP_NUMBER` in `index.html` to the real business number before launch.

Tiers (no custom printing — decided Aug 2026):
- Starter £9.99 — NFC sticker
- Standard £14.99 — PVC NFC card
- Premium £19.99 — PVC card + 2 extra stickers
