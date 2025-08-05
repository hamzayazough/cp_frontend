export interface CampaignMedia {
  id?: string;
  campaignId: string;
  mediaUrl: string;
  mediaType?: "image" | "video" | "document";
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  displayOrder?: number;
  isPrimary?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
