# Popeyes Marketing Orders

Password-protected order report for Popeyes UK head office, built from popeyes-marketing.com (Ecwid) orders.
Prepared by Marketindex Ltd.

Live: https://marketindexltd.github.io/popeyes-orders/

Order data is AES-GCM encrypted in index.html; the password is not stored in this repo.

Refresh: `node ecwid-orders.mjs && node build-data.mjs && node build.mjs`, then commit index.html.
