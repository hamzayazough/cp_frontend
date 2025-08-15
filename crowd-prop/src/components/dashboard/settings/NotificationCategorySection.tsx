import React from "react";
import {
  NotificationPreference,
  NotificationCategory,
  NotificationType,
} from "@/app/interfaces/notification";
import { NotificationPreferenceCard } from "./NotificationPreferenceCard";

interface NotificationCategorySectionProps {
  category: NotificationCategory;
  preferences: NotificationPreference[];
  onUpdatePreference: (
    type: NotificationType,
    field: keyof Pick<
      NotificationPreference,
      "emailEnabled" | "smsEnabled" | "pushEnabled" | "inAppEnabled"
    >,
    value: boolean
  ) => void;
  onToggleAll: (category: NotificationCategory, enabled: boolean) => void;
  disabled?: boolean;
}

export function NotificationCategorySection({
  category,
  preferences,
  onUpdatePreference,
  onToggleAll,
  disabled = false,
}: NotificationCategorySectionProps) {
  // Get preferences for this category
  const categoryPreferences = preferences.filter((pref) =>
    category.types.includes(pref.notificationType)
  );

  // Check if all preferences in this category are enabled for any channel
  const allEnabled = categoryPreferences.every(
    (pref) =>
      pref.emailEnabled ||
      pref.smsEnabled ||
      pref.pushEnabled ||
      pref.inAppEnabled
  );

  const handleToggleAll = () => {
    onToggleAll(category, !allEnabled);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
          <p className="text-gray-600 text-sm">{category.description}</p>
        </div>
        <button
          onClick={handleToggleAll}
          disabled={disabled || categoryPreferences.length === 0}
          className={`px-4 py-2 font-medium rounded-lg transition-all ${
            allEnabled
              ? "bg-red-600 text-white hover:bg-red-700 hover:shadow-md"
              : "bg-green-600 text-white hover:bg-green-700 hover:shadow-md"
          } disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
        >
          {allEnabled ? "Disable All" : "Enable All"}
        </button>
      </div>

      {categoryPreferences.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5V5"
              />
            </svg>
          </div>
          <p className="text-base font-medium">
            No notification preferences found for this category.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {categoryPreferences.map((preference) => (
            <NotificationPreferenceCard
              key={preference.id}
              preference={preference}
              onUpdate={onUpdatePreference}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
