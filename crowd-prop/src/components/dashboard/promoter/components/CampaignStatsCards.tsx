"use client";

import {
  CurrencyDollarIcon,
  EyeIcon,
  ChartBarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import {
  CampaignPromoter,
  VisibilityCampaignDetails,
  ConsultantCampaignDetails,
  SellerCampaignDetails,
} from "@/app/interfaces/campaign/promoter-campaign-details";
import { CampaignType } from "@/app/enums/campaign-type";

interface CampaignStatsCardsProps {
  campaign: CampaignPromoter;
  daysLeft: number | string;
}

export default function CampaignStatsCards({
  campaign,
  daysLeft,
}: CampaignStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            {" "}
            <p className="text-sm font-medium text-gray-600">Total Earned</p>
            <p className="text-2xl font-bold text-gray-900">
              ${(campaign.earnings.totalEarned || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      {campaign.campaign.type === CampaignType.VISIBILITY && (
        <>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <EyeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                {" "}
                <p className="text-sm font-medium text-gray-600">
                  Views Generated
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(campaign.earnings.viewsGenerated || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>{" "}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Earning per 100 views
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(campaign.campaign as VisibilityCampaignDetails).cpv}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      {campaign.campaign.type === CampaignType.CONSULTANT && (
        <>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Budget Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    (campaign.campaign.spentBudget /
                      campaign.campaign.budgetHeld) *
                      100
                  ) || 0}
                  %
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <EyeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Meetings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(campaign.campaign as ConsultantCampaignDetails)
                    .meetingCount || 0}
                </p>
              </div>
            </div>
          </div>
        </>
      )}{" "}
      {campaign.campaign.type === CampaignType.SALESMAN && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sales</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaign.earnings.totalEarned || 0}
              </p>
            </div>
          </div>
        </div>
      )}
      {campaign.campaign.type === CampaignType.SELLER && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              {" "}
              <p className="text-sm font-medium text-gray-600">Min Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {(
                  (campaign.campaign as SellerCampaignDetails).minBudget || 0
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
      {(campaign.campaign.type === CampaignType.SELLER ||
        campaign.campaign.type === CampaignType.SALESMAN) && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              {" "}
              <p className="text-sm font-medium text-gray-600">Max Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {(campaign.campaign.type === CampaignType.SELLER ||
                campaign.campaign.type === CampaignType.SALESMAN
                  ? (campaign.campaign as SellerCampaignDetails).maxBudget || 0
                  : 0
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-lg">
            <CalendarIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Days Left</p>
            <p className="text-2xl font-bold text-gray-900">{daysLeft}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
