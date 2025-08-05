export const PAYMENT_CONSTANTS = {
  MINIMUM_WALLET_FUNDING: 10, // $10 minimum
  MAXIMUM_WALLET_FUNDING: 1000000, // $1,000,000 maximum
  DEFAULT_FUNDING_AMOUNTS: [50, 100, 250, 500, 1000],

  // Withdrawal constants
  MINIMUM_WITHDRAWAL: 1, // $1.00 minimum
  MAXIMUM_DAILY_WITHDRAWAL: 5000, // $5,000 per day
  MINIMUM_WALLET_BALANCE: 10, // $10 must remain in wallet
  WITHDRAWAL_FEE: 5, // $5.00 withdrawal fee
  ACTIVE_CAMPAIGN_LIMIT_PERCENTAGE: 50, // 50% limit if campaigns are active
  WITHDRAWAL_PROCESSING_DAYS: 5, // 3-5 business days

  STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_demo_key",

  // Stripe fee structure
  STRIPE_FEES: {
    PERCENTAGE: 0.029, // 2.9%
    FIXED_FEE: 0.3, // 30 cents
  },

  PAYMENT_STATUS: {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED",
  } as const,

  TRANSACTION_TYPES: {
    DEPOSIT: "DEPOSIT",
    WITHDRAWAL: "WITHDRAWAL",
    CAMPAIGN_FUNDING: "CAMPAIGN_FUNDING",
    REFUND: "REFUND",
  } as const,

  CARD_BRANDS: {
    VISA: "visa",
    MASTERCARD: "mastercard",
    AMEX: "amex",
    DISCOVER: "discover",
    DINERS: "diners",
    JCB: "jcb",
    UNIONPAY: "unionpay",
  } as const,
} as const;

export const PAYMENT_ERROR_MESSAGES = {
  SETUP_REQUIRED: "Payment setup is required before you can fund campaigns",
  INSUFFICIENT_FUNDS: "Insufficient funds in your wallet",
  PAYMENT_FAILED: "Payment processing failed",
  INVALID_AMOUNT: "Please enter a valid amount",
  CARD_DECLINED: "Your card was declined",
  NETWORK_ERROR: "Network error, please try again",
  UNKNOWN_ERROR: "An unexpected error occurred",
} as const;

export const PAYMENT_SUCCESS_MESSAGES = {
  FUNDS_ADDED: "Funds added successfully to your wallet",
  PAYMENT_METHOD_ADDED: "Payment method added successfully",
  PAYMENT_METHOD_REMOVED: "Payment method removed successfully",
  DEFAULT_PAYMENT_METHOD_SET: "Default payment method updated",
  CAMPAIGN_FUNDED: "Campaign funded successfully",
} as const;

export const PAYMENT_ENDPOINTS = {
  // Payment Setup
  PAYMENT_STATUS: "/advertiser/payment-setup/status",
  SETUP_PAYMENT: "/advertiser/payment-setup/complete",

  // Payment Methods
  GET_PAYMENT_METHODS: "/advertiser/payment-methods",
  ADD_PAYMENT_METHOD: "/advertiser/payment-methods",
  REMOVE_PAYMENT_METHOD: "/advertiser/payment-methods",
  SET_DEFAULT_PAYMENT_METHOD: "/advertiser/payment-methods",
  CREATE_SETUP_INTENT: "/advertiser/payment-methods/setup-intent",

  // Wallet
  ADD_FUNDS: "/advertiser/wallet/add-funds",
  WITHDRAW_FUNDS: "/advertiser/wallet/withdraw-funds",
  GET_WALLET_BALANCE: "/advertiser/wallet/balance",
  GET_WALLET_TRANSACTIONS: "/advertiser/wallet/transactions",
  GET_WITHDRAWAL_LIMITS: "/advertiser/wallet/withdrawal-limits",
  GET_WITHDRAWAL_HISTORY: "/advertiser/wallet/withdrawals",

  // Campaign Funding
  FUND_CAMPAIGN: "/advertiser/campaigns",
  GET_CAMPAIGN_FUNDING_STATUS: "/advertiser/campaigns",
  ADJUST_CAMPAIGN_BUDGET: "/advertiser/campaigns",
  CHECK_CAMPAIGN_FUNDING_FEASIBILITY: "/advertiser/campaigns/funding-check",
  PAY_PROMOTER: "/advertiser/campaigns/pay-promoter",

  // Payment History
  GET_PAYMENT_HISTORY: "/advertiser/payments/history",
  GET_PAYMENT_ANALYTICS: "/advertiser/payments/analytics",
} as const;

// Utility function to calculate Stripe fees
export const calculateStripeFees = (amount: number) => {
  const percentageFee = amount * PAYMENT_CONSTANTS.STRIPE_FEES.PERCENTAGE;
  const fixedFee = PAYMENT_CONSTANTS.STRIPE_FEES.FIXED_FEE;
  const totalFees = percentageFee + fixedFee;
  const totalCost = amount + totalFees;

  return {
    walletAmount: amount,
    percentageFee: Math.round(percentageFee * 100) / 100, // Round to 2 decimals
    fixedFee: fixedFee,
    totalFees: Math.round(totalFees * 100) / 100, // Round to 2 decimals
    totalCost: Math.round(totalCost * 100) / 100, // Round to 2 decimals
  };
};
