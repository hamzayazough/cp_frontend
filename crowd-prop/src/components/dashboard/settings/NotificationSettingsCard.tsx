import React, { useState } from "react";
import { NotificationSettings } from "@/app/interfaces/notification";
import { notificationService } from "@/services/notification.service";

interface NotificationSettingsCardProps {
  settings: NotificationSettings;
  onUpdate: (settings: Partial<NotificationSettings>) => void;
  disabled?: boolean;
}

export function NotificationSettingsCard({
  settings,
  onUpdate,
  disabled = false,
}: NotificationSettingsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const timezones = notificationService.getAvailableTimezones();

  const handleSave = () => {
    onUpdate(localSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setIsEditing(false);
  };

  const handleChange = (
    field: keyof NotificationSettings,
    value: string | boolean
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatTime = (time: string) => {
    return notificationService.formatTime(time);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            General Settings
          </h3>
          <p className="text-gray-600 text-sm">
            Global preferences and quiet hours
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            disabled={disabled}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-50"
          >
            Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              disabled={disabled}
              className="px-3 py-1.5 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={disabled}
              className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 hover:shadow-md transition-all disabled:opacity-50"
            >
              Save
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Global Email Toggle */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-base font-semibold text-gray-900 block">
                Email Notifications
              </label>
              <p className="text-gray-600 text-sm">
                Enable or disable all email notifications
              </p>
            </div>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    isEditing
                      ? localSettings.emailNotificationsEnabled
                      : settings.emailNotificationsEnabled
                  }
                  onChange={(e) =>
                    handleChange("emailNotificationsEnabled", e.target.checked)
                  }
                  disabled={disabled || !isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Timezone & Quiet Hours Combined */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Timezone */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Timezone
              </label>
              {isEditing ? (
                <select
                  value={localSettings.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white text-sm"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium text-sm">
                  {timezones.find((tz) => tz.value === settings.timezone)
                    ?.label || settings.timezone}
                </div>
              )}
            </div>

            {/* Quiet Hours From */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Quiet From
              </label>
              {isEditing ? (
                <input
                  type="time"
                  value={localSettings.quietHoursStart}
                  onChange={(e) =>
                    handleChange("quietHoursStart", e.target.value)
                  }
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white text-sm"
                />
              ) : (
                <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg">
                  <span className="text-gray-900 font-medium text-sm">
                    {settings.quietHoursStart ? formatTime(settings.quietHoursStart) : "N/A"}
                  </span>
                </div>
              )}
            </div>

            {/* Quiet Hours To */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                Quiet To
              </label>
              {isEditing ? (
                <input
                  type="time"
                  value={localSettings.quietHoursEnd}
                  onChange={(e) =>
                    handleChange("quietHoursEnd", e.target.value)
                  }
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 bg-white text-sm"
                />
              ) : (
                <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg">
                  <span className="text-gray-900 font-medium text-sm">
                    {settings.quietHoursEnd ? formatTime(settings.quietHoursEnd) : "N/A"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Push Token Status */}
        {settings.pushToken && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium text-sm">
                Push notifications connected
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
