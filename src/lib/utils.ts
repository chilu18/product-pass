export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-50 border-emerald-200";
  if (score >= 60) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

export const CLAIM_TYPE_LABELS: Record<string, string> = {
  organic: "Organic",
  recycled: "Recycled",
  carbon_neutral: "Carbon Neutral",
  biodegradable: "Biodegradable",
  fair_trade: "Fair Trade",
  ethical_sourcing: "Ethical Sourcing",
  repairable: "Repairable",
  recyclable: "Recyclable",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  certificate: "Certificate",
  supplier_declaration: "Supplier Declaration",
  lab_report: "Lab Report",
  audit: "Audit",
  invoice: "Invoice",
  chain_of_custody: "Chain of Custody",
  lifecycle_assessment: "Lifecycle Assessment",
  other: "Other",
};

export const EVIDENCE_CLAIM_KEYWORDS = [
  "organic",
  "recycled",
  "carbon neutral",
  "biodegradable",
  "ethical",
  "fair trade",
  "responsible sourcing",
  "low carbon",
  "sustainable",
];
