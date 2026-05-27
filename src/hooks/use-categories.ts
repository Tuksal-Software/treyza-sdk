import { useState, useEffect } from "react";
import type { Category, UseCategoriesOptions } from "../types";
import { apiFetch } from "./_api";
import { adaptCategory } from "./_adapters";

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export function useCategories(options: UseCategoriesOptions = {}): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { parentId, depth } = options;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const useTree = depth !== undefined || parentId === "root";
    const path = useTree ? "/categories/tree" : "/categories";

    apiFetch<unknown[]>(path)
      .then((data) => {
        if (cancelled) return;
        const raw = Array.isArray(data) ? data : [];
        let adapted = raw.map((c) => adaptCategory(c as Parameters<typeof adaptCategory>[0]));
        if (parentId && parentId !== "root") {
          adapted = adapted.filter((c) => c.parentId === parentId);
        } else if (!useTree && parentId === "root") {
          adapted = adapted.filter((c) => !c.parentId);
        }
        setCategories(adapted);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [parentId, depth]);

  return { categories, loading, error };
}
