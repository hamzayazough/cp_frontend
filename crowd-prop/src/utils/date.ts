/**
 * Utility functions for consistent date formatting across server and client
 */

/**
 * Format a date consistently for SSR compatibility
 * Always returns the same format regardless of server/client environment
 */
export const formatDate = (
  date: Date | string,
  format: "short" | "long" = "short"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (format === "long") {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Use a consistent format for short dates (MM/DD/YYYY)
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

/**
 * Format a date as ISO string in YYYY-MM-DD format
 * This is the most consistent format across server/client
 */
export const formatDateISO = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
};

/**
 * Calculate days left from a deadline
 */
export const getDaysLeft = (deadline: string | Date): number => {
  const deadlineDate =
    typeof deadline === "string" ? new Date(deadline) : deadline;
  const today = new Date();
  const timeDiff = deadlineDate.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return Math.max(0, daysLeft);
};
