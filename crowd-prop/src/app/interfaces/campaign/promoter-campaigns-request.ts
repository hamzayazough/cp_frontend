import { CampaignType } from "@/app/enums/campaign-type";
import { PromoterCampaignStatus } from "@/app/interfaces/promoter-campaign";
import { CampaignPromoter } from "./promoter-campaign-details";

export interface GetPromoterCampaignsRequest {
  // Pagination
  page?: number;
  limit?: number;

  // Search
  searchTerm?: string;

  // Filtering
  status?: PromoterCampaignStatus[];
  type?: CampaignType[];

  // Sorting
  sortBy?: "newest" | "deadline" | "earnings" | "title";
  sortOrder?: "asc" | "desc";
}

export interface GetPromoterCampaignsResponse {
  campaigns: CampaignPromoter[];
  page: number;
  totalPages: number;
  totalCount: number;
  summary: {
    totalActive: number;
    totalPending: number;
    totalCompleted: number;
    totalEarnings: number;
    totalViews: number;
  };
}
