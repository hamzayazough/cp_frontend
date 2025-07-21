/**
 * Utility functions for promoter profile components
 */

/**
 * Truncates text to a specified maximum length and adds ellipsis if needed
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Formats a number with commas for better readability
 * @param num - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Formats a currency value with proper decimal places
 * @param amount - The amount to format
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency = "$"): string => {
  return `${currency}${amount.toFixed(2)}`;
};

/**
 * Validates if a URL is properly formatted
 * @param url - The URL to validate
 * @returns True if valid URL, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Cleans and validates form data before submission
 * @param data - The form data object
 * @returns Cleaned data object with undefined/empty values removed
 */
export const cleanFormData = <T extends Record<string, unknown>>(
  data: T
): Partial<T> => {
  const cleanedData: Partial<T> = {};

  Object.keys(data).forEach((key) => {
    const typedKey = key as keyof T;
    const value = data[typedKey];

    if (value !== undefined && value !== "" && value !== null) {
      if (typeof value === "string") {
        const trimmedValue = value.trim();
        if (trimmedValue !== "") {
          cleanedData[typedKey] = trimmedValue as T[keyof T];
        }
      } else {
        cleanedData[typedKey] = value;
      }
    }
  });

  return cleanedData;
};
