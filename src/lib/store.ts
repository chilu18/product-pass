import type { PassportDocument, ProductPassport } from "./types";
import { DEMO_PUBLIC_ID, DEMO_PRODUCT_ID } from "./constants";
import * as local from "./store-local";
import { isApiMode, productPassApi } from "./api-client";

export { DEMO_PUBLIC_ID, DEMO_PRODUCT_ID };

export function createEmptyPassport(): ProductPassport {
  return local.createEmptyPassport();
}

export async function getAllPassports(): Promise<ProductPassport[]> {
  if (isApiMode()) return productPassApi.getPassports();
  return local.getPassports();
}

export const getPassports = getAllPassports;

export async function getPassportById(id: string): Promise<ProductPassport | undefined> {
  if (isApiMode()) {
    try {
      return await productPassApi.getPassportById(id);
    } catch {
      return undefined;
    }
  }
  return local.getPassportById(id);
}

export async function getPassportByPublicId(
  publicId: string
): Promise<ProductPassport | undefined> {
  if (isApiMode()) {
    try {
      return await productPassApi.getPassportByPublicId(publicId);
    } catch {
      return undefined;
    }
  }
  return local.getPassportByPublicId(publicId);
}

export async function getAllDocuments(): Promise<PassportDocument[]> {
  if (isApiMode()) return productPassApi.getDocuments();
  return local.getDocuments();
}

export const getDocuments = getAllDocuments;

export async function getDocumentsForProduct(
  productId: string
): Promise<PassportDocument[]> {
  if (isApiMode()) return productPassApi.getDocuments(productId);
  return local.getDocumentsForProduct(productId);
}

export async function savePassport(passport: ProductPassport): Promise<ProductPassport> {
  if (isApiMode()) {
    try {
      await productPassApi.getPassportById(passport.id);
      return productPassApi.savePassport(passport);
    } catch {
      return productPassApi.createPassport(passport);
    }
  }
  return local.savePassport(passport);
}

export async function getDashboardStats() {
  if (isApiMode()) return productPassApi.getDashboardStats();
  return local.getDashboardStatsLocal();
}
