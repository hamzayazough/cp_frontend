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
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Apply to Campaign
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
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

          <div className="mb-4">
            <h3 className="font-medium text-gray-900">{campaign.title}</h3>
            <p className="text-sm text-gray-600">
              {campaign.advertiser.companyName}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="application-message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Application Message
              </label>
              <textarea
                id="application-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the advertiser why you're the perfect fit for this campaign..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-4 w-4" />
                    <span>Submit Application</span>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Explore Campaigns
          </h1>
          <p className="text-gray-600 mt-2">
            Discover new opportunities to earn money
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {campaigns.length} campaigns available
          </span>
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>
      {/* Error Message */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-amber-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <EyeIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3 text-black">
              <p className="text-sm text-gray-600">Visibility</p>
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
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            <div className="ml-3 text-black">
              <p className="text-sm text-gray-600">Sales</p>
              <p className="text-lg font-semibold">
                {
                  campaigns.filter((c: CampaignUnion) => c.type === "SALESMAN")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-3 text-black">
              <p className="text-sm text-gray-600">Consulting</p>
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
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TagIcon className="h-8 w-8 text-orange-500" />
            <div className="ml-3 text-black">
              <p className="text-sm text-gray-600">Content</p>
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns, companies, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
            >
              {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>{" "}
      {/* Campaigns Grid */}
      <div className="space-y-6">
        {" "}
        {campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            href={routes.dashboardExploreDetails(campaign.id)}
            className={`block bg-white rounded-xl shadow-sm transition-all hover:shadow-md hover:border-blue-200 relative group ${
              campaign.isPublic
                ? "border border-gray-200"
                : "border-2 border-amber-200 bg-amber-50/30"
            }`}
          >
            {/* External Link Icon */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowTopRightOnSquareIcon className="h-4 w-4 text-blue-600" />
            </div>

            <div className="p-6">
              {" "}
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {campaign.title}
                    </h3>
                    {!campaign.isPublic && (
                      <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                        <LockClosedIcon className="h-4 w-4 text-amber-600" />
                        <span className="text-xs font-medium text-amber-700">
                          Private
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/user/${campaign.advertiser.id}`);
                        }}
                        className="hover:ring-2 hover:ring-blue-500 rounded-md transition-all"
                      >
                        {campaign.advertiser.profileUrl ? (
                          <Image 
                            src={campaign.advertiser.profileUrl} 
                            alt={campaign.advertiser.companyName}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 text-sm font-medium">
                              {campaign.advertiser.companyName?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                      </button>
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {campaign.advertiser.companyName}
                          {campaign.advertiser.verified && (
                            <div className="ml-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 text-white"
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
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        campaign.type
                      )}`}
                    >
                      {campaign.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {getDaysLeft(campaign.deadline)} days left
                  </div>
                </div>
              </div>{" "}
              {/* Prominent Budget Information */}
              <div className="bg-green-50 border-l-4 border-green-400 px-4 py-3 mb-4">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                  <p className="text-lg font-bold text-green-700">
                    {formatBudgetInfo(campaign)}
                  </p>
                </div>
              </div>
              {/* Description */}
              <p className="text-gray-700 mb-4">{campaign.description}</p>{" "}
              {/* Requirements */}
              {(() => {
                const allRequirements = getAllRequirements(campaign);
                const maxDisplayed = 4;
                const displayedRequirements = allRequirements.slice(
                  0,
                  maxDisplayed
                );
                const hasMore = allRequirements.length > maxDisplayed;

                return allRequirements.length > 0 ? (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Requirements:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {displayedRequirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                      {hasMore && (
                        <li className="text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors">
                          +{allRequirements.length - maxDisplayed} more
                          requirements - click to view details
                        </li>
                      )}
                    </ul>
                  </div>
                ) : null;
              })()}
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {campaign.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>{" "}
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {" "}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Posted {formatDate(campaign.createdAt)}</span>
                </div>{" "}
                <div className="flex space-x-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleApplyClick(campaign);
                    }}
                    disabled={acceptingContract === campaign.id}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                  >
                    {acceptingContract === campaign.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>
                          {campaign.isPublic ? "Accepting..." : "Submitting..."}
                        </span>
                      </>
                    ) : campaign.isPublic ? (
                      <>
                        <DocumentTextIcon className="h-4 w-4" />
                        <span>Take Contract</span>
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-4 w-4" />
                        <span>Apply Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>{" "}
      {/* Empty State */}
      {campaigns.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No campaigns found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("ALL");
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {notification.type === "success" ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-green-600"
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
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-red-600"
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
                  <h2 className="text-xl font-semibold text-gray-900">
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
                    className="w-6 h-6"
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

              <p className="text-gray-700 mb-6">{notification.message}</p>

              <div className="flex justify-end">
                <button
                  onClick={() =>
                    setNotification({ ...notification, isOpen: false })
                  }
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
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
