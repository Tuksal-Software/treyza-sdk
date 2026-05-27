import { useState, useMemo } from "react";

interface UsePaginationReturn {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  next: () => void;
  prev: () => void;
  goTo: (page: number) => void;
  startIndex: number;
  endIndex: number;
}

export function usePagination(totalItems: number, pageSize: number = 12): UsePaginationReturn {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalItems / pageSize)), [totalItems, pageSize]);

  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  function next() {
    setPage((p) => Math.min(p + 1, totalPages));
  }

  function prev() {
    setPage((p) => Math.max(p - 1, 1));
  }

  function goTo(target: number) {
    setPage(Math.max(1, Math.min(target, totalPages)));
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return { page, totalPages, hasNext, hasPrev, next, prev, goTo, startIndex, endIndex };
}
