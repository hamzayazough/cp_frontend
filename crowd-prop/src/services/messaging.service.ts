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

class MessagingService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private baseUrl: string;
  private wsUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    this.wsUrl =
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:3000/messaging";
  }

  // WebSocket Connection Management
  connect(firebaseToken: string): Socket {
    this.token = firebaseToken;
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
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.token) {
      throw new Error("No authentication token available");
    }

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

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
    const endpoint = `/api/messaging/threads${query ? `?${query}` : ""}`;

    return this.makeRequest<MessageThreadResponse[]>(endpoint);
  }

  async getThread(threadId: string): Promise<MessageThreadResponse> {
    return this.makeRequest<MessageThreadResponse>(
      `/api/messaging/threads/${threadId}`
    );
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
    const endpoint = `/api/messaging/threads/${threadId}/messages${
      query ? `?${query}` : ""
    }`;

    return this.makeRequest<MessageResponse[]>(endpoint);
  }

  /**
   * Get thread for a specific campaign
   */
  async getThreadForCampaign(
    campaignId: string
  ): Promise<MessageThreadResponse | null> {
    if (!this.token) {
      throw new Error("No authentication token available");
    }

    const url = `${this.baseUrl}/api/messaging/campaigns/${campaignId}/thread`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });

      // Return null if thread doesn't exist (404)
      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Check if response has content before parsing JSON
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0" || contentLength === null) {
        return null;
      }

      // Try to parse JSON, handle empty responses gracefully
      const text = await response.text();
      if (!text.trim()) {
        return null;
      }

      return JSON.parse(text);
    } catch (error) {
      // Handle JSON parsing errors specifically
      if (error instanceof SyntaxError && error.message.includes("JSON")) {
        console.warn(
          "Empty or invalid JSON response for campaign thread:",
          campaignId
        );
        return null;
      }

      console.error("Error getting campaign thread:", error);
      throw error;
    }
  }

  async createThread(
    request: CreateMessageThreadRequest
  ): Promise<MessageThreadResponse> {
    return this.makeRequest<MessageThreadResponse>("/api/messaging/threads", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // Send message via REST API (also broadcasts via WebSocket)
  async sendMessageHTTP(
    threadId: string,
    content: string
  ): Promise<MessageResponse> {
    return this.makeRequest<MessageResponse>(
      `/api/messaging/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
      }
    );
  }

  async markMessageAsReadHTTP(messageId: string): Promise<void> {
    const url = `${this.baseUrl}/api/messaging/messages/${messageId}/read`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Don't try to parse JSON for empty responses
    const text = await response.text();
    if (text) {
      try {
        return JSON.parse(text);
      } catch {
        // If it's not valid JSON, just return void for successful responses
        return;
      }
    }
  }

  async markThreadAsReadHTTP(threadId: string): Promise<void> {
    const url = `${this.baseUrl}/api/messaging/threads/${threadId}/read`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Don't try to parse JSON for empty responses
    const text = await response.text();
    if (text) {
      try {
        return JSON.parse(text);
      } catch {
        // If it's not valid JSON, just return void for successful responses
        return;
      }
    }
  }

  // Check for new messages in campaign
  async hasNewMessagesForCampaign(
    campaignId: string
  ): Promise<{ hasNewMessages: boolean; unreadCount: number }> {
    const url = `${this.baseUrl}/api/messaging/campaigns/${campaignId}/has-new-messages`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
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
