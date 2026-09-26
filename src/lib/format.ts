const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatRating(value: number): string {
  return value.toFixed(1);
}
