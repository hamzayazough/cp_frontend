import { CampaignType } from "../enums/campaign-type";

export enum PayoutStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum ChargeStatus {
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export interface PayoutRecord {
  id: string;
  promoterId: string;
  campaignId?: string;
  amount: number;
  status: PayoutStatus;
  stripeTransferId?: string;
  stripePayoutId?: string;
  periodStart?: Date;
  periodEnd?: Date;
  description?: string;
  failureReason?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdvertiserCharge {
  id: string;
  advertiserId: string;
  campaignId?: string;
  amount: number;
  status: ChargeStatus;
  stripeChargeId?: string;
  stripePaymentMethodId?: string;
  currency: string;
  description?: string;
  failureReason?: string;
  refundedAmount: number;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromoterBalance {
  id: string;
  promoterId: string;
  periodStart: Date;
  periodEnd: Date;
  visibilityEarnings: number;
  consultantEarnings: number;
  sellerEarnings: number;
  salesmanEarnings: number;
  totalEarnings: number;
  paidOut: boolean;
  payoutRecordId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdvertiserSpend {
  id: string;
  advertiserId: string;
  periodStart: Date;
  periodEnd: Date;
  campaignsFunded: number;
  totalSpent: number;
  totalCharged: number;
  remainingBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Payment flow DTOs
export interface CampaignPaymentInfo {
  campaignId: string;
  campaignType: CampaignType;
  budgetHeld: number;
  finalPayoutAmount?: number;
  payoutExecuted: boolean;
  payoutDate?: Date;
  stripeChargeId?: string;
  stripeTransferId?: string;
}

export interface CreateChargeRequest {
  advertiserId: string;
  campaignId?: string;
  amount: number;
  paymentMethodId: string;
  description?: string;
}

export interface CreatePayoutRequest {
  promoterId: string;
  campaignId?: string;
  amount: number;
  description?: string;
  periodStart?: Date;
  periodEnd?: Date;
}

export interface MonthlyPromoterEarnings {
  promoterId: string;
  promoterName: string;
  periodStart: Date;
  periodEnd: Date;
  earningsByType: {
    visibility: number;
    consultant: number;
    seller: number;
    salesman: number;
  };
  totalEarnings: number;
  paidOut: boolean;
  payoutDate?: Date;
}

export interface MonthlyAdvertiserSpend {
  advertiserId: string;
  advertiserName: string;
  periodStart: Date;
  periodEnd: Date;
  campaignsFunded: number;
  totalSpent: number;
  totalCharged: number;
  remainingBalance: number;
}

export interface PaymentDashboard {
  // Promoter view
  currentBalance: number;
  pendingPayouts: number;
  totalEarningsThisMonth: number;
  totalEarningsLastMonth: number;
  nextPayoutDate?: Date;
  recentPayouts: PayoutRecord[];

  // Advertiser view
  totalSpentThisMonth: number;
  totalSpentLastMonth: number;
  activeCampaignsBudget: number;
  prepaidBalance: number;
  recentCharges: AdvertiserCharge[];
}

// Stripe Customer Management
export interface StripeCustomer {
  id: string;
  customerId: string;
  userId: string;
  email: string;
  name?: string;
  defaultPaymentMethodId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    funding: string;
  };
  billingDetails?: {
    name?: string;
    email?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentSetupStatus {
  hasStripeCustomer: boolean;
  paymentMethodsCount: number;
  setupComplete: boolean;
  stripeCustomerId?: string;
}

// Wallet Management
export interface WalletTransaction {
  id: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "CAMPAIGN_FUNDING" | "REFUND";
  amount: number;
  description: string;
  campaignId?: string;
  campaignTitle?: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  paymentIntentId?: string;
}

export interface WalletBalance {
  currentBalance: number;
  pendingCharges: number;
  totalDeposited: number;
  totalSpent: number;
  availableForWithdrawal: number;
  totalHeldForCampaign: number;
}

// Payment Requests and Responses
export interface AddFundsRequest {
  amount: number;
  paymentMethodId?: string;
  description?: string;
}

export interface AddFundsResponse {
  success: boolean;
  paymentIntentId?: string;
  clientSecret?: string;
  message: string;
}

export interface CreatePaymentIntentRequest {
  campaignId?: string;
  amount: number;
  currency?: string;
  description?: string;
  paymentFlowType: PaymentFlowType;
}

export interface PaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ConfirmPaymentRequest {
  paymentMethodId: string;
}

export interface PaymentConfirmationResponse {
  success: boolean;
  paymentIntentId: string;
  status: string;
  message?: string;
}

// Campaign Funding
export interface CampaignFundingStatus {
  campaignId: string;
  totalBudget: number;
  spentAmount: number;
  remainingBudget: number;
  pendingPayments: number;
  lastPaymentDate?: string;
  paymentHistory: WalletTransaction[];
}

export enum PaymentFlowType {
  WALLET_FUNDING = "WALLET_FUNDING",
  CAMPAIGN_FUNDING = "CAMPAIGN_FUNDING",
  DIRECT_PAYMENT = "DIRECT_PAYMENT",
}

// Withdraw Funds
export interface WithdrawFundsRequest {
  amount: number; // Amount in dollars
  reason?: string;
}

export interface WithdrawFundsResponse {
  withdrawalId: string;
  amount: number; // Amount in cents from backend
  processingTime: string;
  estimatedArrival: string; // Date string
  status: string; // "pending", "processing", "completed", etc.
}

export enum WithdrawalStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface WithdrawalLimits {
  feeStructure: {
    standardFee: number;
    freeWithdrawalThreshold: number;
    minimumWithdrawal: number;
  };
  limits: {
    dailyLimit: number;
    remainingDailyLimit: number;
    maxWithdrawable: number;
    recommendedMaxWithdrawal: number;
  };
  campaignRestrictions: {
    activeCampaigns: number;
    totalBudgetAllocated: number;
    recommendedReserve: number;
    canWithdrawFullBalance: boolean;
  };
  processingTime: string;
  description: string;
}

export interface WithdrawalHistory {
  id: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  estimatedArrival: string;
  reason?: string;
}

// Campaign Funding Feasibility Check
export interface CheckCampaignFundingDto {
  estimatedBudgetCents: number; // in cents
}

export interface CampaignFundingFeasibility {
  canAfford: boolean;
  currentAvailableBalance: number; // Available balance for new campaigns (excluding held amounts)
  estimatedBudget: number; // Budget needed for the new campaign
  shortfallAmount: number; // How much more is needed (0 if can afford)
  recommendedDeposit: number; // Recommended deposit amount (includes buffer and Stripe fees)
  walletSummary?: {
    totalBalance: number; // Total current balance
    heldForExistingCampaigns: number; // Amount held for existing campaigns
    pendingTransactions: number; // Pending deposits/withdrawals
  };
}
