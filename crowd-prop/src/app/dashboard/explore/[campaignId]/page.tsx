"use client";

import { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  EyeIcon,
  CurrencyDollarIcon,
  TagIcon,
  CheckCircleIcon,
  UsersIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  PresentationChartLineIcon,
  AcademicCapIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import CampaignMediaViewer from "@/components/ui/CampaignMediaViewer";
import { CampaignType, CampaignStatus } from "@/app/enums/campaign-type";
import {
  VisibilityCampaign,
  SalesmanCampaign,
  ConsultantCampaign,
  SellerCampaign,
  CampaignUnion,
} from "@/app/interfaces/campaign/explore-campaign";
import { formatDate, getDaysLeft } from "@/utils/date";
import { exploreCampaignsStorage } from "@/utils/explore-campaigns-storage";
import { promoterService } from "@/services/promoter.service";
import { useAuthGuard } from "@/hooks/useAuth";

const getCampaignDisplayStatus = (
  campaign: CampaignUnion,
  isExpired: boolean
) => {
  // First check if the campaign is expired (overrides all other statuses)
  if (isExpired) {
    return {
      label: "Expired",
      className:
        "px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium",
    };
  }

  // For now, we'll check if the campaign has a campaignStatus property
  // If not available, we'll derive it from the current PromoterCampaignStatus
  // This is a placeholder - in a real app, the backend should provide the CampaignStatus
  const campaignWithStatus = campaign as CampaignUnion & {
    campaignStatus?: CampaignStatus;
  };
  const campaignStatus =
    campaignWithStatus.campaignStatus || CampaignStatus.ACTIVE;

  switch (campaignStatus) {
    case CampaignStatus.ACTIVE:
      return {
        label: "Active",
        className:
          "px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium",
      };
    case CampaignStatus.PAUSED:
      return {
        label: "Paused",
        className:
          "px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium",
      };
    case CampaignStatus.INACTIVE:
      return {
        label: "Ended",
        className:
          "px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium",
      };
    default:
      return {
        label: "Active",
        className:
          "px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium",
      };
  }
};

interface CampaignDetailsPageProps {
  params: Promise<{
    campaignId: string;
  }>;
}

const formatBudgetInfo = (campaign: CampaignUnion) => {
  switch (campaign.type) {
    case CampaignType.VISIBILITY:
      const visibilityCampaign = campaign as VisibilityCampaign;
      return `$${Number(visibilityCampaign.cpv).toFixed(2)} per 100 view`;
    case CampaignType.SALESMAN:
      const salesmanCampaign = campaign as SalesmanCampaign;
      return `${Number(salesmanCampaign.commissionPerSale * 100).toFixed(
        0
      )}% commission`;
    case CampaignType.CONSULTANT:
      const consultantCampaign = campaign as ConsultantCampaign;
      return `$${Number(
        consultantCampaign.minBudget
      ).toLocaleString()} - $${Number(
        consultantCampaign.maxBudget
      ).toLocaleString()}`;
    case CampaignType.SELLER:
      const sellerCampaign = campaign as SellerCampaign;
      return `$${Number(sellerCampaign.minBudget).toLocaleString()} - $${Number(
        sellerCampaign.maxBudget
      ).toLocaleString()}`;
    default:
      return "Contact for details";
  }
};

const getCampaignTypeIcon = (type: CampaignType) => {
  switch (type) {
    case CampaignType.VISIBILITY:
      return <EyeIcon className="h-6 w-6" />;
    case CampaignType.SALESMAN:
      return <CurrencyDollarIcon className="h-6 w-6" />;
    case CampaignType.CONSULTANT:
      return <AcademicCapIcon className="h-6 w-6" />;
    case CampaignType.SELLER:
      return <TagIcon className="h-6 w-6" />;
    default:
      return <DocumentTextIcon className="h-6 w-6" />;
  }
};

const getCampaignTypeColor = (type: CampaignType) => {
  switch (type) {
    case CampaignType.VISIBILITY:
      return "bg-blue-100 text-blue-800";
    case CampaignType.SALESMAN:
      return "bg-green-100 text-green-800";
    case CampaignType.CONSULTANT:
      return "bg-purple-100 text-purple-800";
    case CampaignType.SELLER:
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const renderCampaignSpecificInfo = (campaign: CampaignUnion) => {
  switch (campaign.type) {
    case CampaignType.VISIBILITY:
      const visibilityCampaign = campaign as VisibilityCampaign;
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <EyeIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-medium">
                  Target Views
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {Number(visibilityCampaign.maxViews).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-xs text-green-600 font-medium">
                  Per 100 Views
                </p>
                <p className="text-lg font-bold text-green-900">
                  ${Number(visibilityCampaign.cpv).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-xs text-purple-600 font-medium">
                  Total Budget
                </p>
                <p className="text-lg font-bold text-purple-900">
                  $
                  {(
                    (Number(visibilityCampaign.maxViews) *
                      Number(visibilityCampaign.cpv)) /
                    100
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case CampaignType.SALESMAN:
      const salesmanCampaign = campaign as SalesmanCampaign;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-xs text-green-600 font-medium">
                  Commission Rate
                </p>
                <p className="text-xl font-bold text-green-900">
                  {Number(salesmanCampaign.commissionPerSale * 100).toFixed(0)}%
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600">Per successful sale</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <GlobeAltIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-medium">
                  Tracking Method
                </p>
                <p className="text-sm font-semibold text-blue-900">
                  {salesmanCampaign.trackSalesVia}
                </p>
              </div>
            </div>
            {salesmanCampaign.refLink && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Reference Link:</p>
                <p className="text-xs text-blue-600 truncate">
                  {salesmanCampaign.refLink}
                </p>
              </div>
            )}
          </div>
        </div>
      );

    case CampaignType.CONSULTANT:
      const consultantCampaign = campaign as ConsultantCampaign;
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">
                    Budget Range
                  </p>{" "}
                  <p className="text-lg font-bold text-purple-900">
                    ${Number(consultantCampaign.minBudget).toLocaleString()} - $
                    {Number(consultantCampaign.maxBudget).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <VideoCameraIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Meeting Plan
                  </p>
                  <p className="text-lg font-bold text-blue-900">
                    {consultantCampaign.meetingPlan}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <PresentationChartLineIcon className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Total Meetings
                  </p>{" "}
                  <p className="text-lg font-bold text-green-900">
                    {Number(consultantCampaign.meetingCount)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Required Expertise
            </h4>
            <p className="text-gray-700">
              {consultantCampaign.expertiseRequired}
            </p>
          </div>

          {consultantCampaign.expectedDeliverables &&
            consultantCampaign.expectedDeliverables.length > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">
                  Expected Deliverables
                </h4>{" "}
                <div className="flex flex-wrap gap-2">
                  {consultantCampaign.expectedDeliverables.map(
                    (deliverable: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {deliverable}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      );

    case CampaignType.SELLER:
      const sellerCampaign = campaign as SellerCampaign;
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-orange-600 font-medium">
                    Budget Range
                  </p>{" "}
                  <p className="text-2xl font-bold text-orange-900">
                    ${Number(sellerCampaign.minBudget).toLocaleString()} - $
                    {Number(sellerCampaign.maxBudget).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <UsersIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Min Followers
                  </p>{" "}
                  <p className="text-2xl font-bold text-blue-900">
                    {sellerCampaign.minFollowers
                      ? Number(sellerCampaign.minFollowers).toLocaleString()
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {sellerCampaign.needMeeting && (
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <VideoCameraIcon className="h-6 w-6 text-green-600" />
                <h4 className="text-lg font-semibold text-green-900">
                  Meeting Required
                </h4>
              </div>
              <p className="text-gray-700 mb-2">
                Meeting Plan:{" "}
                <span className="font-medium">
                  {sellerCampaign.meetingPlan}
                </span>
              </p>{" "}
              <p className="text-gray-700">
                Total Meetings:{" "}
                <span className="font-medium">
                  {Number(sellerCampaign.meetingCount)}
                </span>
              </p>
            </div>
          )}

          {sellerCampaign.deliverables &&
            sellerCampaign.deliverables.length > 0 && (
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-900 mb-3">
                  Required Deliverables
                </h4>{" "}
                <div className="flex flex-wrap gap-2">
                  {sellerCampaign.deliverables.map(
                    (deliverable: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium"
                      >
                        {deliverable}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      );

    default:
      return null;
  }
};

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
              <XMarkIcon className="w-6 h-6" />
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

export default function CampaignDetailsPage({
  params,
}: CampaignDetailsPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { loading: authLoading } = useAuthGuard();
  const [campaign, setCampaign] = useState<CampaignUnion | null>(null);
  const [loading, setLoading] = useState(true);
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
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      // Wait for auth to load before making API calls
      if (authLoading) {
        return;
      }

      // Try to get campaign from localStorage first
      const storedCampaign = exploreCampaignsStorage.getCampaignById(
        resolvedParams.campaignId
      );

      if (storedCampaign) {
        setCampaign(storedCampaign);
        setLoading(false);
      } else {
        // If not found in localStorage, fetch from API
        try {
          const campaignData = await promoterService.getCampaignById(
            resolvedParams.campaignId
          );
          setCampaign(campaignData);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch campaign:", error);
          // If API call fails, redirect to explore page
          setLoading(false);
          router.push("/dashboard/explore");
        }
      }
    };

    fetchCampaign();
  }, [resolvedParams.campaignId, router, authLoading]);

  const handleApplyClick = async (campaign: CampaignUnion) => {
    if (campaign.isPublic) {
      // Handle "Take Contract" for public campaigns
      setAcceptingContract(campaign.id);
      try {
        const response = await promoterService.acceptContract({
          campaignId: campaign.id,
        });

        console.log("Contract accepted successfully:", response); // Show success notification
        setNotification({
          isOpen: true,
          type: "success",
          title: "Contract Accepted!",
          message:
            response.message || "You have successfully joined this campaign.",
        });

        // Redirect to campaigns page after a short delay
        setTimeout(() => {
          router.push("/dashboard/campaigns");
        }, 2000);
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
      setApplicationModal({ isOpen: false, campaign: null }); // Show success notification
      setNotification({
        isOpen: true,
        type: "success",
        title: "Application Submitted!",
        message:
          response.message ||
          "Your application has been submitted successfully.",
      });

      // Redirect to explore page after a short delay
      setTimeout(() => {
        router.push("/dashboard/explore");
      }, 2000);
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

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    notFound();
  }

  const daysLeft = getDaysLeft(campaign.deadline);
  const isExpired = daysLeft === 0;
  const statusInfo = getCampaignDisplayStatus(campaign, isExpired);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard/explore"
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-2">
                <div
                  className={`p-1.5 rounded-lg ${getCampaignTypeColor(
                    campaign.type
                  )}`}
                >
                  {getCampaignTypeIcon(campaign.type)}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {campaign.title}
                  </h1>
                  <p className="text-xs text-gray-600">Campaign Details</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getCampaignTypeColor(
                  campaign.type
                )}`}
              >
                {campaign.type}
              </span>
              <span className={statusInfo.className.replace('text-sm', 'text-xs')}>{statusInfo.label}</span>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Advertiser Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/user/${campaign.advertiser.id}`)}
                className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer flex-shrink-0"
              >
                {campaign.advertiser.profileUrl ? (
                  <Image
                    src={campaign.advertiser.profileUrl}
                    alt={campaign.advertiser.companyName}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <span class="text-gray-500 text-xs font-medium">${campaign.advertiser.companyName
                            .charAt(0)
                            .toUpperCase()}</span>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs font-medium">
                      {campaign.advertiser.companyName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {campaign.advertiser.companyName}
                  </h2>
                  {campaign.advertiser.verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
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
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-1">
                    <StarIconSolid className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs font-medium text-gray-900">
                      {Number(campaign.advertiser.rating).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {campaign.advertiser.advertiserTypes?.slice(0, 2).map(
                      (type: string) => (
                        <span
                          key={type}
                          className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {type}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <p className="text-gray-700 text-xs mb-1 line-clamp-2">
                  {campaign.advertiser.description}
                </p>
                {campaign.advertiser.website && (
                  <a
                    href={campaign.advertiser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium inline-block"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIconSolid
                    key={star}
                    className={`h-3 w-3 ${
                      star <= Math.floor(Number(campaign.advertiser.rating))
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Company Rating</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Campaign Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {campaign.description}
                  </p>
                </div>
              </div>
              {/* Campaign Specific Information */}
              {renderCampaignSpecificInfo(campaign)}
            </div>
            {/* Campaign Media */}
            {campaign.mediaUrls && campaign.mediaUrls.length > 0 && (
              <CampaignMediaViewer mediaUrls={campaign.mediaUrls} />
            )}{" "}
            {/* Requirements */}
            {campaign.requirements && campaign.requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Requirements
                </h3>
                <div className="space-y-2">
                  {campaign.requirements.map(
                    (requirement: string, idx: number) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{requirement}</span>
                      </div>
                    )
                  )}
                  {/* Add min followers requirement for visibility campaigns */}
                  {campaign.type === CampaignType.VISIBILITY &&
                    (campaign as VisibilityCampaign).minFollowers && (
                      <div className="flex items-start space-x-2">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">
                          Minimum{" "}
                          {(
                            campaign as VisibilityCampaign
                          ).minFollowers?.toLocaleString()}{" "}
                          followers required
                        </span>
                      </div>
                    )}
                </div>
              </div>
            )}
            {/* Target Audience & Platforms */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Campaign Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1.5 text-sm">
                    Target Audience
                  </h4>
                  <p className="text-gray-700 text-sm">{campaign.targetAudience}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1.5 text-sm">
                    Preferred Platforms
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {campaign.preferredPlatforms?.map((platform: string) => (
                      <span
                        key={platform}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {platform}
                      </span>
                    )) || (
                      <span className="text-gray-500 text-sm">
                        No platforms specified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Campaign Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {campaign.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Action Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {formatBudgetInfo(campaign)}
                </div>
                <p className="text-gray-600 text-sm">Compensation</p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      statusInfo.label === "Expired"
                        ? "text-red-600"
                        : statusInfo.label === "Active"
                        ? "text-green-600"
                        : statusInfo.label === "Paused"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(campaign.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Deadline:</span>
                  <span
                    className={`font-medium ${
                      isExpired ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {isExpired ? "Expired" : `${daysLeft} days left`}
                  </span>
                </div>
              </div>
              {statusInfo.label === "Active" && (
                <button
                  onClick={() => handleApplyClick(campaign)}
                  disabled={acceptingContract === campaign.id}
                  className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2 text-sm"
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
              )}
            </div>
            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Campaign Timeline
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      Campaign Created
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(campaign.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      Campaign Started
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(campaign.startDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isExpired ? "bg-red-500" : "bg-yellow-500"
                    }`}
                  ></div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">
                      Campaign Deadline
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(campaign.deadline)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Contact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Need Help?
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center space-x-2 py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChatBubbleLeftRightIcon className="h-3 w-3 text-gray-600" />
                  <span className="text-xs text-gray-700">Contact Support</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <DocumentTextIcon className="h-3 w-3 text-gray-600" />
                  <span className="text-xs text-gray-700">View Guidelines</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                    <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                  ) : (
                    <XMarkIcon className="h-6 w-6 text-red-600 mr-3" />
                  )}
                  <h3 className="text-lg font-medium text-gray-900">
                    {notification.title}
                  </h3>
                </div>{" "}
                <button
                  onClick={() => {
                    setNotification({ ...notification, isOpen: false });
                    // If it's a success notification, redirect immediately
                    if (notification.type === "success") {
                      if (notification.title === "Contract Accepted!") {
                        router.push("/dashboard/campaigns");
                      } else if (
                        notification.title === "Application Submitted!"
                      ) {
                        router.push("/dashboard/explore");
                      }
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-700 mb-6">{notification.message}</p>{" "}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setNotification({ ...notification, isOpen: false });
                    // If it's a success notification, redirect immediately
                    if (notification.type === "success") {
                      if (notification.title === "Contract Accepted!") {
                        router.push("/dashboard/campaigns");
                      } else if (
                        notification.title === "Application Submitted!"
                      ) {
                        router.push("/dashboard/explore");
                      }
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
