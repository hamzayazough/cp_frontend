/**
 * Utility functions for handling wallet data
 */

/**
 * Safely converts string or number to a number with default fallback
 * @param value - The value to convert (string or number)
 * @param defaultValue - Default value if conversion fails (default: 0)
 * @returns Parsed number value
 */
export const parseWalletValue = (
  value: string | number | undefined,
  defaultValue: number = 0
): number => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  return defaultValue;
};

/**
 * Formats a wallet value as currency string
 * @param value - The value to format (string or number)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export const formatWalletValue = (
  value: string | number | undefined,
  decimals: number = 2
): string => {
  const numValue = parseWalletValue(value);
  return numValue.toFixed(decimals);
};

/**
 * Checks if wallet balance meets minimum threshold
 * @param balance - Current balance (string or number)
 * @param threshold - Minimum threshold (string or number)
 * @returns Boolean indicating if threshold is met
 */
export const meetsThreshold = (
  balance: string | number | undefined,
  threshold: string | number | undefined
): boolean => {
  const balanceNum = parseWalletValue(balance);
  const thresholdNum = parseWalletValue(threshold);
  return balanceNum >= thresholdNum;
};

/**
 * Calculates amount needed to reach threshold
 * @param balance - Current balance (string or number)
 * @param threshold - Minimum threshold (string or number)
 * @returns Amount needed (0 if threshold already met)
 */
export const amountNeededForThreshold = (
  balance: string | number | undefined,
  threshold: string | number | undefined
): number => {
  const balanceNum = parseWalletValue(balance);
  const thresholdNum = parseWalletValue(threshold);
  return Math.max(0, thresholdNum - balanceNum);
};
