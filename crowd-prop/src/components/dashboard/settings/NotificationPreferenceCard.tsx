import React from "react";
import {
  NotificationPreference,
  NotificationType,
} from "@/app/interfaces/notification";
import {
  getNotificationTypeLabel,
  getNotificationTypeDescription,
} from "@/app/interfaces/notification";

interface NotificationPreferenceCardProps {
  preference: NotificationPreference;
  onUpdate: (
    type: NotificationType,
    field: keyof Pick<
      NotificationPreference,
      "emailEnabled" | "smsEnabled" | "pushEnabled" | "inAppEnabled"
    >,
    value: boolean
  ) => void;
  disabled?: boolean;
}

export function NotificationPreferenceCard({
  preference,
  onUpdate,
  disabled = false,
}: NotificationPreferenceCardProps) {
  const handleToggle = (
    field: keyof Pick<
      NotificationPreference,
      "emailEnabled" | "smsEnabled" | "pushEnabled" | "inAppEnabled"
    >,
    value: boolean
  ) => {
    onUpdate(preference.notificationType, field, value);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all hover:bg-gray-100">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-900">
          {getNotificationTypeLabel(preference.notificationType)}
        </h4>
        <p className="text-sm text-gray-600 mt-1">
          {getNotificationTypeDescription(preference.notificationType)}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Email */}
        <div className="flex flex-col items-center space-y-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id={`${preference.id}-email`}
              type="checkbox"
              checked={preference.emailEnabled}
              onChange={(e) => handleToggle("emailEnabled", e.target.checked)}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <div className="flex items-center space-x-1">
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">Email</span>
          </div>
        </div>

        {/* SMS */}
        <div className="flex flex-col items-center space-y-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id={`${preference.id}-sms`}
              type="checkbox"
              checked={preference.smsEnabled}
              onChange={(e) => handleToggle("smsEnabled", e.target.checked)}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
          <div className="flex items-center space-x-1">
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">SMS</span>
          </div>
        </div>

        {/* Push */}
        <div className="flex flex-col items-center space-y-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id={`${preference.id}-push`}
              type="checkbox"
              checked={preference.pushEnabled}
              onChange={(e) => handleToggle("pushEnabled", e.target.checked)}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
          <div className="flex items-center space-x-1">
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM9 7v5l-5-5h5zM9 13h6m-6 0v6m6-6v6"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">Push</span>
          </div>
        </div>

        {/* In-App */}
        <div className="flex flex-col items-center space-y-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id={`${preference.id}-inapp`}
              type="checkbox"
              checked={preference.inAppEnabled}
              onChange={(e) => handleToggle("inAppEnabled", e.target.checked)}
              disabled={disabled}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
          <div className="flex items-center space-x-1">
            <svg
              className="h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM9 7v5l-5-5h5z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">In-App</span>
          </div>
        </div>
      </div>
    </div>
  );
}
