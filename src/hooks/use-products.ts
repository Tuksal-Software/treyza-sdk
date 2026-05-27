import { useState, useEffect } from "react";
import type { Product, UseProductsOptions } from "../types";
import { apiFetchEnvelope } from "./_api";
import { adaptProduct } from "./_adapters";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

const SORT_MAP: Record<string, string> = {
  newest: "newest",
  oldest: "oldest",
  "price-asc": "price-asc",
  "price-desc": "price-desc",
  bestseller: "bestseller",
  "best-sellers": "bestseller",
  discounted: "discounted",
  random: "random",
};

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const { limit, categoryId, sort, search } = options;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.set("limit", String(limit ?? 24));
    params.set("page", "1");
    if (categoryId) params.set("categorySlug", categoryId);
    if (sort) params.set("sort", SORT_MAP[sort] ?? sort);
    if (search) params.set("search", search);

    apiFetchEnvelope<unknown[]>(`/products?${params.toString()}`)
      .then((envelope) => {
        if (cancelled) return;
        const raw = Array.isArray(envelope.data) ? envelope.data : [];
        setProducts(raw.map((item) => adaptProduct(item as Parameters<typeof adaptProduct>[0])));
        const p = envelope.pagination;
        setHasMore(p ? p.page * p.limit < p.total : false);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [limit, categoryId, sort, search]);

  return { products, loading, error, hasMore };
}
