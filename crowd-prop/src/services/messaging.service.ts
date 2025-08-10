import io, { Socket } from "socket.io-client";
import {
  MessageResponse,
  MessageThreadResponse,
  CreateMessageThreadRequest,
  ConnectedPayload,
  UserTypingPayload,
  MessageReadPayload,
  ThreadReadPayload,
  JoinThreadPayload,
  SendMessagePayload,
  MarkAsReadPayload,
  TypingPayload,
  NewMessagePayload,
  NotificationPayload,
  ErrorPayload,
} from "@/interfaces/messaging";
import { httpService } from "./http.service";

class MessagingService {
  private socket: Socket | null = null;
  private wsUrl: string;

  constructor() {
    this.wsUrl =
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:3000/messaging";
  }

  // WebSocket Connection Management
  connect(firebaseToken: string): Socket {
    this.socket = io(this.wsUrl, {
      auth: { token: firebaseToken },
    });

    this.setupEventHandlers();
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on("connected", (data: ConnectedPayload) => {
      console.log("🔌 WebSocket Event - connected:", data);
    });

    this.socket.on("error", (error: ErrorPayload) => {
      console.error("❌ WebSocket Event - error:", error);
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("🔌 WebSocket Event - disconnect:", reason);
    });
  }

  // WebSocket Methods
  joinThread(threadId: string): void {
    if (!this.socket) {
      console.warn("Socket not connected");
      return;
    }
    const payload: JoinThreadPayload = { threadId };
    console.log("📤 WebSocket Emit - joinThread:", payload);
    this.socket.emit("joinThread", payload);
  }

  leaveThread(threadId: string): void {
    if (!this.socket) {
      console.warn("Socket not connected");
      return;
    }
    const payload = { threadId };
    console.log("📤 WebSocket Emit - leaveThread:", payload);
    this.socket.emit("leaveThread", payload);
  }

  sendMessage(threadId: string, content: string): void {
    if (!this.socket) {
      console.warn("Socket not connected");
      return;
    }
    const payload: SendMessagePayload = { threadId, content };
    console.log("📤 WebSocket Emit - sendMessage:", payload);
    this.socket.emit("sendMessage", payload);
  }

  sendTyping(threadId: string, isTyping: boolean): void {
    if (!this.socket) {
      console.warn("Socket not connected");
      return;
    }
    const payload: TypingPayload = { threadId, isTyping };
    console.log("📤 WebSocket Emit - typing:", payload);
    this.socket.emit("typing", payload);
  }

  markAsRead(threadId?: string, messageId?: string): void {
    if (!this.socket) {
      console.warn("Socket not connected");
      return;
    }
    const payload: MarkAsReadPayload = { threadId, messageId };
    console.log("📤 WebSocket Emit - markAsRead:", payload);
    this.socket.emit("markAsRead", payload);
  }

  // Event Listeners
  onNewMessage(callback: (message: NewMessagePayload) => void): void {
    this.socket?.on("newMessage", (data: NewMessagePayload) => {
      console.log("📨 WebSocket Event - newMessage:", data);
      callback(data);
    });
  }

  onUserTyping(callback: (data: UserTypingPayload) => void): void {
    this.socket?.on("userTyping", (data: UserTypingPayload) => {
      console.log("⌨️ WebSocket Event - userTyping:", data);
      callback(data);
    });
  }

  onMessageRead(callback: (data: MessageReadPayload) => void): void {
    this.socket?.on("messageRead", (data: MessageReadPayload) => {
      console.log("✅ WebSocket Event - messageRead:", data);
      callback(data);
    });
  }

  onThreadRead(callback: (data: ThreadReadPayload) => void): void {
    this.socket?.on("threadRead", (data: ThreadReadPayload) => {
      console.log("📖 WebSocket Event - threadRead:", data);
      callback(data);
    });
  }

  onNotification(callback: (data: NotificationPayload) => void): void {
    this.socket?.on("notification", (data: NotificationPayload) => {
      console.log("🔔 WebSocket Event - notification:", data);
      callback(data);
    });
  }

