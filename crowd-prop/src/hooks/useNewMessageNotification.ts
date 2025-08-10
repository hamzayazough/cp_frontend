import { useState, useEffect, useCallback } from "react";
import messagingService from "@/services/messaging.service";

interface NewMessageStatus {
  hasNewMessages: boolean;
  unreadCount: number;
}

export function useNewMessageNotification(
  campaignId: string,
  firebaseToken: string | null
) {
  const [status, setStatus] = useState<NewMessageStatus>({
    hasNewMessages: false,
    unreadCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkForNewMessages = useCallback(async () => {
    if (!campaignId || !firebaseToken) {
      setStatus({ hasNewMessages: false, unreadCount: 0 });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await messagingService.hasNewMessagesForCampaign(
        campaignId
      );
      setStatus(result);
    } catch (err) {
      console.error("Failed to check for new messages:", err);
      setError(err instanceof Error ? err.message : "Failed to check messages");
      setStatus({ hasNewMessages: false, unreadCount: 0 });
    } finally {
      setLoading(false);
    }
  }, [campaignId, firebaseToken]);

  // Check for new messages when the hook is initialized
  useEffect(() => {
    checkForNewMessages();
  }, [checkForNewMessages]);

  // Set up periodic checking for new messages (every 30 seconds)
  useEffect(() => {
    if (!campaignId || !firebaseToken) return;

    const interval = setInterval(checkForNewMessages, 30000);
    return () => clearInterval(interval);
  }, [checkForNewMessages, campaignId, firebaseToken]);

  const resetNotification = useCallback(() => {
    setStatus({ hasNewMessages: false, unreadCount: 0 });
  }, []);

  return {
    hasNewMessages: status.hasNewMessages,
    unreadCount: status.unreadCount,
    loading,
    error,
    checkForNewMessages,
    resetNotification,
  };
}
