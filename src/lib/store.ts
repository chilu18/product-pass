import fs from "node:fs";
import path from "node:path";
import type { PassportDocument, ProductPassport } from "./types";
import { DEMO_PUBLIC_ID, DEMO_PRODUCT_ID } from "./constants";
import { calculateComplianceScore } from "./compliance";

export { DEMO_PUBLIC_ID, DEMO_PRODUCT_ID };

const now = new Date().toISOString();

export const demoPassport: ProductPassport = {
  id: DEMO_PRODUCT_ID,
  publicId: DEMO_PUBLIC_ID,
  status: "published",
  productName: "HeySalad Reusable Tote Bag",
  sku: "HS-TOTE-001",
  batchNumber: "BATCH-2025-Q1-042",
  category: "Textile accessory",
  description:
    "A durable reusable tote bag designed for everyday grocery and lifestyle use. Made with recycled cotton and polyester for a lower environmental footprint.",
  imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=600&fit=crop",
  brandName: "HeySalad",
  manufacturer: "EcoTextiles Portugal",
  countryOfOrigin: "Designed in the UK, manufactured in Portugal",
  productionDate: "2025-01-15",
  passportLevel: "batch",
  materials: [
    {
      id: "mat-1",
      name: "Recycled cotton",
      percentage: 70,
      recycledContentPercentage: 100,
      sourceCountry: "Portugal",
      supplierName: "EcoTextiles Portugal",
      evidenceStatus: "uploaded",
      visibility: "public",
    },
    {
      id: "mat-2",
      name: "Recycled polyester",
      percentage: 30,
      recycledContentPercentage: 100,
      sourceCountry: "Spain",
      supplierName: "GreenFiber Co.",
      evidenceStatus: "needs_review",
      visibility: "public",
    },
  ],
  claims: [
    {
      id: "claim-1",
      text: "Made with recycled materials",
      claimType: "recycled",
      evidenceRequired: true,
      evidenceStatus: "uploaded",
      visibility: "public",
    },
    {
      id: "claim-2",
      text: "Designed for reuse",
      claimType: "recyclable",
      evidenceRequired: false,
      evidenceStatus: "verified",
      visibility: "public",
    },
    {
      id: "claim-3",
      text: "Repairable through simple stitching",
      claimType: "repairable",
      evidenceRequired: false,
      evidenceStatus: "verified",
      visibility: "public",
    },
    {
      id: "claim-4",
      text: "Recyclable through textile recycling points",
      claimType: "recyclable",
      evidenceRequired: true,
      evidenceStatus: "uploaded",
      visibility: "public",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Recycled Content Declaration",
      issuer: "GreenFiber Co.",
      expiryDate: "2026-06-30",
      documentUrl: "#",
      visibility: "public",
    },
  ],
  lifecycle: {
    careInstructions: "Cold wash, air dry, do not bleach.",
    repairInstructions:
      "Small tears can be stitched by hand or repaired by a local tailor.",
    reuseInstructions: "Designed for repeated grocery and daily use.",
    resaleInstructions:
      "When no longer needed, consider donating or reselling through second-hand platforms.",
    recyclingInstructions: "Use a local textile recycling point at end of life.",
    endOfLifeGuidance:
      "Remove any non-textile components before recycling. Check local textile collection points.",
  },
  createdAt: "2025-01-10T10:00:00Z",
  updatedAt: now,
};

export const draftPassport: ProductPassport = {
  id: "prod-organic-hoodie",
  publicId: "organic-cotton-hoodie-draft",
  status: "draft",
  productName: "Organic Cotton Hoodie",
  sku: "OC-HOOD-002",
  batchNumber: "BATCH-2025-Q2-001",
  category: "Apparel",
  description: "Premium organic cotton hoodie with minimal environmental impact.",
  brandName: "HeySalad",
  manufacturer: "",
  countryOfOrigin: "",
  productionDate: "2025-04-01",
  passportLevel: "model",
  materials: [
    {
      id: "mat-3",
      name: "Organic cotton",
      percentage: 80,
      recycledContentPercentage: 0,
      sourceCountry: "",
      supplierName: "",
      evidenceStatus: "missing",
      visibility: "public",
    },
    {
      id: "mat-4",
      name: "Recycled polyester",
      percentage: 20,
      recycledContentPercentage: 100,
      sourceCountry: "Portugal",
      supplierName: "EcoTextiles Portugal",
      evidenceStatus: "missing",
      visibility: "public",
    },
  ],
  claims: [
    {
      id: "claim-5",
      text: "Made with 80% organic cotton",
      claimType: "organic",
      evidenceRequired: true,
      evidenceStatus: "missing",
      visibility: "public",
    },
    {
      id: "claim-6",
      text: "Carbon neutral production",
      claimType: "carbon_neutral",
      evidenceRequired: true,
      evidenceStatus: "missing",
      visibility: "public",
    },
  ],
  certifications: [],
  lifecycle: {
    careInstructions: "Wash cold, tumble dry low.",
    repairInstructions: "",
    reuseInstructions: "",
    resaleInstructions: "",
    recyclingInstructions: "",
    endOfLifeGuidance: "",
  },
  createdAt: "2025-03-15T09:00:00Z",
  updatedAt: "2025-03-20T11:00:00Z",
};

export const mockDocuments: PassportDocument[] = [
  {
    id: "doc-1",
    name: "Supplier declaration for recycled cotton",
    type: "supplier_declaration",
    linkedProductId: DEMO_PRODUCT_ID,
    linkedClaimId: "claim-1",
    supplier: "EcoTextiles Portugal",
    expiryDate: "2026-12-31",
    status: "uploaded",
    visibility: "private",
  },
  {
    id: "doc-2",
    name: "Recycled polyester certificate",
    type: "certificate",
    linkedProductId: DEMO_PRODUCT_ID,
    linkedClaimId: "claim-1",
    supplier: "GreenFiber Co.",
    expiryDate: "2026-06-30",
    status: "needs_review",
    visibility: "private",
  },
  {
    id: "doc-3",
    name: "Organic cotton certificate",
    type: "certificate",
    linkedProductId: "prod-organic-hoodie",
    linkedClaimId: "claim-5",
    supplier: "Unknown",
    expiryDate: "2025-01-01",
    status: "missing",
    visibility: "private",
  },
  {
    id: "doc-4",
    name: "Packaging sustainability claim evidence",
    type: "lifecycle_assessment",
    linkedProductId: DEMO_PRODUCT_ID,
    supplier: "HeySalad",
    status: "missing",
    visibility: "private",
  },
  {
    id: "doc-5",
    name: "Textile recycling compliance audit",
    type: "audit",
    linkedProductId: DEMO_PRODUCT_ID,
    linkedClaimId: "claim-4",
    supplier: "EcoTextiles Portugal",
    expiryDate: "2025-02-01",
    status: "expired",
    visibility: "regulator",
  },
];

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

export const getAllPassports = getPassports;

export function getPassportById(id: string): ProductPassport | undefined {
  return passports.find((p) => p.id === id);
}

export function getPassportByPublicId(publicId: string): ProductPassport | undefined {
  return passports.find((p) => p.publicId === publicId);
}

export function getDocuments(): PassportDocument[] {
  return [...documents];
}

export const getAllDocuments = getDocuments;

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

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function getDashboardStats() {
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
