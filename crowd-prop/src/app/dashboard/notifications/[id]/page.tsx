"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notificationSystemService } from "@/services/notification-system.service";
import { Notification } from "@/app/interfaces/notification-system";
import { NOTIFICATION_TYPE_CONFIGS } from "@/app/const/notification-constants";
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";

export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const notificationId = params.id as string;

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setLoading(true);
        const data = await notificationSystemService.getNotificationById(
          notificationId
        );
        setNotification(data);

        // Mark as read if not already read
        if (!data.readAt) {
          await notificationSystemService.markAsRead(notificationId);
          setNotification((prev) =>
            prev ? { ...prev, readAt: new Date().toISOString() } : null
          );
        }

        // Mark as clicked
        if (!data.clickedAt) {
          await notificationSystemService.markAsClicked(notificationId);
          setNotification((prev) =>
            prev ? { ...prev, clickedAt: new Date().toISOString() } : null
          );
        }
      } catch (err) {
        console.error("Error fetching notification:", err);
        setError("Failed to load notification details");
      } finally {
        setLoading(false);
      }
    };

    if (notificationId) {
      fetchNotification();
    }
  }, [notificationId]);

  const handleMarkAsDismissed = async () => {
    if (!notification) return;

    try {
      await notificationSystemService.markAsDismissed(notification.id);
      setNotification((prev) =>
        prev ? { ...prev, dismissedAt: new Date().toISOString() } : null
      );
    } catch (err) {
      console.error("Error dismissing notification:", err);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Notification Not Found"}
          </h1>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const config = NOTIFICATION_TYPE_CONFIGS[notification.notificationType];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Notifications
          </button>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Notification Details
            </h1>

            {!notification.dismissedAt && (
              <button
                onClick={handleMarkAsDismissed}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Dismiss
              </button>
            )}
          </div>
        </div>

        {/* Notification Card */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{config?.icon || "📢"}</div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {config?.label || notification.notificationType}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {config?.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {notification.readAt && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckIcon className="h-3 w-3 mr-1" />
                    Read
                  </span>
                )}
                {notification.clickedAt && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <EyeIcon className="h-3 w-3 mr-1" />
                    Clicked
                  </span>
                )}
                {notification.dismissedAt && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <XMarkIcon className="h-3 w-3 mr-1" />
                    Dismissed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="space-y-6">
              {/* Main Content */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Message
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {notification.message}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Details
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">
                        Type
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {notification.notificationType}
                      </dd>
                    </div>
                    {notification.campaignId && (
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Campaign ID
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {notification.campaignId}
                        </dd>
                      </div>
                    )}
                    {notification.userId && (
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          User ID
                        </dt>
                        <dd className="text-sm text-gray-900">
                          {notification.userId}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Timeline
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">
                        Sent
                      </dt>
                      <dd className="text-sm text-gray-900 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </dd>
                    </div>
                    {notification.readAt && (
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Read
                        </dt>
                        <dd className="text-sm text-gray-900 flex items-center">
                          <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                          {formatDistanceToNow(new Date(notification.readAt), {
                            addSuffix: true,
                          })}
                        </dd>
                      </div>
                    )}
                    {notification.clickedAt && (
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Clicked
                        </dt>
                        <dd className="text-sm text-gray-900 flex items-center">
                          <EyeIcon className="h-4 w-4 mr-1 text-blue-500" />
                          {formatDistanceToNow(new Date(notification.clickedAt), {
                            addSuffix: true,
                          })}
                        </dd>
                      </div>
                    )}
                    {notification.dismissedAt && (
                      <div>
                        <dt className="text-xs font-medium text-gray-500">
                          Dismissed
                        </dt>
                        <dd className="text-sm text-gray-900 flex items-center">
                          <XMarkIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {formatDistanceToNow(
                            new Date(notification.dismissedAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {/* Additional Data */}
              {notification.data && Object.keys(notification.data).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Additional Information
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                      {JSON.stringify(notification.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
