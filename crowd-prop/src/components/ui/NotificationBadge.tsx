"use client";

import React from "react";
import { NotificationBadgeProps } from "@/app/interfaces/notification-system";

export default function NotificationBadge({
  count,
  maxCount = 99,
  showZero = false,
  size = "md",
  variant = "primary",
}: NotificationBadgeProps) {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const sizeClasses = {
    sm: "h-4 w-4 text-xs",
    md: "h-5 w-5 text-xs",
    lg: "h-6 w-6 text-sm",
  };

  const variantClasses = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-500 text-white",
    danger: "bg-red-500 text-white",
  };

  const positionClasses = {
    sm: "top-0 right-0 -mt-1 -mr-1",
    md: "top-0 right-0 -mt-1 -mr-1",
    lg: "top-0 right-0 -mt-2 -mr-2",
  };

  return (
    <span
      className={`
        absolute flex items-center justify-center rounded-full font-medium
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${positionClasses[size]}
        ring-2 ring-white
      `}
    >
      {displayCount}
    </span>
  );
}
