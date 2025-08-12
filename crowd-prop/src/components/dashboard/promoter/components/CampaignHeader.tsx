"use client";

import Link from "next/link";
import { routes } from "@/lib/router";
import {
  ArrowLeftIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { CampaignPromoter } from "@/app/interfaces/campaign/promoter-campaign-details";
import {
  CampaignType,
  PromoterCampaignStatus,
} from "@/app/enums/campaign-type";

interface CampaignHeaderProps {
  campaign: CampaignPromoter;
  campaignId: string;
  onShareClick: () => void;
  getTypeColor: (type: string) => string;
}

export default function CampaignHeader({
  campaign,
  onShareClick,
  getTypeColor,
}: CampaignHeaderProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case PromoterCampaignStatus.ONGOING:
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          dot: "bg-green-500"
        };
      case PromoterCampaignStatus.COMPLETED:
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          dot: "bg-blue-500"
        };
      case PromoterCampaignStatus.PENDING:
        return {
          color: "bg-yellow-50 text-yellow-700 border-yellow-200",
          dot: "bg-yellow-500"
        };
      case PromoterCampaignStatus.CANCELLED:
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500"
        };
      case PromoterCampaignStatus.PAUSED:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          dot: "bg-gray-500"
        };
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          dot: "bg-gray-500"
        };
    }
  };

  const statusConfig = getStatusIcon(campaign.status);
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Link
          href={routes.dashboardCampaigns}
          className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{campaign.title}</h1>
          <div className="flex items-center space-x-3 mt-1">
            {/* Status - Clean badge with dot */}
            <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-md border text-xs font-medium ${statusConfig.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></div>
              <span className="capitalize">
                {campaign.status.toLowerCase()}
              </span>
            </div>
            {/* Campaign Type - Badge display */}
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                campaign.campaign.type
              )}`}
            >
              {campaign.campaign.type}
            </span>
            {/* Public/Private Indicator - icon only */}
            <div className={`${
              campaign.campaign.isPublic 
                ? "text-green-600" 
                : "text-gray-500"
            }`} title={campaign.campaign.isPublic ? "Public Campaign" : "Private Campaign"}>
              {campaign.campaign.isPublic ? (
                <GlobeAltIcon className="h-4 w-4" />
              ) : (
                <LockClosedIcon className="h-4 w-4" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {campaign.campaign.type === CampaignType.VISIBILITY &&
          campaign.status === PromoterCampaignStatus.ONGOING && (
            <button
              onClick={onShareClick}
              className="flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <ShareIcon className="h-3 w-3 mr-1" />
              Share
            </button>
          )}
        {campaign.campaign.discordInviteLink &&
          campaign.status === PromoterCampaignStatus.ONGOING && (
            <Link
              href={campaign.campaign.discordInviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
              Discord
            </Link>
          )}
        
      </div>
    </div>
  );
}
