import { useState, useEffect } from "react";
import type { SearchResult, UseSearchOptions } from "../types";
import { apiFetchEnvelope } from "./_api";
import { adaptProduct } from "./_adapters";

interface UseSearchResult {
  results: SearchResult | null;
  loading: boolean;
  error: string | null;
}

export function useSearch(query: string, options: UseSearchOptions = {}): UseSearchResult {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { limit, categoryId } = options;

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ search: query, page: "1" });
    params.set("limit", String(limit ?? 24));
    if (categoryId) params.set("categorySlug", categoryId);

    apiFetchEnvelope<unknown[]>(`/products?${params.toString()}`)
      .then((envelope) => {
        if (cancelled) return;
        const raw = Array.isArray(envelope.data) ? envelope.data : [];
        const products = raw.map((item) => adaptProduct(item as Parameters<typeof adaptProduct>[0]));
        setResults({
          products,
          categories: [],
          totalCount: envelope.pagination?.total ?? products.length,
        });
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [query, limit, categoryId]);

  return { results, loading, error };
}
