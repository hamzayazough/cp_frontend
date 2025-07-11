"use client";

import { 
  CampaignPromoter, 
  VisibilityCampaignDetails,
  ConsultantCampaignDetails
} from "@/interfaces/campaign-promoter";
import { CampaignType } from "@/app/enums/campaign-type";

interface CampaignPerformanceProps {
  campaign: CampaignPromoter;
}

export default function CampaignPerformance({ campaign }: CampaignPerformanceProps) {
  const progress = 
    campaign.campaign.type === CampaignType.VISIBILITY &&
    "maxViews" in campaign.campaign
      ? ((campaign.earnings.viewsGenerated || 0) /
          ((campaign.campaign as VisibilityCampaignDetails).maxViews || 1)) *
        100
      : 0;

  const renderPerformanceStats = () => {
    switch (campaign.campaign.type) {
      case CampaignType.VISIBILITY:
        return (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Price per 100 views</p>
              <p className="text-xl font-bold text-gray-900">
                ${(campaign.campaign as VisibilityCampaignDetails).cpv}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Views Generated</p>
              <p className="text-xl font-bold text-gray-900">
                {campaign.earnings.viewsGenerated.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">View Target Progress</p>
              <p className="text-xl font-bold text-gray-900">
                {progress.toFixed(1)}%
              </p>
            </div>
          </>
        );

      case CampaignType.CONSULTANT:
        return (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Meetings Planned</p>
              <p className="text-xl font-bold text-gray-900">
                {(campaign.campaign as ConsultantCampaignDetails).meetingCount || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Budget used</p>
              <p className="text-xl font-bold text-gray-900">
                {(
                  (campaign.campaign.spentBudget / campaign.campaign.budgetHeld) *
                  100
                ).toFixed(1)}%
              </p>
            </div>
          </>
        );

      case CampaignType.SELLER:
      case CampaignType.SALESMAN:
        return (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-xl font-bold text-gray-900">
                ${campaign.earnings.totalEarned}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Projected Total</p>
              <p className="text-xl font-bold text-gray-900">
                ${campaign.earnings.projectedTotal}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {campaign.earnings.totalEarned > 0 ? "100%" : "0%"}
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderTrackingSection = () => {
    if (campaign.campaign.type === CampaignType.VISIBILITY && 
        (campaign.campaign as VisibilityCampaignDetails).trackingLink) {
      return (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">
            Your Tracking Link
          </h4>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={(campaign.campaign as VisibilityCampaignDetails).trackingLink || ""}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  (campaign.campaign as VisibilityCampaignDetails).trackingLink || ""
                )
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderConsultantDeliverables = () => {
    if (campaign.campaign.type !== CampaignType.CONSULTANT) return null;

    const consultantDetails = campaign.campaign as ConsultantCampaignDetails;
    
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Deliverables Progress</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consultantDetails.expectedDeliverables?.map((deliverable, index) => (
            <div
              key={index}
              className="bg-purple-50 p-4 rounded-lg border border-purple-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-900">
                  {deliverable}
                </span>
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  In Progress
                </span>
              </div>
            </div>
          )) || (
            <div className="col-span-2 text-center text-gray-500 py-4">
              No specific deliverables defined yet
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSalesPerformance = () => {
    if (campaign.campaign.type !== CampaignType.SELLER && 
        campaign.campaign.type !== CampaignType.SALESMAN) return null;

    return (
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Sales Performance</h4>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-800">
            Track your sales performance and commission earnings here.
            {campaign.campaign.type === CampaignType.SALESMAN && (
              <span> Use your referral code or link to track sales.</span>
            )}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Performance Analytics
      </h3>
      
      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderPerformanceStats()}
      </div>

      {/* Tracking Link */}
      {renderTrackingSection()}

      {/* Consultant Performance Tools */}
      {renderConsultantDeliverables()}

      {/* Sales Performance */}
      {renderSalesPerformance()}
    </div>
  );
}
