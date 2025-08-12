"use client";

import Link from "next/link";
import { routes } from "@/lib/router";
import {
  ArrowLeftIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
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
  getStatusColor: (status: string) => string;
  getTypeColor: (type: string) => string;
}

export default function CampaignHeader({
  campaign,
  campaignId,
  onShareClick,
  getStatusColor,
  getTypeColor,
}: CampaignHeaderProps) {
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
          <div className="flex items-center space-x-2 mt-1">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                campaign.status
              )}`}
            >
              {campaign.status}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                campaign.type
              )}`}
            >
              {campaign.type}
            </span>
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
        {campaign.status === PromoterCampaignStatus.ONGOING && (
          <Link
            href={routes.messageThread(campaignId)}
            className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
            Chat
          </Link>
        )}
      </div>
    </div>
  );
}
