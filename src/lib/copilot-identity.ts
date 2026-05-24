const PRODUCT_TYPES: { pattern: RegExp; label: string; category: string; imageKey: string }[] = [
  { pattern: /\btote\s*bag\b|\breusable\s+tote\b/i, label: "Reusable Tote Bag", category: "Textile accessory", imageKey: "tote" },
  { pattern: /\btote\b|\bshopping\s+bag\b/i, label: "Tote Bag", category: "Textile accessory", imageKey: "tote" },
  { pattern: /\bhoodie\b/i, label: "Hoodie", category: "Apparel", imageKey: "hoodie" },
  { pattern: /\bt-?shirt\b|\btee\b/i, label: "T-Shirt", category: "Apparel", imageKey: "tshirt" },
  { pattern: /\bjeans\b|\bdenim\b/i, label: "Jeans", category: "Apparel", imageKey: "jeans" },
  { pattern: /\bdress\b/i, label: "Dress", category: "Apparel", imageKey: "dress" },
  { pattern: /\bjacket\b|\bcoat\b/i, label: "Jacket", category: "Apparel", imageKey: "jacket" },
  { pattern: /\bscarf\b/i, label: "Scarf", category: "Textile accessory", imageKey: "scarf" },
  { pattern: /\bsneakers?\b|\btrainers\b|\bfootwear\b/i, label: "Sneakers", category: "Footwear", imageKey: "footwear" },
  { pattern: /\bbackpack\b/i, label: "Backpack", category: "Textile accessory", imageKey: "bag" },
];

const STOCK_IMAGES: Record<string, string> = {
  tote: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&q=80",
  bag: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=600&fit=crop",
  hoodie: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop",
  tshirt: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop",
  jeans: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=600&fit=crop",
  dress: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop",
  jacket: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop",
  scarf: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
  footwear: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop",
  textile: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
  default: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
};

function detectProductType(notes: string) {
  return PRODUCT_TYPES.find(({ pattern }) => pattern.test(notes));
}

function materialAdjectives(notes: string): string[] {
  const lower = notes.toLowerCase();
  const adjectives: string[] = [];
  if (/organic/i.test(lower)) adjectives.push("Organic");
  if (/recycled/i.test(lower)) adjectives.push("Recycled");
  if (/sustainable/i.test(lower) && !adjectives.includes("Sustainable")) adjectives.push("Sustainable");
  if (/reusable/i.test(lower)) adjectives.push("Reusable");
  return adjectives;
}

export function inferProductName(notes: string): string {
  const type = detectProductType(notes);
  let adjectives = materialAdjectives(notes);
  const base = type?.label ?? "Product";

  adjectives = adjectives.filter(
    (a) => !(a === "Reusable" && /reusable/i.test(base))
  );

  if (/recycled cotton/i.test(notes) && !adjectives.includes("Recycled")) {
    adjectives = ["Recycled Cotton", ...adjectives.filter((a) => a !== "Recycled")];
  }

  if (adjectives.length > 0) {
    const label = adjectives[0].includes("Cotton") ? adjectives[0] : adjectives.slice(0, 2).join(" ");
    return `${label} ${base}`.replace(/\s+/g, " ").trim();
  }
  return base;
}

export function inferCategory(notes: string): string {
  const type = detectProductType(notes);
  if (type) return type.category;
  if (/textile|fabric|apparel|fashion|clothing/i.test(notes)) return "Textile";
  return "Apparel";
}

export function generateSku(productName: string, brandPrefix = "PP"): string {
  const slug = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 16);
  const hash = slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 900 + 100;
  return `${brandPrefix}-${slug || "ITEM"}-${hash}`;
}

export function inferImageUrl(notes: string): string {
  const type = detectProductType(notes);
  const key = type?.imageKey ?? "textile";
  return STOCK_IMAGES[key] ?? STOCK_IMAGES.default;
}

export function polishDescription(
  notes: string,
  productName: string,
  origin: string,
  materialsSummary: string | null
): string {
  const trimmed = notes.trim().replace(/\s+/g, " ");
  if (trimmed.length > 120 && /^[A-Z]/.test(trimmed)) {
    const first = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return first.endsWith(".") ? first : `${first}.`;
  }

  const parts = [
    `The ${productName} is designed for everyday use with a focus on traceability and responsible sourcing.`,
    materialsSummary,
    origin ? `Manufactured in ${origin}.` : null,
  ].filter(Boolean);

  return parts.join(" ");
}
