import { useState, useCallback, useEffect } from "react";
import { stripeService } from "@/services/stripe.service";
import { userService } from "@/services/user.service";
import {
  CreateConnectAccountRequest,
  OnboardingStatusResponse,
  StripeConnectAccount,
} from "@/app/interfaces/stripe";

interface UseStripeOnboardingResult {
  // State
  isLoading: boolean;
  error: string | null;
  accountData: StripeConnectAccount | null;
  onboardingStatus: OnboardingStatusResponse | null;

  // Actions
  createAccount: (accountData: CreateConnectAccountRequest) => Promise<void>;
  getOnboardingLink: () => Promise<string>;
  checkOnboardingStatus: (userId: string) => Promise<OnboardingStatusResponse>;
  getAccountStatus: () => Promise<StripeConnectAccount | null>;
  refreshAccountStatus: () => Promise<void>;
  isAccountReady: () => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

export function useStripeOnboarding(): UseStripeOnboardingResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<StripeConnectAccount | null>(
    null
  );
  const [onboardingStatus, setOnboardingStatus] =
    useState<OnboardingStatusResponse | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setAccountData(null);
    setOnboardingStatus(null);
  }, []);

  const createAccount = useCallback(
    async (accountData: CreateConnectAccountRequest) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await stripeService.createConnectAccount(accountData);

        if (!response.success) {
          throw new Error(response.message || "Failed to create account");
        }

        // The response data should contain account information
        if (
          response.data &&
          typeof response.data === "object" &&
          "accountId" in response.data
        ) {
          setAccountData(response.data as StripeConnectAccount);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create account";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getOnboardingLink = useCallback(async (): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);

      const linkData = await stripeService.getOnboardingLink();
      return linkData.url;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get onboarding link";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkOnboardingStatus = useCallback(
    async (userId: string): Promise<OnboardingStatusResponse> => {
      try {
        setIsLoading(true);
        setError(null);

        const status = await stripeService.getOnboardingStatus(userId);
        setOnboardingStatus(status);
        return status;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to check onboarding status";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const refreshAccountStatus = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("useStripeOnboarding: Refreshing account status");
      const account = await stripeService.getAccountStatus();
      console.log("useStripeOnboarding: Account status refreshed:", account);
      setAccountData(account);
    } catch (err) {
      console.log("useStripeOnboarding: Error refreshing account status:", err);
      // Only set error if it's not a 404 (account doesn't exist)
      if (err instanceof Error && !err.message.includes("404")) {
        setError(err.message);
      }
      // For 404, just leave accountData as null (no account exists)
      setAccountData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAccountStatus =
    useCallback(async (): Promise<StripeConnectAccount | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const account = await stripeService.getAccountStatus();
        setAccountData(account);
        return account;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get account status";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []);

  const isAccountReady = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      return await stripeService.isAccountReady();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to check account readiness";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Automatically fetch account status on mount
  useEffect(() => {
    const fetchInitialAccountStatus = async () => {
      // Check if user is authenticated before making the request
      const currentUser = userService.getCurrentUserSync();
      if (!currentUser) {
        console.log(
          "useStripeOnboarding: User not authenticated, skipping account status fetch"
        );
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log(
          "useStripeOnboarding: Fetching account status on mount for user:",
          currentUser.uid
        );
        const account = await stripeService.getAccountStatus();
        console.log("useStripeOnboarding: Account status fetched:", account);
        setAccountData(account);
      } catch (err) {
        console.log("useStripeOnboarding: Error fetching account status:", err);
        // Only set error if it's not a 404 (account doesn't exist)
        if (err instanceof Error && !err.message.includes("404")) {
          setError(err.message);
        }
        // For 404, just leave accountData as null (no account exists)
        setAccountData(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure user is loaded
    const timer = setTimeout(fetchInitialAccountStatus, 100);
    return () => clearTimeout(timer);
  }, []);

  return {
    // State
    isLoading,
    error,
    accountData,
    onboardingStatus,

    // Actions
    createAccount,
    getOnboardingLink,
    checkOnboardingStatus,
    getAccountStatus,
    refreshAccountStatus,
    isAccountReady,
    clearError,
    reset,
  };
}
