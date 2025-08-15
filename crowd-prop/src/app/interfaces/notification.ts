export type NotificationType =
  // Campaign Related
  | "CAMPAIGN_APPLICATION_RECEIVED"
  | "CAMPAIGN_APPLICATION_ACCEPTED"
  | "CAMPAIGN_APPLICATION_REJECTED"
  | "CAMPAIGN_CREATED"
  | "CAMPAIGN_UPDATED"
  | "CAMPAIGN_COMPLETED"
  | "CAMPAIGN_CANCELLED"
  | "CAMPAIGN_DEADLINE_REMINDER"
  // Payment Related
  | "PAYMENT_RECEIVED"
  | "PAYMENT_FAILED"
  | "PAYOUT_PROCESSED"
  | "PAYOUT_FAILED"
  | "PAYMENT_REMINDER"
  // Communication
  | "MESSAGE_RECEIVED"
  | "MEETING_SCHEDULED"
  | "MEETING_REMINDER"
  | "MEETING_CANCELLED"
  // Account Related
  | "ACCOUNT_VERIFIED"
  | "ACCOUNT_VERIFICATION_REQUIRED"
  | "SECURITY_ALERT"
  | "PROFILE_UPDATE_REQUIRED"
  // System
  | "SYSTEM_MAINTENANCE"
  | "FEATURE_ANNOUNCEMENT"
  | "POLICY_UPDATE"
  | "DAILY_DIGEST";

export interface NotificationPreference {
  id: string;
  userId: string;
  notificationType: NotificationType;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  emailNotificationsEnabled: boolean;
  pushToken?: string;
  timezone: string;
  quietHoursStart: string; // HH:MM format
  quietHoursEnd: string; // HH:MM format
}

export interface NotificationPreferenceUpdate {
  notificationType: NotificationType;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
}

export interface BulkNotificationPreferenceUpdate {
  preferences: NotificationPreferenceUpdate[];
}

export interface NotificationSettingsUpdate {
  emailNotificationsEnabled?: boolean;
  pushToken?: string;
  timezone?: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

// Response types
export interface GetNotificationPreferencesResponse {
  success: boolean;
  preferences: NotificationPreference[];
  message: string;
}

export interface UpdateNotificationPreferenceResponse {
  success: boolean;
  preference: NotificationPreference;
  message: string;
}

export interface UpdateBulkNotificationPreferencesResponse {
  success: boolean;
  preferences: NotificationPreference[];
  message: string;
}

export interface GetNotificationSettingsResponse {
  success: boolean;
  settings: NotificationSettings;
  message: string;
}

export interface UpdateNotificationSettingsResponse {
  success: boolean;
  settings: NotificationSettings;
  message: string;
}

export interface ResetNotificationPreferencesResponse {
  success: boolean;
  preferences: NotificationPreference[];
  message: string;
}

// Notification type categories for UI organization
export interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  types: NotificationType[];
}

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: "campaign",
    name: "Campaign Activities",
    description:
      "Notifications about campaign applications, updates, and deadlines",
    types: [
      "CAMPAIGN_APPLICATION_RECEIVED",
      "CAMPAIGN_APPLICATION_ACCEPTED",
      "CAMPAIGN_APPLICATION_REJECTED",
      "CAMPAIGN_CREATED",
      "CAMPAIGN_UPDATED",
      "CAMPAIGN_COMPLETED",
      "CAMPAIGN_CANCELLED",
      "CAMPAIGN_DEADLINE_REMINDER",
    ],
  },
  {
    id: "payment",
    name: "Payments & Earnings",
    description:
      "Notifications about payments, payouts, and financial transactions",
    types: [
      "PAYMENT_RECEIVED",
      "PAYMENT_FAILED",
      "PAYOUT_PROCESSED",
      "PAYOUT_FAILED",
      "PAYMENT_REMINDER",
    ],
  },
  {
    id: "communication",
    name: "Messages & Meetings",
    description: "Notifications about new messages and scheduled meetings",
    types: [
      "MESSAGE_RECEIVED",
      "MEETING_SCHEDULED",
      "MEETING_REMINDER",
      "MEETING_CANCELLED",
    ],
  },
  {
    id: "account",
    name: "Account & Security",
    description:
      "Important notifications about your account status and security",
    types: [
      "ACCOUNT_VERIFIED",
      "ACCOUNT_VERIFICATION_REQUIRED",
      "SECURITY_ALERT",
      "PROFILE_UPDATE_REQUIRED",
    ],
  },
  {
    id: "system",
    name: "Platform Updates",
    description: "System announcements, maintenance, and feature updates",
    types: [
      "SYSTEM_MAINTENANCE",
      "FEATURE_ANNOUNCEMENT",
      "POLICY_UPDATE",
      "DAILY_DIGEST",
    ],
  },
];

// Utility functions
export const getNotificationTypeLabel = (type: NotificationType): string => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getNotificationTypeDescription = (
  type: NotificationType
): string => {
  const descriptions: Record<NotificationType, string> = {
    // Campaign Related
    CAMPAIGN_APPLICATION_RECEIVED: "When someone applies to your campaign",
    CAMPAIGN_APPLICATION_ACCEPTED: "When your campaign application is accepted",
    CAMPAIGN_APPLICATION_REJECTED: "When your campaign application is rejected",
    CAMPAIGN_CREATED: "When new campaigns matching your interests are created",
    CAMPAIGN_UPDATED: "When campaign details are updated",
    CAMPAIGN_COMPLETED: "When a campaign is completed",
    CAMPAIGN_CANCELLED: "When a campaign is cancelled",
    CAMPAIGN_DEADLINE_REMINDER: "Reminders about upcoming campaign deadlines",

    // Payment Related
    PAYMENT_RECEIVED: "When you receive a payment",
    PAYMENT_FAILED: "When a payment transaction fails",
    PAYOUT_PROCESSED: "When your payout is successfully processed",
    PAYOUT_FAILED: "When a payout fails",
    PAYMENT_REMINDER: "Reminders about pending payments",

    // Communication
    MESSAGE_RECEIVED: "When you receive a new message",
    MEETING_SCHEDULED: "When a meeting is scheduled with you",
    MEETING_REMINDER: "Reminders about upcoming meetings",
    MEETING_CANCELLED: "When a scheduled meeting is cancelled",

    // Account Related
    ACCOUNT_VERIFIED: "When your account verification is complete",
    ACCOUNT_VERIFICATION_REQUIRED: "When additional verification is needed",
    SECURITY_ALERT: "Important security notifications",
    PROFILE_UPDATE_REQUIRED: "When your profile needs updates",

    // System
    SYSTEM_MAINTENANCE: "Platform maintenance notifications",
    FEATURE_ANNOUNCEMENT: "Announcements about new features",
    POLICY_UPDATE: "Updates to terms and policies",
    DAILY_DIGEST: "Daily summary of your activities",
  };

  return descriptions[type] || "Notification description";
};
