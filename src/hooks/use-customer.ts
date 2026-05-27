import { useState, useEffect } from "react";
import type { Customer } from "../types";

interface UseCustomerResult {
  customer: Customer | null;
  isLoggedIn: boolean;
}

export function useCustomer(): UseCustomerResult {
  const [customer, setCustomer] = useState<Customer | null>(
    (window.__TREYZA_CUSTOMER__ as Customer | undefined) ?? null,
  );

  useEffect(() => {
    const handler = () => {
      setCustomer((window.__TREYZA_CUSTOMER__ as Customer | undefined) ?? null);
    };
    window.addEventListener("treyza:customer:updated", handler);
    return () => window.removeEventListener("treyza:customer:updated", handler);
  }, []);

  return { customer, isLoggedIn: customer !== null };
}
