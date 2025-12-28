# 🏥 Wellness Pharmacy - Project Summary

## Overview
Full-stack e-commerce pharmacy with a MongoDB backend, Express API, and Tailwind-powered single-page frontend. Offline-friendly fallback remains for demos when the API is unreachable.

---

## 📦 What's Included
1. **server.js** — Express API + static frontend hosting; MongoDB persistence for auth, catalog, orders, addresses, coupons, inventory, audits.
2. **web_project.html** — Frontend SPA with fetch-based API calls and offline fallback dataset.
3. **db/connection.js** — MongoDB client helper and health checks.
4. **config.js** — Frontend API base URL.
5. **package.json** — Scripts (`start`, `dev`, `dev-server`, `seed:mongodb`) and dependencies (express, mongodb, dotenv, etc.).
6. **Docs** — START_GUIDE.md, SETUP.md, README.md, INTEGRATION_GUIDE.md.

---

## 🚀 Getting Started (Quick Version)
```bash
cp .env.example .env   # set MONGODB_URI / MONGODB_DB
npm install
npm run seed:mongodb   # optional: seed Mongo with catalog/users/coupons
npm start              # or npm run dev for nodemon
# open http://localhost:3000
```

---

## 💡 Key Features
- Auth (register/login/profile) backed by MongoDB.
- Catalog: categories, products, search/filter (API-first with offline fallback).
- Cart + checkout: server-validated totals, order creation, status updates.
- Addresses, coupons, and audit logging in the database.
- Admin endpoints for orders, users, inventory, and stats.
- Frontend offline fallback to embedded data/localStorage for demos.

---

## 🔧 Technical Stack
- Frontend: HTML5, Tailwind (CDN), vanilla JS.
- Backend: Node.js, Express, MongoDB driver, body-parser, cors, dotenv.
- Database: MongoDB (seed via mongodbseed.js).

---

## 📊 API Endpoints (highlight)
- Health: `GET /api/health`
- Catalog: `GET /api/categories`, `GET /api/products`, `GET /api/products/:id`, `GET /api/products/category/:cat`
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile/:userId`
- Addresses: `GET /api/addresses/:userId`, `POST /api/addresses`
- Orders: `POST /api/orders`, `GET /api/orders/:email`, `GET /api/orders/id/:orderId`, `PATCH /api/orders/:orderId/status`
- Coupons: `POST /api/coupons/validate`
- Admin: `GET /api/admin/orders`, `GET /api/admin/stats`, `GET /api/admin/users`, `GET /api/admin/inventory`, `GET /api/admin/audits`

---

## 🎯 How It Works
```
Browser (SPA)
   ↓ fetch (API_BASE_URL)
Express API (server.js)
   ↓ MongoDB driver
MongoDB (seeded via mongodbseed.js)
```
- Frontend uses API-first data; on network errors it falls back to its embedded dataset and localStorage.
- `npm run seed:mongodb` loads seeds so the API returns the same catalog as the frontend fallback.

---

## 🔐 Security Notes
- Demo-only: passwords are stored plaintext; add bcrypt and salts for real use.
- Add JWT/session tokens, input validation, rate limiting, and stricter CORS/headers for production.

---

## ✅ Checklist
- [x] MongoDB seeded (`npm run seed:mongodb`)
- [x] API starts (`npm start` or `npm run dev`)
- [x] Frontend loads and fetches catalog
- [x] Auth + orders work against DB
- [x] Offline fallback still usable for demos
