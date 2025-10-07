// src/utils/euFormat.ts
export function parseEuro(input: string): number {
  if (!input) return 0;
  // Remove currency symbol and spaces
  const cleaned = input
    .toString()
    .replace(/[€\s]/g, "")
    .replace(/\./g, "") // remove thousands dots
    .replace(/,/g, "."); // convert decimal comma to dot
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

export function formatEuro(value: number, options: { decimals?: number; withSymbol?: boolean } = {}): string {
  const { decimals = 2, withSymbol = true } = options;
  const parts = value
    .toFixed(decimals)
    .split(".");
  let intPart = parts[0];
  const decPart = parts[1] || "";
  // Insert thousands separator (.)
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const formatted = decimals > 0 ? `${intPart},${decPart}` : intPart;
  return withSymbol ? `€ ${formatted}` : formatted;
}
