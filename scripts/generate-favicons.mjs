#!/usr/bin/env node
/**
 * Generates PNG favicon assets and favicon.ico from public/icon.svg
 * Run: node scripts/generate-favicons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const svgPath = path.join(root, "public", "icon.svg");
const iconsDir = path.join(root, "public", "icons");

fs.mkdirSync(iconsDir, { recursive: true });

const svg = fs.readFileSync(svgPath);

const sizes = [
  { name: "favicon-16.png", size: 16 },
  { name: "favicon-32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

const pngBuffers = {};

for (const { name, size } of sizes) {
  const outPath = name.startsWith("icon-") || name.startsWith("apple")
    ? path.join(iconsDir, name)
    : path.join(root, "public", name);
  const buffer = await sharp(svg).resize(size, size).png().toBuffer();
  fs.writeFileSync(outPath, buffer);
  if (size === 16 || size === 32) pngBuffers[size] = buffer;
  console.log("Wrote", outPath);
}

const ico = await pngToIco([pngBuffers[16], pngBuffers[32]]);
fs.writeFileSync(path.join(root, "public", "favicon.ico"), ico);
console.log("Wrote public/favicon.ico");
