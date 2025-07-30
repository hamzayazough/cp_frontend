export enum TransactionType {
  VIEW_EARNING = "VIEW_EARNING",
  WALLET_DEPOSIT = "WALLET_DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  CAMPAIGN_FUNDING = "CAMPAIGN_FUNDING",
  SALESMAN_COMMISSION = "SALESMAN_COMMISSION",
  MONTHLY_PAYOUT = "MONTHLY_PAYOUT",
  DIRECT_PAYMENT = "DIRECT_PAYMENT",
}

export enum TransactionStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  WALLET = "WALLET",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export interface Transaction {
  id: string;
  promoterId: string;
  campaignId?: string;
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  description?: string;
  estimatedPaymentDate?: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced transaction interfaces
export interface TransactionDetails extends Transaction {
  promoterName: string;
  campaignTitle?: string;
  campaignType?: string;
  advertiserName?: string;
}

export interface TransactionSummary {
  promoterId: string;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalEarnings: number;
    totalTransactions: number;
    pendingAmount: number;
    completedAmount: number;
  };
  breakdown: {
    [TransactionType.VIEW_EARNING]: number;
    [TransactionType.CAMPAIGN_FUNDING]: number;
    [TransactionType.SALESMAN_COMMISSION]: number;
    [TransactionType.MONTHLY_PAYOUT]: number;
    [TransactionType.DIRECT_PAYMENT]: number;
    [TransactionType.WITHDRAWAL]: number;
    [TransactionType.WALLET_DEPOSIT]: number;
  };
}
