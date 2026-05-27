import { apiFetch, apiFetchGlobal, isPreviewMode } from "../hooks/_api";
import { formatPrice as formatPriceUtil } from "../utils";

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

async function safeAction<T = void>(
  fn: () => Promise<T>,
  options?: { silent?: boolean },
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (err: any) {
    const message = err?.message || "Bir hata olustu";
    if (!options?.silent) {
      showToast(message, "error");
    }
    return { success: false, error: message };
  }
}

function parseCartItemId(id: string): { productId: number; variantId?: number } {
  const [pid, vid] = id.split("-");
  return {
    productId: parseInt(pid, 10),
    variantId: vid ? parseInt(vid, 10) : undefined,
  };
}

export async function addToCart(productId: string, variantId?: string, quantity?: number): Promise<ActionResult> {
  if (isPreviewMode()) {
    window.dispatchEvent(new CustomEvent("treyza:cart:add", { detail: { productId, variantId, quantity: quantity || 1 } }));
    return { success: true };
  }
  return safeAction(async () => {
    await apiFetch("/cart/items", "POST", {
      productId: parseInt(productId, 10),
      variantId: variantId ? parseInt(variantId, 10) : undefined,
      quantity: quantity || 1,
    });
    window.dispatchEvent(new CustomEvent("treyza:cart:updated"));
  });
}

export async function removeFromCart(itemId: string): Promise<ActionResult> {
  if (isPreviewMode()) {
    window.dispatchEvent(new CustomEvent("treyza:cart:remove", { detail: { itemId } }));
    return { success: true };
  }
  return safeAction(async () => {
    const { productId, variantId } = parseCartItemId(itemId);
    await apiFetch(`/cart/items/${productId}`, "DELETE", { variantId });
    window.dispatchEvent(new CustomEvent("treyza:cart:updated"));
  });
}

export async function updateCartItem(itemId: string, quantity: number): Promise<ActionResult> {
  if (isPreviewMode()) {
    window.dispatchEvent(new CustomEvent("treyza:cart:update", { detail: { itemId, quantity } }));
    return { success: true };
  }
  return safeAction(async () => {
    const { productId, variantId } = parseCartItemId(itemId);
    await apiFetch(`/cart/items/${productId}`, "PATCH", { quantity, variantId });
    window.dispatchEvent(new CustomEvent("treyza:cart:updated"));
  });
}

export async function toggleWishlist(productId: string): Promise<ActionResult<{ added: boolean }>> {
  if (isPreviewMode() || !window.__TREYZA_CUSTOMER__) {
    const list = window.__TREYZA_WISHLIST__ || [];
    const idx = list.indexOf(productId);
    const added = idx < 0;
    if (added) list.push(productId);
    else list.splice(idx, 1);
    window.__TREYZA_WISHLIST__ = list;
    window.dispatchEvent(new CustomEvent("treyza:wishlist:updated"));
    return { success: true, data: { added } };
  }
  return safeAction(async () => {
    const productIdNum = parseInt(productId, 10);
    const check = await apiFetch<{ isFavorite: boolean }>(`/favorites/${productIdNum}/check`);
    if (check?.isFavorite) {
      await apiFetch(`/favorites/${productIdNum}`, "DELETE");
      window.dispatchEvent(new CustomEvent("treyza:wishlist:updated"));
      return { added: false };
    }
    await apiFetch("/favorites", "POST", { productId: productIdNum });
    window.dispatchEvent(new CustomEvent("treyza:wishlist:updated"));
    return { added: true };
  });
}

export function navigate(path: string): void {
  window.dispatchEvent(new CustomEvent("treyza:navigate", { detail: { path } }));
}

export function showToast(message: string, type: "success" | "error" | "info" = "info"): void {
  window.dispatchEvent(new CustomEvent("treyza:toast", { detail: { message, type } }));
}

export function openQuickView(productId: string): void {
  window.dispatchEvent(new CustomEvent("treyza:quickview", { detail: { productId } }));
}

export function formatPrice(amount: number | string): string {
  return formatPriceUtil(amount);
}

export async function subscribe(email: string): Promise<ActionResult> {
  if (isPreviewMode()) {
    window.dispatchEvent(new CustomEvent("treyza:subscribe", { detail: { email } }));
    showToast("Abone olundu!", "success");
    return { success: true };
  }
  return safeAction(async () => {
    await apiFetchGlobal("/api/newsletter/subscribe", "POST", { email });
    window.dispatchEvent(new CustomEvent("treyza:subscribed", { detail: { email } }));
    showToast("Abone olundu!", "success");
  });
}

export function trackEvent(name: string, data?: Record<string, unknown>): void {
  window.dispatchEvent(new CustomEvent("treyza:analytics", { detail: { name, data } }));
}

export function openModal(config: { title?: string; content?: string; size?: "sm" | "md" | "lg" | "xl" }): void {
  window.dispatchEvent(new CustomEvent("treyza:modal", { detail: config }));
}

export async function applyDiscount(code: string): Promise<ActionResult> {
  if (isPreviewMode()) {
    window.dispatchEvent(new CustomEvent("treyza:discount", { detail: { code } }));
    showToast("Kupon uygulandı!", "success");
    return { success: true };
  }
  return safeAction(async () => {
    await apiFetch("/discount-codes/validate", "POST", { code });
    window.dispatchEvent(new CustomEvent("treyza:cart:updated"));
    showToast("Kupon uygulandı!", "success");
  });
}

export async function share(url?: string, platform?: "whatsapp" | "twitter" | "facebook" | "copy"): Promise<void> {
  const shareUrl = url || window.location.href;

  if (platform === "copy") {
    await navigator.clipboard.writeText(shareUrl);
    showToast("Link kopyalandı!", "success");
    return;
  }

  if (platform === "whatsapp") {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, "_blank");
    return;
  }

  if (platform === "twitter") {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, "_blank");
    return;
  }

  if (platform === "facebook") {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
    return;
  }

  if (navigator.share) {
    await navigator.share({ url: shareUrl });
  } else {
    await navigator.clipboard.writeText(shareUrl);
    showToast("Link kopyalandı!", "success");
  }
}
