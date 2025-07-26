export const PAYMENT_CONSTANTS = {
  MINIMUM_WALLET_FUNDING: 10, // $10 minimum
  MAXIMUM_WALLET_FUNDING: 10000, // $10,000 maximum
  DEFAULT_FUNDING_AMOUNTS: [50, 100, 250, 500, 1000],
  STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_demo_key",

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
  GET_WALLET_BALANCE: "/advertiser/wallet/balance",
  GET_WALLET_TRANSACTIONS: "/advertiser/wallet/transactions",

  // Campaign Funding
  FUND_CAMPAIGN: "/advertiser/campaigns",
  GET_CAMPAIGN_FUNDING_STATUS: "/advertiser/campaigns",
  ADJUST_CAMPAIGN_BUDGET: "/advertiser/campaigns",

  // Payment History
  GET_PAYMENT_HISTORY: "/advertiser/payments/history",
  GET_PAYMENT_ANALYTICS: "/advertiser/payments/analytics",
} as const;
