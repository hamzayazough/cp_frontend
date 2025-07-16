import { CampaignType } from "@/app/enums/campaign-type";
import { AdvertiserType } from "@/app/enums/advertiser-type";

export interface ExploreCampaignRequest {
  // Pagination
  page?: number;
  limit?: number;

  // Search
  searchTerm?: string;

  // Filtering
  typeFilter?: CampaignType[];
  advertiserTypes?: AdvertiserType[];

  // Sorting
  sortBy?: "newest" | "deadline" | "budget" | "applicants";
}
