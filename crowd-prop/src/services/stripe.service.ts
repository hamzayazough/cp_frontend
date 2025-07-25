import { httpService } from "./http.service";
import {
  CreateConnectAccountRequest,
  StripeConnectResponse,
  OnboardingLinkResponse,
  OnboardingStatusResponse,
  StripeConnectAccount,
} from "@/app/interfaces/stripe";
import { STRIPE_ENDPOINTS } from "@/app/const/stripe-onboarding";
import { auth } from "@/lib/firebase";

class StripeService {
  /**
   * Create a Stripe Connect account for the current user
   */
  async createConnectAccount(
    accountData: CreateConnectAccountRequest
  ): Promise<StripeConnectResponse> {
    try {
      // Verify authentication and get token
      const token = await this.checkAuth();

      console.log("Creating Stripe Connect account with auth:", true);
      console.log("Account data:", accountData);

      const response = await httpService.post<StripeConnectResponse>(
        STRIPE_ENDPOINTS.CREATE_ACCOUNT,
        accountData,
        true // requiresAuth
      );

      console.log("Stripe Connect response:", response);
      return response.data;
    } catch (error) {
      console.error("Failed to create Stripe Connect account:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to create payment account"
      );
    }
  }

  /**
   * Get onboarding link for Stripe Connect
   */
  async getOnboardingLink(): Promise<OnboardingLinkResponse> {
    try {
      const response = await httpService.get<{
        success: boolean;
        data: OnboardingLinkResponse;
        message: string;
      }>(STRIPE_ENDPOINTS.GET_ONBOARDING_LINK, true); // requiresAuth

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.message || "Failed to get onboarding link"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to get onboarding link:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to get onboarding link"
      );
    }
  }

  /**
   * Refresh onboarding link if expired
   */
  async refreshOnboardingLink(): Promise<OnboardingLinkResponse> {
    try {
      const response = await httpService.post<{
        success: boolean;
        data: OnboardingLinkResponse;
        message: string;
      }>(STRIPE_ENDPOINTS.REFRESH_ONBOARDING, {}, true); // requiresAuth

      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.message || "Failed to refresh onboarding link"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to refresh onboarding link:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to refresh onboarding link"
      );
    }
  }

  /**
   * Get current account status
   */
  async getAccountStatus(): Promise<StripeConnectAccount | null> {
    try {
      const response = await httpService.get<{
        success: boolean;
        data: StripeConnectAccount | null;
        message: string;
      }>(STRIPE_ENDPOINTS.ACCOUNT_STATUS, true); // requiresAuth

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to get account status"
        );
      }

      return response.data.data;
    } catch (error) {
      console.error("Failed to get account status:", error);
      // Return null if account doesn't exist yet
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw new Error(
        error instanceof Error ? error.message : "Failed to get account status"
      );
    }
  }

  /**
   * Check onboarding status for a user
   */
  async getOnboardingStatus(userId: string): Promise<OnboardingStatusResponse> {
    try {
      const response = await httpService.get<OnboardingStatusResponse>(
        `${STRIPE_ENDPOINTS.ONBOARDING_STATUS}/${userId}`,
        true // requiresAuth
      );

      return response.data;
    } catch (error) {
      console.error("Failed to get onboarding status:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to check onboarding status"
      );
    }
  }

  /**
   * Check if account is ready for payments
   */
  async isAccountReady(): Promise<boolean> {
    try {
      const response = await httpService.get<{
        success: boolean;
        data: { ready: boolean };
        message: string;
      }>(STRIPE_ENDPOINTS.IS_READY, true); // requiresAuth

      return response.data.success && response.data.data?.ready;
    } catch (error) {
      console.error("Failed to check account readiness:", error);
      return false;
    }
  }

  /**
   * Helper method to get and verify Firebase auth token
   */
  private async checkAuth(): Promise<string> {
    return new Promise((resolve, reject) => {
      const checkAuthState = () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          reject(new Error("User not authenticated. Please log in first."));
          return;
        }

        currentUser
          .getIdToken()
          .then((token) => {
            console.log("Firebase token obtained:", token ? "✓" : "✗");
            console.log("Token length:", token.length);
            resolve(token);
          })
          .catch((error) => {
            console.error("Failed to get Firebase token:", error);
            reject(new Error("Failed to get authentication token"));
          });
      };

      // If auth is already loaded, check immediately
      if (auth.currentUser !== null) {
        checkAuthState();
      } else {
        // Wait for auth state to load
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          if (user) {
            checkAuthState();
          } else {
            reject(new Error("User not authenticated. Please log in first."));
          }
        });
      }
    });
  }
}

export const stripeService = new StripeService();
