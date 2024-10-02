export const currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat(undefined, {
  currency: "usd",
  style: "currency",
  minimumFractionDigits: 0,
})

// If you want to export a function that uses the formatter:
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}