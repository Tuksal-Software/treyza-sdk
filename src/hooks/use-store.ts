import type { StoreInfo } from "../types";

export function useStore(): StoreInfo | null {
  const store = window.__TREYZA_STORE__;
  if (!store) return null;
  return {
    name: store.name,
    logo: store.logo,
    currency: store.currency,
    locale: store.locale,
    socialLinks: store.socialLinks,
  };
}
