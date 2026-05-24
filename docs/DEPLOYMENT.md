# Deployment: Vercel + Cloudflare

ProductPass runs as a split deployment:

| Service | Host | Platform |
|---------|------|----------|
| Web app | `theproductpass.garden` | **Vercel** |
| API + database | `api.theproductpass.garden` | **Cloudflare Worker + D1** |

Your domain DNS stays in **Cloudflare**. You map subdomains to each platform.

---

## Where to add `PRODUCTPASS_API_KEY`

The same secret value must exist in **two places** with **different names**:

| Location | Variable name | Value |
|----------|---------------|-------|
| **Cloudflare Worker** (secret) | `API_KEY` | your secret (already set via `wrangler secret put`) |
| **Vercel** (env var) | `PRODUCTPASS_API_KEY` | **same value** as Cloudflare `API_KEY` |
| **Local dev** (`.env.local`) | `PRODUCTPASS_API_KEY` | same value |

### Vercel dashboard

1. Go to [vercel.com](https://vercel.com) → your **product-pass** project
2. **Settings** → **Environment Variables**
3. Add:

| Name | Value | Environments |
|------|-------|--------------|
| `PRODUCTPASS_API_URL` | `https://api.theproductpass.garden` | Production, Preview, Development |
| `PRODUCTPASS_API_KEY` | *(your secret — see team password manager or regenerate)* | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://theproductpass.garden` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://<preview-url>.vercel.app` | Preview *(optional)* |

4. **Redeploy** after saving env vars (Deployments → ⋯ → Redeploy)

### Cloudflare Worker (already done)

```bash
# To rotate the key later:
openssl rand -hex 24 | npx wrangler secret put API_KEY --config workers/productpass-api/wrangler.jsonc
# Then update Vercel PRODUCTPASS_API_KEY to match
```

### Local `.env.local`

```env
PRODUCTPASS_API_URL=https://api.theproductpass.garden
PRODUCTPASS_API_KEY=<same-as-cloudflare-API_KEY>
NEXT_PUBLIC_APP_URL=http://localhost:3023
```

---

## DNS setup (domain on Cloudflare)

Because `theproductpass.garden` is on Cloudflare, you configure DNS there — **not** in Vercel's DNS panel.

### 1. API subdomain (already live)

`api.theproductpass.garden` → Cloudflare Worker `productpass-api`

This was attached during `npm run worker:deploy`. Verify:

```bash
curl https://api.theproductpass.garden/health
# {"ok":true,"service":"productpass-api"}
```

### 2. Main site → Vercel

**In Vercel:**

1. Project → **Settings** → **Domains**
2. Add `theproductpass.garden` and `www.theproductpass.garden`
3. Vercel shows required DNS records (usually a **CNAME**)

**In Cloudflare DNS** (for `theproductpass.garden` zone):

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `@` or `theproductpass.garden` | `cname.vercel-dns.com` | DNS only (grey cloud) recommended for Vercel |
| CNAME | `www` | `cname.vercel-dns.com` | DNS only |

> Vercel's domain setup page shows the exact CNAME target for your project — use that value.

**Optional:** Redirect `www` → apex in Cloudflare **Rules** → **Redirect Rules**.

### 3. SSL

- Cloudflare: SSL/TLS mode **Full** (or Full Strict once Vercel cert is active)
- Vercel provisions HTTPS automatically once DNS propagates

---

## Checklist

- [x] D1 database `productpass-db` created
- [x] Migrations applied (remote)
- [x] Worker deployed to `api.theproductpass.garden`
- [x] Demo data seeded (HeySalad tote + documents)
- [x] `API_KEY` secret set on Worker
- [ ] Add domain in **Vercel** project settings
- [ ] Add **CNAME** in **Cloudflare DNS** pointing to Vercel
- [ ] Add env vars in **Vercel** (`PRODUCTPASS_API_URL`, `PRODUCTPASS_API_KEY`, `NEXT_PUBLIC_APP_URL`)
- [ ] Redeploy Vercel

---

## Verify end-to-end

```bash
# API
curl -H "X-API-Key: YOUR_KEY" https://api.theproductpass.garden/v1/passports

# Public site (after Vercel + DNS)
open https://theproductpass.garden
open https://theproductpass.garden/passport/heysalad-reusable-tote-bag
```

---

## Regenerate API key (if lost)

```bash
NEW_KEY=$(openssl rand -hex 24)
echo -n "$NEW_KEY" | npx wrangler secret put API_KEY --config workers/productpass-api/wrangler.jsonc
echo "Update Vercel PRODUCTPASS_API_KEY to: $NEW_KEY"
```
