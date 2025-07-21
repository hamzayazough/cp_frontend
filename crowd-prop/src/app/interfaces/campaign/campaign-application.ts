// Interface for sending campaign application
export interface SendApplicationRequest {
  campaignId: string;
  applicationMessage: string;
}

export interface SendApplicationResponse {
  success: boolean;
  message: string;
  data?: {
    applicationId: string;
    status: string;
  };
}
