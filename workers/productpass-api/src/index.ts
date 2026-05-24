import type { Env, PassportDocument, ProductPassport } from "./types";
import { parseDocument, parsePassport } from "./types";
import { getSeedData } from "./seed";

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function error(message: string, status = 400) {
  return json({ error: message }, status);
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = (env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  if (origin && (allowed.length === 0 || allowed.includes(origin))) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
      Vary: "Origin",
    };
  }
  return {};
}

function requireApiKey(request: Request, env: Env): Response | null {
  if (!env.API_KEY) return null;
  const key = request.headers.get("X-API-Key");
  if (key !== env.API_KEY) return error("Unauthorized", 401);
  return null;
}

async function listPassports(db: D1Database): Promise<ProductPassport[]> {
  const { results } = await db
    .prepare("SELECT payload FROM passports ORDER BY updated_at DESC")
    .all<{ payload: string }>();
  return (results ?? []).map(parsePassport);
}

async function listDocuments(db: D1Database, productId?: string): Promise<PassportDocument[]> {
  const stmt = productId
    ? db
        .prepare("SELECT payload FROM documents WHERE linked_product_id = ?")
        .bind(productId)
    : db.prepare("SELECT payload FROM documents");
  const { results } = await stmt.all<{ payload: string }>();
  return (results ?? []).map(parseDocument);
}

function complianceScore(passport: ProductPassport, docs: PassportDocument[]): number {
  let score = 0;
  if (passport.productName) score += 10;
  if (passport.sku) score += 10;
  if (passport.materials.length) score += 15;
  if (passport.manufacturer) score += 10;
  if (passport.lifecycle.recyclingInstructions) score += 10;
  const missing = docs.filter(
    (d) => d.linkedProductId === passport.id && d.status === "missing"
  ).length;
  score += Math.max(0, 25 - missing * 5);
  if (passport.status === "published") score += 20;
  return Math.min(100, score);
}

async function dashboardStats(db: D1Database) {
  const passports = await listPassports(db);
  const documents = await listDocuments(db);
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const scores = passports.map((p) =>
    complianceScore(
      p,
      documents.filter((d) => d.linkedProductId === p.id)
    )
  );

  return {
    total: passports.length,
    published: passports.filter((p) => p.status === "published").length,
    drafts: passports.filter((p) => p.status === "draft").length,
    missingEvidence: documents.filter((d) => d.status === "missing").length,
    expiringCerts: documents.filter(
      (d) =>
        d.expiryDate &&
        new Date(d.expiryDate) <= thirtyDays &&
        new Date(d.expiryDate) >= now
    ).length,
    expiredDocs: documents.filter((d) => d.status === "expired").length,
    recentProducts: passports.slice(0, 5),
    averageComplianceScore:
      scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
  };
}

async function upsertPassport(db: D1Database, passport: ProductPassport) {
  const updated = { ...passport, updatedAt: new Date().toISOString() };
  await db
    .prepare(
      `INSERT INTO passports (id, public_id, payload, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET public_id = excluded.public_id, payload = excluded.payload, updated_at = excluded.updated_at`
    )
    .bind(updated.id, updated.publicId, JSON.stringify(updated), updated.updatedAt)
    .run();
  return updated;
}

async function seedDatabase(db: D1Database) {
  const count = await db.prepare("SELECT COUNT(*) as c FROM passports").first<{ c: number }>();
  if (count && count.c > 0) return { seeded: false, message: "Database already has data" };

  const { passports, documents } = getSeedData();
  for (const p of passports) {
    await upsertPassport(db, p);
  }
  for (const d of documents) {
    await db
      .prepare(
        "INSERT INTO documents (id, linked_product_id, payload) VALUES (?, ?, ?)"
      )
      .bind(d.id, d.linkedProductId, JSON.stringify(d))
      .run();
  }
  return { seeded: true, passports: passports.length, documents: documents.length };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/health") {
      return json({ ok: true, service: "productpass-api" }, 200, cors);
    }

    const authError = requireApiKey(request, env);
    if (authError) {
      Object.entries(cors).forEach(([k, v]) => authError.headers.set(k, v));
      return authError;
    }

    try {
      if (path === "/v1/passports" && request.method === "GET") {
        return json(await listPassports(env.DB), 200, cors);
      }

      if (path === "/v1/passports" && request.method === "POST") {
        const passport = (await request.json()) as ProductPassport;
        const saved = await upsertPassport(env.DB, passport);
        return json(saved, 201, cors);
      }

      if (path === "/v1/documents" && request.method === "GET") {
        const productId = url.searchParams.get("productId") ?? undefined;
        return json(await listDocuments(env.DB, productId), 200, cors);
      }

      if (path === "/v1/dashboard/stats" && request.method === "GET") {
        return json(await dashboardStats(env.DB), 200, cors);
      }

      if (path === "/v1/admin/seed" && request.method === "POST") {
        return json(await seedDatabase(env.DB), 200, cors);
      }

      const publicMatch = path.match(/^\/v1\/passports\/by-public-id\/([^/]+)$/);
      if (publicMatch && request.method === "GET") {
        const row = await env.DB.prepare(
          "SELECT payload FROM passports WHERE public_id = ?"
        )
          .bind(publicMatch[1])
          .first<{ payload: string }>();
        if (!row) return error("Passport not found", 404);
        return json(parsePassport(row), 200, cors);
      }

      const idMatch = path.match(/^\/v1\/passports\/([^/]+)$/);
      if (idMatch && request.method === "GET") {
        const row = await env.DB.prepare("SELECT payload FROM passports WHERE id = ?")
          .bind(idMatch[1])
          .first<{ payload: string }>();
        if (!row) return error("Passport not found", 404);
        return json(parsePassport(row), 200, cors);
      }

      if (idMatch && request.method === "PUT") {
        const passport = (await request.json()) as ProductPassport;
        if (passport.id !== idMatch[1]) return error("ID mismatch", 400);
        const saved = await upsertPassport(env.DB, passport);
        return json(saved, 200, cors);
      }

      return error("Not found", 404);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Internal error";
      return error(message, 500);
    }
  },
};
