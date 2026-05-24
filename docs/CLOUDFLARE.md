# Cloudflare API + D1 Setup

ProductPass uses a **hybrid architecture**:

- **Vercel** — Next.js app (`theproductpass.garden`)
- **Cloudflare Workers** — REST API (`api.theproductpass.garden`)
- **Cloudflare D1** — SQLite database for passports and evidence metadata

```
Browser → Vercel (Next.js) → Worker API → D1
                ↓
         Public passport pages
```

## 1. Create the D1 database

```bash
npx wrangler d1 create productpass-db
```

Copy the `database_id` into `workers/productpass-api/wrangler.jsonc`.

## 2. Run migrations

```bash
npm run db:migrate:local    # local dev
npm run db:migrate:remote   # production
```

## 3. Start the Worker locally

```bash
npm run worker:dev
```

API runs at `http://localhost:8787`.

## 4. Seed demo data

```bash
npm run db:seed:local
# Or with API key: curl -X POST http://localhost:8787/v1/admin/seed -H "X-API-Key: dev"
```

## 5. Point the Next.js app at the API

In `.env.local` (and Vercel env vars):

```env
PRODUCTPASS_API_URL=http://localhost:8787
# PRODUCTPASS_API_KEY=dev   # only if Worker has API_KEY secret set
```

Restart `npm run dev`. The app now reads/writes via D1 instead of `data/store.json`.

## 6. Deploy the Worker

```bash
# Set API key secret (recommended for production)
npx wrangler secret put API_KEY --config workers/productpass-api/wrangler.jsonc

npm run worker:deploy
npm run db:migrate:remote
curl -X POST https://productpass-api.<your-subdomain>.workers.dev/v1/admin/seed \
  -H "X-API-Key: your-secret-key"
```

## 7. Custom domain for the API

In Cloudflare dashboard → Workers → productpass-api → Settings → Domains:

Add **`api.theproductpass.garden`**

Then set on Vercel:

```env
PRODUCTPASS_API_URL=https://api.theproductpass.garden
PRODUCTPASS_API_KEY=your-secret-key
NEXT_PUBLIC_APP_URL=https://theproductpass.garden
```

Update `ALLOWED_ORIGINS` in `wrangler.jsonc` if you add preview URLs.

## API routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/v1/passports` | List all passports |
| GET | `/v1/passports/:id` | Get by ID |
| GET | `/v1/passports/by-public-id/:publicId` | Get by public slug |
| POST | `/v1/passports` | Create passport |
| PUT | `/v1/passports/:id` | Update passport |
| GET | `/v1/documents?productId=` | List evidence documents |
| GET | `/v1/dashboard/stats` | Dashboard aggregates |
| POST | `/v1/admin/seed` | Seed demo data (empty DB only) |

## Future: R2 for file uploads

Store certificate PDFs and supplier declarations in **Cloudflare R2**, with metadata in D1. The Evidence Vault would link `documentUrl` to R2 public/signed URLs.

## Fallback mode

If `PRODUCTPASS_API_URL` is **not set**, the Next.js app uses local file storage (`data/store.json`) — no Cloudflare required for hackathon demos on your laptop.
