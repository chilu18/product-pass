"use server";

import { revalidatePath } from "next/cache";
import type { ProductPassport } from "@/types";
import { createEmptyPassport, savePassport } from "@/lib/store";

export async function savePassportAction(passport: ProductPassport): Promise<ProductPassport> {
  const saved = savePassport(passport);
  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath(`/products/${passport.id}/edit`);
  revalidatePath(`/passport/${passport.publicId}`);
  return saved;
}

export async function createPassportAction(
  passport: ProductPassport
): Promise<ProductPassport> {
  const slug = (passport.productName ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
  const publicId = slug
    ? `${slug}-${Date.now().toString(36)}`
    : `passport-${Date.now().toString(36)}`;

  const created = {
    ...createEmptyPassport(),
    ...passport,
    id: `prod-${Date.now()}`,
    publicId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return savePassport(created);
}
