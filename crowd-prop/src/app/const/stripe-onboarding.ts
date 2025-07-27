export const STRIPE_ONBOARDING_CONSTANTS = {
  ACCOUNT_TYPES: {
    EXPRESS: "express",
    STANDARD: "standard",
    CUSTOM: "custom",
  },

  ACCOUNT_STATUS: {
    PENDING: "pending",
    ACTIVE: "active",
    RESTRICTED: "restricted",
  },

  CAPABILITY_STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    PENDING: "pending",
  },

  COUNTRIES: [
    { code: "US", name: "United States" },
    { code: "CA", name: "Canada" },
  ],

  BUSINESS_TYPES: {
    LLC: "llc",
    CORPORATION: "corporation",
    PARTNERSHIP: "partnership",
    SOLE_PROPRIETORSHIP: "sole_proprietorship",
  },

  ONBOARDING_MESSAGES: {
    SETUP_REQUIRED: "Payment setup is required to receive earnings",
    SETUP_COMPLETE: "Your payment account is ready to receive earnings",
    SETUP_INCOMPLETE: "Please complete your payment setup to receive earnings",
    SETUP_PROCESSING: "Your payment setup is being processed",
    SETUP_ERROR: "There was an error setting up your payment account",
  },

  REDIRECT_MESSAGES: {
    SUCCESS: "Payment setup completed successfully!",
    ERROR: "There was an error during payment setup",
    INCOMPLETE: "Payment setup is incomplete. Please try again.",
    CANCELLED: "Payment setup was cancelled",
  },
} as const;

export const STRIPE_ENDPOINTS = {
  CREATE_ACCOUNT: "/connect/create-account",
  GET_ONBOARDING_LINK: "/connect/onboard",
  REFRESH_ONBOARDING: "/connect/refresh-onboarding",
  ACCOUNT_STATUS: "/connect/status",
  ONBOARDING_STATUS: "/connect/onboarding-status",
  IS_READY: "/connect/ready",
} as const;
