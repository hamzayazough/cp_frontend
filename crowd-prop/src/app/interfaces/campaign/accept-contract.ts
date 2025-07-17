
export interface AcceptContractRequest {
  campaignId: string;
}

export interface AcceptContractResponse {
  success: boolean;
  message: string;
  data?: {
    contractId: string;
    campaignId: string;
    status: string;
    acceptedAt: string;
  };
}
