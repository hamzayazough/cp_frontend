// Message sender types
export type MessageSenderType = "ADVERTISER" | "PROMOTER" | "ADMIN" | "SYSTEM";
export type UserRole = "ADVERTISER" | "PROMOTER" | "ADMIN";

// User information in messages
export interface UserInfo {
  id: string; // Database UUID only
  username: string; // maps to user.name in backend
  profilePictureUrl?: string; // maps to user.avatarUrl in backend
}

// Campaign information in threads
export interface CampaignInfo {
  id: string;
  title: string;
  isPublic: boolean;
}

// Request/Response Objects

// Create Thread Request
export interface CreateMessageThreadRequest {
  campaignId: string;
  subject?: string;
}

// Send Message Request
export interface CreateMessageRequest {
  threadId: string;
  content: string;
  senderType: MessageSenderType; // Auto-determined by backend based on user role
}

// Message Response Object
export interface MessageResponse {
  id: string;
  threadId: string;
  senderId: string;
  senderType: MessageSenderType;
  content: string;
  isRead: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  sender?: UserInfo;
}

// Message Thread Response Object
export interface MessageThreadResponse {
  id: string;
  campaignId: string;
  promoterId: string;
  advertiserId: string;
  subject?: string;
  lastMessageAt: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  campaign?: CampaignInfo;
  promoter?: UserInfo;
  advertiser?: UserInfo;
  unreadCount?: number; // Only included in getThreads response
  messages?: MessageResponse[]; // Only latest message in getThreads response
}

// Chat Summary Response
export interface ChatSummaryResponse {
  id: string;
  threadId: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentimentScore?: number; // -1.00 to 1.00
  createdAt: string;
  updatedAt: string;
}

// Create Chat Summary Request
export interface CreateChatSummaryRequest {
  threadId: string;
  summary: string;
  keyPoints?: string[];
  actionItems?: string[];
  sentimentScore?: number;
}

// Mark as Read Requests
export interface MarkMessageAsReadRequest {
  messageId: string;
}

export interface MarkThreadAsReadRequest {
  threadId: string;
  userId: string;
}

// Query Parameters for GET requests
export interface GetMessagesRequest {
  threadId: string;
  page?: number;
  limit?: number;
  before?: Date; // For pagination, get messages before this date
}

export interface GetThreadsRequest {
  userId: string;
  page?: number;
  limit?: number;
  campaignId?: string; // Filter by campaign
}

// WebSocket Event Payloads

// Client -> Server Events
export interface JoinThreadPayload {
  threadId: string;
}

export interface SendMessagePayload {
  threadId: string;
  content: string;
}

export interface MarkAsReadPayload {
  threadId?: string; // For marking entire thread as read
  messageId?: string; // For marking single message as read
}

export interface TypingPayload {
  threadId: string;
  isTyping: boolean;
}

// Server -> Client Events
export interface ConnectedPayload {
  userId: string;
  role: UserRole;
  message: string;
}

export interface ThreadJoinedPayload {
  threadId: string;
}

export interface ThreadLeftPayload {
  threadId: string;
}

export type NewMessagePayload = MessageResponse;

export interface MessageReadPayload {
  messageId: string;
  userId: string;
}

export interface ThreadReadPayload {
  threadId: string;
  userId: string;
}

export interface UserTypingPayload {
  threadId: string;
  userId: string;
  isTyping: boolean;
}

export interface NotificationPayload {
  type: "info" | "warning" | "error" | "success";
  message: string;
  data?: Record<string, unknown>;
}

export interface ErrorPayload {
  message: string;
  code?: string;
}
