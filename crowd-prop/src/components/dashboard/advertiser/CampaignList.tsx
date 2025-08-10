"use client";

import { useState, Fragment } from "react";
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
  Check,
  Bell,
  Clock,
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

  const getTypeBadge = (type: CampaignType) => {
    const baseClasses = "px-2 py-1 rounded-md text-xs font-medium";
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

  const getCampaignTypeColor = (type: CampaignType) => {
    switch (type) {
      case CampaignType.VISIBILITY:
        return "bg-blue-500";
      case CampaignType.CONSULTANT:
        return "bg-purple-500";
      case CampaignType.SALESMAN:
        return "bg-orange-500";
      case CampaignType.SELLER:
        return "bg-green-500";
      default:
        return "bg-gray-500";
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
    <Fragment>
      <div className="space-y-6">
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
              className="group bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
            >
              {/* Header Section */}
              <div className="relative">
                {/* Status Banner */}
                <div className={`h-1 w-full ${getCampaignTypeColor(campaign.type)}`} />
                
                <div className="p-4">
                  {/* Title Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="p-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 mb-0.5 truncate">
                          {campaign.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={getTypeBadge(campaign.type)}>
                            {campaign.type}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Due {formatDate(campaign.campaign.deadline)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Edit campaign:", campaign.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit Campaign"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Status Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">Campaign Progress</span>
                      <span className="text-xs text-gray-500">
                        {(() => {
                          const statusLabels = {
                            [AdvertiserCampaignStatus.PENDING_PROMOTER]: "Waiting for Applicants",
                            [AdvertiserCampaignStatus.REVIEWING_APPLICATIONS]: "Reviewing Applications", 
                            [AdvertiserCampaignStatus.ONGOING]: "In Progress",
                            [AdvertiserCampaignStatus.COMPLETED]: "Completed"
                          };
                          return statusLabels[campaign.status] || "Unknown";
                        })()}
                      </span>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-[75%] flex items-center space-x-1">
                      {(() => {
                        const statuses = campaign.campaign.isPublic 
                          ? [
                              { key: AdvertiserCampaignStatus.PENDING_PROMOTER, label: "Waiting", icon: AlertCircle },
                              { key: AdvertiserCampaignStatus.ONGOING, label: "Ongoing", icon: Play },
                              { key: AdvertiserCampaignStatus.COMPLETED, label: "Completed", icon: CheckCircle },
                            ]
                          : [
                              { key: AdvertiserCampaignStatus.PENDING_PROMOTER, label: "Waiting", icon: AlertCircle },
                              { key: AdvertiserCampaignStatus.REVIEWING_APPLICATIONS, label: "Review", icon: Search },
                              { key: AdvertiserCampaignStatus.ONGOING, label: "Ongoing", icon: Play },
                              { key: AdvertiserCampaignStatus.COMPLETED, label: "Completed", icon: CheckCircle },
                            ];
                        
                        const currentIndex = statuses.findIndex(status => status.key === campaign.status);
                        
                        return statuses.map((status, index) => {
                          const Icon = status.icon;
                          const isActive = index === currentIndex;
                          const isCompleted = index < currentIndex;
                          
                          return (
                            <div key={status.key} className="flex items-center flex-1">
                              <div className="flex flex-col items-center flex-1">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center mb-0.5 transition-all ${
                                    isActive
                                      ? "bg-blue-600 text-white shadow-lg"
                                      : isCompleted
                                      ? "bg-green-600 text-white"
                                      : "bg-gray-200 text-gray-400"
                                  }`}
                                >
                                  <Icon className="h-2.5 w-2.5" />
                                </div>
                                <span
                                  className={`text-xs font-medium ${
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
                                  className={`flex-1 h-0.5 mx-1 rounded-full transition-all ${
                                    isCompleted ? "bg-green-600" : "bg-gray-200"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        });
                      })()}
                      </div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {campaign.type === CampaignType.SALESMAN ? (
                      // SALESMAN campaigns
                      <>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center space-x-1.5 mb-0.5">
                            <div className="p-1 bg-gray-200 rounded-md">
                              <DollarSign className="h-3 w-3 text-gray-600" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Promo Code</span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {campaign.campaign.type === CampaignType.SALESMAN
                              ? campaign.campaign.codePrefix || "Not Set"
                              : "N/A"}
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center space-x-1.5 mb-0.5">
                            <div className="p-1 bg-blue-200 rounded-md">
                              <BarChart3 className="h-3 w-3 text-blue-600" />
                            </div>
                            <span className="text-xs font-medium text-blue-700">Commission</span>
                          </div>
                          <p className="text-sm font-bold text-blue-900">
                            {campaign.campaign.type === CampaignType.SALESMAN
                              ? `${campaign.campaign.commissionPerSale}%`
                              : "N/A"}
                          </p>
                        </div>
                      </>
                    ) : (
                      // Other campaign types
                      <>
                        {/* Budget Circle Chart */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-3 border border-green-200">
                          {(() => {
                            const budget = campaign.campaign.budgetAllocated;
                            const spent = campaign.campaign.spentBudget;
                            const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                            const circumference = 2 * Math.PI * 16;
                            const strokeDashoffset = circumference - (percentage / 100) * circumference;
                            
                            return (
                              <div className="flex items-center space-x-2">
                                <div className="relative">
                                  <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 40 40">
                                    <circle
                                      cx="20"
                                      cy="20"
                                      r="16"
                                      stroke="#d1fae5"
                                      strokeWidth="4"
                                      fill="none"
                                    />
                                    <circle
                                      cx="20"
                                      cy="20"
                                      r="16"
                                      stroke={percentage > 90 ? "#ef4444" : percentage > 70 ? "#f59e0b" : "#10b981"}
                                      strokeWidth="4"
                                      fill="none"
                                      strokeDasharray={circumference}
                                      strokeDashoffset={strokeDashoffset}
                                      strokeLinecap="round"
                                      className="transition-all duration-500"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-bold text-green-700">
                                      {Math.round(percentage)}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-green-700 mb-0.5">Budget Usage</p>
                                  <p className="text-xs text-green-600">
                                    {formatCurrency(spent)} spent
                                  </p>
                                  <p className="text-xs text-green-500">
                                    of {formatCurrency(budget)} total
                                  </p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        
                        {/* Secondary Metric */}
                        {campaign.type === CampaignType.VISIBILITY ? (
                          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg p-3 border border-purple-200">
                            <div className="flex items-center space-x-1.5 mb-0.5">
                              <div className="p-1 bg-purple-200 rounded-md">
                                <Eye className="h-3 w-3 text-purple-600" />
                              </div>
                              <span className="text-xs font-medium text-purple-700">Views</span>
                            </div>
                            <p className="text-sm font-bold text-purple-900">
                              {formatNumber(
                                campaign.campaign.type === CampaignType.VISIBILITY
                                  ? campaign.campaign.currentViews
                                  : 0
                              )}
                            </p>
                          </div>
                        ) : (
                          (() => {
                            if (!campaign.campaign.isPublic) {
                              if (chosenPromotersArray.length > 0) {
                                const chosenPromoter = chosenPromotersArray[0];
                                if (campaign.type === CampaignType.CONSULTANT) {
                                  return (
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-3 border border-blue-200">
                                      <div className="flex items-center space-x-1.5 mb-0.5">
                                        <div className="p-1 bg-blue-200 rounded-md">
                                          <Users className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <span className="text-xs font-medium text-blue-700">Meetings</span>
                                      </div>
                                      <p className="text-sm font-bold text-blue-900">
                                        {chosenPromoter.numberMeetingsDone || 0}/8
                                      </p>
                                    </div>
                                  );
                                }
                              }
                              return (
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">No metrics available</span>
                                </div>
                              );
                            } else {
                              const totalApplicants = campaign.applicants?.length || 0;
                              return (
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-lg p-3 border border-indigo-200">
                                  <div className="flex items-center space-x-1.5 mb-0.5">
                                    <div className="p-1 bg-indigo-200 rounded-md">
                                      <Users className="h-3 w-3 text-indigo-600" />
                                    </div>
                                    <span className="text-xs font-medium text-indigo-700">Applicants</span>
                                  </div>
                                  <p className="text-sm font-bold text-indigo-900">
                                    {totalApplicants}
                                  </p>
                                </div>
                              );
                            }
                          })()
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-3">
                  {/* Deliverables for CONSULTANT and SELLER */}
                  {(campaign.type === CampaignType.CONSULTANT ||
                    campaign.type === CampaignType.SELLER) && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Deliverables</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(() => {
                          const deliverables =
                            campaign.type === CampaignType.CONSULTANT
                              ? campaign.campaign.type === CampaignType.CONSULTANT
                                ? campaign.campaign.expectedDeliverables || []
                                : []
                              : campaign.campaign.type === CampaignType.SELLER
                              ? campaign.campaign.deliverables || []
                              : [];

                          return deliverables.map((deliverable, index) => (
                            <div
                              key={deliverable.id || index}
                              className={`flex items-center space-x-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                                deliverable.isFinished
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : "bg-orange-100 text-orange-800 border border-orange-200"
                              }`}
                            >
                              <span>{deliverable.deliverable.replace(/_/g, " ")}</span>
                              {deliverable.isFinished ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Application Status */}
                  {!campaign.campaign.isPublic && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">Promoters</span>
                      {(() => {
                        const chosenPromoter = chosenPromotersArray[0];
                        const pendingApplications =
                          campaign.applicants?.filter(
                            (app) => app.applicationStatus === "PENDING"
                          ) || [];

                        if (chosenPromoter) {
                          return (
                            <span className="inline-flex items-center space-x-1.5 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              <UserCheck className="h-3 w-3" />
                              <span>Promoter Selected</span>
                            </span>
                          );
                        } else if (pendingApplications.length > 0) {
                          return (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewApplications(campaign);
                              }}
                              className="inline-flex items-center space-x-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-medium transition-colors"
                            >
                              <Bell className="h-3 w-3" />
                              <span>{pendingApplications.length} pending applications</span>
                            </button>
                          );
                        } else {
                          return (
                            <span className="inline-flex items-center space-x-1.5 text-gray-500 text-xs">
                              <Clock className="h-3 w-3" />
                              <span>Waiting for applications</span>
                            </span>
                          );
                        }
                      })()}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      Created {formatDate(campaign.campaign.createdAt)}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {campaign.campaign.isPublic && (
                        <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                          Public
                        </span>
                      )}
                      {campaign.type === CampaignType.SALESMAN && (
                        <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                          {campaign.performance.totalSalesMade || 0} sales
                        </span>
                      )}
                    </div>
                  </div>
                </div>
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
    </Fragment>
  );
}
