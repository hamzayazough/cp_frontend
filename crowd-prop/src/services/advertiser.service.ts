import { httpService } from "./http.service";
import {
  AdvertiserDashboardData,
  GetAdvertiserDashboardRequest,
  GetAdvertiserDashboardResponse,
  GetAdvertiserStatsResponse,
  GetAdvertiserCampaignsResponse,
  GetAdvertiserTransactionsResponse,
  GetAdvertiserMessagesResponse,
  GetAdvertiserWalletResponse,
} from "@/app/interfaces/dashboard/advertiser-dashboard";
import { Campaign } from "@/app/interfaces/campaign/campaign";
import {
  CampaignAdvertiser,
  AdvertiserCampaignListResponse,
  AdvertiserCampaignListRequest,
  AdvertiserDashboardSummary,
  PromoterApplicationInfo,
  ReviewPromoterApplicationRequest,
} from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType, CampaignStatus } from "@/app/enums/campaign-type";
import { CampaignType, CampaignStatus } from "@/app/enums/campaign-type";

interface CreateCampaignResponse {
  success: boolean;
  message: string;
  campaign?: Campaign;
}

interface GetCampaignDetailsResponse {
  success: boolean;
  data: CampaignAdvertiser;
  message?: string;
}

interface GetCampaignApplicationsResponse {
  success: boolean;
  data: PromoterApplicationInfo[];
  message?: string;
}

interface ReviewApplicationResponse {
  success: boolean;
  message: string;
}

interface GetCampaignFiltersResponse {
  success: boolean;
  data: {
    statuses: CampaignStatus[];
    types: CampaignType[];
  };
  message?: string;
}

class AdvertiserService {
  private baseUrl = "/advertiser";

  async getDashboardData(
    params: GetAdvertiserDashboardRequest = {}
  ): Promise<AdvertiserDashboardData> {
    try {
      const response = await httpService.post<GetAdvertiserDashboardResponse>(
        `${this.baseUrl}/dashboard`,
        params,
        true
      );

      return response.data.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to retrieve dashboard data"
      );
    }
  }

  async createCampaign(
    campaignData: Omit<Campaign, "file"> & {
      mediaUrl?: string;
    }
  ): Promise<CreateCampaignResponse> {
    try {
      const response = await httpService.post(
        `${this.baseUrl}/create-campaign`,
        campaignData,
        true
      );

      // Debug log to see the response structure
      console.log("Raw API response:", response);
      console.log("Response data:", response.data);

      // Type assertion for the response data
      const responseData = response.data as {
        message?: string;
        campaign?: Campaign;
      };

      return {
        success: true,
        message:
          responseData.message ||
          response.message ||
          "Campaign created successfully",
        campaign: responseData.campaign || (response.data as Campaign),
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create campaign",
      };
    }
  }

  // New methods for campaign management
  async getCampaignsList(
    params: AdvertiserCampaignListRequest = {}
  ): Promise<AdvertiserCampaignListResponse> {
    try {
      const response = await httpService.post<AdvertiserCampaignListResponse>(
        `${this.baseUrl}/campaigns/list`,
        params,
        true
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to retrieve campaigns"
      );
    }
  }

  async getCampaignDetails(campaignId: string): Promise<CampaignAdvertiser> {
    try {
      const response = await httpService.get<GetCampaignDetailsResponse>(
        `${this.baseUrl}/campaigns/${campaignId}`,
        true
      );

      return response.data.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to retrieve campaign details"
      );
    }
  }

  async getCampaignApplications(
    campaignId: string
  ): Promise<PromoterApplicationInfo[]> {
    try {
      const response = await httpService.get<GetCampaignApplicationsResponse>(
        `${this.baseUrl}/campaigns/${campaignId}/applications`,
        true
      );

      return response.data.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to retrieve campaign applications"
      );
    }
  }

  async reviewPromoterApplication(
    params: ReviewPromoterApplicationRequest
  ): Promise<ReviewApplicationResponse> {
    try {
      const response = await httpService.post<ReviewApplicationResponse>(
        `${this.baseUrl}/campaigns/${params.campaignId}/applications/${params.applicationId}/review`,
        { action: params.action },
        true
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to review application"
      );
    }
  }

  async getDashboardSummary(): Promise<AdvertiserDashboardSummary> {
    try {
      const response = await httpService.get<{
        success: boolean;
        data: AdvertiserDashboardSummary;
      }>(`${this.baseUrl}/dashboard/summary`, true);

      return response.data.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to retrieve dashboard summary"
      );
    }
  }

  async getCampaignFilters(): Promise<{
    statuses: CampaignStatus[];
    types: CampaignType[];
  }> {
    try {
      const response = await httpService.get<GetCampaignFiltersResponse>(
        `${this.baseUrl}/campaigns/filters`,
        true
      );

      return response.data.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to retrieve campaign filters"
      );
    }
  }

  async deleteCampaign(
    campaignId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpService.delete(
        `${this.baseUrl}/campaigns/${campaignId}`,
        true
      );

      return {
        success: true,
        message: response.message || "Campaign deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete campaign",
      };
    }
  }

  async duplicateCampaign(
    campaignId: string
  ): Promise<{ success: boolean; message: string; campaign?: Campaign }> {
    try {
      const response = await httpService.post(
        `${this.baseUrl}/campaigns/${campaignId}/duplicate`,
        {},
        true
      );

      return {
        success: true,
        message: response.message || "Campaign duplicated successfully",
        campaign: response.data?.campaign,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to duplicate campaign",
      };
    }
  }

  async updateCampaign(
    campaignId: string,
    updateData: Partial<Campaign>
  ): Promise<{ success: boolean; message: string; campaign?: Campaign }> {
    try {
      const response = await httpService.put(
        `${this.baseUrl}/campaigns/${campaignId}`,
        updateData,
        true
      );

      return {
        success: true,
        message: response.message || "Campaign updated successfully",
        campaign: response.data?.campaign,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update campaign",
      };
    }
  }

  async shareCampaign(
    campaignId: string,
    shareData: { platform: string; message?: string }
  ): Promise<{ success: boolean; message: string; shareUrl?: string }> {
    try {
      const response = await httpService.post(
        `${this.baseUrl}/campaigns/${campaignId}/share`,
        shareData,
        true
      );

      return {
        success: true,
        message: response.message || "Campaign shared successfully",
        shareUrl: response.data?.shareUrl,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to share campaign",
      };
    }
  }

  async getCampaignAnalytics(
    campaignId: string,
    dateRange?: { startDate: string; endDate: string }
  ): Promise<{
    success: boolean;
    data: {
      views: number;
      clicks: number;
      conversions: number;
      spend: number;
      roi: number;
      impressions: number;
    };
  }> {
    try {
      const params = dateRange
        ? `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        : "";

      const response = await httpService.get(
        `${this.baseUrl}/campaigns/${campaignId}/analytics${params}`,
        true
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to retrieve campaign analytics"
      );
    }
  }

  async fundCampaign(
    campaignId: string,
    amount: number,
    paymentMethodId?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpService.post(
        `${this.baseUrl}/campaigns/${campaignId}/fund`,
        { amount, paymentMethodId },
        true
      );

      return {
        success: true,
        message: response.message || "Campaign funded successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fund campaign",
      };
    }
  }
  async getStats(): Promise<GetAdvertiserStatsResponse> {
    const response = await httpService.get<GetAdvertiserStatsResponse>(
      `${this.baseUrl}/stats`,
      true
    );

    return response.data;
  }
}

export const advertiserService = new AdvertiserService();
