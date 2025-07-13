"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { CampaignAdvertiser } from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignStatus, CampaignType } from "@/app/enums/campaign-type";

interface AdvertiserCampaignHeaderProps {
  campaign: CampaignAdvertiser;
  campaignId: string;
  onShareClick: () => void;
  getStatusColor: (status: CampaignStatus) => string;
  getTypeColor: (type: CampaignType) => string;
}

export default function AdvertiserCampaignHeader({
  campaign,
  campaignId,
  onShareClick,
  getStatusColor,
  getTypeColor,
}: AdvertiserCampaignHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/campaigns"
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
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
        {campaign.type === CampaignType.VISIBILITY && (
          <button
            onClick={onShareClick}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <ShareIcon className="h-4 w-4 mr-2" />
            Link to Share
          </button>
        )}
        {campaign.campaign.discordInviteLink && (
          <Link
            href={campaign.campaign.discordInviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
            Discord Channel
          </Link>
        )}
        <Link
          href={`/dashboard/messages/${campaignId}`}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
          Chat
        </Link>
      </div>
    </div>
  );
}
