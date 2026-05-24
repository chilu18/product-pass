import type { PassportDocument, ProductPassport } from "./types";

export interface DashboardStatsResponse {
  total: number;
  published: number;
  drafts: number;
  missingEvidence: number;
  expiringCerts: number;
  expiredDocs: number;
  recentProducts: ProductPassport[];
  averageComplianceScore: number;
}

function getConfig() {
  const baseUrl = process.env.PRODUCTPASS_API_URL?.replace(/\/$/, "");
  const apiKey = process.env.PRODUCTPASS_API_KEY;
  if (!baseUrl) return null;
  return { baseUrl, apiKey };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const config = getConfig();
  if (!config) throw new Error("PRODUCTPASS_API_URL is not configured");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (config.apiKey) headers["X-API-Key"] = config.apiKey;

  const res = await fetch(`${config.baseUrl}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ProductPass API ${res.status}: ${body}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function isApiMode(): boolean {
  return Boolean(process.env.PRODUCTPASS_API_URL);
}

export const productPassApi = {
  getPassports: () => request<ProductPassport[]>("/v1/passports"),
  getPassportById: (id: string) => request<ProductPassport>(`/v1/passports/${id}`),
  getPassportByPublicId: (publicId: string) =>
    request<ProductPassport>(`/v1/passports/by-public-id/${publicId}`),
  savePassport: (passport: ProductPassport) =>
    request<ProductPassport>(`/v1/passports/${passport.id}`, {
      method: "PUT",
      body: JSON.stringify(passport),
    }),
  createPassport: (passport: ProductPassport) =>
    request<ProductPassport>("/v1/passports", {
      method: "POST",
      body: JSON.stringify(passport),
    }),
  getDocuments: (productId?: string) =>
    request<PassportDocument[]>(
      productId ? `/v1/documents?productId=${encodeURIComponent(productId)}` : "/v1/documents"
    ),
  getDashboardStats: () => request<DashboardStatsResponse>("/v1/dashboard/stats"),
};
