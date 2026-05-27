import { useState, useEffect } from "react";

export function useConfig<T = Record<string, unknown>>(): T {
  const [config, setConfig] = useState<T>((window.__TREYZA_CONFIG__ ?? {}) as T);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "CONFIG_UPDATE") {
        setConfig(event.data.payload as T);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return config;
}
