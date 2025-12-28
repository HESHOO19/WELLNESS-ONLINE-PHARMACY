# 🏥 Wellness Pharmacy - Complete Setup Guide

Step-by-step instructions to run the project with the MongoDB-backed stack (frontend still has an offline fallback).

---

## 📋 What You Have
- Frontend: single-page HTML/CSS/JS (Tailwind via CDN) in web_project.html.
- Backend: Node.js + Express REST API in server.js.
- Database: MongoDB (uses MongoDB client via db/connection.js; seeds via mongodbseed.js).
- Fallback: frontend ships a local dataset so browsing/cart still work if the API is offline.

---

## ⚡ Quick Start (about 5 minutes)
1) Install prerequisites: Node.js 18+, MongoDB (local or Atlas URI).
2) Copy env file: `cp .env.example .env` (or create `.env`) and set `MONGODB_URI` / `MONGODB_DB`.
3) Install dependencies: `npm install`.
4) Seed data (optional but recommended): `npm run seed:mongodb`.
5) Start the API: `npm start` (or `npm run dev` for nodemon).
6) Open the site: http://localhost:3000 (served by Express).

---

## 🧪 Test the Application
- Health: GET http://localhost:3000/api/health should report success.
- Catalog: Products and categories should load from the API; if the API is down the page will transparently fall back to the embedded dataset.
- Auth: Register/login works against MongoDB (demo passwords are stored plaintext for now).
- Cart/Checkout: Add items, view cart, and place orders; order totals come from the API when online.

Suggested manual flow:
1. Browse categories and search.
2. Add a few items to cart, open cart sidebar, adjust quantities.
3. Sign up or log in, then checkout; you should receive an order ID.

---

## 🗂️ Project File Structure
```
web_project/
├── server.js            ← Backend (Express + MongoDB)
├── web_project.html     ← Frontend SPA
├── config.js            ← Frontend API base URL
├── db/
│   └── connection.js    ← MongoDB client helper
├── package.json         ← Scripts and dependencies
├── .env.example         ← Environment template
├── START_GUIDE.md       ← This guide
├── SETUP.md             ← Technical reference
└── README.md            ← Backend overview
```

---

## 🔄 How Everything Works Together
- Frontend tries the API first (`API_BASE_URL` from config.js). If unreachable, it uses its embedded data and localStorage for cart/auth fallback.
- Backend connects to MongoDB using settings from `.env` and serves both the API and the frontend file.
- Database collections (roles/users/products/orders/addresses/inventory/coupons/audits) are seeded via `npm run seed:mongodb`.

---

## 🖥️ Running Options
- Full stack (recommended): `npm start` → API + frontend at http://localhost:3000 (uses MongoDB).
- Dev with auto-reload: `npm run dev` (nodemon required) → same endpoints.
- Frontend-only fallback: `npm run dev-server` or open web_project.html directly → uses embedded data/localStorage only (no server persistence).

---

## 🔌 Key API Endpoints
- Health: `GET /api/health`
- Catalog: `GET /api/categories`, `GET /api/products`, `GET /api/products/:id`, `GET /api/products/category/:cat`
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile/:userId`
- Addresses: `GET /api/addresses/:userId`, `POST /api/addresses`
- Orders: `POST /api/orders`, `GET /api/orders/:email`, `GET /api/orders/id/:orderId`, `PATCH /api/orders/:orderId/status`
- Coupons: `POST /api/coupons/validate`
- Admin: `GET /api/admin/orders`, `GET /api/admin/stats`, `GET /api/admin/users`, `GET /api/admin/inventory`, `GET /api/admin/audits`

---

## 🐛 Troubleshooting
- Cannot connect to DB: verify `MONGODB_URI` and that MongoDB is running/accessible.
- API 404: ensure `API_BASE_URL` in config.js matches your server (default http://localhost:3000/api).
- CORS errors: server has permissive CORS for local dev; check the browser console for the actual failing URL.
- Data not persisting: confirm `npm run seed:mongodb` ran and the API can reach MongoDB; offline mode only uses localStorage.

---

**Last Updated**: December 24, 2025  
**Status**: MongoDB-integrated ✅
