## WhatsX_Advanced — WhatsApp Messaging & Automation (Prototype)

This prototype delivers:

- Admin authentication (email/password with JWT)
- User management (add/update/delete end users)
- Template management (create/update/delete messaging templates)
- Duplicate contact handling (normalize + deduplicate phone numbers)
- Frontend app (React + Tailwind) with Login, Dashboard, Users, Templates, and Compose screens
- Backend API (Node.js/Express) with Firestore persistence (and safe in-memory fallback)
- Twilio Sandbox integration stub (no sending in prototype)
- Scheduled background job via node-cron

### Tech Stack

- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js / Express
- Database: Firebase Firestore (via Firebase Admin; with in-memory fallback for local runs)
- WhatsApp: Twilio Sandbox API (stub wiring only; not used in prototype send flow)
- Scheduling: node-cron

---

## Setup

### 1) Prerequisites

- Node.js 18+
- A Firebase Service Account for Firestore (optional for quick local run; required for Firestore persistence)

### 2) Backend

1. Create the environment file:

   - Copy `server/.env.example` to `server/.env` and fill values:
     - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET` are required
     - Firestore credentials are optional (fallback is in-memory storage)
   
2. Install and run:

```bash
cd server
npm install
npm run dev
```

Backend runs at `http://localhost:4000` by default.

### 3) Frontend

1. Create the environment file:

   - Copy `client/.env.example` to `client/.env`
   - Ensure `VITE_API_BASE_URL` points to the backend (default is fine for local dev)

2. Install and run:

```bash
cd client
npm install
npm run dev
```

Frontend runs at the Vite dev server URL printed in your terminal (typically `http://localhost:5173`).

---

## Firestore Configuration (Optional for local, recommended for persistence)

Use environment variables (without a JSON file):

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (escape newlines as `\n`)

If these are not provided, the backend stores data in memory for the session.

---

## Twilio Sandbox (Stub)

Fill these if you want to validate configuration (no sending performed in prototype):

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM` (Twilio Sandbox WhatsApp from number like `whatsapp:+14155238886`)

---

## API Overview

Base URL: `/api`

- `POST /api/auth/login` — Login with `ADMIN_EMAIL`/`ADMIN_PASSWORD`, returns JWT

Authenticated routes require header: `Authorization: Bearer <token>`

- `GET /api/users` — List end users
- `POST /api/users` — Create `{ name, phone }`
- `PUT /api/users/:id` — Update `{ name?, phone? }`
- `DELETE /api/users/:id`

- `GET /api/templates` — List templates
- `POST /api/templates` — Create `{ name, content }`
- `PUT /api/templates/:id` — Update `{ name?, content? }`
- `DELETE /api/templates/:id`

- `POST /api/utils/deduplicate` — `{ contacts: string[], defaultCountryCode?: string }` ⇒ `{ uniqueContacts: string[], duplicates: { [normalized: string]: string[] } }`

---

## Scripts

Backend:

```bash
cd server
npm run dev       # Start dev server with nodemon
npm run start     # Start production server
```

Frontend:

```bash
cd client
npm run dev       # Start Vite dev server
npm run build     # Build production assets
npm run preview   # Preview production build
```

---

## Notes

- This prototype excludes actual WhatsApp message sending. The UI demonstrates template selection and allows deduplication of contact lists. Templates remain editable before sending.
- If Firestore is not configured, data will reset on each backend restart.

# WhatsX
my first repository on github
