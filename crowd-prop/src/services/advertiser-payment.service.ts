import { httpService } from "./http.service";
import {
  PaymentSetupStatus,
  PaymentMethod,
  WalletBalance,
  WalletTransaction,
  AddFundsRequest,
  AddFundsResponse,
  CampaignFundingStatus,
  StripeCustomer,
  WithdrawFundsRequest,
  WithdrawFundsResponse,
  WithdrawalLimits,
  WithdrawalHistory,
  CampaignFundingFeasibility,
  PayPromoterResponse,
} from "@/app/interfaces/payment";
import { PAYMENT_ENDPOINTS } from "@/app/const/payment-constants";

class AdvertiserPaymentService {
  /**
   * Check payment setup status
   */
  async getPaymentSetupStatus(): Promise<PaymentSetupStatus> {
    try {
      const response = await httpService.get<{
        success: boolean;
        data: PaymentSetupStatus;
        message: string;
      }>(PAYMENT_ENDPOINTS.PAYMENT_STATUS, true);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to get payment status"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to get payment setup status:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get payment setup status"
      );
    }
  }

  /**
   * Complete payment setup (create Stripe customer)
   */
  async completePaymentSetup(setupData: {
    companyName?: string;
    email?: string;
  }): Promise<StripeCustomer> {
    try {
      const response = await httpService.post<{
        success: boolean;
        data: StripeCustomer;
        message: string;
      }>(PAYMENT_ENDPOINTS.SETUP_PAYMENT, setupData, true);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to complete payment setup"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to complete payment setup:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to complete payment setup"
      );
    }
  }

  /**
   * Get saved payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await httpService.get<{
        success: boolean;
        data: PaymentMethod[];
        message: string;
      }>(PAYMENT_ENDPOINTS.GET_PAYMENT_METHODS, true);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to get payment methods"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to get payment methods:", error);
      return [];
    }
  }

  /**
   * Add new payment method
   */
  async addPaymentMethod(paymentMethodData: {
    paymentMethodId: string;
    setAsDefault?: boolean;
  }): Promise<void> {
    try {
      const response = await httpService.post<{
        success: boolean;
        message: string;
      }>(PAYMENT_ENDPOINTS.ADD_PAYMENT_METHOD, paymentMethodData, true);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to add payment method"
        );
      }
    } catch (error) {
      console.error("Failed to add payment method:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to add payment method"
      );
    }
  }

  /**
   * Remove payment method
   */
  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      const response = await httpService.delete<{
        success: boolean;
        message: string;
      }>(`${PAYMENT_ENDPOINTS.REMOVE_PAYMENT_METHOD}/${paymentMethodId}`, true);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to remove payment method"
        );
      }
    } catch (error) {
      console.error("Failed to remove payment method:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to remove payment method"
      );
    }
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      const response = await httpService.put<{
        success: boolean;
        message: string;
      }>(
        `${PAYMENT_ENDPOINTS.SET_DEFAULT_PAYMENT_METHOD}/${paymentMethodId}/default`,
        {},
        true
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to set default payment method"
        );
      }
    } catch (error) {
      console.error("Failed to set default payment method:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to set default payment method"
      );
    }
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(): Promise<WalletBalance> {
    try {
      const response = await httpService.get<{
        success: boolean;
        data: WalletBalance;
        message: string;
      }>(PAYMENT_ENDPOINTS.GET_WALLET_BALANCE, true);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to get wallet balance"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to get wallet balance:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to get wallet balance"
      );
    }
  }

  /**
   * Add funds to wallet
   */
  async addFunds(request: AddFundsRequest): Promise<AddFundsResponse> {
    try {
      const response = await httpService.post<{
        success: boolean;
        data: AddFundsResponse;
        message: string;
      }>(PAYMENT_ENDPOINTS.ADD_FUNDS, request, true);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add funds");
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to add funds:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to add funds"
      );
    }
  }

  /**
   * Get wallet transactions
   */
  async getWalletTransactions(params?: { type?: string }): Promise<{
    transactions: WalletTransaction[];
    total: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append("type", params.type);

      const url = `${PAYMENT_ENDPOINTS.GET_WALLET_TRANSACTIONS}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await httpService.get<{
        success: boolean;
        data: {
          transactions: WalletTransaction[];
          total: number;
        };
        message: string;
      }>(url, true);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to get wallet transactions"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to get wallet transactions:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get wallet transactions"
      );
    }
  }

  /**
   * Get campaign funding status
   */
  async getCampaignFundingStatus(
    campaignId: string
  ): Promise<CampaignFundingStatus> {
    try {
      const response = await httpService.get<{
        success: boolean;
        data: CampaignFundingStatus;
        message: string;
      }>(
        `${PAYMENT_ENDPOINTS.GET_CAMPAIGN_FUNDING_STATUS}/${campaignId}/funding-status`,
        true
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to get campaign funding status"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to get campaign funding status:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get campaign funding status"
      );
    }
  }

  /**
   * Adjust campaign budget
   */
  async adjustCampaignBudget(
    campaignId: string,
    additionalBudget: number
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      campaignId: string;
      previousBudgetCents: number;
      additionalBudgetCents: number;
      newBudgetCents: number;
    };
    requiresAdditionalFunding?: boolean;
    additionalFundingAmount?: number;
  }> {
    try {
      const response = await httpService.put<{
        success: boolean;
        data: {
          campaignId: string;
          previousBudgetCents: number;
          additionalBudgetCents: number;
          newBudgetCents: number;
          requiresAdditionalFunding?: boolean;
          additionalFundingAmount?: number;
        };
        message: string;
      }>(
        `${PAYMENT_ENDPOINTS.ADJUST_CAMPAIGN_BUDGET}/${campaignId}/budget`,
        { additionalBudget },
        true
      );

      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data
          ? {
              campaignId: response.data.data.campaignId,
              previousBudgetCents: response.data.data.previousBudgetCents,
              additionalBudgetCents: response.data.data.additionalBudgetCents,
              newBudgetCents: response.data.data.newBudgetCents,
            }
          : undefined,
        requiresAdditionalFunding:
          response.data.data?.requiresAdditionalFunding,
        additionalFundingAmount: response.data.data?.additionalFundingAmount,
      };
    } catch (error) {
      console.error("Failed to adjust campaign budget:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to adjust campaign budget"
      );
    }
  }

  /**
   * Create a setup intent for collecting payment methods
   */
  async createSetupIntent(): Promise<{
    clientSecret: string;
    setupIntentId: string;
  }> {
    try {
      const response = await httpService.post<{
        success: boolean;
        data: {
          clientSecret: string;
          setupIntentId: string;
        };
        message: string;
      }>(PAYMENT_ENDPOINTS.CREATE_SETUP_INTENT, {}, true);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to create setup intent"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to create setup intent:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to create setup intent"
      );
    }
  }

  /**
   * Withdraw funds from wallet
   */
  async withdrawFunds(
    request: WithdrawFundsRequest
  ): Promise<WithdrawFundsResponse> {
    try {
      // Convert dollars to cents for backend
      const requestInCents = {
        ...request,
        amount: Math.round(request.amount * 100), // Convert to cents
      };

      const response = await httpService.post<{
        success: boolean;
        data: WithdrawFundsResponse;
        message: string;
      }>(PAYMENT_ENDPOINTS.WITHDRAW_FUNDS, requestInCents, true);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to withdraw funds");
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to withdraw funds:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to withdraw funds"
      );
    }
  }

  /**
   * Get withdrawal limits and constraints
   */
  async getWithdrawalLimits(): Promise<WithdrawalLimits> {
    try {
      const response = await httpService.get<{
        success: boolean;
        data: WithdrawalLimits;
        message: string;
      }>(PAYMENT_ENDPOINTS.GET_WITHDRAWAL_LIMITS, true);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to get withdrawal limits"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to get withdrawal limits:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get withdrawal limits"
      );
    }
  }

  /**
   * Get withdrawal history
   */
  async getWithdrawalHistory(params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    withdrawals: WithdrawalHistory[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const url = `${PAYMENT_ENDPOINTS.GET_WITHDRAWAL_HISTORY}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await httpService.get<{
        success: boolean;
        data: {
          withdrawals: WithdrawalHistory[];
          total: number;
          page: number;
          totalPages: number;
        };
        message: string;
      }>(url, true);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to get withdrawal history"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to get withdrawal history:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to get withdrawal history"
      );
    }
  }

  /**
   * Check campaign funding feasibility
   */
  async checkCampaignFundingFeasibility(
    estimatedBudgetCents: number
  ): Promise<CampaignFundingFeasibility> {
    try {
      const response = await httpService.post<{
        success: boolean;
        data: CampaignFundingFeasibility;
        message: string;
      }>(
        PAYMENT_ENDPOINTS.CHECK_CAMPAIGN_FUNDING_FEASIBILITY,
        { estimatedBudgetCents },
        true
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Failed to check campaign funding feasibility"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to check campaign funding feasibility:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to check campaign funding feasibility"
      );
    }
  }

  /**
   * Pay a promoter for campaign work
   */
  async payPromoter(
    campaignId: string,
    promoterId: string,
    amountCents: number
  ): Promise<PayPromoterResponse> {
    try {
      console.log("PayPromoter function called with:", {
        campaignId: campaignId,
        campaignIdType: typeof campaignId,
        campaignIdLength: campaignId?.length,
        promoterId: promoterId,
        promoteridType: typeof promoterId,
        amountCents: amountCents,
        amountCentsType: typeof amountCents,
      });

      if (!campaignId) {
        throw new Error("Campaign ID is required but was not provided");
      }
      if (!promoterId) {
        throw new Error("Promoter ID is required but was not provided");
      }

      const requestBody = {
        campaignId: campaignId,
        promoterId: promoterId,
        amount: amountCents,
      };

      console.log("PayPromoter request:", {
        url: PAYMENT_ENDPOINTS.PAY_PROMOTER,
        body: requestBody,
        campaignId,
        promoterId,
        amountCents,
      });

      const response = await httpService.post<{
        success: boolean;
        data: PayPromoterResponse;
        message: string;
      }>(PAYMENT_ENDPOINTS.PAY_PROMOTER, requestBody, true);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to process payment");
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to pay promoter:", error);
      console.error("Error details:", {
        campaignId,
        promoterId,
        amountCents,
        error: error instanceof Error ? error.message : error,
      });
      throw new Error(
        error instanceof Error ? error.message : "Failed to process payment"
      );
    }
  }
}

export { AdvertiserPaymentService };
export const advertiserPaymentService = new AdvertiserPaymentService();
