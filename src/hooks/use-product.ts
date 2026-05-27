import { useState, useEffect } from "react";
import type { Product } from "../types";
import { apiFetch } from "./_api";
import { adaptProduct } from "./_adapters";

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export function useProduct(slug: string): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    apiFetch<Parameters<typeof adaptProduct>[0]>(`/products/slug/${encodeURIComponent(slug)}`)
      .then((data) => {
        if (!cancelled) setProduct(data ? adaptProduct(data) : null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug]);

  return { product, loading, error };
}