  onThreadJoined(callback: (data: { threadId: string }) => void): void {
    this.socket?.on("threadJoined", (data: { threadId: string }) => {
      console.log("🚪 WebSocket Event - threadJoined:", data);
      callback(data);
    });
  }

  onThreadLeft(callback: (data: { threadId: string }) => void): void {
    this.socket?.on("threadLeft", (data: { threadId: string }) => {
      console.log("🚪 WebSocket Event - threadLeft:", data);
      callback(data);
    });
  }

  // Remove event listeners
  offNewMessage(callback: (message: NewMessagePayload) => void): void {
    this.socket?.off("newMessage", callback);
  }

  offUserTyping(callback: (data: UserTypingPayload) => void): void {
    this.socket?.off("userTyping", callback);
  }

  offMessageRead(callback: (data: MessageReadPayload) => void): void {
    this.socket?.off("messageRead", callback);
  }

  offThreadRead(callback: (data: ThreadReadPayload) => void): void {
    this.socket?.off("threadRead", callback);
  }

  // REST API Methods
  async getThreads(
    page?: number,
    limit?: number,
    campaignId?: string
  ): Promise<MessageThreadResponse[]> {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (campaignId) params.append("campaignId", campaignId);

    const query = params.toString();
    const endpoint = `/messaging/threads${query ? `?${query}` : ""}`;

    const response = await httpService.get<MessageThreadResponse[]>(endpoint, true);
    return response.data;
  }

  async getThread(threadId: string): Promise<MessageThreadResponse> {
    const response = await httpService.get<MessageThreadResponse>(
      `/messaging/threads/${threadId}`,
      true
    );
    return response.data;
  }

  async getMessages(
    threadId: string,
    page?: number,
    limit?: number,
    before?: Date
  ): Promise<MessageResponse[]> {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (before) params.append("before", before.toISOString());

    const query = params.toString();
    const endpoint = `/messaging/threads/${threadId}/messages${
      query ? `?${query}` : ""
    }`;

    const response = await httpService.get<MessageResponse[]>(endpoint, true);
    return response.data;
  }

  /**
   * Get thread for a specific campaign
   */
  async getThreadForCampaign(
    campaignId: string
  ): Promise<MessageThreadResponse | null> {
    try {
      const response = await httpService.get<MessageThreadResponse>(
        `/messaging/campaigns/${campaignId}/thread`,
        true
      );
      return response.data;
    } catch (error: unknown) {
      // Return null if thread doesn't exist (404)
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      console.error("Error getting campaign thread:", error);
      throw error;
    }
  }

  async createThread(
    request: CreateMessageThreadRequest
  ): Promise<MessageThreadResponse> {
    const response = await httpService.post<MessageThreadResponse>(
      "/messaging/threads",
      request,
      true
    );
    return response.data;
  }

  // Send message via REST API (also broadcasts via WebSocket)
  async sendMessageHTTP(
    threadId: string,
    content: string
  ): Promise<MessageResponse> {
    const response = await httpService.post<MessageResponse>(
      `/messaging/threads/${threadId}/messages`,
      { content },
      true
    );
    return response.data;
  }

  async markMessageAsReadHTTP(messageId: string): Promise<void> {
    await httpService.patch<void>(
      `/messaging/messages/${messageId}/read`,
      undefined,
      true
    );
  }

  async markThreadAsReadHTTP(threadId: string): Promise<void> {
    await httpService.patch<void>(
      `/messaging/threads/${threadId}/read`,
      undefined,
      true
    );
  }

  // Check for new messages in campaign
  async hasNewMessagesForCampaign(
    campaignId: string
  ): Promise<{ hasNewMessages: boolean; unreadCount: number }> {
    const response = await httpService.get<{ hasNewMessages: boolean; unreadCount: number }>(
      `/messaging/campaigns/${campaignId}/has-new-messages`,
      true
    );
    return response.data;
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Singleton instance
export const messagingService = new MessagingService();
export default messagingService;
