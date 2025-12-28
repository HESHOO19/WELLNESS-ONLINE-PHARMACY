# Wellness Pharmacy - Complete Project Setup

## 📋 Project Structure
```
web_project/
├── server.js              # Backend server (Node.js/Express + MongoDB)
├── config.js              # Frontend API configuration
├── web_project.html       # Frontend (HTML/CSS/JS)
├── package.json           # Scripts and dependencies
├── .env.example           # Environment variables template
├── db/
│   └── connection.js      # MongoDB client helper
├── mongodbseed.js         # MongoDB seed script
├── START_GUIDE.md         # Quick-start guide
└── README.md              # Backend overview
```

## 🚀 Quick Start (5 minutes)
1) Install prerequisites: Node.js 18+, MongoDB (local or Atlas URI).
2) Copy env: `cp .env.example .env` and set `MONGODB_URI` / `MONGODB_DB`.
3) Install dependencies: `npm install`.
4) Seed data (optional): `npm run seed:mongodb`.
5) Start server: `npm start` (or `npm run dev` for nodemon).
6) Open http://localhost:3000.

## 📡 Backend API Endpoints (core)

- Health: `GET /api/health`
- Catalog: `GET /api/categories`, `GET /api/products`, `GET /api/products/:id`, `GET /api/products/category/:cat`
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile/:userId`
- Addresses: `GET /api/addresses/:userId`, `POST /api/addresses`
- Orders: `POST /api/orders`, `GET /api/orders/:email`, `GET /api/orders/id/:orderId`, `PATCH /api/orders/:orderId/status`
- Coupons: `POST /api/coupons/validate`
- Admin: `GET /api/admin/orders`, `GET /api/admin/stats`, `GET /api/admin/users`, `GET /api/admin/inventory`, `GET /api/admin/audits`

## 🔑 Demo / Defaults
- Frontend ships with embedded products and a local fallback so browsing/cart works even if the API is down.
- Auth and orders use MongoDB when the API is reachable (passwords are plaintext for demo only).

## 💾 Data Storage
- Primary: MongoDB (seed via mongodbseed.js). All auth/orders/inventory live here.
- Fallback: Frontend localStorage + embedded dataset (used only when the API is unreachable).

## 🎯 How It Works
- Frontend fetches from `API_BASE_URL` (config.js). On network errors it falls back to its embedded data and localStorage.
- Backend connects to MongoDB using `.env` and exposes REST endpoints while serving the frontend file.
- `npm run seed:mongodb` can be run after cloning to load catalog/users/coupons.

## 🛠️ Configuration
- `config.js`: set `API_BASE_URL` if your API host/port differs from localhost:3000.
- `.env`: set `MONGODB_URI` (mongodb://user:pass@host:port/db) or MONGODB_DB, plus `PORT` if you want to override 3000.

## 🖥️ Running Options
- Full stack: `npm start` → API + frontend at http://localhost:3000.
- Dev (auto-reload): `npm run dev` (requires nodemon).
- Frontend only: `npm run dev-server` or open web_project.html directly → uses embedded data/localStorage only; no server persistence.

## 🐛 Troubleshooting
- Database connection errors: check `.env`, ensure MongoDB is running, and that the MongoDB URI can connect with the same credentials.
- API 404s: confirm `API_BASE_URL` and that the server is running on the expected port.
- CORS issues: server allows local dev origins; inspect the failing URL in the browser console.
- Data not persisting: ensure `npm run seed:mongodb` was executed and the API can reach MongoDB; offline mode keeps data only in the browser.

## 📚 Technology Stack
- Frontend: HTML5, Tailwind (CDN), vanilla JS.
- Backend: Node.js, Express, MongoDB driver, CORS, body-parser, dotenv.
- Database: MongoDB (seed via mongodbseed.js).

## 💡 Key Features
- SPA frontend with search, categories, cart, and checkout.
- REST API for auth, catalog, orders, addresses, coupons, admin stats, inventory, and audits.
- Offline-aware frontend fallback for demos.






