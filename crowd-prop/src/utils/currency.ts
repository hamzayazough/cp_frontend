export const formatCurrency = (
  amount: number | null | undefined,
  currency = "$"
): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currency}0.00`;
  }
  return `${currency}${Number(amount).toFixed(2)}`;
};
