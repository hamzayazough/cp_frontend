"use client";

import {
  CampaignPromoter,
  VisibilityCampaignDetails,
} from "@/app/interfaces/campaign/promoter-campaign-details";
import { CampaignType } from "@/app/enums/campaign-type";

interface CampaignProgressProps {
  campaign: CampaignPromoter;
}

export default function CampaignProgress({ campaign }: CampaignProgressProps) {
  const getProgressData = () => {
    if (campaign.campaign.type === CampaignType.VISIBILITY) {
      const visibilityDetails = campaign.campaign as VisibilityCampaignDetails;
      const progress =
        (visibilityDetails.currentViews / visibilityDetails.maxViews) * 100;
      return {
        title: "Views Progress",
        current: (visibilityDetails.currentViews || 0).toLocaleString(),
        max: (visibilityDetails.maxViews || 0).toLocaleString(),
        unit: "views",
        progress: Math.min(progress, 100),
        color: "bg-blue-600",
      };
    }

    if (campaign.campaign.type === CampaignType.CONSULTANT) {
      const budgetProgress =
        (campaign.earnings.totalEarned / campaign.campaign.budgetHeld) * 100;
      return {
        title: "Budget Progress",
        current: (campaign.earnings.totalEarned || 0).toLocaleString(),
        max: (campaign.campaign.budgetHeld || 0).toLocaleString(),
        unit: "budget",
        progress: Math.min(budgetProgress, 100),
        color: "bg-purple-600",
      };
    }

    if (
      campaign.campaign.type === CampaignType.SELLER ||
      campaign.campaign.type === CampaignType.SALESMAN
    ) {
      const budgetProgress =
        (campaign.earnings.totalEarned / campaign.campaign.budgetHeld) * 100;
      return {
        title: "Campaign Progress",
        current: (campaign.earnings.totalEarned || 0).toLocaleString(),
        max: (campaign.campaign.budgetHeld || 0).toLocaleString(),
        unit: "budget",
        progress: Math.min(budgetProgress, 100),
        color: "bg-green-600",
      };
    }

    return null;
  };

  const progressData = getProgressData();

  if (!progressData) {
    return null;
  }

  const getProgressText = () => {
    if (campaign.campaign.type === CampaignType.VISIBILITY) {
      return `${progressData.progress.toFixed(1)}% complete`;
    }
    return `${progressData.progress.toFixed(1)}% ${progressData.unit} used`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      {" "}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {progressData.title}
        </h3>
        <span className="text-sm text-gray-600">
          {campaign.campaign.type === CampaignType.VISIBILITY
            ? `${progressData.current} / ${progressData.max} ${progressData.unit}`
            : `$${progressData.current} / $${progressData.max} ${progressData.unit}`}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${progressData.color} h-3 rounded-full transition-all duration-300`}
          style={{ width: `${progressData.progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">{getProgressText()}</p>
    </div>
  );
}
