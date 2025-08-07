"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CampaignAdvertiser,
  PromoterApplicationInfo,
} from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType } from "@/app/enums/campaign-type";
import { ADVERTISER_CAMPAIGN_MOCKS } from "@/app/mocks/advertiser-campaign-mock";
import { useAdvertiserCampaigns } from "@/hooks/useAdvertiserCampaigns";
import ApplicationReviewModal from "./ApplicationReviewModal";
import {
  Eye,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  MessageCircle,
  ExternalLink,
  UserCheck,
  Clock,
  Edit,
} from "lucide-react";
import { AdvertiserCampaignStatus } from "@/app/interfaces/dashboard/advertiser-dashboard";

interface CampaignListProps {
  campaigns: CampaignAdvertiser[];
}

export default function CampaignList({ campaigns }: CampaignListProps) {
  const router = useRouter();
  const { reviewApplication } = useAdvertiserCampaigns();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    campaign: CampaignAdvertiser | null;
    applications: PromoterApplicationInfo[];
  }>({
    isOpen: false,
    campaign: null,
    applications: [],
  });

  const handleUserClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent campaign card click
    router.push(`/user/${userId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const getStatusBadge = (status: AdvertiserCampaignStatus) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case AdvertiserCampaignStatus.ONGOING:
        return `${baseClasses} bg-green-100 text-green-800`;
      case AdvertiserCampaignStatus.COMPLETED:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case AdvertiserCampaignStatus.WAITING_FOR_APPLICATIONS:
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case AdvertiserCampaignStatus.REVIEWING_APPLICATIONS:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case AdvertiserCampaignStatus.PENDING_PROMOTER:
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeBadge = (type: CampaignType) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (type) {
      case CampaignType.VISIBILITY:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case CampaignType.CONSULTANT:
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case CampaignType.SALESMAN:
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case CampaignType.SELLER:
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getProgressPercentage = (spent: number, total: number) => {
    return Math.min((spent / total) * 100, 100);
  };

  const getCampaignIcon = (type: CampaignType) => {
    switch (type) {
      case CampaignType.VISIBILITY:
        return Eye;
      case CampaignType.CONSULTANT:
        return Users;
      case CampaignType.SALESMAN:
        return DollarSign;
      case CampaignType.SELLER:
        return BarChart3;
      default:
        return Eye;
    }
  };
  const handleViewApplications = async (campaign: CampaignAdvertiser) => {
    try {
      // Use the applicants from the campaign object directly
      const applications = campaign.applicants || [];
      setModalState({
        isOpen: true,
        campaign,
        applications,
      });
    } catch (error) {
      console.error("Error loading applications:", error);
      // Fallback to mock data if API fails for now
      const applications =
        ADVERTISER_CAMPAIGN_MOCKS.helpers.getApplicationsByCampaignId(
          campaign.id
        );
      setModalState({
        isOpen: true,
        campaign,
        applications,
      });
    }
  };
  const handleAcceptApplication = async (applicationId: string) => {
    if (!modalState.campaign) return;

    try {
      const result = await reviewApplication({
        campaignId: modalState.campaign.id,
        applicationId,
        action: "ACCEPTED",
      });

      if (result.success) {
        // Remove the application from local state since it was accepted
        setModalState((prev) => ({
          ...prev,
          applications: prev.applications.filter(
            (app) => app.promoter.id !== applicationId
          ),
        }));
      }
    } catch (error) {
      console.error("Error accepting application:", error);
      // For now, just close the modal on error
      setModalState((prev) => ({ ...prev, isOpen: false }));
    }
  };
  const handleRejectApplication = async (applicationId: string) => {
    if (!modalState.campaign) return;

    try {
      const result = await reviewApplication({
        campaignId: modalState.campaign.id,
        applicationId,
        action: "REJECTED",
      });

      if (result.success) {
        // Remove the application from local state since it was rejected
        setModalState((prev) => ({
          ...prev,
          applications: prev.applications.filter(
            (app) => app.promoter.id !== applicationId
          ),
        }));
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      // Fallback to removing from local state
      setModalState((prev) => ({
        ...prev,
        applications: prev.applications.filter(
          (app) => app.promoter.id !== applicationId
        ),
      }));
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      campaign: null,
      applications: [],
    });
  };

  const handleSendMessage = (campaign: CampaignAdvertiser) => {
    console.log("Send message for campaign:", campaign.id);
    // TODO: Open message modal or navigate to messages
  };
  const handleJoinDiscord = (campaign: CampaignAdvertiser) => {
    if (campaign.campaign.discordInviteLink) {
      window.open(campaign.campaign.discordInviteLink, "_blank");
    }
  };

  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No campaigns found
        </h3>
        <p className="text-gray-500 mb-4">
          No campaigns match your current filters. Try adjusting your search
          criteria.
        </p>
        <button
          onClick={() => router.push("/dashboard/campaigns/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Campaign
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {campaigns.map((campaign) => {
          const Icon = getCampaignIcon(campaign.type);
          const progressPercentage = getProgressPercentage(
            campaign.campaign.spentBudget,
            campaign.campaign.budgetAllocated
          );

          // Handle both single object and array for chosenPromoters
          const chosenPromotersArray = Array.isArray(campaign.chosenPromoters)
            ? campaign.chosenPromoters
            : campaign.chosenPromoters
            ? [campaign.chosenPromoters]
            : [];

          return (
            <div
              key={campaign.id}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer relative"
              onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
            >
              <div className="flex items-start justify-between">
                {/* Campaign Info */}
                <div className="flex items-start space-x-4 flex-1">
                  {/* Icon */}
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {campaign.title}
                      </h3>
                      <span className={getStatusBadge(campaign.status)}>
                        {campaign.status.replace(/_/g, " ")}
                      </span>
                      <span className={getTypeBadge(campaign.type)}>
                        {campaign.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {campaign.description}
                    </p>{" "}
                    {/* Campaign Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {campaign.type === CampaignType.SALESMAN ? (
                        // For SALESMAN campaigns, show promo code, commission, and current sales
                        <>
                          <div>
                            <p className="text-xs text-gray-500">Promo Code</p>
                            <p className="text-sm font-medium text-gray-900">
                              {campaign.campaign.type === CampaignType.SALESMAN
                                ? campaign.campaign.codePrefix || "Not Set"
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Commission</p>
                            <p className="text-sm font-medium text-gray-900">
                              {campaign.campaign.type === CampaignType.SALESMAN
                                ? `${campaign.campaign.commissionPerSale}%`
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Current Sales
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {campaign.performance.totalSalesMade || 0}
                            </p>
                          </div>
                        </>
                      ) : (
                        // For other campaign types, show budget and spent
                        <>
                          <div>
                            <p className="text-xs text-gray-500">Budget</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(
                                campaign.campaign.budgetAllocated
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Spent</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(campaign.campaign.spentBudget)}
                            </p>
                          </div>
                        </>
                      )}
                      {/* Visibility campaigns - show views instead of promoters in main metrics */}
                      {campaign.type === CampaignType.VISIBILITY ? (
                        <div>
                          <p className="text-xs text-gray-500">Views</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatNumber(
                              campaign.campaign.type === CampaignType.VISIBILITY
                                ? campaign.campaign.currentViews
                                : 0
                            )}
                          </p>
                        </div>
                      ) : (
                        // Non-visibility campaigns logic
                        (() => {
                          // For private campaigns (consultant, salesman, seller), don't show promoter count
                          if (!campaign.campaign.isPublic) {
                            // For private campaigns with chosen promoter, show campaign-specific metric
                            if (chosenPromotersArray.length > 0) {
                              const chosenPromoter = chosenPromotersArray[0];
                              if (campaign.type === CampaignType.CONSULTANT) {
                                return (
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Meetings
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {chosenPromoter.numberMeetingsDone || 0}
                                      /8
                                    </p>
                                  </div>
                                );
                              } else if (
                                campaign.type === CampaignType.SALESMAN
                              ) {
                                return (
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Sales
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {campaign.performance.totalSalesMade || 0}
                                    </p>
                                  </div>
                                );
                              } else if (
                                campaign.type === CampaignType.SELLER
                              ) {
                                return (
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Progress
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                      In Progress
                                    </p>
                                  </div>
                                );
                              }
                            }
                            // For private campaigns without chosen promoter, return empty div
                            return <div></div>;
                          } else {
                            // For public campaigns, show applicants
                            const totalApplicants =
                              campaign.applicants?.length || 0;
                            if (totalApplicants > 0) {
                              // Make it clickable if there are applicants
                              return (
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Applicants
                                  </p>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewApplications(campaign);
                                    }}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                  >
                                    {totalApplicants}
                                  </button>
                                </div>
                              );
                            } else {
                              // Show regular count if no applicants
                              return (
                                <div>
                                  <p className="text-xs text-gray-500">
                                    Applicants
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {totalApplicants}
                                  </p>
                                </div>
                              );
                            }
                          }
                        })()
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Deadline</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(campaign.campaign.deadline)}
                        </p>
                      </div>{" "}
                    </div>
                    {/* Deliverables - For CONSULTANT and SELLER */}
                    {(campaign.type === CampaignType.CONSULTANT ||
                      campaign.type === CampaignType.SELLER) && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Deliverables:
                        </p>
                        <div className="space-y-2">
                          {(() => {
                            const deliverables =
                              campaign.type === CampaignType.CONSULTANT
                                ? campaign.campaign.type ===
                                  CampaignType.CONSULTANT
                                  ? campaign.campaign.expectedDeliverables || []
                                  : []
                                : campaign.campaign.type === CampaignType.SELLER
                                ? campaign.campaign.deliverables || []
                                : [];

                            return deliverables.map((deliverable, index) => (
                              <div
                                key={deliverable.id || index}
                                className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {deliverable.deliverable.replace(/_/g, " ")}
                                  </span>
                                  <div className="flex items-center space-x-2 text-xs">
                                    <span
                                      className={`px-2 py-0.5 rounded-full font-medium ${
                                        deliverable.isSubmitted
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {deliverable.isSubmitted
                                        ? "Submitted"
                                        : "Pending"}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded-full font-medium ${
                                        deliverable.isFinished
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {deliverable.isFinished
                                        ? "Finished"
                                        : "In Progress"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-600">
                                  <span className="flex items-center space-x-1">
                                    <span>
                                      {deliverable.promoterWork?.length || 0}
                                    </span>
                                    <span>
                                      work
                                      {(deliverable.promoterWork?.length ||
                                        0) !== 1
                                        ? "s"
                                        : ""}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                    {/* Visibility campaigns - organized additional metrics */}
                    {campaign.type === CampaignType.VISIBILITY && (
                      <div className="mb-4 pt-3 border-t border-gray-100">
                        {/* Campaign Performance */}
                        <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-6">
                          <div className="flex items-center mb-4">
                            <Eye className="h-5 w-5 text-blue-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Campaign Performance
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm text-gray-500">
                                Cost Per 100 Views
                              </p>
                              <p className="mt-1 text-2xl font-bold text-blue-600">
                                $
                                {campaign.campaign.type ===
                                  CampaignType.VISIBILITY &&
                                campaign.campaign.cpv
                                  ? Number(campaign.campaign.cpv).toFixed(2)
                                  : "0.00"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Target Views
                              </p>
                              <p className="mt-1 text-2xl font-bold text-blue-600">
                                {campaign.campaign.type ===
                                  CampaignType.VISIBILITY &&
                                campaign.campaign.maxViews
                                  ? formatNumber(campaign.campaign.maxViews)
                                  : "Unlimited"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Chosen Promoters (Visibility Campaigns Only) */}
                        {(() => {
                          if (chosenPromotersArray.length === 0) return null;

                          return (
                            <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-6">
                              <div className="flex items-center mb-4">
                                <div className="flex-shrink-0 bg-blue-50 p-3 rounded-full">
                                  <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="ml-3 text-lg font-semibold text-gray-900">
                                  {campaign.campaign.isPublic
                                    ? `Active Promoters (${chosenPromotersArray.length})`
                                    : "Selected Promoter"}
                                </h3>
                              </div>

                              <div className="space-y-4">
                                {chosenPromotersArray.map(
                                  (chosenPromoter, index) => (
                                    <div
                                      key={chosenPromoter.promoter.id || index}
                                      className={`${
                                        index > 0
                                          ? "border-t border-gray-100 pt-4"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                          <button
                                            onClick={(e) =>
                                              handleUserClick(
                                                chosenPromoter.promoter.id,
                                                e
                                              )
                                            }
                                            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer"
                                            title={`View ${chosenPromoter.promoter.name}'s profile`}
                                          >
                                            {chosenPromoter.promoter
                                              .avatarUrl ? (
                                              <Image
                                                src={
                                                  chosenPromoter.promoter
                                                    .avatarUrl
                                                }
                                                alt={
                                                  chosenPromoter.promoter.name
                                                }
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover rounded-full"
                                              />
                                            ) : (
                                              chosenPromoter.promoter.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                            )}
                                          </button>
                                          <div>
                                            <div className="flex items-center space-x-2">
                                              <p className="text-base font-medium text-gray-900">
                                                {chosenPromoter.promoter.name}
                                              </p>
                                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {chosenPromoter.status ||
                                                  "Active"}
                                              </span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">
                                              Joined{" "}
                                              {chosenPromoter.joinedAt
                                                ? formatDate(
                                                    chosenPromoter.joinedAt
                                                  )
                                                : "Recently"}
                                            </p>
                                            {/* Show earnings and views for public campaigns */}
                                            {campaign.campaign.isPublic && (
                                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                                                <span>
                                                  Views:{" "}
                                                  {formatNumber(
                                                    chosenPromoter.viewsGenerated ||
                                                      0
                                                  )}
                                                </span>
                                                <span>
                                                  Earnings:{" "}
                                                  {formatCurrency(
                                                    Number(
                                                      chosenPromoter.earnings
                                                    ) || 0
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (chosenPromoter.promoter?.id) {
                                              router.push(
                                                `/user/${chosenPromoter.promoter.id}`
                                              );
                                            }
                                          }}
                                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          View Details
                                        </button>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}{" "}
                    {/* Private Campaign State Management */}
                    {campaign.campaign.type !== CampaignType.VISIBILITY && (
                      <div className="mb-4 pt-2 border-t border-gray-100">
                        {(() => {
                          const chosenPromoter = chosenPromotersArray[0]; // For private campaigns, there should only be one

                          const pendingApplications =
                            campaign.applicants?.filter(
                              (app) => app.applicationStatus === "PENDING"
                            ) || [];

                          if (chosenPromoter) {
                            // Show selected promoter info with campaign-specific details
                            return (
                              <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3 flex-1">
                                    <button
                                      onClick={(e) =>
                                        handleUserClick(
                                          chosenPromoter.promoter.id,
                                          e
                                        )
                                      }
                                      className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer"
                                      title={`View ${chosenPromoter.promoter.name}'s profile`}
                                    >
                                      {chosenPromoter.promoter.avatarUrl ? (
                                        <Image
                                          src={
                                            chosenPromoter.promoter.avatarUrl
                                          }
                                          alt={chosenPromoter.promoter.name}
                                          width={40}
                                          height={40}
                                          className="w-full h-full object-cover rounded-full"
                                        />
                                      ) : (
                                        <UserCheck className="h-5 w-5 text-blue-600" />
                                      )}
                                    </button>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <p className="text-sm font-medium text-gray-900">
                                          {chosenPromoter.promoter.name}
                                        </p>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                          Active
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600 mb-2">
                                        Joined{" "}
                                        {chosenPromoter.joinedAt
                                          ? formatDate(chosenPromoter.joinedAt)
                                          : "Recently"}
                                      </p>

                                      {/* Campaign-specific information */}
                                      {campaign.type ===
                                        CampaignType.CONSULTANT && (
                                        <div className="bg-white rounded-md p-3 mb-2 border border-gray-200">
                                          <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                              <span className="text-gray-600 font-medium">
                                                Meetings:
                                              </span>
                                              <span className="ml-2 font-semibold text-gray-900">
                                                {chosenPromoter.numberMeetingsDone ||
                                                  0}
                                                /8
                                              </span>
                                            </div>
                                            <div>
                                              <span className="text-gray-600 font-medium">
                                                Next:
                                              </span>
                                              <span className="ml-2 font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs">
                                                TBD
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {campaign.type ===
                                        CampaignType.SALESMAN && (
                                        <div className="bg-white rounded p-2 mb-2">
                                          <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                              <span className="text-gray-500">
                                                Sales:
                                              </span>
                                              <span className="ml-1 font-medium">
                                                {campaign.performance
                                                  .totalSalesMade || 0}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="text-gray-500">
                                                Commission:
                                              </span>
                                              <span className="ml-1 font-medium">
                                                {formatCurrency(
                                                  Number(
                                                    chosenPromoter.earnings
                                                  ) || 0
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {campaign.type ===
                                        CampaignType.SELLER && (
                                        <div className="bg-white rounded p-2 mb-2">
                                          <div className="text-xs">
                                            <div className="mb-1">
                                              <span className="text-gray-500">
                                                Progress:
                                              </span>
                                              <span className="ml-1 font-medium">
                                                In Progress
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2 ml-4">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSendMessage(campaign);
                                      }}
                                      className="flex items-center space-x-1 px-3 py-1 bg-white text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors text-xs"
                                    >
                                      <MessageCircle className="h-3 w-3" />
                                      <span>Message</span>
                                    </button>
                                    {campaign.campaign.discordInviteLink && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleJoinDiscord(campaign);
                                        }}
                                        className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        <span>Join Discord</span>
                                      </button>
                                    )}
                                    {campaign.campaign.discordThreadUrl && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(campaign.campaign.discordThreadUrl, "_blank");
                                        }}
                                        className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-xs"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        <span>Discord Thread</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          } else if (pendingApplications.length > 0) {
                            // Show applications to review
                            return (
                              <div className="bg-amber-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                                      <Clock className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {pendingApplications.length} Application
                                        {pendingApplications.length !== 1
                                          ? "s"
                                          : ""}{" "}
                                        Pending
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Review and select a promoter for this
                                        campaign
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewApplications(campaign);
                                    }}
                                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm font-medium"
                                  >
                                    Review Applications
                                  </button>
                                </div>
                              </div>
                            );
                          } else {
                            // No applications yet
                            return (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <Users className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      Waiting for Applications
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      No promoters have applied yet
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    )}{" "}
                    {/* Progress Bar - Hide for SALESMAN campaigns */}
                    {campaign.type !== CampaignType.SALESMAN && (
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">
                            Budget Usage
                          </span>
                          <span className="text-xs text-gray-700">
                            {progressPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              progressPercentage > 80
                                ? "bg-red-500"
                                : progressPercentage > 60
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Created {formatDate(campaign.campaign.createdAt)}
                          </span>
                        </span>
                        {campaign.campaign.isPublic && (
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Public
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>{" "}
                {/* Edit Icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    // TODO: Add edit functionality
                    console.log("Edit campaign:", campaign.id);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Campaign"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Review Modal */}
      <ApplicationReviewModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        campaignTitle={modalState.campaign?.title || ""}
        applications={modalState.applications}
        onAcceptApplication={handleAcceptApplication}
        onRejectApplication={handleRejectApplication}
      />
    </div>
  );
}
