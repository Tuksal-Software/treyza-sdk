import { useState, useMemo, useCallback } from "react";

interface UseFilterReturn<T extends Record<string, unknown>> {
  filters: T;
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  clearFilters: () => void;
  activeCount: number;
}

export function useFilter<T extends Record<string, unknown>>(initialFilters: T): UseFilterReturn<T> {
  const [filters, setFilters] = useState<T>(initialFilters);

  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const activeCount = useMemo(() => {
    return Object.keys(filters).filter((key) => {
      const current = filters[key];
      const initial = initialFilters[key];
      if (current === null || current === undefined || current === "") return false;
      return current !== initial;
    }).length;
  }, [filters, initialFilters]);

  return { filters, setFilter, clearFilters, activeCount };
}
