"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/router";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  TagIcon,
  StarIcon,
  CalendarIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  ArrowTopRightOnSquareIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import {
  TYPE_OPTIONS,
  SORT_OPTIONS,
  getTypeColor,
  formatBudgetInfo,
  getDaysLeft,
} from "./promoter-explore-content.constants";
import { formatDate } from "@/utils/date";
import { CampaignType } from "@/app/enums/campaign-type";
import { CampaignUnion } from "@/app/interfaces/campaign/explore-campaign";
import { promoterService } from "@/services/promoter.service";
import { useExploreCampaigns } from "@/hooks/useExploreCampaigns";

// Application Modal Component
interface ApplicationModalProps {
  campaign: CampaignUnion;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
}

function ApplicationModal({
  campaign,
  onClose,
  onSubmit,
}: ApplicationModalProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(message);
      setMessage("");
    } catch (error) {
      console.error("Failed to submit application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Apply to Campaign
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-3">
            <h3 className="font-medium text-gray-900 text-sm">{campaign.title}</h3>
            <p className="text-xs text-gray-600">
              {campaign.advertiser.companyName}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="application-message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Application Message
              </label>
              <textarea
                id="application-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the advertiser why you're perfect for this campaign..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-3 w-3" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper function to get all requirements for a campaign
const getAllRequirements = (campaign: CampaignUnion): string[] => {
  const requirements: string[] = [];

  // Add general requirements
  if (campaign.requirements) {
    requirements.push(...campaign.requirements);
  }

  // Add campaign-specific requirements
  if ("minFollowers" in campaign && campaign.minFollowers) {
    requirements.push(
      `Minimum ${campaign.minFollowers.toLocaleString()} followers required`
    );
  }

  if (
    campaign.type === CampaignType.CONSULTANT &&
    "expertiseRequired" in campaign &&
    campaign.expertiseRequired
  ) {
    requirements.push(`Expertise required: ${campaign.expertiseRequired}`);
  }

  if (
    campaign.type === CampaignType.SELLER &&
    "needMeeting" in campaign &&
    campaign.needMeeting
  ) {
    requirements.push("Meetings required");
  }

  return requirements;
};

export default function PromoterExploreContent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [acceptingContract, setAcceptingContract] = useState<string | null>(
    null
  );
  const [applicationModal, setApplicationModal] = useState<{
    isOpen: boolean;
    campaign: CampaignUnion | null;
  }>({ isOpen: false, campaign: null });

  // Notification state
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  }); // Use the hook to get campaigns data
  const { campaigns, loading, error, refetch } = useExploreCampaigns({
    searchTerm,
    typeFilter,
    sortBy,
  });
  const handleApplyClick = async (campaign: CampaignUnion) => {
    if (campaign.isPublic) {
      // Handle "Take Contract" for public campaigns
      setAcceptingContract(campaign.id);
      try {
        const response = await promoterService.acceptContract({
          campaignId: campaign.id,
        });

        console.log("Contract accepted successfully:", response);

        // Show success notification
        setNotification({
          isOpen: true,
          type: "success",
          title: "Contract Accepted!",
          message:
            response.message || "You have successfully joined this campaign.",
        });

        // Refresh campaigns to remove the accepted campaign
        await refetch();
      } catch (error) {
        console.error("Failed to accept contract:", error);

        // Show error notification
        setNotification({
          isOpen: true,
          type: "error",
          title: "Failed to Accept Contract",
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while accepting the contract. Please try again.",
        });
      } finally {
        setAcceptingContract(null);
      }
    } else {
      // Open application modal for private campaigns
      setApplicationModal({ isOpen: true, campaign });
    }
  };
  const handleApplicationSubmit = async (message: string) => {
    if (!applicationModal.campaign) return;

    try {
      const response = await promoterService.sendCampaignApplication({
        campaignId: applicationModal.campaign.id,
        applicationMessage: message,
      });

      console.log("Application submitted successfully:", response);

      // Close modal and show success message
      setApplicationModal({ isOpen: false, campaign: null });

      // Show success notification
      setNotification({
        isOpen: true,
        type: "success",
        title: "Application Submitted!",
        message:
          response.message ||
          "Your application has been submitted successfully.",
      });
    } catch (error) {
      console.error("Failed to submit application:", error);

      // Show error notification but keep modal open
      setNotification({
        isOpen: true,
        type: "error",
        title: "Failed to Submit Application",
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while submitting your application. Please try again.",
      });
    }
  };

  const handleCloseModal = () => {
    setApplicationModal({ isOpen: false, campaign: null });
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Explore Campaigns
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Discover new opportunities to earn money
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {campaigns.length} available
          </span>
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>
      {/* Error Message */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-amber-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <EyeIcon className="h-6 w-6 text-blue-500" />
            <div className="ml-2 text-black">
              <p className="text-xs text-gray-600">Visibility</p>
              <p className="text-lg font-semibold">
              {
                campaigns.filter(
                (c: CampaignUnion) => c.type === "VISIBILITY"
                ).length
              }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-6 w-6 text-orange-500" />
            <div className="ml-2 text-black">
              <p className="text-xs text-gray-600">Salesman</p>
              <p className="text-lg font-semibold">
                {
                  campaigns.filter((c: CampaignUnion) => c.type === "SALESMAN")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-6 w-6 text-purple-500" />
            <div className="ml-2 text-black">
              <p className="text-xs text-gray-600">Consultant</p>
              <p className="text-lg font-semibold">
                {
                  campaigns.filter(
                    (c: CampaignUnion) => c.type === "CONSULTANT"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TagIcon className="h-6 w-6 text-green-500" />
            <div className="ml-2 text-black">
              <p className="text-xs text-gray-600">Seller</p>
              <p className="text-lg font-semibold">
                {
                  campaigns.filter((c: CampaignUnion) => c.type === "SELLER")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns, companies, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
            >
              {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>{" "}
      {/* Campaigns Grid */}
      <div className="space-y-3">
        {campaigns.map((campaign) => {
          const getTypeColorBorder = (type: string) => {
            switch (type) {
              case "VISIBILITY":
                return "border-t-blue-500";
              case "CONSULTANT":
                return "border-t-purple-500";
              case "SELLER":
                return "border-t-green-500";
              case "SALESMAN":
                return "border-t-orange-500";
              default:
                return "border-t-gray-500";
            }
          };

          const getTypeIcon = (type: string) => {
            switch (type) {
              case "VISIBILITY":
                return <EyeIcon className="h-4 w-4 text-blue-600" />;
              case "CONSULTANT":
                return <BuildingOfficeIcon className="h-4 w-4 text-purple-600" />;
              case "SELLER":
                return <TagIcon className="h-4 w-4 text-green-600" />;
              case "SALESMAN":
                return <CurrencyDollarIcon className="h-4 w-4 text-orange-600" />;
              default:
                return <EyeIcon className="h-4 w-4 text-gray-600" />;
            }
          };

          return (
            <Link
              key={campaign.id}
              href={routes.dashboardExploreDetails(campaign.id)}
              className={`block bg-white rounded-lg shadow-sm border-t-4 transition-all hover:shadow-md hover:scale-[1.01] relative group border border-gray-200 ${getTypeColorBorder(
                campaign.type
              )} ${
                !campaign.isPublic ? "bg-amber-50/30 border-amber-200" : ""
              }`}
            >
              {/* External Link Icon */}
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowTopRightOnSquareIcon className="h-3 w-3 text-blue-600" />
              </div>

              <div className="p-4">
                {/* Header with Icon and Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Type Icon */}
                    <div className="mt-1">
                      {getTypeIcon(campaign.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {campaign.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(
                            campaign.type
                          )}`}
                        >
                          {campaign.type}
                        </span>
                        {!campaign.isPublic && (
                          <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            <LockClosedIcon className="h-3 w-3 text-amber-600" />
                            <span className="text-xs font-medium text-amber-700">
                              Private
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Company Info */}
                      <div className="flex items-center space-x-2 mb-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/user/${campaign.advertiser.id}`);
                          }}
                          className="hover:ring-2 hover:ring-blue-500 rounded transition-all"
                        >
                          {campaign.advertiser.profileUrl ? (
                            <Image 
                              src={campaign.advertiser.profileUrl} 
                              alt={campaign.advertiser.companyName}
                              width={24}
                              height={24}
                              className="rounded object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-xs font-medium">
                                {campaign.advertiser.companyName?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                          )}
                        </button>
                        <div>
                          <div className="text-xs font-medium text-gray-900 flex items-center">
                            {campaign.advertiser.companyName}
                            {campaign.advertiser.verified && (
                              <div className="ml-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-2 h-2 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">
                              {campaign.advertiser.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Days Left */}
                  <div className="text-right ml-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {getDaysLeft(campaign.deadline)} days
                    </div>
                  </div>
                </div>

                {/* Budget Section - Dual cards for Visibility, single card for others */}
                {campaign.type === 'VISIBILITY' ? (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {/* Per View Rate */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-2 py-1.5">
                      <div className="flex items-center space-x-1.5">
                        <div className="bg-blue-100 p-0.5 rounded-full">
                          <EyeIcon className="h-2.5 w-2.5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-600 font-medium">Per 100 Views</p>
                          <p className="text-sm font-bold text-blue-800">
                            ${Number(campaign.cpv).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Total Budget */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg px-2 py-1.5">
                      <div className="flex items-center space-x-1.5">
                        <div className="bg-emerald-100 p-0.5 rounded-full">
                          <CurrencyDollarIcon className="h-2.5 w-2.5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-emerald-600 font-medium">Total Budget</p>
                          <p className="text-sm font-bold text-emerald-800">
                            ${((campaign.maxViews / 100) * Number(campaign.cpv)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="bg-emerald-100 p-1 rounded-full">
                          <CurrencyDollarIcon className="h-3 w-3 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-emerald-600 font-medium">
                            {campaign.type === 'SALESMAN' ? 'Commission' :
                             campaign.type === 'CONSULTANT' ? 'Project Budget' : 'Budget Range'}
                          </p>
                          <p className="text-sm font-bold text-emerald-800">
                            {formatBudgetInfo(campaign)}
                          </p>
                        </div>
                      </div>

                      {campaign.type === 'SALESMAN' && (
                        <div className="bg-white bg-opacity-60 px-2 py-0.5 rounded text-xs text-emerald-700 font-medium">
                          Per Sale
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Description - Truncated */}
                <p className="text-gray-700 text-xs mb-2 line-clamp-1">{campaign.description}</p>

                {/* Compact Requirements and Tags */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <span>{formatDate(campaign.createdAt)}</span>
                    {(() => {
                      const allRequirements = getAllRequirements(campaign);
                      return allRequirements.length > 0 ? (
                        <>
                          <span>•</span>
                          <span>{allRequirements.length} requirements</span>
                        </>
                      ) : null;
                    })()}
                    {campaign.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{campaign.tags.length} tags</span>
                      </>
                    )}
                  </div>
                  
                  {/* Apply Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleApplyClick(campaign);
                    }}
                    disabled={acceptingContract === campaign.id}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-1"
                  >
                    {acceptingContract === campaign.id ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>
                          {campaign.isPublic ? "Accepting..." : "Submitting..."}
                        </span>
                      </>
                    ) : campaign.isPublic ? (
                      <>
                        <DocumentTextIcon className="h-3 w-3" />
                        <span>Take</span>
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-3 w-3" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>{" "}
      {/* Empty State */}
      {campaigns.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-2">
            No campaigns found
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("ALL");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}{" "}
      {/* Application Modal */}
      {applicationModal.isOpen && applicationModal.campaign && (
        <ApplicationModal
          campaign={applicationModal.campaign}
          onClose={handleCloseModal}
          onSubmit={handleApplicationSubmit}
        />
      )}
      {/* Notification Modal */}
      {notification.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {notification.type === "success" ? (
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-gray-900">
                    {notification.title}
                  </h2>
                </div>
                <button
                  onClick={() =>
                    setNotification({ ...notification, isOpen: false })
                  }
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-gray-700 text-sm mb-4">{notification.message}</p>

              <div className="flex justify-end">
                <button
                  onClick={() =>
                    setNotification({ ...notification, isOpen: false })
                  }
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                    notification.type === "success"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
