# ProductPass

**QR-powered Digital Product Passports for modern brands.**

ProductPass helps small fashion, apparel, textile, and lifestyle brands create QR-powered Digital Product Passports that combine product identity, sustainability data, supplier evidence, repair/recycling information, and customer-facing trust pages.

> "ProductPass helps small brands turn product data, supplier evidence, and sustainability claims into QR-powered Digital Product Passports."

## Why Digital Product Passports Matter

The EU and other jurisdictions are moving toward mandatory Digital Product Passports (DPPs) for textiles and other product categories. A DPP is not just a QR code page — it is **compliance, traceability, identity, evidence, and circular-commerce infrastructure** for physical products.

## Target Customer

Small and medium fashion/apparel/textile brands preparing for EU-style Digital Product Passport requirements.

## Demo Flow

1. Open the landing page at `/`
2. Go to `/dashboard` for passport overview and compliance stats
3. Open **HeySalad Reusable Tote Bag** at `/products/prod-heysalad-tote/edit`
4. Review product identity, materials, sustainability claims, and Evidence Vault
5. See missing evidence warnings and compliance readiness score
6. View QR code in the product editor sidebar
7. Open the public passport at `/passport/heysalad-reusable-tote-bag`
8. Try **Passport Copilot** — paste rough product notes and get structured suggestions

## How to Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

Deploy to Vercel with zero config — push to GitHub and connect the repo.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | No | Base URL for QR code generation (defaults to `http://localhost:3000`) |
| `OPENAI_API_KEY` | No | Enables real AI generation in Passport Copilot (falls back to mock parser) |

Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=sk-...
```

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/dashboard` | Brand dashboard |
| `/products` | Product list |
| `/products/new` | Create product passport |
| `/products/[id]/edit` | Edit product passport |
| `/passport/[publicId]` | Public passport page |
| `/evidence` | Supplier Evidence Vault |
| `/api/passport-copilot` | AI helper (mock fallback) |

## Core Modules

- **Landing page** — Product positioning and feature overview
- **Brand dashboard** — Passport stats, compliance score, evidence warnings
- **Product passport builder** — Full form for identity, materials, claims, lifecycle, certifications
- **Evidence Vault** — Document management with status tracking and warnings
- **Compliance readiness score** — TypeScript scoring engine (0–100) in `src/lib/compliance.ts`
- **Public passport page** — Consumer-friendly trust page with QR code
- **Passport Copilot** — AI helper for structuring rough product notes
- **Circular commerce placeholders** — Repair, resale, ownership, recycling actions

## Demo Product

**HeySalad Reusable Tote Bag** (`/passport/heysalad-reusable-tote-bag`)

- 70% recycled cotton, 30% recycled polyester
- Batch-level passport
- Evidence: supplier declaration uploaded, polyester cert needs review, organic cert missing
- Compliance score calculated dynamically from mock fields

## Hackathon Demo Script

1. Open ProductPass landing page — explain DPP-lite positioning for fashion SMEs
2. Go to dashboard — show total passports, missing evidence, compliance score
3. Open **HeySalad Reusable Tote Bag** product editor
4. Walk through product identity, materials, sustainability claims, and Evidence Vault
5. Show missing evidence warnings and compliance readiness score (~68/100)
6. Show QR code card — explain scan → public passport flow
7. Open public passport page — beautiful consumer-facing trust page
8. Demo Passport Copilot with sample notes about organic cotton hoodie
9. Explain future expansion: supplier portal, GS1 Digital Link, verifiable credentials, lifecycle updates, resale, repair, recycling

## Future Integrations

- **Supabase** — Persistent storage, auth, and real-time sync
- **OpenAI** — Enhanced Passport Copilot with structured output
- **Cloudflare R2** — Document and evidence file storage
- **Shopify / WooCommerce** — Product catalog sync
- **GS1 Digital Link** — Standard-compliant product identifiers
- **ERP / PIM / PLM systems** — Enterprise data ingestion
- **Supplier portals** — Direct evidence upload from suppliers
- **Audit logs** — Immutable compliance trail
- **Verifiable credentials** — Cryptographically signed claims

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- qrcode.react + lucide-react
- Local mock data in `src/lib/store.ts` (no database required for MVP)
- Deployable to Vercel

## License

MIT — Hackathon MVP
