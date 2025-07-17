import React from "react";
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  CampaignPromoter,
  VisibilityCampaignDetails,
  ConsultantCampaignDetails,
  SellerCampaignDetails,
  SalesmanCampaignDetails,
} from "../interfaces/campaign/promoter-campaign-details";
import { CampaignType } from "../enums/campaign-type";

export const statusOptions = [
  { value: "ALL", label: "All Status" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "AWAITING_REVIEW", label: "Awaiting Review" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PAUSED", label: "Paused" },
];

export const typeOptions = [
  { value: "ALL", label: "All Types" },
  { value: "VISIBILITY", label: "Visibility" },
  { value: "SALESMAN", label: "Salesman" },
  { value: "CONSULTANT", label: "Consultant" },
  { value: "SELLER", label: "Seller" },
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case "ONGOING":
      return "bg-green-100 text-green-800";
    case "AWAITING_REVIEW":
      return "bg-yellow-100 text-yellow-800";
    case "COMPLETED":
      return "bg-gray-100 text-gray-800";
    case "PAUSED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusIcon = (status: string): React.ReactElement => {
  switch (status) {
    case "ONGOING":
      return React.createElement(ClockIcon, { className: "h-4 w-4" });
    case "AWAITING_REVIEW":
      return React.createElement(ExclamationTriangleIcon, {
        className: "h-4 w-4",
      });
    case "COMPLETED":
      return React.createElement(CheckCircleIcon, { className: "h-4 w-4" });
    default:
      return React.createElement(ClockIcon, { className: "h-4 w-4" });
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case "VISIBILITY":
      return "bg-blue-100 text-blue-800";
    case "SALESMAN":
      return "bg-green-100 text-green-800";
    case "CONSULTANT":
      return "bg-purple-100 text-purple-800";
    case "SELLER":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getEarningsInfo = (campaign: CampaignPromoter) => {
  switch (campaign.type) {
    case CampaignType.VISIBILITY:
      const cpv = (campaign.campaign as VisibilityCampaignDetails).cpv;
      const cpvNumber = typeof cpv === "number" ? cpv : parseFloat(cpv) || 0;
      return `$${cpvNumber.toFixed(2)}/100 views`;
    case CampaignType.SALESMAN:
      return `${
        (campaign.campaign as SalesmanCampaignDetails).commissionPerSale
      }% commission`;
    case CampaignType.CONSULTANT:
      const consultantDetails = campaign.campaign as ConsultantCampaignDetails;
      return `$${consultantDetails.minBudget}-$${consultantDetails.maxBudget}`;
    case CampaignType.SELLER:
      const sellerDetails = campaign.campaign as SellerCampaignDetails;
      return sellerDetails.fixedPrice
        ? `$${sellerDetails.fixedPrice} fixed`
        : `$${sellerDetails.minBudget}-$${sellerDetails.maxBudget}`;
    default:
      return "Variable";
  }
};
