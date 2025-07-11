import { httpService } from "./http.service";
import {
  AdvertiserDashboardData,
  GetAdvertiserDashboardRequest,
  GetAdvertiserDashboardResponse,
  GetAdvertiserStatsResponse,
  GetAdvertiserCampaignsResponse,
  GetRecommendedPromotersResponse,
  GetAdvertiserTransactionsResponse,
  GetAdvertiserMessagesResponse,
  GetAdvertiserWalletResponse,
} from "@/interfaces/advertiser-dashboard";
import { Campaign, CampaignFormData } from "@/app/interfaces/campaign";

interface CreateCampaignResponse {
  success: boolean;
  message: string;
  campaign?: Campaign;
}

class AdvertiserService {
  private baseUrl = "/advertiser";

  async getDashboardData(
    firebaseUid: string,
    params: GetAdvertiserDashboardRequest
  ): Promise<AdvertiserDashboardData> {
    try {
      const response = await httpService.post<GetAdvertiserDashboardResponse>(
        `${this.baseUrl}/dashboard`,
        {
          firebaseUid,
          ...params,
        },
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

  async getStats(): Promise<GetAdvertiserStatsResponse> {
    const response = await httpService.get<GetAdvertiserStatsResponse>(
      `${this.baseUrl}/stats`,
      true
    );

    return response.data;
  }

  async getCampaigns(limit?: number): Promise<GetAdvertiserCampaignsResponse> {
    const endpoint = limit
      ? `${this.baseUrl}/campaigns?limit=${limit}`
      : `${this.baseUrl}/campaigns`;

    const response = await httpService.get<GetAdvertiserCampaignsResponse>(
      endpoint,
      true
    );

    return response.data;
  }

  async getRecommendedPromoters(
    limit?: number
  ): Promise<GetRecommendedPromotersResponse> {
    const endpoint = limit
      ? `${this.baseUrl}/recommended-promoters?limit=${limit}`
      : `${this.baseUrl}/recommended-promoters`;

    const response = await httpService.get<GetRecommendedPromotersResponse>(
      endpoint,
      true
    );

    return response.data;
  }

  async getTransactions(
    limit?: number
  ): Promise<GetAdvertiserTransactionsResponse> {
    const endpoint = limit
      ? `${this.baseUrl}/transactions?limit=${limit}`
      : `${this.baseUrl}/transactions`;

    const response = await httpService.get<GetAdvertiserTransactionsResponse>(
      endpoint,
      true
    );

    return response.data;
  }

  async getMessages(limit?: number): Promise<GetAdvertiserMessagesResponse> {
    const endpoint = limit
      ? `${this.baseUrl}/messages?limit=${limit}`
      : `${this.baseUrl}/messages`;

    const response = await httpService.get<GetAdvertiserMessagesResponse>(
      endpoint,
      true
    );

    return response.data;
  }

  async getWallet(): Promise<GetAdvertiserWalletResponse> {
    const response = await httpService.get<GetAdvertiserWalletResponse>(
      `${this.baseUrl}/wallet`,
      true
    );

    return response.data;
  }

  async addFunds(
    amount: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpService.post(
        `${this.baseUrl}/wallet/add-funds`,
        { amount },
        true
      );

      return {
        success: true,
        message: response.message || "Funds added successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to add funds",
      };
    }
  }

  async pauseCampaign(
    campaignId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpService.post(
        `${this.baseUrl}/campaigns/${campaignId}/pause`,
        undefined,
        true
      );

      return {
        success: true,
        message: response.message || "Campaign paused successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to pause campaign",
      };
    }
  }

  async resumeCampaign(
    campaignId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpService.post(
        `${this.baseUrl}/campaigns/${campaignId}/resume`,
        undefined,
        true
      );

      return {
        success: true,
        message: response.message || "Campaign resumed successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to resume campaign",
      };
    }
  }

  async contactPromoter(
    promoterId: string,
    message: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpService.post(
        `${this.baseUrl}/promoters/${promoterId}/contact`,
        { message },
        true
      );

      return {
        success: true,
        message: response.message || "Message sent successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to contact promoter",
      };
    }
  }

  async createCampaign(
    campaignData: CampaignFormData
  ): Promise<CreateCampaignResponse> {
    try {
      const response = await httpService.post(
        `${this.baseUrl}/campaigns`,
        campaignData,
        true
      );

      return {
        success: true,
        message: response.message || "Campaign created successfully",
        campaign: response.data as Campaign,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create campaign",
      };
    }
  }
}

export const advertiserService = new AdvertiserService();
