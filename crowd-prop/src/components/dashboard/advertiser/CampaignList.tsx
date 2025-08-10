"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  UserCheck,
  Edit,
  Play,
  CheckCircle,
  Search,
  AlertCircle,
  X,
  Check,
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

  const getStatusProgress = (currentStatus: AdvertiserCampaignStatus, isPublic: boolean = true) => {
    // Define the base flow
    const baseStatuses = [
      {
        key: AdvertiserCampaignStatus.PENDING_PROMOTER,
        label: "Waiting Applicants",
        icon: AlertCircle,
      },
      {
        key: AdvertiserCampaignStatus.ONGOING,
        label: "Ongoing",
        icon: Play,
      },
      {
        key: AdvertiserCampaignStatus.COMPLETED,
        label: "Completed",
        icon: CheckCircle,
      },
    ];

    // For private campaigns, insert REVIEWING_APPLICATIONS between PENDING and ONGOING
    const statuses = isPublic 
      ? baseStatuses 
      : [
          baseStatuses[0], // PENDING_PROMOTER
          {
            key: AdvertiserCampaignStatus.REVIEWING_APPLICATIONS,
            label: "Reviewing Applications",
            icon: Search,
          },
          baseStatuses[1], // ONGOING
          baseStatuses[2], // COMPLETED
        ];

    const currentIndex = statuses.findIndex(status => status.key === currentStatus);

    return (
      <div className="flex items-center w-full">
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <div key={status.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                  title={`${status.label} - ${status.key.replace(/_/g, " ")}`}
                >
                  <Icon className="h-3 w-3" />
                </div>
                <span
                  className={`text-xs mt-1 font-medium text-center whitespace-nowrap ${
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {status.label}
                </span>
              </div>
              {index < statuses.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-all ${
                    isCompleted ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
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
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {campaign.title}
                      </h3>
                      <span className={getTypeBadge(campaign.type)}>
                        {campaign.type}
                      </span>
                    </div>
                    
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
                        <div className="flex flex-wrap gap-2">
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
                                className="flex items-center space-x-2 bg-gray-50 rounded-md px-3 py-2 border border-gray-200"
                              >
                                <span className="text-xs font-medium text-gray-700">
                                  {deliverable.deliverable.replace(/_/g, " ")}
                                </span>
                                {deliverable.isFinished ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <X className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                    {/* Visibility campaigns - show active promoters count */}
                    {campaign.type === CampaignType.VISIBILITY && chosenPromotersArray.length > 0 && (
                      <div className="mb-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Active Promoters
                              </p>
                              <p className="text-xs text-gray-600">
                                {chosenPromotersArray.length} promoter{chosenPromotersArray.length !== 1 ? 's' : ''} working
                              </p>
                            </div>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            {chosenPromotersArray.length}
                          </span>
                        </div>
                      </div>
                    )}{" "}
                    {/* Private Campaign State Management */}
                    {campaign.campaign.type !== CampaignType.VISIBILITY && (
                      <div className="mb-4 pt-2 border-t border-gray-100">
                        {(() => {
                          const chosenPromoter = chosenPromotersArray[0];
                          const pendingApplications =
                            campaign.applicants?.filter(
                              (app) => app.applicationStatus === "PENDING"
                            ) || [];

                          if (chosenPromoter) {
                            // Show selected promoter status
                            return (
                              <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-3 py-1">
                                <UserCheck className="h-3 w-3 text-blue-600" />
                                <span className="text-xs font-medium text-blue-700">Promoter Selected</span>
                              </div>
                            );
                          } else if (pendingApplications.length > 0) {
                            // Show applications notification - compact badge style
                            return (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewApplications(campaign);
                                }}
                                className="inline-flex items-center space-x-2 bg-amber-100 hover:bg-amber-200 rounded-full px-3 py-1 transition-colors"
                              >
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium text-amber-700">
                                  {pendingApplications.length} pending application
                                </span>
                              </button>
                            );
                          } else {
                            // No applications yet - minimal indicator
                            return (
                              <span className="inline-flex items-center space-x-1 text-xs text-gray-500">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <span>Waiting for applications</span>
                              </span>
                            );
                          }
                        })()}
                      </div>
                    )}{" "}
                    
                    {/* Status Progress Indicator */}
                    <div className="mb-3">
                      <div className="w-full">
                        {getStatusProgress(campaign.status, campaign.campaign.isPublic)}
                      </div>
                    </div>
                    
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
