import { useState, useEffect, useCallback } from "react";
import { notificationService } from "@/services/notification.service";
import {
  NotificationPreference,
  NotificationSettings,
  NotificationPreferenceUpdate,
  NotificationSettingsUpdate,
  NotificationType,
} from "@/app/interfaces/notification";

interface UseNotificationSettingsReturn {
  // Data
  preferences: NotificationPreference[];
  settings: NotificationSettings | null;

  // Loading states
  preferencesLoading: boolean;
  settingsLoading: boolean;
  updateLoading: boolean;

  // Error states
  preferencesError: string | null;
  settingsError: string | null;
  updateError: string | null;

  // Actions
  loadPreferences: () => Promise<void>;
  loadSettings: () => Promise<void>;
  updatePreference: (preference: NotificationPreferenceUpdate) => Promise<void>;
  updateBulkPreferences: (
    preferences: NotificationPreferenceUpdate[]
  ) => Promise<void>;
  updateSettings: (settings: NotificationSettingsUpdate) => Promise<void>;
  resetPreferences: () => Promise<void>;

  // Utility functions
  getPreferenceByType: (
    type: NotificationType
  ) => NotificationPreference | undefined;
  hasUnsavedChanges: boolean;
  clearErrors: () => void;
}

export function useNotificationSettings(
  userId: string
): UseNotificationSettingsReturn {
  // State
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);

  // Loading states
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Error states
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /**
   * Load notification preferences
   */
  const loadPreferences = useCallback(async () => {
    if (!userId) return;

    setPreferencesLoading(true);
    setPreferencesError(null);

    try {
      const data = await notificationService.getPreferences(userId);
      setPreferences(data);
      setHasUnsavedChanges(false);
    } catch (error) {
      setPreferencesError(
        error instanceof Error ? error.message : "Failed to load preferences"
      );
    } finally {
      setPreferencesLoading(false);
    }
  }, [userId]);

  /**
   * Load notification settings
   */
  const loadSettings = useCallback(async () => {
    if (!userId) return;

    setSettingsLoading(true);
    setSettingsError(null);

    try {
      const data = await notificationService.getSettings(userId);
      setSettings(data);
    } catch (error) {
      setSettingsError(
        error instanceof Error ? error.message : "Failed to load settings"
      );
    } finally {
      setSettingsLoading(false);
    }
  }, [userId]);

  /**
   * Update a single notification preference
   */
  const updatePreference = useCallback(
    async (preference: NotificationPreferenceUpdate) => {
      if (!userId) return;

      setUpdateLoading(true);
      setUpdateError(null);

      try {
        const updatedPreference = await notificationService.updatePreference(
          userId,
          preference
        );

        // Update local state
        setPreferences((prev) =>
          prev.map((p) =>
            p.notificationType === updatedPreference.notificationType
              ? updatedPreference
              : p
          )
        );

        setHasUnsavedChanges(false);
      } catch (error) {
        setUpdateError(
          error instanceof Error ? error.message : "Failed to update preference"
        );
      } finally {
        setUpdateLoading(false);
      }
    },
    [userId]
  );

  /**
   * Update multiple notification preferences
   */
  const updateBulkPreferences = useCallback(
    async (preferencesUpdate: NotificationPreferenceUpdate[]) => {
      if (!userId) return;

      // Validate that preferences array is not empty
      if (!preferencesUpdate || preferencesUpdate.length === 0) {
        setUpdateError("No preferences to update");
        return;
      }

      setUpdateLoading(true);
      setUpdateError(null);

      try {
        const updatedPreferences =
          await notificationService.updateBulkPreferences(userId, {
            preferences: preferencesUpdate,
          });

        // Update local state
        setPreferences(updatedPreferences);
        setHasUnsavedChanges(false);
      } catch (error) {
        setUpdateError(
          error instanceof Error
            ? error.message
            : "Failed to update preferences"
        );
      } finally {
        setUpdateLoading(false);
      }
    },
    [userId]
  );

  /**
   * Update notification settings
   */
  const updateSettings = useCallback(
    async (settingsUpdate: NotificationSettingsUpdate) => {
      if (!userId) return;

      setUpdateLoading(true);
      setUpdateError(null);

      try {
        const updatedSettings = await notificationService.updateSettings(
          userId,
          settingsUpdate
        );
        setSettings(updatedSettings);
      } catch (error) {
        setUpdateError(
          error instanceof Error ? error.message : "Failed to update settings"
        );
      } finally {
        setUpdateLoading(false);
      }
    },
    [userId]
  );

  /**
   * Reset preferences to default values
   */
  const resetPreferences = useCallback(async () => {
    if (!userId) return;

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const resetPreferences = await notificationService.resetPreferences(
        userId
      );
      setPreferences(resetPreferences);
      setHasUnsavedChanges(false);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Failed to reset preferences"
      );
    } finally {
      setUpdateLoading(false);
    }
  }, [userId]);

  /**
   * Get preference by notification type
   */
  const getPreferenceByType = useCallback(
    (type: NotificationType) => {
      return preferences.find((p) => p.notificationType === type);
    },
    [preferences]
  );

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setPreferencesError(null);
    setSettingsError(null);
    setUpdateError(null);
  }, []);

  // Load data on mount
  useEffect(() => {
    if (userId) {
      loadPreferences();
      loadSettings();
    }
  }, [userId, loadPreferences, loadSettings]);

  return {
    // Data
    preferences,
    settings,

    // Loading states
    preferencesLoading,
    settingsLoading,
    updateLoading,

    // Error states
    preferencesError,
    settingsError,
    updateError,

    // Actions
    loadPreferences,
    loadSettings,
    updatePreference,
    updateBulkPreferences,
    updateSettings,
    resetPreferences,

    // Utility functions
    getPreferenceByType,
    hasUnsavedChanges,
    clearErrors,
  };
}
