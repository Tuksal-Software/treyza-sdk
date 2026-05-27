declare global {
  interface Window {
    __TREYZA_TOKEN__?: string;
    __TREYZA_STORE__?: { slug: string; apiUrl: string; name: string; currency: string; locale: string; logo?: string; socialLinks?: Record<string, string> };
    __TREYZA_CONFIG__?: Record<string, unknown>;
    __TREYZA_CUSTOMER__?: { id: string; email: string; firstName?: string; lastName?: string; avatar?: string; phone?: string } | null;
    __TREYZA_WISHLIST__?: string[];
  }
}

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  status?: number;
  pagination?: { total: number; page: number; limit: number; totalPages: number };
}

export function buildApiUrl(path: string): string {
  const store = window.__TREYZA_STORE__;
  if (!store?.apiUrl || !store?.slug) return "";
  return `${store.apiUrl}/api/${store.slug}/storefront${path}`;
}

export function buildGlobalApiUrl(path: string): string {
  const store = window.__TREYZA_STORE__;
  if (!store?.apiUrl) return "";
  return `${store.apiUrl}${path}`;
}

async function fetchJsonRaw<T>(url: string, method: string, body?: unknown): Promise<ApiEnvelope<T>> {
  if (!url) throw new Error("Treyza store context yok");
  const token = window.__TREYZA_TOKEN__;
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return (await res.json()) as ApiEnvelope<T>;
}

export async function apiFetch<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const envelope = await fetchJsonRaw<T>(buildApiUrl(path), method, body);
  return (envelope?.data ?? (envelope as unknown)) as T;
}

export async function apiFetchEnvelope<T>(path: string, method = "GET", body?: unknown): Promise<ApiEnvelope<T>> {
  return fetchJsonRaw<T>(buildApiUrl(path), method, body);
}

export async function apiFetchGlobal<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const envelope = await fetchJsonRaw<T>(buildGlobalApiUrl(path), method, body);
  return (envelope?.data ?? (envelope as unknown)) as T;
}

export function isPreviewMode(): boolean {
  try {
    const token = window.__TREYZA_TOKEN__;
    if (!token) return true;
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    return !payload.scopes?.includes("cart:write");
  } catch {
    return true;
  }
}
