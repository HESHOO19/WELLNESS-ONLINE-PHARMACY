# Wellness Pharmacy Backend Setup Guide

## Overview
Node.js/Express backend with MongoDB persistence for the Wellness Pharmacy e-commerce site. Frontend lives in web_project.html and calls these APIs (with a graceful local fallback when the API is offline).

## Quick Start
1) Prerequisites: Node.js 18+, MongoDB (local or Atlas URI).
2) Copy env file: `cp .env.example .env` (or create `.env`) and set `MONGODB_URI` / `MONGODB_DB`.
3) Install deps: `npm install`.
4) Seed data (optional): `npm run seed:mongodb`.
5) Run server: `npm start` (or `npm run dev` for nodemon).
6) Open http://localhost:3000 (frontend served from root).

## Project Structure
```
web_project/
├── server.js            # Express API + static frontend (MongoDB persistence)
├── web_project.html     # Frontend SPA (Tailwind + vanilla JS)
├── config.js            # Frontend API base URL
├── db/
│   └── connection.js    # MongoDB client helper
├── mongodbseed.js       # Seed script for MongoDB
├── package.json         # Scripts and dependencies
├── .env.example         # Environment template
└── docs (md/txt files)  # Guides and summaries
```

## API Surface (high level)
- Health: `GET /api/health`
- Catalog: `GET /api/categories`, `GET /api/products`, `GET /api/products/:id`, `GET /api/products/category/:cat`
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile/:userId`
- Addresses: `GET /api/addresses/:userId`, `POST /api/addresses`
- Orders: `POST /api/orders`, `GET /api/orders/:email`, `GET /api/orders/id/:orderId`, `PATCH /api/orders/:orderId/status`
- Coupons: `POST /api/coupons/validate`
- Admin: `GET /api/admin/orders`, `GET /api/admin/stats`, `GET /api/admin/users`, `GET /api/admin/inventory`, `GET /api/admin/audits`

## Database
- MongoDB is the source of truth. Seeds live in mongodbseed.js.
- The frontend still contains a local fallback dataset for offline/demo, but when the API is available all catalog/auth/order flows use MongoDB.
- Connection config comes from `.env` (MONGODB_URI and MONGODB_DB).

## Security Notes (current)
- Demo-only: passwords are stored plaintext; add bcrypt+salts for real use.
- No JWT/session tokens; add auth tokens before production.
- Add rate limiting, validation, and stricter CORS/headers for production.

## Development Tips
- `npm run dev` uses nodemon.
- Update `config.js` if you serve the API from a different host/port.
- Use `npm run seed:mongodb` after any seed changes.

## License
MIT
