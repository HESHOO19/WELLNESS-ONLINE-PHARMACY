Wellness Pharmacy project is now fully integrated with MongoDB. This guide explains how the pieces fit together and how to run in different modes.

---

## Files & Their Purposes

1) **web_project.html** — Frontend SPA (Tailwind + vanilla JS). Calls the API first and falls back to embedded data/localStorage when offline.
2) **server.js** — Express API + static hosting. Connects to MongoDB, exposes catalog/auth/orders/addresses/coupons/admin/audits.
3) **db/connection.js** — MongoDB client helper and health check.
4) **config.js** — Frontend API base URL.
5) **package.json** — Scripts: `start`, `dev`, `dev-server`, `seed:mongodb`.

---

## How Everything Connects

```
Browser (web_project.html)
    ↓ fetch (API_BASE_URL)
Express API (server.js)
  ↓ MongoDB client
MongoDB (seeded by mongodbseed.js)
```

- Page load: server serves web_project.html; frontend reads config.js for API_BASE_URL.
- Catalog: frontend calls `/api/categories` + `/api/products` (with search/filter). On failure, it uses the embedded dataset.
- Auth: signup/login hit `/api/auth/register` and `/api/auth/login`; user profile via `/api/auth/profile/:userId`.
- Orders: `/api/orders` creates orders with totals validated server-side; status updates via `/api/orders/:orderId/status`.
- Addresses & coupons: `/api/addresses` and `/api/coupons/validate` use Mongo collections.
- Admin: dashboards via `/api/admin/*` (orders/users/inventory/stats/audits).

---

## Running Modes

- **Full integration (recommended):**
  ```bash
  cp .env.example .env   # set MONGODB_URI / MONGODB_DB
  npm install
  npm run seed:mongodb   # optional: seed the catalog/users/coupons
  npm start
  # http://localhost:3000
  ```
  Uses MongoDB for all auth/orders/catalog; frontend is served by Express.

- **Dev with auto-reload:** `npm run dev` (nodemon) → same as above, with reloads on save.

- **Frontend-only fallback:** `npm run dev-server` or open web_project.html directly → uses embedded data/localStorage only (no DB writes).

---

## Storage Behavior
| Feature          | Online (MongoDB)           | Offline fallback            |
|------------------|----------------------------|----------------------------|
| Products/Cats    | `/api/products` + seeds    | Embedded dataset           |
| Auth             | Users collection           | LocalStorage demo users    |
| Orders           | Orders collection          | LocalStorage cart only     |
| Cart             | LocalStorage (client)      | LocalStorage               |
| Admin dashboards | DB-backed                  | Unavailable offline        |

---

## Security Notes
- Demo passwords are plaintext; add bcrypt before production.
- No JWT/session tokens yet; add tokens + refresh + CSRF protection for real deployments.
- Add rate limiting, validation, and stricter CORS/headers in production.

---

## Readiness Checklist
- [x] `.env` configured with MongoDB settings
- [x] `npm run seed:mongodb` applied catalog/users/coupons
- [x] `npm start` serving API + frontend
- [x] Catalog loads from DB; fallback works when API is offline
- [x] Auth + orders functional against MongoDB

**Status**: MongoDB-integrated ✅  
**Last Updated**: December 24, 2025

