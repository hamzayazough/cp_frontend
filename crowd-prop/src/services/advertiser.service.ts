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
import { Campaign } from "@/app/interfaces/campaign";

interface CreateCampaignResponse {
  success: boolean;
  message: string;
  campaign?: Campaign;
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

  async uploadCampaignFile(
    file: File,
    campaignId: string
  ): Promise<{
    success: boolean;
    message: string;
    fileUrl?: string;
    campaign?: Campaign;
  }> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("campaignId", campaignId);
      formData.append("type", "campaign-media");

      const response = await httpService.uploadFormData(
        `${this.baseUrl}/upload-file`,
        formData,
        true
      );

      return {
        success: true,
        message: response.message || "File uploaded successfully",
        fileUrl: response.data.fileUrl,
        campaign: response.data.campaign as Campaign,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to upload file",
      };
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

      return {
        success: true,
        message:
          response.data?.message ||
          response.message ||
          "Campaign created successfully",
        campaign: response.data?.campaign || (response.data as Campaign),
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
