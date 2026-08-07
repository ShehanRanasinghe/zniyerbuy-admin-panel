# 🛠 ZNIYERBUY Admin Panel

The platform administration dashboard for ZNIYERBUY. Built with **Next.js 16 (App Router)**, **React 19**, and **TypeScript**, styled with **Tailwind CSS v4**. Admins use it to manage users, shops, and products, and to review platform-wide analytics.

This README is written directly from this repo's source (`src/app/`, `src/lib/`, `src/middleware.ts`).

---

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Authentication & Route Protection](#authentication--route-protection)
- [Backend Connectivity](#backend-connectivity)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Known Gaps](#known-gaps)

---

## Overview

This app is one of the three ZNIYERBUY frontends. It talks to `zniyerbuy-backend`'s `/api/v1/admin/*` and `/api/v1/analytics/*` endpoints for all data, and additionally imports `@supabase/supabase-js` directly for a few data needs alongside the backend API. It runs on the default Next.js **port 3000**.

## Technology Stack

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.2.6 | Framework (App Router) |
| react / react-dom | 19.2.4 | UI library |
| typescript | ^5 | Type safety |
| tailwindcss | ^4 | Styling |
| firebase | ^12.14.0 | Client-side Auth SDK |
| @supabase/supabase-js | ^2.107.0 | Direct Supabase access (alongside the backend API) |
| recharts | ^3.8.1 | Analytics charts |
| @fortawesome/react-fontawesome + free-solid-svg-icons | ^3.3.1 / ^7.2.0 | Icons |
| dotenv | ^17.4.2 | Env loading |

## Project Structure

```
zniyerbuy-admin-panel/
├── src/
│   ├── app/
│   │   ├── login/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           ← overview
│   │   │   ├── users/page.tsx
│   │   │   ├── shops/page.tsx
│   │   │   └── products/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── lib/
│   │   ├── api.ts                  ← fetch-based API client (admin endpoints)
│   │   └── auth.ts                  ← Firebase login/logout + admin-role check
│   └── middleware.ts                ← protects /dashboard/* routes
└── package.json                     (dev/start scripts run on default port 3000)
```

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Admin login (Firebase Auth + role check) |
| `/dashboard` | Platform-wide stats overview |
| `/dashboard/users` | List users, change role, activate/deactivate, delete |
| `/dashboard/shops` | List shops, verify/reject, delete |
| `/dashboard/products` | List products with filters, flag/unflag (moderation) |

## Authentication & Route Protection

- `src/lib/auth.ts` (`loginAdmin`) does a 3-step login:
  1. Signs in with Firebase Auth (`signInWithEmailAndPassword`)
  2. Fetches the backend profile via `GET /api/v1/auth/me` using the Firebase ID token
  3. **Rejects the login** (signs the user back out) unless `role === "admin"`
- On success, the ID token is stored in `sessionStorage` (`adminAuthToken`) for API calls, and mirrored into a cookie (`adminAuthToken`, 1-hour expiry, `SameSite=Strict`) so `src/middleware.ts` can check for its presence.
- `src/middleware.ts` protects every `/dashboard/*` route: no `adminAuthToken` cookie → redirect to `/login`. (Note: this is a presence check, not a token-validity check — actual verification happens server-side on every backend API call.)
- `src/lib/api.ts`'s `apiCall()` helper attaches `Authorization: Bearer <token>` (read from `sessionStorage` via `getAuthToken()`) to every backend request.

## Backend Connectivity

```ts
// src/lib/api.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const API_BASE = `${BACKEND_URL}/api/v1`;
```

Exposed helper functions call straight through to the backend's admin routes, e.g.:
- `fetchUsers()` → `GET /admin/users`
- `updateUserRole(userId, role)` → `PATCH /admin/users/:id/role`
- `toggleUserStatus(userId, isActive)` → `PATCH /admin/users/:id/status`
- `fetchShops()` / `verifyShop()` / `rejectShop()` / `deleteShop()` → `/admin/shops*`
- `fetchProducts()` / `fetchProductFilters()` → `/admin/products`, `/admin/products/filters`

## Installation & Setup

```bash
git clone https://github.com/ShehanRanasinghe/zniyerbuy-admin-panel.git
cd zniyerbuy-admin-panel
npm install

cp .env.example .env   # or create .env manually, see below

npm run dev
# http://localhost:3000
```

## Environment Variables

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_SERVICE_KEY=

# Firebase Configuration (for authentication)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

> ⚠️ `NEXT_PUBLIC_SUPABASE_SERVICE_KEY` is prefixed `NEXT_PUBLIC_`, which means it is exposed to the browser bundle if actually used client-side. Double check where/how this key is consumed before deploying — service-role keys should never be shipped to a browser in production.

## Scripts

```bash
npm run dev     # next dev
npm run build   # next build
npm start       # next start
npm run lint    # eslint
```

## Known Gaps

- Route protection in `middleware.ts` only checks cookie *presence*, not validity/expiry — real authorization is enforced by the backend on every API call, which is the actual security boundary.
- No Dockerfile or CI/CD workflow is present in this repo yet (planned for a later deployment sprint).

For the full project context (all six ZNIYERBUY repos, database schema, sprint history), see `zniyerbuy-project-hub`.