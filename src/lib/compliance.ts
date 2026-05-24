import type { ComplianceResult, ProductPassport, PassportDocument } from "@/types";

function isFilled(value: string | undefined | null): boolean {
  return Boolean(value?.trim());
}

function scoreIdentity(passport: ProductPassport): { score: number; missing: string[] } {
  const fields: [string, string][] = [
    ["Product name", passport.productName],
    ["SKU", passport.sku],
    ["Category", passport.category],
    ["Description", passport.description],
    ["Product image", passport.imageUrl ?? ""],
    ["Brand name", passport.brandName],
    ["Batch number", passport.batchNumber],
  ];
  const missing = fields.filter(([, v]) => !isFilled(v)).map(([k]) => k);
  const score = Math.round(((fields.length - missing.length) / fields.length) * 100);
  return { score, missing };
}

function scoreMaterials(passport: ProductPassport): { score: number; missing: string[] } {
  const missing: string[] = [];
  if (passport.materials.length === 0) {
    missing.push("At least one material");
    return { score: 0, missing };
  }
  passport.materials.forEach((m, i) => {
    if (!isFilled(m.name)) missing.push(`Material ${i + 1} name`);
    if (!m.percentage) missing.push(`Material ${i + 1} percentage`);
    if (!isFilled(m.sourceCountry)) missing.push(`Material ${i + 1} source country`);
    if (!isFilled(m.supplierName)) missing.push(`Material ${i + 1} supplier`);
  });
  const totalChecks = passport.materials.length * 4;
  const passed = totalChecks - missing.length;
  return { score: Math.round((passed / totalChecks) * 100), missing };
}

function scoreOrigin(passport: ProductPassport): { score: number; missing: string[] } {
  const fields: [string, string][] = [
    ["Manufacturer", passport.manufacturer],
    ["Country of origin", passport.countryOfOrigin],
    ["Production date", passport.productionDate],
  ];
  const missing = fields.filter(([, v]) => !isFilled(v)).map(([k]) => k);
  const score = Math.round(((fields.length - missing.length) / fields.length) * 100);
  return { score, missing };
}

function scoreLifecycle(passport: ProductPassport): { score: number; missing: string[] } {
  const c = passport.lifecycle;
  const fields: [string, string][] = [
    ["Care instructions", c.careInstructions],
    ["Repair instructions", c.repairInstructions],
    ["Reuse instructions", c.reuseInstructions],
    ["Recycling instructions", c.recyclingInstructions],
    ["End-of-life guidance", c.endOfLifeGuidance],
  ];
  const missing = fields.filter(([, v]) => !isFilled(v)).map(([k]) => k);
  const score = Math.round(((fields.length - missing.length) / fields.length) * 100);
  return { score, missing };
}

function scoreEvidence(
  passport: ProductPassport,
  documents: PassportDocument[]
): { score: number; missing: string[] } {
  const missing: string[] = [];
  const productDocs = documents.filter((d) => d.linkedProductId === passport.id);

  passport.claims
    .filter((c) => c.evidenceRequired)
    .forEach((claim) => {
      const doc = productDocs.find((d) => d.linkedClaimId === claim.id);
      if (!doc || doc.status === "missing") {
        missing.push(`Evidence for claim: "${claim.text}"`);
      } else if (doc.status === "expired") {
        missing.push(`Expired evidence for claim: "${claim.text}"`);
      } else if (doc.status === "needs_review") {
        missing.push(`Evidence needs review for claim: "${claim.text}"`);
      }
    });

  passport.materials.forEach((m) => {
    if (m.evidenceStatus === "missing") {
      missing.push(`Supplier declaration for ${m.name}`);
    }
    if (m.recycledContentPercentage > 0 && m.evidenceStatus !== "verified" && m.evidenceStatus !== "uploaded") {
      if (!missing.some((x) => x.includes(m.name))) {
        missing.push(`Recycled content evidence for ${m.name}`);
      }
    }
  });

  const requiredCount =
    passport.claims.filter((c) => c.evidenceRequired).length +
    passport.materials.filter((m) => m.evidenceStatus !== "verified").length;
  const covered = Math.max(0, requiredCount - missing.length);
  const score = requiredCount === 0 ? 100 : Math.round((covered / requiredCount) * 100);
  return { score: Math.min(score, 100), missing };
}

