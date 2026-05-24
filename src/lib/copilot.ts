import type { CopilotResponse } from "@/types";
import { GREEN_CLAIM_KEYWORDS } from "./constants";
import {
  generateSku,
  inferCategory,
  inferImageUrl,
  inferProductName,
  polishDescription,
} from "./copilot-identity";
import { generateProductImage } from "./product-image";

export function generateCopilotResponse(notes: string, brandPrefix = "PP"): CopilotResponse {
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
  const plainCottonMatch = notes.match(/(\d+)%?\s*cotton/i);
  const plainMaterialMatch = notes.match(/(\d+)%?\s*([a-z]+)/i);

  if (cottonMatch) {
    materials.push({
      name: "Organic cotton",
      percentage: Number(cottonMatch[1]),
      recycledContentPercentage: 0,
    });
    missingEvidenceChecklist.push("Organic cotton certificate");
  } else if (plainCottonMatch && !recycledCottonMatch) {
    materials.push({
      name: "Cotton",
      percentage: Number(plainCottonMatch[1]),
      recycledContentPercentage: 0,
    });
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
  if (materials.length === 0 && plainMaterialMatch) {
    materials.push({
      name: plainMaterialMatch[2],
      percentage: Number(plainMaterialMatch[1]),
      recycledContentPercentage: 0,
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

  const productName = inferProductName(notes);
  const sku = generateSku(productName, brandPrefix);
  const category = inferCategory(notes);
  const imageUrl = inferImageUrl(notes);

  const materialsSummary =
    materials.length > 0
      ? `Made with ${materials.map((m) => `${m.percentage}% ${m.name.toLowerCase()}`).join(" and ")}.`
      : null;

  const productDescription = polishDescription(notes, productName, origin, materialsSummary);

  const sustainabilitySummary = [
    materialsSummary,
    origin ? `Manufactured in ${origin}.` : null,
    /reusable|reuse/i.test(notes) ? "Designed for repeated use." : null,
    /repair/i.test(notes) ? "Repairable through simple maintenance." : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    productName,
    sku,
    category,
    productDescription,
    imageUrl,
    materials,
    careInstructions: careInstructions.trim(),
    recyclingInstructions,
    sustainabilitySummary: sustainabilitySummary || "Review and refine sustainability summary before publishing.",
    missingEvidenceChecklist: [...new Set(missingEvidenceChecklist)],
    greenClaimsWarnings: [...new Set(greenClaimsWarnings)],
  };
}

async function generateWithOpenAI(notes: string, brandPrefix: string): Promise<CopilotResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are ProductPass Copilot for Digital Product Passports in fashion/textiles. Parse rough product notes into JSON with: productName, sku (format BRAND-TYPE-CODE, use brand prefix "${brandPrefix}"), category, productDescription (consumer-friendly paragraph), materials (array of {name, percentage, recycledContentPercentage}), careInstructions, recyclingInstructions, sustainabilitySummary, missingEvidenceChecklist (array), greenClaimsWarnings (array). Do not include imageUrl. Flag green claims needing evidence.`,
          },
          { role: "user", content: notes },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content) as Partial<CopilotResponse>;
    const base = generateCopilotResponse(notes, brandPrefix);
    return { ...base, ...parsed };
  } catch {
    return null;
  }
}

export async function generateCopilotResponseAsync(
  notes: string,
  brandPrefix = "PP"
): Promise<CopilotResponse> {
  const base = (await generateWithOpenAI(notes, brandPrefix)) ?? generateCopilotResponse(notes, brandPrefix);

  const materialsSummary =
    base.materials.length > 0
      ? `Made with ${base.materials.map((m) => `${m.percentage}% ${m.name.toLowerCase()}`).join(" and ")}.`
      : null;

  const { imageUrl } = await generateProductImage({
    notes,
    productName: base.productName,
    materialsSummary,
  });

  return { ...base, imageUrl };
}
