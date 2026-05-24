import sharp from "sharp";
import { inferImageUrl } from "./copilot-identity";

export type ImageProvider = "openai" | "stability" | "stock";

interface GenerateProductImageInput {
  notes: string;
  productName: string;
  materialsSummary?: string | null;
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

async function toDataUrl(imageBuffer: Buffer): Promise<string> {
  const jpeg = await sharp(imageBuffer)
    .resize(800, 600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

async function fetchAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch generated image (${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  return toDataUrl(buffer);
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
        size: model === "dall-e-3" ? "1024x1024" : "1024x1024",
        response_format: "b64_json",
        quality: "standard",
      }),
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
  if (configured === "openai") return ["openai", "stock"];
  if (configured === "stability") return ["stability", "stock"];
  if (configured === "stock") return ["stock"];

  const providers: ImageProvider[] = [];
  if (process.env.OPENAI_API_KEY) providers.push("openai");
  if (process.env.STABILITY_API_KEY) providers.push("stability");
  providers.push("stock");
  return providers;
}

export async function generateProductImage(input: GenerateProductImageInput): Promise<{
  imageUrl: string;
  source: ImageProvider;
}> {
  const prompt = buildPrompt(input);
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
      return { imageUrl: inferImageUrl(input.notes), source: "stock" };
    }
  }

  return { imageUrl: inferImageUrl(input.notes), source: "stock" };
}
