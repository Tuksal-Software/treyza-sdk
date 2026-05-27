import * as React from "react";
import type { StoreInfo, Customer } from "../types";

interface TreyzaContextValue {
  store: StoreInfo;
  customer: Customer | null;
  isLoggedIn: boolean;
}

const TreyzaContext = React.createContext<TreyzaContextValue | null>(null);

export function useTreyza(): TreyzaContextValue {
  const ctx = React.useContext(TreyzaContext);
  if (!ctx) {
    return {
      store: window.__TREYZA_STORE__ as StoreInfo,
      customer: (window.__TREYZA_CUSTOMER__ as Customer) ?? null,
      isLoggedIn: !!window.__TREYZA_CUSTOMER__,
    };
  }
  return ctx;
}

interface TreyzaSDKProviderProps {
  store: {
    slug: string;
    apiUrl: string;
    name: string;
    currency: string;
    locale: string;
    logo?: string;
    socialLinks?: Record<string, string>;
  };
  token?: string;
  customer?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    phone?: string;
  } | null;
  children: React.ReactNode;
}

export function TreyzaSDKProvider({ store, token, customer, children }: TreyzaSDKProviderProps) {
  React.useEffect(() => {
    window.__TREYZA_STORE__ = store;
  }, [store]);

  React.useEffect(() => {
    window.__TREYZA_TOKEN__ = token;
  }, [token]);

  React.useEffect(() => {
    window.__TREYZA_CUSTOMER__ = customer ?? null;
    window.dispatchEvent(new CustomEvent("treyza:customer:updated"));
  }, [customer]);

  const contextValue = React.useMemo<TreyzaContextValue>(() => ({
    store: store as StoreInfo,
    customer: (customer as Customer) ?? null,
    isLoggedIn: !!customer,
  }), [store, customer]);

  return (
    <TreyzaContext.Provider value={contextValue}>
      {children}
    </TreyzaContext.Provider>
  );
}
