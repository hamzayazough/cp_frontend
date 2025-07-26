import { useState, useEffect, useCallback } from "react";
import {
  PaymentSetupStatus,
  PaymentMethod,
  WalletBalance,
  WalletTransaction,
  AddFundsRequest,
  AddFundsResponse,
} from "@/app/interfaces/payment";
import { advertiserPaymentService } from "@/services/advertiser-payment.service";
import { userService } from "@/services/user.service";

interface UsePaymentManagementResult {
  // Payment Setup
  paymentStatus: PaymentSetupStatus | null;
  isPaymentStatusLoading: boolean;
  paymentStatusError: string | null;

  // Payment Methods
  paymentMethods: PaymentMethod[];
  isPaymentMethodsLoading: boolean;
  paymentMethodsError: string | null;

  // Wallet
  walletBalance: WalletBalance | null;
  isWalletLoading: boolean;
  walletError: string | null;

  // Transactions
  transactions: WalletTransaction[];
  isTransactionsLoading: boolean;
  transactionsError: string | null;

  // Actions
  refreshPaymentStatus: () => Promise<void>;
  completePaymentSetup: (setupData?: { companyName?: string }) => Promise<void>;
  refreshPaymentMethods: () => Promise<void>;
  addPaymentMethod: (
    paymentMethodId: string,
    setAsDefault?: boolean
  ) => Promise<void>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
  refreshWalletBalance: () => Promise<void>;
  addFunds: (request: AddFundsRequest) => Promise<AddFundsResponse>;
  refreshTransactions: () => Promise<void>;
  clearErrors: () => void;
}

