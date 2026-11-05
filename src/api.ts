import type { ImportResult, Product } from "./types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new Error("API sunucusuna ulaşılamıyor. ASP.NET Core backend'in ve PostgreSQL servisinin çalıştığını kontrol edin.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    if (body?.message) {
      throw new Error(body.message);
    }

    if (response.status >= 500) {
      throw new Error(`API isteği sunucu hatası verdi (${response.status}). Backend günlüğünü ve PostgreSQL bağlantısını kontrol edin.`);
    }

    throw new Error(`İstek başarısız oldu (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export const getProducts = () => request<Product[]>("/api/products");

export const getProduct = (gtin: string, authorized = false) => {
  const query = authorized ? "?rol=yetkili" : "";
  return request<Product>(`/api/products/${encodeURIComponent(gtin)}${query}`);
};

export async function importCsv(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append("file", file);
  return request<ImportResult>("/api/imports/csv", { method: "POST", body: formData });
}
