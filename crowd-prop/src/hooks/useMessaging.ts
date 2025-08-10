"use client";

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Socket } from "socket.io-client";
import messagingService from "@/services/messaging.service";
import {
  MessageResponse,
  MessageThreadResponse,
  UserTypingPayload,
  MessageReadPayload,
  ThreadReadPayload,
  NotificationPayload,
  CreateMessageThreadRequest,
} from "@/interfaces/messaging";

interface UseMessagingOptions {
  autoConnect?: boolean;
  autoJoinThread?: string;
  currentUserType?: "ADVERTISER" | "PROMOTER";
}

interface UseMessagingReturn {
  // Connection state
  isConnected: boolean;
  socket: Socket | null;

  // Data state
  messages: MessageResponse[];
  threads: MessageThreadResponse[];
  currentThread: MessageThreadResponse | null;
  typingUsers: Set<string>;
  unreadCount: number;

  // Loading states
  isLoadingThreads: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;

  // Error states
  error: string | null;

  // WebSocket methods
  sendMessage: (threadId: string, content: string) => Promise<void>;
  joinThread: (threadId: string) => void;
  leaveThread: (threadId: string) => void;
  sendTyping: (threadId: string, isTyping: boolean) => void;
  markAsRead: (threadId?: string, messageId?: string) => Promise<void>;

  // REST API methods
  loadThreads: (
    page?: number,
    limit?: number,
    campaignId?: string
  ) => Promise<void>;
  loadMessages: (
    threadId: string,
    page?: number,
    limit?: number
  ) => Promise<void>;
  loadThread: (threadId: string) => Promise<void>;
  createThread: (
    request: CreateMessageThreadRequest
  ) => Promise<MessageThreadResponse>;
  sendMessageHTTP: (
    threadId: string,
    content: string
  ) => Promise<MessageResponse>;
  getCampaignThread: (
    campaignId: string
  ) => Promise<MessageThreadResponse | null>;

  // Utility methods
  clearMessages: () => void;
  clearError: () => void;
  refreshThreads: () => Promise<void>;
}

