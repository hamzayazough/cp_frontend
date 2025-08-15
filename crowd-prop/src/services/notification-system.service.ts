import { httpService } from "./http.service";
import {
  NotificationFilters,
  GetNotificationsResponse,
  GetUnreadCountResponse,
  NotificationActionResponse,
  MarkAllAsReadResponse,
  DeleteDismissedResponse,
  Notification,
} from "@/app/interfaces/notification-system";

export class NotificationSystemService {
  private readonly baseEndpoint = "/notifications";

  /**
   * Fetch paginated notifications with optional filtering
   */
  async getNotifications(
    filters: NotificationFilters = {}
  ): Promise<GetNotificationsResponse> {
    const queryParams = new URLSearchParams();

    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.limit) queryParams.append("limit", filters.limit.toString());
    if (filters.unread !== undefined)
      queryParams.append("unread", filters.unread.toString());
    if (filters.notificationType)
      queryParams.append("notificationType", filters.notificationType);
    if (filters.campaignId)
      queryParams.append("campaignId", filters.campaignId);

    const endpoint = `${this.baseEndpoint}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await httpService.get<GetNotificationsResponse>(
      endpoint,
      true
    );
    return response.data;
  }

  /**
   * Get unread notification count for badge display
   */
  async getUnreadCount(): Promise<number> {
    const response = await httpService.get<GetUnreadCountResponse>(
      `${this.baseEndpoint}/unread-count`,
      true
    );
    return response.data.count;
  }

  /**
   * Get a specific notification by ID
   */
  async getNotificationById(id: string): Promise<Notification> {
    const response = await httpService.get<Notification>(
      `${this.baseEndpoint}/${id}`,
      true
    );
    return response.data;
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string): Promise<NotificationActionResponse> {
    const response = await httpService.patch<NotificationActionResponse>(
      `${this.baseEndpoint}/${id}/read`,
      undefined,
      true
    );
    return response.data;
  }

  /**
   * Mark a notification as clicked
   */
  async markAsClicked(id: string): Promise<NotificationActionResponse> {
    const response = await httpService.patch<NotificationActionResponse>(
      `${this.baseEndpoint}/${id}/clicked`,
      undefined,
      true
    );
    return response.data;
  }

  /**
   * Mark a notification as dismissed
   */
  async markAsDismissed(id: string): Promise<NotificationActionResponse> {
    const response = await httpService.patch<NotificationActionResponse>(
      `${this.baseEndpoint}/${id}/dismissed`,
      undefined,
      true
    );
    return response.data;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<MarkAllAsReadResponse> {
    const response = await httpService.patch<MarkAllAsReadResponse>(
      `${this.baseEndpoint}/mark-all-read`,
      undefined,
      true
    );
    return response.data;
  }

  /**
   * Delete all dismissed notifications
   */
  async deleteDismissedNotifications(): Promise<DeleteDismissedResponse> {
    const response = await httpService.delete<DeleteDismissedResponse>(
      `${this.baseEndpoint}/dismissed`,
      true
    );
    return response.data;
  }

  /**
   * Batch mark notifications as read
   */
  async batchMarkAsRead(ids: string[]): Promise<NotificationActionResponse> {
    const response = await httpService.patch<NotificationActionResponse>(
      `${this.baseEndpoint}/batch-read`,
      { ids },
      true
    );
    return response.data;
  }

  /**
   * Get notifications for dropdown display (limited count, unread only)
   */
  async getDropdownNotifications(limit: number = 5): Promise<Notification[]> {
    const response = await this.getNotifications({
      limit,
      unread: true,
      page: 1,
    });
    return response.notifications;
  }

  /**
   * Real-time notification polling
   * Returns new notifications since the last check
   */
  async pollForNewNotifications(
    lastCheckTime: string
  ): Promise<Notification[]> {
    const queryParams = new URLSearchParams();
    queryParams.append("since", lastCheckTime);
    queryParams.append("limit", "50");

    const response = await httpService.get<GetNotificationsResponse>(
      `${this.baseEndpoint}/poll?${queryParams.toString()}`,
      true
    );
    return response.data.notifications;
  }
}

// Export singleton instance
export const notificationSystemService = new NotificationSystemService();
