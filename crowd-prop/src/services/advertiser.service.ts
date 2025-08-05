import { httpService } from "./http.service";
import {
  AdvertiserDashboardData,
  GetAdvertiserDashboardRequest,
  GetAdvertiserDashboardResponse,
  GetAdvertiserStatsResponse,
} from "@/app/interfaces/dashboard/advertiser-dashboard";
import { Campaign } from "@/app/interfaces/campaign/campaign";
import {
  CampaignAdvertiser,
  AdvertiserCampaignListResponse,
  AdvertiserCampaignListRequest,
  ReviewPromoterApplicationRequest,
} from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType, CampaignStatus } from "@/app/enums/campaign-type";
import { CampaignWork } from "@/app/interfaces/campaign-work";

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

  /**
   * Get campaign by ID
   */
  async getCampaignById(campaignId: string): Promise<CampaignAdvertiser> {
    try {
      const response = await httpService.get<{
        success: boolean;
        data: CampaignAdvertiser;
        message?: string;
      }>(`${this.baseUrl}/campaigns/${campaignId}`, true);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch campaign");
      }

      return response.data.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to retrieve campaign"
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
      const response = await httpService.delete<{
        success: boolean;
        message: string;
      }>(`${this.baseUrl}/campaigns/${campaignId}`, true);
      return {
        success: true,
        message:
          (response.data as { message?: string })?.message ||
          "Campaign deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete campaign",
      };
    }
  }

  async shareCampaign(
    campaignId: string,
    shareData: { platform: string; message?: string }
  ): Promise<{ success: boolean; message: string; shareUrl?: string }> {
    try {
      const response = await httpService.post<{
        success: boolean;
        message: string;
        shareUrl?: string;
      }>(`${this.baseUrl}/campaigns/${campaignId}/share`, shareData, true);

      return {
        success: true,
        message:
          (response.data as { message?: string })?.message ||
          "Campaign shared successfully",
        shareUrl: (response.data as { shareUrl?: string })?.shareUrl,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to share campaign",
      };
    }
  }

  async fundCampaign(
    campaignId: string,
    amount: number,
    paymentMethodId?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpService.post<{
        success: boolean;
        message: string;
      }>(
        `${this.baseUrl}/campaigns/${campaignId}/fund`,
        { amount, paymentMethodId },
        true
      );

      return {
        success: true,
        message:
          (response.data as { message?: string })?.message ||
          "Campaign funded successfully",
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
  async uploadCampaignFiles(
    files: File[],
    campaignId: string
  ): Promise<{
    success: boolean;
    message: string;
    uploadedFiles?: Array<{ fileUrl: string; fileName: string }>;
    failedFiles?: Array<{ fileName: string; error: string }>;
    campaign?: Campaign;
  }> {
    try {
      if (!files || files.length === 0) {
        return {
          success: true,
          message: "No files to upload",
          uploadedFiles: [],
          failedFiles: [],
        };
      }

      if (files.length > 10) {
        return {
          success: false,
          message: "Maximum 10 files allowed",
        };
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("campaignId", campaignId);

      const response = await httpService.uploadFormData<{
        success: boolean;
        message: string;
        uploadedFiles?: Array<{ fileUrl: string; fileName: string }>;
        failedFiles?: Array<{ fileName: string; error: string }>;
        campaign?: Campaign;
      }>(`${this.baseUrl}/upload-files`, formData, true);

      return {
        success: response.data.success || true,
        message: response.data.message || "Files uploaded successfully",
        uploadedFiles: response.data.uploadedFiles || [],
        failedFiles: response.data.failedFiles || [],
        campaign: response.data.campaign,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to upload files",
      };
    }
  }

  /**
   * Add a comment to a work item in a specific deliverable
   */
  async addCommentToWork(
    campaignId: string,
    deliverableId: string,
    workId: string,
    commentMessage: string
  ): Promise<{ success: boolean; message: string; data?: CampaignWork[] }> {
    try {
      const response = await httpService.post<{
        success: boolean;
        message: string;
        data?: CampaignWork[];
      }>(
        `${this.baseUrl}/campaigns/${campaignId}/deliverables/${deliverableId}/work/${workId}/comments`,
        { commentMessage },
        true // requiresAuth
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to add comment to work"
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to add comment"
      );
    }
  }

  /**
   * Mark a campaign deliverable as finished
   */
  async markDeliverableAsFinished(
    campaignId: string,
    deliverableId: string
  ): Promise<{
    success: boolean;
    message: string;
    data?: { deliverableId: string; isFinished: boolean };
  }> {
    try {
      const response = await httpService.put<{
        success: boolean;
        message: string;
        data?: { deliverableId: string; isFinished: boolean };
      }>(
        `${this.baseUrl}/campaigns/${campaignId}/deliverables/${deliverableId}/finish`,
        {},
        true // requiresAuth
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to mark deliverable as finished"
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to mark deliverable as finished"
      );
    }
  }

  async completeCampaign(campaignId: string): Promise<{
    success: boolean;
    message: string;
    data?: CampaignAdvertiser;
  }> {
    try {
      const response = await httpService.patch(
        `/campaign-management/campaigns/${campaignId}/complete`,
        undefined, // no body needed
        true // requiresAuth
      );

      return response.data as {
        success: boolean;
        message: string;
        data?: CampaignAdvertiser;
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to complete campaign",
      };
    }
  }
}

export const advertiserService = new AdvertiserService();