export const useMessaging = (
  firebaseToken: string | null,
  options: UseMessagingOptions = {}
): UseMessagingReturn => {
  const { autoConnect = true, autoJoinThread, currentUserType } = options;

  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Data state
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [threads, setThreads] = useState<MessageThreadResponse[]>([]);
  const [currentThread, setCurrentThread] =
    useState<MessageThreadResponse | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [unreadCount, setUnreadCount] = useState(0);

  // Loading states
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Refs to prevent stale closures
  const threadsRef = useRef(threads);
  const messagesRef = useRef(messages);
  const currentThreadRef = useRef(currentThread);

  useEffect(() => {
    threadsRef.current = threads;
  }, [threads]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    currentThreadRef.current = currentThread;
  }, [currentThread]);

  // Calculate unread count from threads
  useEffect(() => {
    const total = threads.reduce(
      (sum, thread) => sum + (thread.unreadCount || 0),
      0
    );
    setUnreadCount(total);
  }, [threads]);

  // WebSocket connection management
  useEffect(() => {
    if (!firebaseToken || !autoConnect) return;

    try {
      const socketInstance = messagingService.connect(firebaseToken);
      setSocket(socketInstance);

      // Connection events
      socketInstance.on("connect", () => {
        setIsConnected(true);
        setError(null);
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
      });

      socketInstance.on("connect_error", (error) => {
        setError(`Connection failed: ${error.message}`);
        setIsConnected(false);
      });

      // Message events
      messagingService.onNewMessage((message: MessageResponse) => {
        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.find((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });

        // Update thread's last message and unread count
        // Only increment unread count for messages from other users
        setThreads((prev) =>
          prev.map((thread) => {
            if (thread.id === message.threadId) {
              const isOwnMessage =
                currentUserType && message.senderType === currentUserType;
              return {
                ...thread,
                lastMessageAt: message.createdAt,
                messages: [message],
                unreadCount: isOwnMessage
                  ? thread.unreadCount || 0
                  : (thread.unreadCount || 0) + 1,
              };
            }
            return thread;
          })
        );
      });

      // Typing events
      messagingService.onUserTyping((data: UserTypingPayload) => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      });

      // Read receipt events
      messagingService.onMessageRead((data: MessageReadPayload) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId ? { ...msg, isRead: true } : msg
          )
        );
      });

      messagingService.onThreadRead((data: ThreadReadPayload) => {
        console.log("🔄 Received threadRead event:", data);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.threadId === data.threadId && msg.senderId !== data.userId
              ? { ...msg, isRead: true }
              : msg
          )
        );

        setThreads((prev) =>
          prev.map((thread) => {
            if (thread.id === data.threadId) {
              console.log(
                `📝 Updating thread ${thread.id} unreadCount from ${thread.unreadCount} to 0`
              );
              return { ...thread, unreadCount: 0 };
            }
            return thread;
          })
        );
      });

      // Notification events
      messagingService.onNotification((notification: NotificationPayload) => {
        console.log("📢 Notification:", notification);
        // You can integrate with a toast system here
      });

      // Auto-join thread if specified
      if (autoJoinThread) {
        socketInstance.on("connect", () => {
          messagingService.joinThread(autoJoinThread);
        });
      }
    } catch (err) {
      setError(
        `Failed to initialize messaging: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }

    return () => {
      messagingService.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [firebaseToken, autoConnect, autoJoinThread, currentUserType]);

  // WebSocket methods
  const sendMessage = useCallback(async (threadId: string, content: string) => {
    try {
      setIsSendingMessage(true);
      setError(null);

      // Use HTTP API to send message and get immediate response
      const newMessage = await messagingService.sendMessageHTTP(
        threadId,
        content
      );

      // Add the message to local state immediately
      setMessages((prev) => {
        // Avoid duplicate messages
        if (prev.find((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });

      // Update thread's last message time
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === threadId) {
            return {
              ...thread,
              lastMessageAt: newMessage.createdAt,
              messages: [newMessage],
            };
          }
          return thread;
        })
      );
    } catch (err) {
      setError(
        `Failed to send message: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsSendingMessage(false);
    }
  }, []);

  const joinThread = useCallback((threadId: string) => {
    messagingService.joinThread(threadId);
  }, []);

  const leaveThread = useCallback((threadId: string) => {
    messagingService.leaveThread(threadId);
  }, []);

  const sendTyping = useCallback((threadId: string, isTyping: boolean) => {
    messagingService.sendTyping(threadId, isTyping);
  }, []);

  const markAsRead = useCallback(
    async (threadId?: string, messageId?: string) => {
      try {
        if (messageId) {
          // Mark specific message as read via HTTP API
          console.log("📖 Marking message as read (HTTP):", messageId);
          await messagingService.markMessageAsReadHTTP(messageId);
        } else if (threadId) {
          // Mark entire thread as read via HTTP API
          console.log("📖 Marking thread as read (HTTP):", threadId);
          await messagingService.markThreadAsReadHTTP(threadId);

          // Immediately update local state for instant UI feedback
          console.log("🔄 Updating local thread state immediately");
          setThreads((prev) =>
            prev.map((thread) => {
              if (thread.id === threadId) {
                console.log(
                  `📝 Local update: thread ${thread.id} unreadCount from ${thread.unreadCount} to 0`
                );
                return { ...thread, unreadCount: 0 };
              }
              return thread;
            })
          );
        }
      } catch (error) {
        console.error("Failed to mark as read:", error);
        throw error; // Re-throw so calling code can handle it
      }
    },
    []
  );

  // REST API methods

  const loadThreads = useCallback(
    async (page?: number, limit?: number, campaignId?: string) => {
      try {
        setIsLoadingThreads(true);
        setError(null);
        const threadsData = await messagingService.getThreads(
          page,
          limit,
          campaignId
        );
        setThreads(threadsData);
      } catch (err) {
        setError(
          `Failed to load threads: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setIsLoadingThreads(false);
      }
    },
    []
  );

  const loadMessages = useCallback(
    async (threadId: string, page?: number, limit?: number) => {
      try {
        setIsLoadingMessages(true);
        setError(null);
        const messagesData = await messagingService.getMessages(
          threadId,
          page,
          limit
        );
        setMessages(messagesData);
      } catch (err) {
        setError(
          `Failed to load messages: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setIsLoadingMessages(false);
      }
    },
    []
  );

  const loadThread = useCallback(async (threadId: string) => {
    try {
      setError(null);
      const thread = await messagingService.getThread(threadId);
      setCurrentThread(thread);

      // Update thread in threads list if it exists
      setThreads((prev) => prev.map((t) => (t.id === threadId ? thread : t)));
    } catch (err) {
      setError(
        `Failed to load thread: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  }, []);

  const createThread = useCallback(
    async (
      request: CreateMessageThreadRequest
    ): Promise<MessageThreadResponse> => {
      try {
        setError(null);
        const newThread = await messagingService.createThread(request);
        setThreads((prev) => [newThread, ...prev]);
        return newThread;
      } catch (err) {
        const errorMsg = `Failed to create thread: ${
          err instanceof Error ? err.message : "Unknown error"
        }`;
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    },
    []
  );

  const sendMessageHTTP = useCallback(
    async (threadId: string, content: string): Promise<MessageResponse> => {
      try {
        setIsSendingMessage(true);
        setError(null);
        const message = await messagingService.sendMessageHTTP(
          threadId,
          content
        );

        // Add message to local state (it will also come via WebSocket)
        setMessages((prev) => {
          if (prev.find((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });

        return message;
      } catch (err) {
        const errorMsg = `Failed to send message: ${
          err instanceof Error ? err.message : "Unknown error"
        }`;
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsSendingMessage(false);
      }
    },
    []
  );

  const getCampaignThread = useCallback(
    async (campaignId: string): Promise<MessageThreadResponse | null> => {
      try {
        setError(null);
        const thread = await messagingService.getThreadForCampaign(campaignId);

        if (thread) {
          setCurrentThread(thread);

          // Add to threads list if not present
          setThreads((prev) => {
            if (prev.find((t) => t.id === thread.id)) return prev;
            return [thread, ...prev];
          });
        }

        return thread;
      } catch (err) {
        // Handle JSON parsing errors gracefully
        if (err instanceof SyntaxError && err.message.includes("JSON")) {
          console.warn(
            "JSON parsing error for campaign thread, treating as no thread found:",
            campaignId
          );
          return null;
        }

        const errorMsg = `Failed to get campaign thread: ${
          err instanceof Error ? err.message : "Unknown error"
        }`;
        console.error(errorMsg, err);
        setError(errorMsg);
        throw new Error(errorMsg);
      }
    },
    []
  );

  // Utility methods
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshThreads = useCallback(async () => {
    await loadThreads();
  }, [loadThreads]);

  return {
    // Connection state
    isConnected,
    socket,

    // Data state
    messages,
    threads,
    currentThread,
    typingUsers,
    unreadCount,

    // Loading states
    isLoadingThreads,
    isLoadingMessages,
    isSendingMessage,

    // Error state
    error,

    // WebSocket methods
    sendMessage,
    joinThread,
    leaveThread,
    sendTyping,
    markAsRead,

    // REST API methods
    loadThreads,
    loadMessages,
    loadThread,
    createThread,
    sendMessageHTTP,
    getCampaignThread,

    // Utility methods
    clearMessages,
    clearError,
    refreshThreads,
  };
};
