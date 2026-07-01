# Evo Growth

Local growth infrastructure for attribution, lead capture, Meta tracking, and reporting.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment config
cp .env.example .env
# Edit .env and add your Meta Pixel ID when ready

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — lead form with UTM capture  
Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

Test UTM attribution:

```
http://localhost:3000/?utm_source=meta&utm_medium=paid&utm_campaign=sprint
```

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/leads` | Create lead (deduplicates by email) |
| `GET` | `/api/leads` | List all leads |
| `GET` | `/api/dashboard` | Dashboard metrics JSON |
| `GET` | `/api/leads/export` | CSV export |
| `POST` | `/api/webhooks/crm` | CRM sync stub (set `CRM_WEBHOOK_URL`) |

### Sample lead submission

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "phone": "+15551234567",
    "source": "meta",
    "medium": "paid",
    "campaign": "sprint",
    "content": "hero-cta",
    "landing_page": "/?utm_source=meta"
  }'
```

## Features

- **UTM tracking** — captures `utm_*` params from URL, stores in `localStorage`, attaches to form submissions
- **Lead capture** — validated form → SQLite with email deduplication
- **Meta Pixel** — `PageView` on load, `Lead` event on submit with SHA-256 hashed email
- **Dashboard** — total leads, breakdown by source/campaign, daily counts
- **CRM prep** — clean schema, webhook stub, CSV export
- **CORS** — configurable via `CORS_ORIGINS` in `.env`

## Environment variables

See `.env.example`:

- `NEXT_PUBLIC_META_PIXEL_ID` — Meta Pixel ID (client-side)
- `CRM_WEBHOOK_URL` — external CRM endpoint for webhook sync
- `CORS_ORIGINS` — comma-separated allowed origins

## Data storage

SQLite database at `data/leads.db` (auto-created on first request).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint

## Stack

- [Next.js](https://nextjs.org/) 15 (App Router + API routes)
- [React](https://react.dev/) 19
- [SQLite](https://github.com/WiseLibs/better-sqlite3) via better-sqlite3
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Production dependencies

Before going live:

- Add Meta Pixel ID and verify events in Events Manager
- Connect CRM via `CRM_WEBHOOK_URL` or extend the webhook handler
- Deploy to a real domain for accurate attribution
- Add cookie/consent banner for privacy compliance
