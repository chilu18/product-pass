import sharp from "sharp";
import { inferImageUrl, inferProductName } from "./copilot-identity";

export type ImageProvider = "openai" | "stability" | "stock" | "placeholder";

interface GenerateProductImageInput {
  notes: string;
  productName: string;
  materialsSummary?: string | null;
}

/** Verified Unsplash IDs (HEAD 200) — primary + alternates per category */
const STOCK_CANDIDATES: Record<string, string[]> = {
  tote: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=600&fit=crop&q=80",
  ],
  bag: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=600&fit=crop&q=80"],
  hoodie: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=600&fit=crop&q=80"],
  tshirt: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&q=80"],
  jeans: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=600&fit=crop&q=80"],
  dress: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop&q=80"],
  jacket: ["https://images.unsplash.com/photo-1551028711-00167b16eac5?w=800&h=600&fit=crop&q=80"],
  footwear: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop&q=80"],
  default: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&q=80"],
};

function stockCandidatesForNotes(notes: string): string[] {
  const primary = inferImageUrl(notes);
  const key = Object.entries(STOCK_CANDIDATES).find(([, urls]) => urls.includes(primary))?.[0];
  const alternates = key ? STOCK_CANDIDATES[key] : STOCK_CANDIDATES.default;
  return [...new Set([primary, ...alternates, ...STOCK_CANDIDATES.default])];
}

function buildPrompt({ notes, productName, materialsSummary }: GenerateProductImageInput): string {
  const materialHint = materialsSummary ? `${materialsSummary} ` : "";
  return [
    `Professional e-commerce product photo of a ${productName}.`,
    materialHint,
    notes.trim().slice(0, 240),
    "Single product centered on a clean white studio background.",
    "Soft natural lighting, fashion catalog style, no people, no text, no watermark, no logo.",
  ]
    .filter(Boolean)
    .join(" ");
}

function svgPlaceholderDataUrl(productName: string): string {
  const label = productName.slice(0, 36).replace(/[<>&'"]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#ecfdf5"/>
  <rect x="280" y="100" width="240" height="340" rx="28" fill="#059669"/>
  <rect x="280" y="100" width="52" height="340" rx="28" fill="#047857"/>
  <text x="400" y="520" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#065f46">${label}</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

async function toDataUrl(imageBuffer: Buffer): Promise<string> {
  const jpeg = await sharp(imageBuffer)
    .resize(800, 600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) return null;
    return toDataUrl(buffer);
  } catch {
    return null;
  }
}

async function fetchStockImageAsDataUrl(notes: string, productName: string): Promise<string> {
  for (const url of stockCandidatesForNotes(notes)) {
    const dataUrl = await fetchAsDataUrl(url);
    if (dataUrl) return dataUrl;
  }
  return svgPlaceholderDataUrl(productName);
}

async function generateWithOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_IMAGE_MODEL ?? "dall-e-3";

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
        quality: "standard",
      }),
      signal: AbortSignal.timeout(55000),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { data?: { b64_json?: string; url?: string }[] };
    const item = data.data?.[0];
    if (item?.b64_json) {
      return toDataUrl(Buffer.from(item.b64_json, "base64"));
    }
    if (item?.url) {
      return fetchAsDataUrl(item.url);
    }
    return null;
  } catch {
    return null;
  }
}

async function generateWithStability(prompt: string): Promise<string | null> {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) return null;

  try {
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("output_format", "jpeg");
    form.append("aspect_ratio", "4:3");

    const res = await fetch("https://api.stability.ai/v2beta/stable-image/generate/sd3", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      body: form,
      signal: AbortSignal.timeout(55000),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { image?: string };
    if (!data.image) return null;
    return toDataUrl(Buffer.from(data.image, "base64"));
  } catch {
    return null;
  }
}

function resolveProviders(): ImageProvider[] {
  const configured = process.env.PRODUCT_IMAGE_PROVIDER?.toLowerCase();
  if (configured === "openai") return ["openai", "stability", "stock", "placeholder"];
  if (configured === "stability") return ["stability", "openai", "stock", "placeholder"];
  if (configured === "stock") return ["stock", "placeholder"];

  const providers: ImageProvider[] = [];
  if (process.env.OPENAI_API_KEY) providers.push("openai");
  if (process.env.STABILITY_API_KEY) providers.push("stability");
  providers.push("stock", "placeholder");
  return providers;
}

export async function generateProductImage(input: GenerateProductImageInput): Promise<{
  imageUrl: string;
  source: ImageProvider;
}> {
  const prompt = buildPrompt(input);
  const productName = input.productName || inferProductName(input.notes);
  const providers = resolveProviders();

  for (const provider of providers) {
    if (provider === "openai") {
      const imageUrl = await generateWithOpenAI(prompt);
      if (imageUrl) return { imageUrl, source: "openai" };
    }
    if (provider === "stability") {
      const imageUrl = await generateWithStability(prompt);
      if (imageUrl) return { imageUrl, source: "stability" };
    }
    if (provider === "stock") {
      const imageUrl = await fetchStockImageAsDataUrl(input.notes, productName);
      if (imageUrl) return { imageUrl, source: "stock" };
    }
    if (provider === "placeholder") {
      return { imageUrl: svgPlaceholderDataUrl(productName), source: "placeholder" };
    }
  }

  return { imageUrl: svgPlaceholderDataUrl(productName), source: "placeholder" };
}
