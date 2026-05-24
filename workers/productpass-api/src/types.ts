export type EvidenceStatus =
  | "missing"
  | "uploaded"
  | "needs_review"
  | "verified"
  | "expired";

export type VisibilityLevel =
  | "public"
  | "private"
  | "regulator"
  | "recycler"
  | "repairer"
  | "supplier";

export type PassportLevel = "model" | "batch" | "item";
export type ClaimType =
  | "organic"
  | "recycled"
  | "carbon_neutral"
  | "biodegradable"
  | "fair_trade"
  | "ethical_sourcing"
  | "repairable"
  | "recyclable";
export type DocumentType =
  | "certificate"
  | "supplier_declaration"
  | "lab_report"
  | "audit"
  | "invoice"
  | "chain_of_custody"
  | "lifecycle_assessment"
  | "other";
export type PassportStatus = "draft" | "published";

export interface Material {
  id: string;
  name: string;
  percentage: number;
  recycledContentPercentage: number;
  sourceCountry: string;
  supplierName: string;
  evidenceStatus: EvidenceStatus;
  visibility: VisibilityLevel;
}

export interface SustainabilityClaim {
  id: string;
  text: string;
  claimType: ClaimType;
  evidenceRequired: boolean;
  evidenceStatus: EvidenceStatus;
  visibility: VisibilityLevel;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  expiryDate: string;
  documentUrl?: string;
  visibility: VisibilityLevel;
}

export interface CareAndLifecycle {
  careInstructions: string;
  repairInstructions: string;
  reuseInstructions: string;
  resaleInstructions: string;
  recyclingInstructions: string;
  sparePartsUrl?: string;
  endOfLifeGuidance: string;
}

export interface PassportDocument {
  id: string;
  name: string;
  type: DocumentType;
  linkedProductId: string;
  linkedClaimId?: string;
  supplier: string;
  expiryDate?: string;
  status: EvidenceStatus;
  visibility: VisibilityLevel;
}

export interface ProductPassport {
  id: string;
  publicId: string;
  status: PassportStatus;
  productName: string;
  sku: string;
  batchNumber: string;
  category: string;
  description: string;
  imageUrl?: string;
  brandName: string;
  manufacturer: string;
  countryOfOrigin: string;
  productionDate: string;
  passportLevel: PassportLevel;
  materials: Material[];
  claims: SustainabilityClaim[];
  certifications: Certification[];
  lifecycle: CareAndLifecycle;
  createdAt: string;
  updatedAt: string;
}

export interface Env {
  DB: D1Database;
  API_KEY?: string;
  ALLOWED_ORIGINS?: string;
}

export interface DashboardStats {
  total: number;
  published: number;
  drafts: number;
  missingEvidence: number;
  expiringCerts: number;
  expiredDocs: number;
  recentProducts: ProductPassport[];
  averageComplianceScore: number;
}

export function parsePassport(row: { payload: string }): ProductPassport {
  return JSON.parse(row.payload) as ProductPassport;
}

export function parseDocument(row: { payload: string }): PassportDocument {
  return JSON.parse(row.payload) as PassportDocument;
}
