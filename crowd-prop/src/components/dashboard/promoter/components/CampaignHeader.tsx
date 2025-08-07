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
      <div className="flex items-center space-x-4">
        <Link
          href={routes.dashboardCampaigns}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{campaign.title}</h1>
          <div className="flex items-center space-x-3 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                campaign.status
              )}`}
            >
              {campaign.status}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                campaign.type
              )}`}
            >
              {campaign.type}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {campaign.campaign.type === CampaignType.VISIBILITY &&
          campaign.status === PromoterCampaignStatus.ONGOING && (
            <button
              onClick={onShareClick}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Link to Share
            </button>
          )}
        {campaign.campaign.discordInviteLink &&
          campaign.status === PromoterCampaignStatus.ONGOING && (
            <Link
              href={campaign.campaign.discordInviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Join Discord
            </Link>
          )}
        {campaign.status === PromoterCampaignStatus.ONGOING && (
          <Link
            href={routes.messageThread(campaignId)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
            Chat
          </Link>
        )}
      </div>
    </div>
  );
}
