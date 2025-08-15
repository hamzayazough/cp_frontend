import React from "react";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { NotificationCategorySection } from "./NotificationCategorySection";
import { NotificationSettingsCard } from "./NotificationSettingsCard";
import {
  NOTIFICATION_CATEGORIES,
  NotificationPreference,
  NotificationType,
  NotificationSettingsUpdate,
  NotificationCategory,
} from "@/app/interfaces/notification";

interface NotificationSettingsProps {
  userId: string;
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const {
    preferences,
    settings,
    preferencesLoading,
    settingsLoading,
    updateLoading,
    preferencesError,
    settingsError,
    updateError,
    updatePreference,
    updateBulkPreferences,
    updateSettings,
    resetPreferences,
    clearErrors,
  } = useNotificationSettings(userId);

  const isLoading = preferencesLoading || settingsLoading || updateLoading;
  const hasError = preferencesError || settingsError || updateError;

  const handleUpdatePreference = async (
    type: NotificationType,
    field: keyof Pick<
      NotificationPreference,
      "emailEnabled" | "smsEnabled" | "pushEnabled" | "inAppEnabled"
    >,
    value: boolean
  ) => {
    await updatePreference({
      notificationType: type,
      [field]: value,
    });
  };

  const handleToggleAllCategory = async (
    category: NotificationCategory,
    enabled: boolean
  ) => {
    const categoryPreferences = preferences.filter((pref) =>
      category.types.includes(pref.notificationType)
    );

    // Check if there are any preferences to update
    if (categoryPreferences.length === 0) {
      console.warn(`No preferences found for category: ${category.name}`);
      return;
    }

    const updates = categoryPreferences.map((pref) => ({
      notificationType: pref.notificationType,
      emailEnabled: enabled,
      pushEnabled: enabled,
      inAppEnabled: enabled,
      // Keep SMS disabled by default for bulk operations
      smsEnabled: enabled ? pref.smsEnabled : false,
    }));

    await updateBulkPreferences(updates);
  };

  const handleUpdateSettings = async (
    settingsUpdate: Partial<NotificationSettingsUpdate>
  ) => {
    if (settings) {
      await updateSettings(settingsUpdate);
    }
  };

  const handleResetPreferences = async () => {
    if (
      confirm(
        "Are you sure you want to reset all notification preferences to default values?"
      )
    ) {
      await resetPreferences();
    }
  };

  // Loading state
  if (preferencesLoading || settingsLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded-lg w-1/3 mb-2"></div>
            <div className="h-3 bg-white/20 rounded-lg w-1/2"></div>
          </div>
        </div>
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="animate-pulse">
                <div className="h-5 bg-gray-200 rounded-lg w-1/4 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded-lg w-full"></div>
                  <div className="h-3 bg-gray-200 rounded-lg w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-4 text-white">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">
              Error loading notification settings
            </h3>
            <p className="text-white/90 text-sm mb-3">
              {preferencesError || settingsError || updateError}
            </p>
            <button
              onClick={clearErrors}
              className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Notification Settings</h2>
            <p className="text-blue-100 text-sm">
              Manage how and when you receive notifications
            </p>
          </div>
          <button
            onClick={handleResetPreferences}
            disabled={isLoading}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* General Settings */}
      {settings && (
        <NotificationSettingsCard
          settings={settings}
          onUpdate={handleUpdateSettings}
          disabled={isLoading}
        />
      )}

      {/* Notification Categories */}
      <div className="space-y-3">
        {NOTIFICATION_CATEGORIES.map((category) => (
          <NotificationCategorySection
            key={category.id}
            category={category}
            preferences={preferences}
            onUpdatePreference={handleUpdatePreference}
            onToggleAll={handleToggleAllCategory}
            disabled={isLoading}
          />
        ))}
      </div>

      {/* Success Message */}
      {updateLoading && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-3 shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Updating...</p>
          </div>
        </div>
      )}
    </div>
  );
}
