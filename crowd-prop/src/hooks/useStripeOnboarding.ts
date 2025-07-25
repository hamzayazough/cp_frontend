import { useState, useCallback } from "react";
import { stripeService } from "@/services/stripe.service";
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
    isAccountReady,
    clearError,
    reset,
  };
}
