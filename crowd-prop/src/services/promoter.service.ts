import { CampaignWork } from "@/app/interfaces/campaign-work";
import {
  SendApplicationRequest,
  SendApplicationResponse,
} from "@/app/interfaces/campaign/campaign-application";
import {
  AcceptContractRequest,
  AcceptContractResponse,
} from "@/app/interfaces/campaign/accept-contract";
import { ExploreCampaignRequest } from "@/app/interfaces/campaign/explore-campaign-request";
import {
  ExploreCampaignResponse,
  CampaignUnion,
} from "@/app/interfaces/campaign/explore-campaign";
import {
  GetPromoterCampaignsRequest,
  GetPromoterCampaignsResponse as PromoterCampaignsListResponse,
} from "@/app/interfaces/campaign/promoter-campaigns-request";
import { CampaignPromoter } from "@/app/interfaces/campaign/promoter-campaign-details";
import { HttpService } from "./http.service";
import {
  GetPromoterDashboardRequest,
  GetPromoterDashboardResponse,
  GetPromoterStatsResponse,
  GetPromoterCampaignsResponse,
  GetSuggestedCampaignsResponse,
  GetPromoterTransactionsResponse,
  GetPromoterMessagesResponse,
  GetPromoterWalletResponse,
  PromoterDashboardData,
  PromoterStats,
  PromoterActiveCampaign,
  PromoterSuggestedCampaign,
  PromoterTransaction,
  PromoterMessage,
  PromoterWallet,
} from "@/app/interfaces/dashboard/promoter-dashboard";

export class PromoterService {
  private httpService: HttpService;

  constructor() {
    this.httpService = new HttpService();
  }

  /**
   * Get complete promoter dashboard data in one optimized call
   * This is the optimal approach as it reduces API calls and ensures data consistency
   */
  async getDashboardData(
    params: GetPromoterDashboardRequest = {}
  ): Promise<PromoterDashboardData> {
    const defaultParams: GetPromoterDashboardRequest = {
      includeStats: true,
      includeCampaigns: true,
      includeSuggestions: true,
      includeTransactions: true,
      includeMessages: true,
      includeWallet: true,
      activeCampaignLimit: 10,
      suggestedCampaignLimit: 5,
      transactionLimit: 5,
      messageLimit: 5,
      ...params,
    };

    const response = await this.httpService.post<GetPromoterDashboardResponse>(
      "/promoter/dashboard",
      defaultParams,
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch dashboard data"
      );
    }