function scoreCertifications(passport: ProductPassport): { score: number; missing: string[] } {
  const missing: string[] = [];
  if (passport.certifications.length === 0) {
    return { score: 70, missing: [] };
  }
  const now = new Date();
  passport.certifications.forEach((cert) => {
    if (cert.expiryDate && new Date(cert.expiryDate) < now) {
      missing.push(`Expired certificate: ${cert.name}`);
    }
  });
  const valid = passport.certifications.filter(
    (c) => !c.expiryDate || new Date(c.expiryDate) >= now
  );
  const score = Math.round((valid.length / passport.certifications.length) * 100);
  return { score, missing };
}

function scoreReadiness(passport: ProductPassport): { score: number; missing: string[] } {
  const missing: string[] = [];
  if (passport.status !== "published") missing.push("Passport not published");
  if (!passport.publicId) missing.push("Public ID not set");
  const score = missing.length === 0 ? 100 : passport.status === "published" ? 50 : 0;
  return { score, missing };
}

export function calculateComplianceScore(
  passport: ProductPassport,
  documents: PassportDocument[] = []
): ComplianceResult {
  const identity = scoreIdentity(passport);
  const materials = scoreMaterials(passport);
  const origin = scoreOrigin(passport);
  const lifecycle = scoreLifecycle(passport);
  const evidence = scoreEvidence(passport, documents);
  const certifications = scoreCertifications(passport);
  const readiness = scoreReadiness(passport);

  const weights = {
    identity: 0.15,
    materials: 0.15,
    origin: 0.1,
    lifecycle: 0.15,
    evidence: 0.25,
    certifications: 0.1,
    readiness: 0.1,
  };

  const score = Math.round(
    identity.score * weights.identity +
      materials.score * weights.materials +
      origin.score * weights.origin +
      lifecycle.score * weights.lifecycle +
      evidence.score * weights.evidence +
      certifications.score * weights.certifications +
      readiness.score * weights.readiness
  );

  const missingFields = [
    ...identity.missing,
    ...materials.missing,
    ...origin.missing,
    ...lifecycle.missing,
  ];
  const missingEvidence = evidence.missing;

  let recommendedAction = "Review and complete all passport sections before publishing.";
  if (missingEvidence.length > 0) {
    recommendedAction = `Upload evidence: ${missingEvidence.slice(0, 2).join(", ")}${missingEvidence.length > 2 ? "…" : ""}`;
  } else if (missingFields.length > 0) {
    recommendedAction = `Complete missing fields: ${missingFields.slice(0, 2).join(", ")}${missingFields.length > 2 ? "…" : ""}`;
  } else if (passport.status !== "published") {
    recommendedAction = "All sections complete — ready to publish your passport.";
  } else {
    recommendedAction = "Passport is compliance-ready. Share the QR code with customers.";
  }

  return {
    score,
    missingFields,
    missingEvidence,
    recommendedAction,
    breakdown: {
      identity: identity.score,
      materials: materials.score,
      origin: origin.score,
      lifecycle: lifecycle.score,
      evidence: evidence.score,
      certifications: certifications.score,
      readiness: readiness.score,
    },
  };
}

export function getVerificationStatus(
  passport: ProductPassport,
  documents: PassportDocument[] = []
): "verified" | "partial" | "unverified" {
  const result = calculateComplianceScore(passport, documents);
  if (result.score >= 85 && result.missingEvidence.length === 0) return "verified";
  if (result.score >= 50) return "partial";
  return "unverified";
}

export function getDashboardStats(
  passports: ProductPassport[],
  documents: PassportDocument[]
) {
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const scores = passports.map((p) =>
    calculateComplianceScore(
      p,
      documents.filter((d) => d.linkedProductId === p.id)
    ).score
  );

  return {
    totalPassports: passports.length,
    publishedPassports: passports.filter((p) => p.status === "published").length,
    draftPassports: passports.filter((p) => p.status === "draft").length,
    missingEvidenceWarnings: documents.filter((d) => d.status === "missing").length,
    expiringCertificates: documents.filter(
      (d) =>
        d.expiryDate &&
        new Date(d.expiryDate) <= thirtyDays &&
        new Date(d.expiryDate) >= now
    ).length,
    averageComplianceScore:
      scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
  };
}
