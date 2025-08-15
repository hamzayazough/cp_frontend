import { httpService } from "./http.service";
import {
  NotificationPreference,
  NotificationSettings,
  NotificationPreferenceUpdate,
  NotificationSettingsUpdate,
  BulkNotificationPreferenceUpdate,
  GetNotificationPreferencesResponse,
  UpdateNotificationPreferenceResponse,
  UpdateBulkNotificationPreferencesResponse,
  GetNotificationSettingsResponse,
  UpdateNotificationSettingsResponse,
  ResetNotificationPreferencesResponse,
} from "@/app/interfaces/notification";

export class NotificationService {
  /**
   * Get user notification preferences
   */
  async getPreferences(userId: string): Promise<NotificationPreference[]> {
    try {
      const response =
        await httpService.get<GetNotificationPreferencesResponse>(
          `/user/${userId}/notifications/preferences`,
          true
        );
      return response.data.preferences;
    } catch (error) {
      console.error("Failed to get notification preferences:", error);
      throw new Error("Failed to load notification preferences");
    }
  }

  /**
   * Update a single notification preference
   */
  async updatePreference(
    userId: string,
    preference: NotificationPreferenceUpdate
  ): Promise<NotificationPreference> {
    // Validate input parameters
    if (!userId || !userId.trim()) {
      throw new Error("User ID is required");
    }

    if (!this.validatePreferenceUpdate(preference)) {
      throw new Error(
        "Invalid preference update: notification type is required and at least one channel must be specified"
      );
    }

    try {
      const response =
        await httpService.put<UpdateNotificationPreferenceResponse>(
          `/user/${userId}/notifications/preferences`,
          preference,
          true
        );
      return response.data.preference;
    } catch (error) {
      console.error("Failed to update notification preference:", error);
      throw new Error("Failed to update notification preference");
    }
  }

  /**
   * Update multiple notification preferences in bulk
   */
  async updateBulkPreferences(
    userId: string,
    bulkUpdate: BulkNotificationPreferenceUpdate
  ): Promise<NotificationPreference[]> {
    // Validate input parameters
    if (!userId || !userId.trim()) {
      throw new Error("User ID is required");
    }

    // Validate bulk update data
    const validation = this.validateBulkPreferencesUpdate(bulkUpdate);
    if (!validation.isValid) {
      throw new Error(validation.errors.join("; "));
    }

    try {
      const response =
        await httpService.put<UpdateBulkNotificationPreferencesResponse>(
          `/user/${userId}/notifications/preferences/bulk`,
          bulkUpdate,
          true
        );
      return response.data.preferences;
    } catch (error) {
      console.error("Failed to update bulk notification preferences:", error);
      throw new Error("Failed to update notification preferences");
    }
  }

  /**
   * Reset notification preferences to default values
   */
  async resetPreferences(userId: string): Promise<NotificationPreference[]> {
    try {
      const response =
        await httpService.post<ResetNotificationPreferencesResponse>(
          `/user/${userId}/notifications/preferences/reset`,
          undefined,
          true
        );
      return response.data.preferences;
    } catch (error) {
      console.error("Failed to reset notification preferences:", error);
      throw new Error("Failed to reset notification preferences");
    }
  }

  /**
   * Get user notification settings
   */
  async getSettings(userId: string): Promise<NotificationSettings> {
    try {
      const response = await httpService.get<GetNotificationSettingsResponse>(
        `/user/${userId}/notifications/settings`,
        true
      );
      return response.data.settings;
    } catch (error) {
      console.error("Failed to get notification settings:", error);
      throw new Error("Failed to load notification settings");
    }
  }

  /**
   * Update user notification settings
   */
  async updateSettings(
    userId: string,
    settings: NotificationSettingsUpdate
  ): Promise<NotificationSettings> {
    try {
      const response =
        await httpService.put<UpdateNotificationSettingsResponse>(
          `/user/${userId}/notifications/settings`,
          settings,
          true
        );
      return response.data.settings;
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      throw new Error("Failed to update notification settings");
    }
  }

  /**
   * Get available timezones for notification settings
   */
  getAvailableTimezones(): { value: string; label: string }[] {
    return [
      { value: "America/New_York", label: "Eastern Time (ET)" },
      { value: "America/Chicago", label: "Central Time (CT)" },
      { value: "America/Denver", label: "Mountain Time (MT)" },
      { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
      { value: "America/Toronto", label: "Toronto (EST/EDT)" },
      { value: "America/Vancouver", label: "Vancouver (PST/PDT)" },
      { value: "Europe/London", label: "London (GMT/BST)" },
      { value: "Europe/Paris", label: "Paris (CET/CEST)" },
      { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
      { value: "Asia/Tokyo", label: "Tokyo (JST)" },
      { value: "Asia/Shanghai", label: "Shanghai (CST)" },
      { value: "Asia/Dubai", label: "Dubai (GST)" },
      { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
      { value: "UTC", label: "UTC" },
    ];
  }

  /**
   * Validate time format (HH:MM)
   */
  validateTimeFormat(time: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  /**
   * Validate notification preference update
   */
  validatePreferenceUpdate(preference: NotificationPreferenceUpdate): boolean {
    if (!preference.notificationType) {
      return false;
    }
    // At least one channel should be specified
    return (
      preference.emailEnabled !== undefined ||
      preference.smsEnabled !== undefined ||
      preference.pushEnabled !== undefined ||
      preference.inAppEnabled !== undefined
    );
  }

  /**
   * Validate bulk preferences update
   */
  validateBulkPreferencesUpdate(bulkUpdate: BulkNotificationPreferenceUpdate): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!bulkUpdate.preferences || bulkUpdate.preferences.length === 0) {
      errors.push("Preferences array is required and must not be empty");
    } else {
      bulkUpdate.preferences.forEach((pref, index) => {
        if (!this.validatePreferenceUpdate(pref)) {
          errors.push(
            `Invalid preference at index ${index}: ${
              pref.notificationType || "missing notification type"
            }`
          );
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format time for display
   */
  formatTime(time: string): string {
    if (!this.validateTimeFormat(time)) {
      return time;
    }

    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    return `${displayHour}:${minutes} ${ampm}`;
  }
}

export const notificationService = new NotificationService();
