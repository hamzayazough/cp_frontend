import { Deliverable } from "../enums/campaign-type";

export interface CampaignWork {
  id: string;
  campaignId: string;
  promoterLink: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  comments?: CampaignWorkComment[]; // Comments on the work
}

export interface CampaignWorkComment {
  id: string;
  workId: string;
  commentMessage: string;
  commentatorId?: string;
  commentatorName?: string;
  createdAt: Date;
}

export interface CampaignDeliverable {
  id?: string;
  campaignId?: string;
  deliverable: Deliverable;
  isSubmitted: boolean;
  isFinished: boolean;
  createdAt: Date;
  updatedAt: Date;
  promoterWork?: CampaignWork[]; // Work submissions for this deliverable
}
