"use client";

import {
  CampaignPromoter,
  VisibilityCampaignDetails,
  ConsultantCampaignDetails,
  SellerCampaignDetails,
} from "@/app/interfaces/campaign/promoter-campaign-details";
import { CampaignType } from "@/app/enums/campaign-type";

interface CampaignPerformanceProps {
  campaign: CampaignPromoter;
}

export default function CampaignPerformance({
  campaign,
}: CampaignPerformanceProps) {
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
              <p className="text-sm text-gray-600">Views Generated</p>{" "}
              <p className="text-xl font-bold text-gray-900">
                {(campaign.earnings.viewsGenerated || 0).toLocaleString()}
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
        const consultantDetails =
          campaign.campaign as ConsultantCampaignDetails;
        // Assume meetingsDone comes from campaign.meetingDone or calculate from some field
        const meetingsDone = campaign.meetingDone ? 1 : 0; // Placeholder logic
        const meetingsRemaining = Math.max(
          0,
          consultantDetails.meetingCount - meetingsDone
        );

        return (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Meetings Done</p>
              <p className="text-xl font-bold text-gray-900">{meetingsDone}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Meetings Remaining</p>
              <p className="text-xl font-bold text-gray-900">
                {meetingsRemaining}
              </p>
            </div>{" "}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-xl font-bold text-gray-900">
                ${(campaign.earnings.totalEarned || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Max Budget</p>
              <p className="text-xl font-bold text-gray-900">
                ${(consultantDetails.maxBudget || 0).toLocaleString()}
              </p>
            </div>
          </>
        );

      case CampaignType.SELLER:
        const sellerDetails = campaign.campaign as SellerCampaignDetails;
        // For seller campaigns, check if meetings are required
        const sellerMeetingsDone = campaign.meetingDone ? 1 : 0; // Placeholder logic
        const sellerMeetingsRemaining = sellerDetails.needMeeting
          ? Math.max(0, sellerDetails.meetingCount - sellerMeetingsDone)
          : 0;

        return (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Meetings Done</p>
              <p className="text-xl font-bold text-gray-900">
                {sellerDetails.needMeeting ? sellerMeetingsDone : "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Meetings Remaining</p>
              <p className="text-xl font-bold text-gray-900">
                {sellerDetails.needMeeting ? sellerMeetingsRemaining : "N/A"}
              </p>
            </div>{" "}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-xl font-bold text-gray-900">
                ${(campaign.earnings.totalEarned || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Max Budget</p>
              <p className="text-xl font-bold text-gray-900">
                ${(sellerDetails.maxBudget || 0).toLocaleString()}
              </p>
            </div>
          </>
        );

      case CampaignType.SALESMAN:
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
          </>
        );

      default:
        return null;
    }
  };

  const renderTrackingSection = () => {
    if (
      campaign.campaign.type === CampaignType.VISIBILITY &&
      (campaign.campaign as VisibilityCampaignDetails).trackingLink
    ) {
      return (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Your Tracking Link</h4>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={
                (campaign.campaign as VisibilityCampaignDetails).trackingLink ||
                ""
              }
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  (campaign.campaign as VisibilityCampaignDetails)
                    .trackingLink || ""
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

    if (!consultantDetails.expectedDeliverables || consultantDetails.expectedDeliverables.length === 0) {
      return (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Deliverables Progress</h4>
          <div className="text-center text-gray-500 py-4">
            No specific deliverables defined yet
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Deliverables Progress</h4>
        <div className="space-y-3">
          {consultantDetails.expectedDeliverables.map((deliverable, index) => {
            const completionPercentage = deliverable.isFinished ? 100 : deliverable.isSubmitted ? 75 : 0;
            const workCount = deliverable.promoterWork?.length || 0;
            
            return (
              <div
                key={deliverable.id || index}
                className="bg-purple-50 p-4 rounded-lg border border-purple-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-purple-900 mb-1">
                      {deliverable.deliverable.replace(/_/g, " ")}
                    </h5>
                    <div className="flex items-center space-x-2 text-xs text-purple-700">
                      <span>Created: {new Date(deliverable.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Updated: {new Date(deliverable.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        deliverable.isFinished
                          ? "bg-green-100 text-green-800"
                          : deliverable.isSubmitted
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {deliverable.isFinished ? "Completed" : deliverable.isSubmitted ? "Under Review" : "Pending"}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-purple-600">Progress</span>
                    <span className="text-xs text-purple-600 font-medium">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        deliverable.isFinished
                          ? "bg-green-500"
                          : deliverable.isSubmitted
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Work Submissions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-purple-700">
                    <span className="font-medium">Work Submissions:</span>
                    <span className="bg-purple-100 px-2 py-1 rounded-full">
                      {workCount} item{workCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {workCount > 0 && (
                    <button className="text-xs text-purple-600 hover:text-purple-800 underline">
                      View Submissions
                    </button>
                  )}
                </div>

                {/* Work Items Preview */}
                {workCount > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <div className="space-y-2">
                      {deliverable.promoterWork?.slice(0, 2).map((work, workIndex) => (
                        <div key={work.id || workIndex} className="flex items-center space-x-2 text-xs text-purple-700">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="flex-1 truncate">{work.description || 'Work submission'}</span>
                          <span className="text-purple-500">
                            {new Date(work.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                      {workCount > 2 && (
                        <div className="text-xs text-purple-600 pl-4">
                          +{workCount - 2} more submission{workCount - 2 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSellerDeliverables = () => {
    if (campaign.campaign.type !== CampaignType.SELLER) return null;

    const sellerDetails = campaign.campaign as SellerCampaignDetails;

    if (!sellerDetails.deliverables || sellerDetails.deliverables.length === 0) {
      return (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Deliverables Progress</h4>
          <div className="text-center text-gray-500 py-4">
            No specific deliverables defined yet
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Deliverables Progress</h4>
        <div className="space-y-3">
          {sellerDetails.deliverables.map((deliverable, index) => {
            const completionPercentage = deliverable.isFinished ? 100 : deliverable.isSubmitted ? 75 : 0;
            const workCount = deliverable.promoterWork?.length || 0;
            
            return (
              <div
                key={deliverable.id || index}
                className="bg-orange-50 p-4 rounded-lg border border-orange-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-orange-900 mb-1">
                      {deliverable.deliverable.replace(/_/g, " ")}
                    </h5>
                    <div className="flex items-center space-x-2 text-xs text-orange-700">
                      <span>Created: {new Date(deliverable.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Updated: {new Date(deliverable.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        deliverable.isFinished
                          ? "bg-green-100 text-green-800"
                          : deliverable.isSubmitted
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {deliverable.isFinished ? "Completed" : deliverable.isSubmitted ? "Under Review" : "Pending"}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-orange-600">Progress</span>
                    <span className="text-xs text-orange-600 font-medium">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        deliverable.isFinished
                          ? "bg-green-500"
                          : deliverable.isSubmitted
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Work Submissions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-orange-700">
                    <span className="font-medium">Work Submissions:</span>
                    <span className="bg-orange-100 px-2 py-1 rounded-full">
                      {workCount} item{workCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {workCount > 0 && (
                    <button className="text-xs text-orange-600 hover:text-orange-800 underline">
                      View Submissions
                    </button>
                  )}
                </div>

                {/* Work Items Preview */}
                {workCount > 0 && (
                  <div className="mt-3 pt-3 border-t border-orange-200">
                    <div className="space-y-2">
                      {deliverable.promoterWork?.slice(0, 2).map((work, workIndex) => (
                        <div key={work.id || workIndex} className="flex items-center space-x-2 text-xs text-orange-700">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="flex-1 truncate">{work.description || 'Work submission'}</span>
                          <span className="text-orange-500">
                            {new Date(work.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                      {workCount > 2 && (
                        <div className="text-xs text-orange-600 pl-4">
                          +{workCount - 2} more submission{workCount - 2 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSalesPerformance = () => {
    if (
      campaign.campaign.type !== CampaignType.SELLER &&
      campaign.campaign.type !== CampaignType.SALESMAN
    )
      return null;

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {renderPerformanceStats()}
      </div>

      {/* Tracking Link */}
      {renderTrackingSection()}

      {/* Consultant Performance Tools */}
      {renderConsultantDeliverables()}

      {/* Seller Performance Tools */}
      {renderSellerDeliverables()}

      {/* Sales Performance */}
      {renderSalesPerformance()}
    </div>
  );
}
