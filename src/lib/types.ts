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

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface Supplier {
  id: string;
  name: string;
  country?: string;
}

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

export interface ComplianceResult {
  score: number;
  missingFields: string[];
  missingEvidence: string[];
  recommendedAction: string;
  breakdown: {
    identity: number;
    materials: number;
    origin: number;
    lifecycle: number;
    evidence: number;
    certifications: number;
    readiness: number;
  };
}

export interface CopilotResponse {
  productName: string;
  sku: string;
  category: string;
  productDescription: string;
  imageUrl: string;
  materials: { name: string; percentage: number; recycledContentPercentage: number }[];
  careInstructions: string;
  recyclingInstructions: string;
  sustainabilitySummary: string;
  missingEvidenceChecklist: string[];
  greenClaimsWarnings: string[];
}

export interface DashboardStats {
  totalPassports: number;
  publishedPassports: number;
  draftPassports: number;
  missingEvidenceWarnings: number;
  expiringCertificates: number;
  averageComplianceScore: number;
}
