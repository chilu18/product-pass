import type { CopilotResponse } from "@/types";
import { GREEN_CLAIM_KEYWORDS } from "./constants";

export function generateCopilotResponse(notes: string): CopilotResponse {
  const lower = notes.toLowerCase();
  const greenClaimsWarnings: string[] = [];
  const missingEvidenceChecklist: string[] = [];

  GREEN_CLAIM_KEYWORDS.forEach((keyword) => {
    if (lower.includes(keyword)) {
      greenClaimsWarnings.push(
        `Evidence required: attach a certificate, supplier declaration, audit record, or lifecycle assessment before publishing "${keyword}" claim.`
      );
      missingEvidenceChecklist.push(`Supporting document for ${keyword} claim`);
    }
  });

  const materials: CopilotResponse["materials"] = [];
  const cottonMatch = notes.match(/(\d+)%?\s*organic\s*cotton/i);
  const recycledCottonMatch = notes.match(/(\d+)%?\s*recycled\s*cotton/i);
  const polyMatch = notes.match(/(\d+)%?\s*recycled\s*polyester/i);
  const genericRecycled = notes.match(/(\d+)%?\s*recycled\s*(\w+)/gi);

  if (cottonMatch) {
    materials.push({
      name: "Organic cotton",
      percentage: Number(cottonMatch[1]),
      recycledContentPercentage: 0,
    });
    missingEvidenceChecklist.push("Organic cotton certificate");
  }
  if (recycledCottonMatch) {
    materials.push({
      name: "Recycled cotton",
      percentage: Number(recycledCottonMatch[1]),
      recycledContentPercentage: Number(recycledCottonMatch[1]),
    });
    missingEvidenceChecklist.push("Supplier declaration for recycled cotton");
  }
  if (polyMatch) {
    materials.push({
      name: "Recycled polyester",
      percentage: Number(polyMatch[1]),
      recycledContentPercentage: Number(polyMatch[1]),
    });
    missingEvidenceChecklist.push("Recycled polyester certificate");
  }
  if (materials.length === 0 && genericRecycled) {
    genericRecycled.forEach((match) => {
      const parts = match.match(/(\d+)%?\s*recycled\s*(\w+)/i);
      if (parts) {
        materials.push({
          name: `Recycled ${parts[2]}`,
          percentage: Number(parts[1]),
          recycledContentPercentage: Number(parts[1]),
        });
      }
    });
  }

  const countryMatch = notes.match(/made in ([A-Za-z\s]+?)(?:\.|,|$)/i);
  const origin = countryMatch ? countryMatch[1].trim() : "";

  let careInstructions = "";
  if (/wash cold|cold wash/i.test(notes)) careInstructions = "Wash cold, air dry.";
  if (/do not bleach/i.test(notes)) careInstructions += " Do not bleach.";

  let recyclingInstructions = "";
  if (/recycl/i.test(notes)) {
    recyclingInstructions = "Use local textile or packaging recycling points at end of life.";
  }

  const sustainabilitySummary = [
    materials.length > 0
      ? `Made with ${materials.map((m) => `${m.percentage}% ${m.name.toLowerCase()}`).join(" and ")}.`
      : null,
    origin ? `Manufactured in ${origin}.` : null,
    /reusable|reuse/i.test(notes) ? "Designed for repeated use." : null,
    /repair/i.test(notes) ? "Repairable through simple maintenance." : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    productDescription: notes.trim(),
    materials,
    careInstructions: careInstructions.trim(),
    recyclingInstructions,
    sustainabilitySummary: sustainabilitySummary || "Review and refine sustainability summary before publishing.",
    missingEvidenceChecklist: [...new Set(missingEvidenceChecklist)],
    greenClaimsWarnings: [...new Set(greenClaimsWarnings)],
  };
}
