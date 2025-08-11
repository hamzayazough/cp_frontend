"use client";

import { useState } from "react";
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
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setShowCopiedToast(true);
      setIsCopied(true);
      // Hide toast and reset button after 2 seconds
      setTimeout(() => {
        setShowCopiedToast(false);
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };
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
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-blue-600 font-medium">Price per 100 views</p>
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-lg font-bold text-blue-900">
                ${(campaign.campaign as VisibilityCampaignDetails).cpv}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-green-600 font-medium">Views Generated</p>
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-green-900">
                {(campaign.earnings.viewsGenerated || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-purple-600 font-medium">Progress</p>
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {progress.toFixed(1)}%
              </p>
              <div className="w-full bg-purple-200 rounded-full h-1 mt-1">
                <div className="bg-purple-600 h-1 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }}></div>
              </div>
            </div>
          </>
        );
      case CampaignType.CONSULTANT:
        const consultantDetails =
          campaign.campaign as ConsultantCampaignDetails;
        // Assume meetingsDone comes from campaign.meetingDone or calculate from some field
        const meetingsDone = campaign.meetingDone ? 1 : 0; // Placeholder logic
        const consultantDeliverables = consultantDetails.expectedDeliverables || [];
        const completedConsultantDeliverables = consultantDeliverables.filter(d => d.isFinished).length;

        return (
          <>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-blue-600 font-medium">Meetings</p>
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-blue-900">{meetingsDone}/{consultantDetails.meetingCount}</p>
              <p className="text-xs text-blue-600">Completed</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-green-600 font-medium">Deliverables</p>
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-green-900">{completedConsultantDeliverables}/{consultantDeliverables.length}</p>
              <p className="text-xs text-green-600">Finished</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-purple-600 font-medium">Total Earned</p>
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-lg font-bold text-purple-900">
                ${(campaign.earnings.totalEarned || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-orange-600 font-medium">Max Budget</p>
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-orange-900">
                ${(consultantDetails.maxBudget || 0).toLocaleString()}
              </p>
            </div>
          </>
        );

      case CampaignType.SELLER:
        const sellerDetails = campaign.campaign as SellerCampaignDetails;
        // For seller campaigns, check if meetings are required
        const sellerMeetingsDone = campaign.meetingDone ? 1 : 0; // Placeholder logic
        const sellerDeliverables = sellerDetails.deliverables || [];
        const completedSellerDeliverables = sellerDeliverables.filter(d => d.isFinished).length;

        return (
          <>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-blue-600 font-medium">Meetings</p>
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-blue-900">
                {sellerDetails.needMeeting ? `${sellerMeetingsDone}/${sellerDetails.meetingCount}` : "N/A"}
              </p>
              <p className="text-xs text-blue-600">Completed</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-green-600 font-medium">Deliverables</p>
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-green-900">{completedSellerDeliverables}/{sellerDeliverables.length}</p>
              <p className="text-xs text-green-600">Finished</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-purple-600 font-medium">Total Earned</p>
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-lg font-bold text-purple-900">
                ${(campaign.earnings.totalEarned || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-orange-600 font-medium">Max Budget</p>
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-orange-900">
                ${(sellerDetails.maxBudget || 0).toLocaleString()}
              </p>
            </div>
          </>
        );

      case CampaignType.SALESMAN:
      case CampaignType.SALESMAN:
        return (
          <>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-green-600 font-medium">Total Earned</p>
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-lg font-bold text-green-900">
                ${campaign.earnings.totalEarned}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-blue-600 font-medium">Projected Total</p>
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-blue-900">
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
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Your Tracking Link</h4>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={
                (campaign.campaign as VisibilityCampaignDetails).trackingLink ||
                ""
              }
              readOnly
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50"
            />
            <button
              onClick={() =>
                handleCopyLink(
                  (campaign.campaign as VisibilityCampaignDetails)
                    .trackingLink || ""
                )
              }
              disabled={isCopied}
              className={`px-3 py-1 text-xs rounded transition-colors flex items-center space-x-1 ${
                isCopied
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isCopied ? (
                <>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <span>Copy</span>
              )}
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

    if (
      !consultantDetails.expectedDeliverables ||
      consultantDetails.expectedDeliverables.length === 0
    ) {
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Deliverables Progress</h4>
          <div className="text-center text-gray-500 py-3 bg-gray-50 rounded-lg">
            <p className="text-xs">No specific deliverables defined yet</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900">Deliverables Progress</h4>
        <div className="space-y-3">
          {consultantDetails.expectedDeliverables.map((deliverable, index) => {
            const completionPercentage = deliverable.isFinished
              ? 100
              : deliverable.isSubmitted
              ? 75
              : 0;
            const workCount = deliverable.promoterWork?.length || 0;

            return (
              <div
                key={deliverable.id || index}
                className="bg-purple-50 p-3 rounded-lg border border-purple-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h5 className="text-xs font-medium text-purple-900 mb-1">
                      {deliverable.deliverable.replace(/_/g, " ")}
                    </h5>
                    <div className="flex items-center space-x-2 text-xs text-purple-700">
                      <span>
                        Created:{" "}
                        {new Date(deliverable.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        Updated:{" "}
                        {new Date(deliverable.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      deliverable.isFinished
                        ? "bg-green-100 text-green-800"
                        : deliverable.isSubmitted
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {deliverable.isFinished
                      ? "Done"
                      : deliverable.isSubmitted
                      ? "Review"
                      : "Pending"}
                  </span>
                </div>

                {/* Compact Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-purple-600">Progress</span>
                    <span className="text-xs text-purple-600 font-medium">
                      {completionPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
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

                {/* Work Submissions - Compact */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-purple-700">
                    <span className="font-medium">Work:</span>
                    <span className="bg-purple-100 px-2 py-1 rounded-full">
                      {workCount} item{workCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {workCount > 0 && (
                    <button className="text-purple-600 hover:text-purple-800 underline">
                      View
                    </button>
                  )}
                </div>

                {/* Work Items Preview - Very Compact */}
                {workCount > 0 && (
                  <div className="mt-2 pt-2 border-t border-purple-200">
                    <div className="space-y-1">
                      {deliverable.promoterWork
                        ?.slice(0, 2)
                        .map((work, workIndex) => (
                          <div
                            key={work.id || workIndex}
                            className="flex items-center space-x-2 text-xs text-purple-700"
                          >
                            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                            <span className="flex-1 truncate">
                              {work.description || "Work submission"}
                            </span>
                            <span className="text-purple-500">
                              {new Date(work.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      {workCount > 2 && (
                        <div className="text-xs text-purple-600 pl-3">
                          +{workCount - 2} more
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

    if (
      !sellerDetails.deliverables ||
      sellerDetails.deliverables.length === 0
    ) {
      return (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Deliverables Progress</h4>
          <div className="text-center text-gray-500 py-3 bg-gray-50 rounded-lg">
            <p className="text-xs">No specific deliverables defined yet</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900">Deliverables Progress</h4>
        <div className="space-y-3">
          {sellerDetails.deliverables.map((deliverable, index) => {
            const completionPercentage = deliverable.isFinished
              ? 100
              : deliverable.isSubmitted
              ? 75
              : 0;
            const workCount = deliverable.promoterWork?.length || 0;

            return (
              <div
                key={deliverable.id || index}
                className="bg-orange-50 p-3 rounded-lg border border-orange-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h5 className="text-xs font-medium text-orange-900 mb-1">
                      {deliverable.deliverable.replace(/_/g, " ")}
                    </h5>
                    <div className="flex items-center space-x-2 text-xs text-orange-700">
                      <span>
                        Created:{" "}
                        {new Date(deliverable.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>
                        Updated:{" "}
                        {new Date(deliverable.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      deliverable.isFinished
                        ? "bg-green-100 text-green-800"
                        : deliverable.isSubmitted
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {deliverable.isFinished
                      ? "Done"
                      : deliverable.isSubmitted
                      ? "Review"
                      : "Pending"}
                  </span>
                </div>

                {/* Compact Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-orange-600">Progress</span>
                    <span className="text-xs text-orange-600 font-medium">
                      {completionPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${
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

                {/* Work Submissions - Compact */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-orange-700">
                    <span className="font-medium">Work:</span>
                    <span className="bg-orange-100 px-2 py-1 rounded-full">
                      {workCount} item{workCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {workCount > 0 && (
                    <button className="text-orange-600 hover:text-orange-800 underline">
                      View
                    </button>
                  )}
                </div>

                {/* Work Items Preview - Very Compact */}
                {workCount > 0 && (
                  <div className="mt-2 pt-2 border-t border-orange-200">
                    <div className="space-y-1">
                      {deliverable.promoterWork
                        ?.slice(0, 2)
                        .map((work, workIndex) => (
                          <div
                            key={work.id || workIndex}
                            className="flex items-center space-x-2 text-xs text-orange-700"
                          >
                            <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                            <span className="flex-1 truncate">
                              {work.description || "Work submission"}
                            </span>
                            <span className="text-orange-500">
                              {new Date(work.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      {workCount > 2 && (
                        <div className="text-xs text-orange-600 pl-3">
                          +{workCount - 2} more
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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Performance</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Live</span>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {renderPerformanceStats()}
      </div>

      {/* Tracking Link */}
      {renderTrackingSection()}

      {/* Consultant Performance Tools */}
      {renderConsultantDeliverables()}

      {/* Seller Performance Tools */}
      {renderSellerDeliverables()}

      {/* Copy Success Toast */}
      {showCopiedToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm">Link copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  );
}
