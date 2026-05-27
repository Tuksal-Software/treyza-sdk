import { useState, useCallback, useEffect } from "react";
import type { CartItem } from "../types";
import { apiFetch, isPreviewMode } from "./_api";

interface AddToCartPayload {
  productId: string;
  name: string;
  price: string;
  image?: string;
  variantId?: string;
  variantName?: string;
}

interface UseCartResult {
  items: CartItem[];
  total: string;
  itemCount: number;
  loading: boolean;
  addToCart: (payload: AddToCartPayload) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

interface BackendCartItem {
  productId: number;
  variantId: number | null;
  quantity: number;
  itemUnitPrice: number;
  itemTotalPrice: number;
  product: {
    name: string;
    slug: string;
    price: { salePrice: number };
    picture: string | null;
    variantValues?: { name: string; value: string }[] | null;
  };
}

interface BackendCartResponse {
  items: BackendCartItem[];
  summary: { totalItems: number; subtotal: number; itemCount: number };
}

function adaptCartItems(backend: BackendCartResponse | null | undefined): CartItem[] {
  if (!backend?.items) return [];
  return backend.items.map((b) => ({
    id: `${b.productId}${b.variantId ? `-${b.variantId}` : ""}`,
    productId: String(b.productId),
    name: b.product.name,
    price: String(b.itemUnitPrice ?? b.product.price.salePrice),
    quantity: b.quantity,
    image: b.product.picture ?? undefined,
    variantId: b.variantId != null ? String(b.variantId) : undefined,
    variantName: b.product.variantValues?.map((v) => v.value).join(" / "),
  }));
}

function parseItemId(id: string): { productId: number; variantId?: number } {
  const [pid, vid] = id.split("-");
  return {
    productId: parseInt(pid, 10),
    variantId: vid ? parseInt(vid, 10) : undefined,
  };
}

function calcTotal(items: CartItem[]): string {
  const sum = items.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
  return sum.toFixed(2);
}

export function useCart(): UseCartResult {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (isPreviewMode()) return;
    try {
      const data = await apiFetch<BackendCartResponse>("/cart");
      setItems(adaptCartItems(data));
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (isPreviewMode()) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await apiFetch<BackendCartResponse>("/cart");
        if (!cancelled) setItems(adaptCartItems(data));
      } catch {
        /* silent */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addToCart = useCallback(async (payload: AddToCartPayload) => {
    if (isPreviewMode()) {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === payload.productId && i.variantId === payload.variantId,
        );
        if (existing) {
          return prev.map((i) =>
            i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }
        const newItem: CartItem = {
          id: `preview-${Date.now()}`,
          productId: payload.productId,
          name: payload.name,
          price: payload.price,
          quantity: 1,
          image: payload.image,
          variantId: payload.variantId,
          variantName: payload.variantName,
        };
        return [...prev, newItem];
      });
      return;
    }
    const data = await apiFetch<BackendCartResponse>("/cart/items", "POST", {
      productId: parseInt(payload.productId, 10),
      variantId: payload.variantId ? parseInt(payload.variantId, 10) : undefined,
      quantity: 1,
    });
    setItems(adaptCartItems(data));
  }, []);

  const removeFromCart = useCallback(async (id: string) => {
    if (isPreviewMode()) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    const { productId, variantId } = parseItemId(id);
    const data = await apiFetch<BackendCartResponse>(`/cart/items/${productId}`, "DELETE", { variantId });
    setItems(adaptCartItems(data));
  }, []);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    if (isPreviewMode()) {
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
      );
      return;
    }
    const { productId, variantId } = parseItemId(id);
    const data = await apiFetch<BackendCartResponse>(`/cart/items/${productId}`, "PATCH", {
      quantity,
      variantId,
    });
    setItems(adaptCartItems(data));
  }, []);

  const clearCart = useCallback(async () => {
    if (isPreviewMode()) {
      setItems([]);
      return;
    }
    await apiFetch("/cart", "DELETE");
    setItems([]);
  }, []);

  useEffect(() => {
    const onAdd = (e: Event) => {
      const detail = (e as CustomEvent<{ productId: string; variantId?: string; quantity: number }>).detail;
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === detail.productId && i.variantId === detail.variantId,
        );
        if (existing) {
          return prev.map((i) =>
            i.id === existing.id ? { ...i, quantity: i.quantity + detail.quantity } : i,
          );
        }
        const newItem: CartItem = {
          id: `preview-${Date.now()}`,
          productId: detail.productId,
          name: detail.productId,
          price: "0",
          quantity: detail.quantity,
          variantId: detail.variantId,
        };
        return [...prev, newItem];
      });
    };
    const onRemove = (e: Event) => {
      const { itemId } = (e as CustomEvent<{ itemId: string }>).detail;
      removeFromCart(itemId);
    };
    const onUpdate = (e: Event) => {
      const { itemId, quantity } = (e as CustomEvent<{ itemId: string; quantity: number }>).detail;
      updateQuantity(itemId, quantity);
    };

    window.addEventListener("treyza:cart:add", onAdd);
    window.addEventListener("treyza:cart:remove", onRemove);
    window.addEventListener("treyza:cart:update", onUpdate);
    window.addEventListener("treyza:cart:updated", refresh);
    return () => {
      window.removeEventListener("treyza:cart:add", onAdd);
      window.removeEventListener("treyza:cart:remove", onRemove);
      window.removeEventListener("treyza:cart:update", onUpdate);
      window.removeEventListener("treyza:cart:updated", refresh);
    };
  }, [addToCart, removeFromCart, updateQuantity, refresh]);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return { items, total: calcTotal(items), itemCount, loading, addToCart, removeFromCart, updateQuantity, clearCart };
}
