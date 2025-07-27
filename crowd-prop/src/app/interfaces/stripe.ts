export interface StripeConnectAccount {
  accountId: string;
  stripeAccountId: string;
  status: string;
  accountType: string;
  businessType?: string;
  country: string;
  defaultCurrency?: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirements: {
    currentlyDue: string[];
    eventuallyDue: string[];
    pastDue: string[];
    pendingVerification: string[];
  };
  capabilities: {
    cardPayments: string;
    transfers: string;
  };
  onboarding: {
    link?: string;
    expiresAt?: Date;
    lastAttempt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConnectAccountRequest {
  email: string;
  country: string;
  isBusiness: boolean;
  businessName?: string;
  firstName?: string;
  lastName?: string;
}

export interface OnboardingLinkResponse {
  url: string;
  expiresAt: Date;
}

export interface StripeConnectResponse {
  success: boolean;
  data?: StripeConnectAccount | OnboardingLinkResponse | null;
  message: string;
}

export interface OnboardingStatusResponse {
  success: boolean;
  onboarded: boolean;
  data?: {
    accountId: string;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    status: string;
    requirementsComplete: boolean;
    requirements: string[];
  };
  message: string;
}
