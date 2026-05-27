export function formatPrice(amount: number | string, currency?: string, locale?: string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return String(amount);
  const store = window.__TREYZA_STORE__;
  const cur = currency || store?.currency || "TRY";
  const loc = locale || store?.locale || "tr-TR";
  return new Intl.NumberFormat(loc, { style: "currency", currency: cur }).format(num);
}

export function formatDate(date: string | Date, locale?: string): string {
  const store = window.__TREYZA_STORE__;
  const loc = locale || store?.locale || "tr-TR";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(loc, { year: "numeric", month: "long", day: "numeric" }).format(d);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
