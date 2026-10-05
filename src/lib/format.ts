export function formatPrice(priceCents: number, currency: string, locale = "pl-PL"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(priceCents / 100);
}