export function usePaymentManagement(): UsePaymentManagementResult {
  // Payment Setup State
  const [paymentStatus, setPaymentStatus] = useState<PaymentSetupStatus | null>(
    null
  );
  const [isPaymentStatusLoading, setIsPaymentStatusLoading] = useState(false);
  const [paymentStatusError, setPaymentStatusError] = useState<string | null>(
    null
  );

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isPaymentMethodsLoading, setIsPaymentMethodsLoading] = useState(false);
  const [paymentMethodsError, setPaymentMethodsError] = useState<string | null>(
    null
  );

  // Wallet State
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(
    null
  );
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Transactions State
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );

  const currentUser = userService.getCurrentUserSync();

  // Clear all errors
  const clearErrors = useCallback(() => {
    setPaymentStatusError(null);
    setPaymentMethodsError(null);
    setWalletError(null);
    setTransactionsError(null);
  }, []);

  // Refresh payment setup status
  const refreshPaymentStatus = useCallback(async () => {
    if (!currentUser) return;

    try {
      setIsPaymentStatusLoading(true);
      setPaymentStatusError(null);
      const status = await advertiserPaymentService.getPaymentSetupStatus();
      setPaymentStatus(status);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get payment status";
      setPaymentStatusError(errorMessage);
      console.error("Failed to refresh payment status:", error);
    } finally {
      setIsPaymentStatusLoading(false);
    }
  }, [currentUser]);

  // Complete payment setup
  const completePaymentSetup = useCallback(
    async (setupData?: { companyName?: string }) => {
      if (!currentUser) return;

      try {
        setIsPaymentStatusLoading(true);
        setPaymentStatusError(null);

        await advertiserPaymentService.completePaymentSetup({
          email: currentUser.email,
          companyName: setupData?.companyName,
        });

        // Refresh status after setup
        await refreshPaymentStatus();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to complete payment setup";
        setPaymentStatusError(errorMessage);
        console.error("Failed to complete payment setup:", error);
        throw error;
      } finally {
        setIsPaymentStatusLoading(false);
      }
    },
    [currentUser, refreshPaymentStatus]
  );

  // Refresh payment methods
  const refreshPaymentMethods = useCallback(async () => {
    if (!currentUser) return;

    try {
      setIsPaymentMethodsLoading(true);
      setPaymentMethodsError(null);
      const methods = await advertiserPaymentService.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to get payment methods";
      setPaymentMethodsError(errorMessage);
      console.error("Failed to refresh payment methods:", error);
    } finally {
      setIsPaymentMethodsLoading(false);
    }
  }, [currentUser]);

  // Add payment method
  const addPaymentMethod = useCallback(
    async (paymentMethodId: string, setAsDefault = false) => {
      try {
        setPaymentMethodsError(null);
        await advertiserPaymentService.addPaymentMethod({
          paymentMethodId,
          setAsDefault,
        });

        // Refresh methods after adding
        await refreshPaymentMethods();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to add payment method";
        setPaymentMethodsError(errorMessage);
        console.error("Failed to add payment method:", error);
        throw error;
      }
    },
    [refreshPaymentMethods]
  );

  // Remove payment method
  const removePaymentMethod = useCallback(
    async (paymentMethodId: string) => {
      try {
        setPaymentMethodsError(null);
        await advertiserPaymentService.removePaymentMethod(paymentMethodId);

        // Refresh methods after removing
        await refreshPaymentMethods();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to remove payment method";
        setPaymentMethodsError(errorMessage);
        console.error("Failed to remove payment method:", error);
        throw error;
      }
    },
    [refreshPaymentMethods]
  );

  // Set default payment method
  const setDefaultPaymentMethod = useCallback(
    async (paymentMethodId: string) => {
      try {
        setPaymentMethodsError(null);
        await advertiserPaymentService.setDefaultPaymentMethod(paymentMethodId);

        // Refresh methods after setting default
        await refreshPaymentMethods();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to set default payment method";
        setPaymentMethodsError(errorMessage);
        console.error("Failed to set default payment method:", error);
        throw error;
      }
    },
    [refreshPaymentMethods]
  );

  // Refresh wallet balance
  const refreshWalletBalance = useCallback(async () => {
    if (!currentUser) return;

    try {
      setIsWalletLoading(true);
      setWalletError(null);
      const balance = await advertiserPaymentService.getWalletBalance();
      setWalletBalance(balance);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get wallet balance";
      setWalletError(errorMessage);
      console.error("Failed to refresh wallet balance:", error);
    } finally {
      setIsWalletLoading(false);
    }
  }, [currentUser]);

  // Add funds to wallet
  const addFunds = useCallback(
    async (request: AddFundsRequest): Promise<AddFundsResponse> => {
      try {
        setWalletError(null);
        const response = await advertiserPaymentService.addFunds(request);

        // Refresh wallet balance after adding funds
        await refreshWalletBalance();

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to add funds";
        setWalletError(errorMessage);
        console.error("Failed to add funds:", error);
        throw error;
      }
    },
    [refreshWalletBalance]
  );

  // Refresh transactions
  const refreshTransactions = useCallback(async () => {
    if (!currentUser) return;

    try {
      setIsTransactionsLoading(true);
      setTransactionsError(null);
      const response = await advertiserPaymentService.getWalletTransactions({
        limit: 10,
      });
      setTransactions(response.transactions);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get transactions";
      setTransactionsError(errorMessage);
      console.error("Failed to refresh transactions:", error);
    } finally {
      setIsTransactionsLoading(false);
    }
  }, [currentUser]);

  // Load initial data
  useEffect(() => {
    if (currentUser) {
      refreshPaymentStatus();
      refreshPaymentMethods();
      refreshWalletBalance();
      refreshTransactions();
    }
  }, [currentUser]); // Only depend on currentUser, not the refresh functions

  return {
    // Payment Setup
    paymentStatus,
    isPaymentStatusLoading,
    paymentStatusError,

    // Payment Methods
    paymentMethods,
    isPaymentMethodsLoading,
    paymentMethodsError,

    // Wallet
    walletBalance,
    isWalletLoading,
    walletError,

    // Transactions
    transactions,
    isTransactionsLoading,
    transactionsError,

    // Actions
    refreshPaymentStatus,
    completePaymentSetup,
    refreshPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    refreshWalletBalance,
    addFunds,
    refreshTransactions,
    clearErrors,
  };
}
