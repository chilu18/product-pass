import fs from "node:fs";
import path from "node:path";
import type { PassportDocument, ProductPassport } from "./types";
import { calculateComplianceScore } from "./compliance";
import { demoPassport, draftPassport, mockDocuments } from "./seed-data";

const STORE_FILE = path.join(process.cwd(), "data", "store.json");

interface StoreData {
  passports: ProductPassport[];
  documents: PassportDocument[];
}

function defaultStore(): StoreData {
  return {
    passports: [demoPassport, draftPassport],
    documents: [...mockDocuments],
  };
}

function loadStore(): StoreData {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(STORE_FILE, "utf-8")) as StoreData;
      if (parsed.passports?.length) return parsed;
    }
  } catch {
    // use defaults
  }
  const defaults = defaultStore();
  persistStore(defaults);
  return defaults;
}

function persistStore(data: StoreData) {
  const dir = path.dirname(STORE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

const initialStore = loadStore();
let passports: ProductPassport[] = initialStore.passports;
let documents: PassportDocument[] = initialStore.documents;

function syncToDisk() {
  persistStore({ passports, documents });
}

export function getPassports(): ProductPassport[] {
  return [...passports];
}

export function getPassportById(id: string): ProductPassport | undefined {
  return passports.find((p) => p.id === id);
}

export function getPassportByPublicId(publicId: string): ProductPassport | undefined {
  return passports.find((p) => p.publicId === publicId);
}

export function getDocuments(): PassportDocument[] {
  return [...documents];
}

export function getDocumentsForProduct(productId: string): PassportDocument[] {
  return documents.filter((d) => d.linkedProductId === productId);
}

export function savePassport(passport: ProductPassport): ProductPassport {
  const idx = passports.findIndex((p) => p.id === passport.id);
  const updated = { ...passport, updatedAt: new Date().toISOString() };
  if (idx >= 0) passports[idx] = updated;
  else passports.push(updated);
  syncToDisk();
  return updated;
}

export function createEmptyPassport(): ProductPassport {
  return {
    id: `prod-${Date.now()}`,
    publicId: `passport-${Date.now().toString(36)}`,
    status: "draft",
    productName: "",
    sku: "",
    batchNumber: "",
    category: "",
    description: "",
    brandName: "HeySalad",
    manufacturer: "",
    countryOfOrigin: "",
    productionDate: "",
    passportLevel: "model",
    materials: [],
    claims: [],
    certifications: [],
    lifecycle: {
      careInstructions: "",
      repairInstructions: "",
      reuseInstructions: "",
      resaleInstructions: "",
      recyclingInstructions: "",
      endOfLifeGuidance: "",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getDashboardStatsLocal() {
  const allPassports = getPassports();
  const allDocuments = getDocuments();
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const recentProducts = [...allPassports]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const scores = allPassports.map((p) =>
    calculateComplianceScore(p, getDocumentsForProduct(p.id)).score
  );

  return {
    total: allPassports.length,
    published: allPassports.filter((p) => p.status === "published").length,
    drafts: allPassports.filter((p) => p.status === "draft").length,
    missingEvidence: allDocuments.filter((d) => d.status === "missing").length,
    expiringCerts: allDocuments.filter(
      (d) =>
        d.expiryDate &&
        new Date(d.expiryDate) <= thirtyDays &&
        new Date(d.expiryDate) >= now
    ).length,
    expiredDocs: allDocuments.filter((d) => d.status === "expired").length,
    recentProducts,
    averageComplianceScore:
      scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
  };
}
