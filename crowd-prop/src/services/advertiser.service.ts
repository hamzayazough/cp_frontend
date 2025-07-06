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

class AdvertiserService {
  private baseUrl = "/api/advertiser";

  async getDashboardData(
    params?: GetAdvertiserDashboardRequest
  ): Promise<AdvertiserDashboardData> {
    const response = await httpService.get<GetAdvertiserDashboardResponse>(
      `${this.baseUrl}/dashboard`,
      {
        params: {
          includeStats: true,
          includeCampaigns: true,
          includeRecommendations: true,
          includeTransactions: true,
          includeMessages: true,
          includeWallet: true,
          activeCampaignLimit: 5,
          recommendedPromoterLimit: 6,
          transactionLimit: 10,
          messageLimit: 5,
          ...params,
        },
      }
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch dashboard data");
    }

    return response.data;
  }

  async getStats(): Promise<GetAdvertiserStatsResponse> {
    const response = await httpService.get<GetAdvertiserStatsResponse>(
      `${this.baseUrl}/stats`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch stats");
    }

    return response;
  }

  async getCampaigns(limit?: number): Promise<GetAdvertiserCampaignsResponse> {
    const response = await httpService.get<GetAdvertiserCampaignsResponse>(
      `${this.baseUrl}/campaigns`,
      {
        params: { limit },
      }
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch campaigns");
    }

    return response;
  }

  async getRecommendedPromoters(
    limit?: number
  ): Promise<GetRecommendedPromotersResponse> {
    const response = await httpService.get<GetRecommendedPromotersResponse>(
      `${this.baseUrl}/recommended-promoters`,
      {
        params: { limit },
      }
    );

    if (!response.success) {
      throw new Error(
        response.message || "Failed to fetch recommended promoters"
      );
    }

    return response;
  }

  async getTransactions(
    limit?: number
  ): Promise<GetAdvertiserTransactionsResponse> {
    const response = await httpService.get<GetAdvertiserTransactionsResponse>(
      `${this.baseUrl}/transactions`,
      {
        params: { limit },
      }
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch transactions");
    }

    return response;
  }

  async getMessages(limit?: number): Promise<GetAdvertiserMessagesResponse> {
    const response = await httpService.get<GetAdvertiserMessagesResponse>(
      `${this.baseUrl}/messages`,
      {
        params: { limit },
      }
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch messages");
    }

    return response;
  }

  async getWallet(): Promise<GetAdvertiserWalletResponse> {
    const response = await httpService.get<GetAdvertiserWalletResponse>(
      `${this.baseUrl}/wallet`
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch wallet");
    }

    return response;
  }

  async addFunds(
    amount: number
  ): Promise<{ success: boolean; message: string }> {
    const response = await httpService.post(
      `${this.baseUrl}/wallet/add-funds`,
      { amount }
    );

    return {
      success: response.success || false,
      message: response.message || "Failed to add funds",
    };
  }

  async pauseCampaign(
    campaignId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await httpService.post(
      `${this.baseUrl}/campaigns/${campaignId}/pause`
    );

    return {
      success: response.success || false,
      message: response.message || "Failed to pause campaign",
    };
  }

  async resumeCampaign(
    campaignId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await httpService.post(
      `${this.baseUrl}/campaigns/${campaignId}/resume`
    );

    return {
      success: response.success || false,
      message: response.message || "Failed to resume campaign",
    };
  }

  async contactPromoter(
    promoterId: string,
    message: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await httpService.post(
      `${this.baseUrl}/promoters/${promoterId}/contact`,
      { message }
    );

    return {
      success: response.success || false,
      message: response.message || "Failed to contact promoter",
    };
  }
}

export const advertiserService = new AdvertiserService();
