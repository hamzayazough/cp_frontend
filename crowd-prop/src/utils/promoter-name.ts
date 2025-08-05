import { Promoter } from "@/app/interfaces/user";

/**
 * Get the display name for a promoter
 * Returns business name if it's a business, otherwise returns the person's name
 */
export function getPromoterDisplayName(promoter: Promoter): string {
  if (promoter.isBusiness && promoter.businessName) {
    return promoter.businessName;
  }
  return promoter.name;
}

/**
 * Get initials for a promoter avatar
 * Uses business name if it's a business, otherwise uses the person's name
 */
export function getPromoterInitials(promoter: Promoter): string {
  const displayName = getPromoterDisplayName(promoter);
  return displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}
