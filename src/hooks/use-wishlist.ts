import { useState, useEffect, useCallback } from "react";
import type { WishlistItem } from "../types";
import { apiFetch, isPreviewMode } from "./_api";
import { adaptWishlistItem } from "./_adapters";

interface UseWishlistResult {
  items: WishlistItem[];
  add: (productId: string) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

function isAuthenticated(): boolean {
  return !!window.__TREYZA_CUSTOMER__;
}

export function useWishlist(): UseWishlistResult {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const fetchItems = useCallback(async () => {
    if (isPreviewMode()) return;
    if (!isAuthenticated()) {
      setItems([]);
      return;
    }
    try {
      const data = await apiFetch<unknown[]>("/favorites");
      const raw = Array.isArray(data) ? data : [];
      setItems(raw.map((it) => adaptWishlistItem(it as Parameters<typeof adaptWishlistItem>[0])));
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    fetchItems();
    const handler = () => { fetchItems(); };
    window.addEventListener("treyza:wishlist:updated", handler);
    window.addEventListener("treyza:customer:updated", handler);
    return () => {
      window.removeEventListener("treyza:wishlist:updated", handler);
      window.removeEventListener("treyza:customer:updated", handler);
    };
  }, [fetchItems]);

  const add = useCallback(async (productId: string) => {
    if (isPreviewMode() || !isAuthenticated()) {
      const list = window.__TREYZA_WISHLIST__ || [];
      if (!list.includes(productId)) list.push(productId);
      window.__TREYZA_WISHLIST__ = list;
      window.dispatchEvent(new CustomEvent("treyza:wishlist:updated"));
      return;
    }
    await apiFetch("/favorites", "POST", { productId: parseInt(productId, 10) });
    window.dispatchEvent(new CustomEvent("treyza:wishlist:updated"));
  }, []);

  const remove = useCallback(async (productId: string) => {
    if (isPreviewMode() || !isAuthenticated()) {
      const list = window.__TREYZA_WISHLIST__ || [];
      const idx = list.indexOf(productId);
      if (idx >= 0) list.splice(idx, 1);
      window.__TREYZA_WISHLIST__ = list;
      window.dispatchEvent(new CustomEvent("treyza:wishlist:updated"));
      return;
    }
    await apiFetch(`/favorites/${parseInt(productId, 10)}`, "DELETE");
    window.dispatchEvent(new CustomEvent("treyza:wishlist:updated"));
  }, []);

  const toggle = useCallback(async (productId: string) => {
    const inList = items.some((i) => i.productId === productId) ||
      (window.__TREYZA_WISHLIST__ || []).includes(productId);
    if (inList) await remove(productId);
    else await add(productId);
  }, [items, add, remove]);

  const isInWishlist = useCallback(
    (productId: string) =>
      items.some((i) => i.productId === productId) ||
      (window.__TREYZA_WISHLIST__ || []).includes(productId),
    [items],
  );

  return { items, add, remove, toggle, isInWishlist };
}