    return response.data.data;
  }

  /**
   * Get promoter statistics with percentage changes
   */
  async getStats(): Promise<PromoterStats> {
    const response = await this.httpService.get<GetPromoterStatsResponse>(
      "/promoter/stats",
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch stats");
    }

    return response.data.data;
  }

  /**
   * Get active campaigns for promoter
   */
  async getActiveCampaigns(limit?: number): Promise<PromoterActiveCampaign[]> {
    const endpoint = `/promoter/campaigns/active${
      limit ? `?limit=${limit}` : ""
    }`;

    const response = await this.httpService.get<GetPromoterCampaignsResponse>(
      endpoint,
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch active campaigns"
      );
    }

    return response.data.data.activeCampaigns;
  }

  /**
   * Get suggested campaigns for promoter
   */
  async getSuggestedCampaigns(
    limit?: number
  ): Promise<PromoterSuggestedCampaign[]> {
    const endpoint = `/promoter/campaigns/suggested${
      limit ? `?limit=${limit}` : ""
    }`;

    const response = await this.httpService.get<GetSuggestedCampaignsResponse>(
      endpoint,
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch suggested campaigns"
      );
    }

    return response.data.data.campaigns;
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(limit?: number): Promise<PromoterTransaction[]> {
    const endpoint = `/promoter/transactions${limit ? `?limit=${limit}` : ""}`;

    const response =
      await this.httpService.get<GetPromoterTransactionsResponse>(
        endpoint,
        true // requiresAuth
      );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch transactions");
    }

    return response.data.data.transactions;
  }

  /**
   * Get recent messages
   */
  async getRecentMessages(limit?: number): Promise<PromoterMessage[]> {
    const endpoint = `/promoter/messages${limit ? `?limit=${limit}` : ""}`;

    const response = await this.httpService.get<GetPromoterMessagesResponse>(
      endpoint,
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch messages");
    }

    return response.data.data.messages;
  }

  /**
   * Get wallet information
   */
  async getWallet(): Promise<PromoterWallet> {
    const response = await this.httpService.get<GetPromoterWalletResponse>(
      "/promoter/wallet",
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch wallet information"
      );
    }

    return response.data.data;
  }

  /**
   * Request payout
   */
  async requestPayout(
    amount?: number
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.httpService.post<{
      success: boolean;
      message: string;
    }>(
      "/promoter/payout/request",
      { amount },
      true // requiresAuth
    );

    return response.data;
  }
  /**
   * Apply to a campaign
   * @deprecated Use sendCampaignApplication instead
   */
  async applyCampaign(
    campaignId: string,
    message?: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.httpService.post<{
      success: boolean;
      message: string;
    }>(
      `/promoter/campaigns/${campaignId}/apply`,
      { message },
      true // requiresAuth
    );

    return response.data;
  }

  /**
   * Send campaign application with proper request interface
   */
  async sendCampaignApplication(
    request: SendApplicationRequest
  ): Promise<SendApplicationResponse> {
    const response = await this.httpService.post<SendApplicationResponse>(
      `/promoter/campaigns/${request.campaignId}/apply`,
      { applicationMessage: request.applicationMessage },
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to send campaign application"
      );
    }

    return response.data;
  }

  /**
   * Get campaign details
   */
  async getCampaignDetails(
    campaignId: string
  ): Promise<PromoterActiveCampaign> {
    const response = await this.httpService.get<{
      success: boolean;
      data: PromoterActiveCampaign;
      message?: string;
    }>(
      `/promoter/campaigns/${campaignId}`,
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch campaign details"
      );
    }

    return response.data.data;
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(
    messageId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.httpService.patch<{
      success: boolean;
      message: string;
    }>(
      `/promoter/messages/${messageId}/read`,
      {},
      true // requiresAuth
    );

    return response.data;
  }
  /**
   * Get unread message count
   */
  async getUnreadMessageCount(): Promise<number> {
    const response = await this.httpService.get<{
      success: boolean;
      data: { count: number };
      message?: string;
    }>(
      "/promoter/messages/unread-count",
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch unread message count"
      );
    }

    return response.data.data.count;
  }
  /**
   * Explore available campaigns
   */
  async getExploreCampaigns(
    params: ExploreCampaignRequest = {}
  ): Promise<ExploreCampaignResponse> {
    const response = await this.httpService.post<{
      success: boolean;
      data: ExploreCampaignResponse;
      message?: string;
    }>(
      "/promoter/campaigns/explore",
      params,
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch explore campaigns"
      );
    }

    return response.data.data;
  }

  /**
   * Get campaign by ID
   */
  async getCampaignById(campaignId: string): Promise<CampaignUnion> {
    const response = await this.httpService.get<{
      success: boolean;
      data: CampaignUnion;
      message?: string;
    }>(
      `/promoter/campaigns/explore/${campaignId}`,
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch campaign");
    }

    return response.data.data;
  }

  /**
   * Get promoter's campaigns list
   */
  async getPromoterCampaigns(
    params: GetPromoterCampaignsRequest = {}
  ): Promise<PromoterCampaignsListResponse> {
    const response = await this.httpService.post<{
      success: boolean;
      data: PromoterCampaignsListResponse;
      message?: string;
    }>(
      "/promoter/campaigns/list",
      params,
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch promoter campaigns"
      );
    }

    return response.data.data;
  }

  /**
   * Get promoter campaign by ID
   */
  async getPromoterCampaignById(campaignId: string): Promise<CampaignPromoter> {
    const response = await this.httpService.get<{
      success: boolean;
      data: CampaignPromoter;
      message?: string;
    }>(
      `/promoter/campaigns/list/${campaignId}`,
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch promoter campaign"
      );
    }

    return response.data.data;
  }

  /**
   * Accept a public campaign contract
   */
  async acceptContract(
    params: AcceptContractRequest
  ): Promise<AcceptContractResponse> {
    const response = await this.httpService.post<AcceptContractResponse>(
      "/promoter/campaigns/accept-contract",
      params,
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to accept contract");
    }

    return response.data;
  }

  /**
   * Add a new link to a campaign
   */
  async addCampaignLink(
    campaignId: string,
    promoterLink: string,
    description?: string
  ): Promise<{ success: boolean; message: string; data?: CampaignWork[] }> {
    const response = await this.httpService.post<{
      success: boolean;
      message: string;
      data?: CampaignWork[];
    }>(
      `/promoter/campaigns/${campaignId}/links`,
      { promoterLink, description },
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to add campaign link");
    }

    return response.data;
  }

  /**
   * Update an existing campaign link
   */
  async updateCampaignLink(
    campaignId: string,
    workId: string,
    promoterLink: string,
    description?: string
  ): Promise<{ success: boolean; message: string; data?: CampaignWork[] }> {
    const response = await this.httpService.put<{
      success: boolean;
      message: string;
      data?: CampaignWork[];
    }>(
      `/promoter/campaigns/${campaignId}/links/${workId}`,
      { promoterLink, description },
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to update campaign link"
      );
    }

    return response.data;
  }

  /**
   * Delete a campaign link
   */
  async deleteCampaignLink(
    campaignId: string,
    workId: string
  ): Promise<{ success: boolean; message: string; data?: CampaignWork[] }> {
    const response = await this.httpService.delete<{
      success: boolean;
      message: string;
      data?: CampaignWork[];
    }>(
      `/promoter/campaigns/${campaignId}/links/${workId}`,
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to delete campaign link"
      );
    }

    return response.data;
  }

  /**
   * Add a new work item to a specific deliverable
   */
  async addCampaignWorkToDeliverable(
    campaignId: string,
    deliverableId: string,
    promoterLink: string,
    description?: string
  ): Promise<{ success: boolean; message: string; data?: CampaignWork[] }> {
    const response = await this.httpService.post<{
      success: boolean;
      message: string;
      data?: CampaignWork[];
    }>(
      `/promoter/campaigns/${campaignId}/deliverables/${deliverableId}/work`,
      { promoterLink, description },
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to add work to deliverable"
      );
    }

    return response.data;
  }

  /**
   * Update an existing work item in a specific deliverable
   */
  async updateCampaignWorkInDeliverable(
    campaignId: string,
    deliverableId: string,
    workId: string,
    promoterLink: string,
    description?: string
  ): Promise<{ success: boolean; message: string; data?: CampaignWork[] }> {
    const response = await this.httpService.put<{
      success: boolean;
      message: string;
      data?: CampaignWork[];
    }>(
      `/promoter/campaigns/${campaignId}/deliverables/${deliverableId}/work/${workId}`,
      { promoterLink, description },
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to update work in deliverable"
      );
    }

    return response.data;
  }

  /**
   * Delete a work item from a specific deliverable
   */
  async deleteCampaignWorkFromDeliverable(
    campaignId: string,
    deliverableId: string,
    workId: string
  ): Promise<{ success: boolean; message: string; data?: CampaignWork[] }> {
    const response = await this.httpService.delete<{
      success: boolean;
      message: string;
      data?: CampaignWork[];
    }>(
      `/promoter/campaigns/${campaignId}/deliverables/${deliverableId}/work/${workId}`,
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to delete work from deliverable"
      );
    }

    return response.data;
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
    const response = await this.httpService.post<{
      success: boolean;
      message: string;
      data?: CampaignWork[];
    }>(
      `/promoter/campaigns/${campaignId}/deliverables/${deliverableId}/work/${workId}/comments`,
      { commentMessage },
      true // requiresAuth
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to add comment to work");
    }

    return response.data;
  }
}

// Export singleton instance
export const promoterService = new PromoterService();
