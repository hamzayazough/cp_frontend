"use client";

import { useState } from "react";
import Link from "next/link";
import { routes } from "@/lib/router";
import {
  ArrowLeftIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  TagIcon,
  LinkIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import {
  CampaignPromoter,
  VisibilityCampaignDetails,
  ConsultantCampaignDetails,
  SellerCampaignDetails,
  SalesmanCampaignDetails,
} from "@/interfaces/campaign-promoter";
import { CampaignType } from "@/app/enums/campaign-type";
import {
  MOCK_CAMPAIGN_PROMOTER1,
  MOCK_CAMPAIGN_PROMOTER2,
  MOCK_CAMPAIGN_PROMOTER3,
  MOCK_CAMPAIGN_PROMOTER4,
} from "@/app/mocks/campaign-promoter-mock";

interface PromoterCampaignDetailsContentProps {
  campaignId: string;
}

// Mock campaign data - in production, this would be fetched from your API
const mockCampaignData: Record<string, CampaignPromoter> = {
  "1": MOCK_CAMPAIGN_PROMOTER1,
  "2": MOCK_CAMPAIGN_PROMOTER2,
  "3": MOCK_CAMPAIGN_PROMOTER3,
  "4": MOCK_CAMPAIGN_PROMOTER4,
};

export default function PromoterCampaignDetailsContent({
  campaignId,
}: PromoterCampaignDetailsContentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareModal, setShowShareModal] = useState(false);
  const [promoterLinks, setPromoterLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [editingLinkValue, setEditingLinkValue] = useState("");
  const campaign =
    mockCampaignData[campaignId as keyof typeof mockCampaignData];

  // Helper functions for PromoterLinks management
  const addPromoterLink = () => {
    if (newLink.trim()) {
      setPromoterLinks([...promoterLinks, newLink.trim()]);
      setNewLink("");
    }
  };

  const deletePromoterLink = (index: number) => {
    setPromoterLinks(promoterLinks.filter((_, i) => i !== index));
  };

  const startEditingLink = (index: number) => {
    setEditingLinkIndex(index);
    setEditingLinkValue(promoterLinks[index]);
  };

  const saveEditedLink = () => {
    if (editingLinkIndex !== null && editingLinkValue.trim()) {
      const updatedLinks = [...promoterLinks];
      updatedLinks[editingLinkIndex] = editingLinkValue.trim();
      setPromoterLinks(updatedLinks);
      setEditingLinkIndex(null);
      setEditingLinkValue("");
    }
  };

  const cancelEditing = () => {
    setEditingLinkIndex(null);
    setEditingLinkValue("");
  };

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Campaign Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The campaign you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access to it.
        </p>
        <Link
          href={routes.dashboardCampaigns}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Campaigns
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ONGOING":
        return "bg-green-100 text-green-800";
      case "AWAITING_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "VISIBILITY":
        return "bg-blue-100 text-blue-800";
      case "SALESMAN":
        return "bg-green-100 text-green-800";
      case "CONSULTANT":
        return "bg-purple-100 text-purple-800";
      case "SELLER":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Ensure safe access to properties that might be undefined
  const progress =
    campaign.campaign.type === CampaignType.VISIBILITY &&
    "maxViews" in campaign.campaign
      ? ((campaign.earnings.viewsGenerated || 0) /
          ((campaign.campaign as VisibilityCampaignDetails).maxViews || 1)) *
        100
      : 0;

  const daysLeft = campaign.campaign.deadline
    ? Math.ceil(
        (new Date(campaign.campaign.deadline).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : "N/A";

  const tabs = [
    { id: "overview", label: "Overview", icon: ChartBarIcon },
    { id: "performance", label: "Performance", icon: EyeIcon },
    { id: "requirements", label: "Requirements", icon: CheckCircleIcon },
    { id: "messages", label: "Messages", icon: ChatBubbleLeftRightIcon },
  ];

  const renderCampaignDetails = () => {
    switch (campaign.campaign.type) {
      case CampaignType.VISIBILITY:
        const visibilityDetails =
          campaign.campaign as VisibilityCampaignDetails;
        return (
          <div>
            <p>Max Views: {visibilityDetails.maxViews}</p>
            <p>CPV: ${visibilityDetails.cpv}</p>
            <p>Tracking Link: {visibilityDetails.trackingLink}</p>
          </div>
        );
      case CampaignType.CONSULTANT:
        const consultantDetails =
          campaign.campaign as ConsultantCampaignDetails;
        return (
          <div>
            <p>Expertise Required: {consultantDetails.expertiseRequired}</p>
            <p>Min Budget: ${consultantDetails.minBudget?.toLocaleString()}</p>
            <p>Max Budget: ${consultantDetails.maxBudget?.toLocaleString()}</p>
          </div>
        );
      case CampaignType.SELLER:
        const sellerDetails = campaign.campaign as SellerCampaignDetails;
        return (
          <div>
            <p>Fixed Price: ${sellerDetails.fixedPrice}</p>
            <p>
              Seller Requirements:{" "}
              {sellerDetails.sellerRequirements?.join(", ")}
            </p>
          </div>
        );
      case CampaignType.SALESMAN:
        const salesmanDetails = campaign.campaign as SalesmanCampaignDetails;
        return (
          <div>
            <p>Commission Per Sale: {salesmanDetails.commissionPerSale}%</p>
            <p>Tracking Method: {salesmanDetails.trackSalesVia}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={routes.dashboardCampaigns}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {campaign.title}
            </h1>
            <div className="flex items-center space-x-3 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  campaign.status
                )}`}
              >
                {campaign.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                  campaign.type
                )}`}
              >
                {campaign.type}
              </span>
            </div>
          </div>{" "}
        </div>{" "}
        <div className="flex items-center space-x-3">
          {campaign.campaign.type === CampaignType.VISIBILITY && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Link to Share
            </button>
          )}
          {campaign.campaign.discordInviteLink && (
            <Link
              href={campaign.campaign.discordInviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Discord Channel
            </Link>
          )}
          <Link
            href={routes.messageThread(campaignId)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
            Chat
          </Link>
        </div>
      </div>{" "}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900">
                ${campaign.earnings.totalEarned}
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
                  <p className="text-sm font-medium text-gray-600">
                    Views Generated
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaign.earnings.viewsGenerated.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Max Views Target
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(
                      campaign.campaign as VisibilityCampaignDetails
                    ).maxViews.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}{" "}
        {campaign.campaign.type === CampaignType.CONSULTANT && (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Min Budget
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    $
                    {(
                      campaign.campaign as ConsultantCampaignDetails
                    ).minBudget?.toLocaleString() || 0}
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
                  <p className="text-sm font-medium text-gray-600">
                    Max Budget
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    $
                    {(
                      campaign.campaign as ConsultantCampaignDetails
                    ).maxBudget?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {(campaign.campaign.type === CampaignType.SELLER ||
          campaign.campaign.type === CampaignType.SALESMAN) && (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Campaign Budget
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${campaign.campaign.budgetHeld.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <EyeIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Projected Total
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${campaign.earnings.projectedTotal}
                  </p>
                </div>
              </div>
            </div>
          </>
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
      </div>{" "}
      {/* Progress Bar */}
      {campaign.campaign.type === CampaignType.VISIBILITY && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Views Progress
            </h3>
            <span className="text-sm text-gray-600">
              {(
                campaign.campaign as VisibilityCampaignDetails
              ).currentViews.toLocaleString()}{" "}
              /
              {(
                campaign.campaign as VisibilityCampaignDetails
              ).maxViews.toLocaleString()}{" "}
              views
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {progress.toFixed(1)}% complete
          </p>
        </div>
      )}
      {campaign.campaign.type === CampaignType.CONSULTANT && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Budget Progress
            </h3>
            <span className="text-sm text-gray-600">
              ${campaign.earnings.totalEarned.toLocaleString()} / $
              {campaign.campaign.budgetHeld.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (campaign.earnings.totalEarned / campaign.campaign.budgetHeld) *
                    100,
                  100
                )}%`,
              }}
            ></div>
          </div>{" "}
          <p className="text-sm text-gray-600 mt-2">
            {(
              (campaign.earnings.totalEarned / campaign.campaign.budgetHeld) *
              100
            ).toFixed(1)}
            % budget used
          </p>
        </div>
      )}
      {/* PromoterLinks Section - Only for Consultant Campaigns */}
      {campaign.campaign.type === CampaignType.CONSULTANT && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Campaign Links
            </h3>
            <span className="text-sm text-gray-600">
              Add links to your work (posts, videos, docs, etc.)
            </span>
          </div>
          {/* Add New Link */}
          <div className="mb-4">
            <div className="flex gap-3">
              <input
                type="url"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="Enter a link (Instagram post, TikTok video, Google Doc, etc.)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <button
                onClick={addPromoterLink}
                disabled={!newLink.trim()}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Link
              </button>
            </div>
          </div>
          {/* Links List */}
          <div className="space-y-3">
            {" "}
            {promoterLinks.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">
                  No work links added yet
                </p>
                <p className="text-gray-400 text-sm">
                  Share Google Docs, PowerPoints, designs, or reports that your
                  client needs to review
                </p>
              </div>
            ) : (
              promoterLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {editingLinkIndex === index ? (
                    // Edit mode
                    <>
                      <input
                        type="url"
                        value={editingLinkValue}
                        onChange={(e) => setEditingLinkValue(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        autoFocus
                      />
                      <button
                        onClick={saveEditedLink}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    // View mode
                    <>
                      <LinkIcon className="h-4 w-4 text-purple-600 flex-shrink-0" />
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-blue-600 hover:text-blue-800 truncate text-sm font-medium"
                      >
                        {link}
                      </a>
                      <button
                        onClick={() => startEditingLink(index)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deletePromoterLink(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>{" "}
          {/* Helper text */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-purple-700 text-sm">
              <strong>💡 Important:</strong> These links will be{" "}
              <strong>visible to your client</strong>. Share links to your
              deliverables and work progress such as:
            </p>
            <ul className="text-purple-700 text-sm mt-2 ml-4 space-y-1">
              <li>• Google Docs with strategy documents or reports</li>
              <li>• PowerPoint presentations with your recommendations</li>
              <li>• Spreadsheets with data analysis or campaign metrics</li>
              <li>• Figma/Canva designs for marketing materials</li>
              <li>• Live campaign examples or case studies you've created</li>
            </ul>
          </div>
        </div>
      )}
      {(campaign.campaign.type === CampaignType.SELLER ||
        campaign.campaign.type === CampaignType.SALESMAN) && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Campaign Progress
            </h3>
            <span className="text-sm text-gray-600">
              ${campaign.earnings.totalEarned.toLocaleString()} / $
              {campaign.campaign.budgetHeld.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (campaign.earnings.totalEarned / campaign.campaign.budgetHeld) *
                    100,
                  100
                )}%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {(
              (campaign.campaign.spentBudget / campaign.campaign.budgetHeld) *
              100
            ).toFixed(1)}
            % budget used
          </p>
        </div>
      )}
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {" "}
              {/* Campaign Media */}
              {campaign.mediaUrl && (
                <div>
                  <div className="w-full max-w-2xl h-80 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center mx-auto">
                    {campaign.mediaUrl.endsWith(".mp4") ||
                    campaign.mediaUrl.endsWith(".webm") ? (
                      <video
                        src={campaign.mediaUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={campaign.mediaUrl}
                        alt="Campaign Media"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              )}{" "}
              {/* Tips Section for Visibility Campaigns */}
              {campaign.campaign.type === CampaignType.VISIBILITY && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-400 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                        💡 Pro Tips to Maximize Your Earnings
                      </h3>
                      <div className="space-y-2 text-sm text-emerald-800">
                        <div className="flex items-start space-x-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>
                            Create engaging content that naturally incorporates
                            your tracking link
                          </span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>
                            Share across multiple platforms to reach diverse
                            audiences
                          </span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>
                            Post during peak hours when your audience is most
                            active
                          </span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>
                            The more genuine engagement you drive, the higher
                            your earnings potential!
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Tips Section for Consultant Campaigns */}
              {campaign.campaign.type === CampaignType.CONSULTANT && (
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-l-4 border-purple-400 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">
                        🎯 Consulting Success Tips
                      </h3>
                      <div className="space-y-2 text-sm text-purple-800">
                        <div className="flex items-start space-x-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>
                            Prepare thoroughly for each meeting with data and
                            insights
                          </span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>
                            Document all recommendations and deliverables
                            clearly
                          </span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>
                            Maintain regular communication and provide weekly
                            updates
                          </span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>
                            Show measurable results and ROI for your strategies
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Tips Section for Seller/Salesman Campaigns */}
              {(campaign.campaign.type === CampaignType.SELLER ||
                campaign.campaign.type === CampaignType.SALESMAN) && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-orange-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-orange-900 mb-2">
                        💰 Sales & Delivery Tips
                      </h3>
                      <div className="space-y-2 text-sm text-orange-800">
                        <div className="flex items-start space-x-2">
                          <span className="text-orange-600 font-bold">•</span>
                          <span>
                            Focus on building trust and relationships with
                            potential customers
                          </span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-orange-600 font-bold">•</span>
                          <span>
                            Deliver high-quality work that exceeds expectations
                          </span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-orange-600 font-bold">•</span>
                          <span>
                            Meet all deadlines and communicate proactively
                          </span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-orange-600 font-bold">•</span>
                          <span>
                            Use testimonials and portfolio pieces to showcase
                            your value
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Campaign Description */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">
                    Campaign Description
                  </h3>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-700 leading-relaxed">
                    {campaign.description}
                  </p>
                </div>
              </div>
              {/* Advertiser Information */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-100">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <BuildingOfficeIcon className="h-5 w-5 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">
                    Advertiser Information
                  </h3>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-start space-x-4">
                    {/* Advertiser Profile Picture */}
                    <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      {campaign.advertiser.profileUrl ? (
                        <img
                          src={campaign.advertiser.profileUrl}
                          alt={campaign.advertiser.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <BuildingOfficeIcon className="h-6 w-6 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {campaign.advertiser.name}
                        </h4>
                        {campaign.advertiser.verified && (
                          <CheckBadgeIcon className="h-5 w-5 text-cyan-500" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                        {campaign.advertiser.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-600">
                            Rating: {campaign.advertiser.rating}/5
                          </span>
                        </div>
                        <Link
                          href={campaign.advertiser.website}
                          className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
                        >
                          <LinkIcon className="h-4 w-4 mr-1" />
                          Visit Website
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              {/* Campaign Information Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Campaign Details Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">
                      Campaign Details
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Budget</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ${campaign.campaign.budgetHeld.toLocaleString()}
                      </span>
                    </div>
                    {/* Visibility Campaign Specific Details */}
                    {campaign.campaign.type === CampaignType.VISIBILITY && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">
                            Revenue per 100 Views
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          $
                          {(campaign.campaign as VisibilityCampaignDetails).cpv}
                        </span>
                      </div>
                    )}{" "}
                    {/* Consultant Campaign Specific Details */}
                    {campaign.campaign.type === CampaignType.CONSULTANT && (
                      <>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">
                              Min Budget
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            $
                            {(
                              campaign.campaign as ConsultantCampaignDetails
                            ).minBudget?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">
                              Max Budget
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            $
                            {(
                              campaign.campaign as ConsultantCampaignDetails
                            ).maxBudget?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">
                              Meeting Plan
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {(campaign.campaign as ConsultantCampaignDetails)
                              .meetingPlan || "TBD"}
                          </span>
                        </div>
                      </>
                    )}
                    {/* Seller Campaign Specific Details */}
                    {campaign.campaign.type === CampaignType.SELLER && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">
                            Fixed Price
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          $
                          {(campaign.campaign as SellerCampaignDetails)
                            .fixedPrice || 0}
                        </span>
                      </div>
                    )}
                    {/* Salesman Campaign Specific Details */}
                    {campaign.campaign.type === CampaignType.SALESMAN && (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">
                            Commission Rate
                          </span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {
                            (campaign.campaign as SalesmanCampaignDetails)
                              .commissionPerSale
                          }
                          %
                        </span>
                      </div>
                    )}
                    {/* Removed start date and deadline - now shown in timeline section */}
                  </div>
                </div>{" "}
                {/* Target Audience Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <UserGroupIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">
                      {campaign.campaign.type === CampaignType.CONSULTANT
                        ? "Target Market"
                        : "Target Audience"}
                    </h3>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {campaign.campaign.targetAudience}
                    </p>
                  </div>

                  {/* Consultant-specific expertise display */}
                  {campaign.campaign.type === CampaignType.CONSULTANT && (
                    <div className="mb-4">
                      <div className="flex items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Required Expertise:
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-green-200">
                        <p className="text-green-700 text-sm font-medium">
                          {
                            (campaign.campaign as ConsultantCampaignDetails)
                              .expertiseRequired
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Preferred Platforms:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campaign.campaign.preferredPlatforms &&
                        campaign.campaign.preferredPlatforms.map((platform) => (
                          <span
                            key={platform}
                            className="inline-flex items-center px-3 py-1 bg-white border border-green-200 text-green-700 rounded-full text-sm font-medium shadow-sm"
                          >
                            {platform}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
                {/* Tags Card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TagIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">
                      Campaign Tags
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {" "}
                    {campaign.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        {tag}
                      </span>
                    ))}{" "}
                  </div>
                </div>
              </div>
              {/* Timeline Section - Full Width */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
                {" "}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <CalendarIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Campaign Timeline
                    </h3>
                  </div>

                  {/* Visual Timeline */}
                  {campaign.campaign.startDate &&
                    campaign.campaign.deadline && (
                      <div className="w-full max-w-5xl mx-auto">
                        <div className="relative">
                          {/* Calculate progress percentage */}
                          {(() => {
                            const startDate = new Date(
                              campaign.campaign.startDate
                            );
                            const endDate = new Date(
                              campaign.campaign.deadline
                            );
                            const today = new Date();
                            const totalDuration =
                              endDate.getTime() - startDate.getTime();
                            const elapsed =
                              today.getTime() - startDate.getTime();
                            const progressPercent = Math.max(
                              0,
                              Math.min(100, (elapsed / totalDuration) * 100)
                            );

                            return (
                              <>
                                {/* Timeline Track */}
                                <div className="w-full h-3 bg-gray-200 rounded-full relative">
                                  <div
                                    className="h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>

                                {/* Timeline Markers */}
                                <div className="relative mt-3 min-h-16">
                                  {/* Start Marker */}
                                  <div
                                    className="absolute left-0 text-center"
                                    style={{ transform: "translateX(-50%)" }}
                                  >
                                    <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                                    <div className="text-xs font-medium text-gray-700">
                                      Start
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {startDate.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year:
                                          startDate.getFullYear() !==
                                          new Date().getFullYear()
                                            ? "numeric"
                                            : undefined,
                                      })}
                                    </div>
                                  </div>

                                  {/* Today Marker - positioned at progress end */}
                                  <div
                                    className="absolute text-center"
                                    style={{
                                      left: `${progressPercent}%`,
                                      transform: "translateX(-50%)",
                                    }}
                                  >
                                    <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                                    <div className="text-xs font-medium text-blue-600">
                                      Today
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {today.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </div>
                                  </div>

                                  {/* End Marker */}
                                  <div
                                    className="absolute right-0 text-center"
                                    style={{ transform: "translateX(50%)" }}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded-full mx-auto mb-2 ${
                                        endDate < today
                                          ? "bg-red-500"
                                          : "bg-orange-500"
                                      }`}
                                    ></div>
                                    <div className="text-xs font-medium text-gray-700">
                                      {endDate < today ? "Ended" : "End"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {endDate.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year:
                                          endDate.getFullYear() !==
                                          new Date().getFullYear()
                                            ? "numeric"
                                            : undefined,
                                      })}
                                    </div>
                                  </div>
                                </div>

                                {/* Progress Information */}
                                <div className="text-center mt-6 space-y-1">
                                  
                                  <div className="text-xs text-gray-500">
                                    {daysLeft > 0
                                      ? `${daysLeft} days remaining`
                                      : daysLeft === 0
                                      ? "Last day!"
                                      : `Ended ${Math.abs(daysLeft)} days ago`}
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                </div>
              </div>
              {/* Campaign Channel Footer */}
              {campaign.campaign.discordInviteLink && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Join Campaign Channel
                        </h3>
                        <p className="text-sm text-gray-600">
                          Connect with the advertiser and other promoters
                        </p>
                      </div>
                    </div>
                    <Link
                      href={campaign.campaign.discordInviteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                      Join Discord Channel
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}{" "}
          {activeTab === "performance" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Analytics
              </h3>
              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaign.campaign.type === CampaignType.VISIBILITY && (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Price per 100 views</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${campaign.campaign.cpv}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Views Generated</p>
                      <p className="text-xl font-bold text-gray-900">
                        {campaign.earnings.viewsGenerated.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        View Target Progress
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {progress.toFixed(1)}%
                      </p>
                    </div>
                  </>
                )}

                {campaign.campaign.type === CampaignType.CONSULTANT && (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Meetings Planned</p>
                      <p className="text-xl font-bold text-gray-900">
                        {(campaign.campaign as ConsultantCampaignDetails)
                          .meetingCount || 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Budget used</p>
                      <p className="text-xl font-bold text-gray-900">
                        {(
                          (campaign.campaign.spentBudget /
                            campaign.campaign.budgetHeld) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </>
                )}

                {(campaign.campaign.type === CampaignType.SELLER ||
                  campaign.campaign.type === CampaignType.SALESMAN) && (
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
                )}
              </div>{" "}
              {/* Tracking Link */}
              {campaign.campaign.type === CampaignType.VISIBILITY &&
                campaign.campaign.trackingLink && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Your Tracking Link
                    </h4>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={
                          (campaign.campaign as VisibilityCampaignDetails)
                            .trackingLink || ""
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
                )}
              {/* Consultant Performance Tools */}
              {campaign.campaign.type === CampaignType.CONSULTANT && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">
                    Deliverables Progress
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(
                      campaign.campaign as ConsultantCampaignDetails
                    ).expectedDeliverables?.map((deliverable, index) => (
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
              )}
              {/* Sales Performance for Seller/Salesman campaigns */}
              {(campaign.campaign.type === CampaignType.SELLER ||
                campaign.campaign.type === CampaignType.SALESMAN) && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Sales Performance
                  </h4>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      Track your sales performance and commission earnings here.
                      {campaign.campaign.type === CampaignType.SALESMAN && (
                        <span>
                          {" "}
                          Use your referral code or link to track sales.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}{" "}
          {activeTab === "requirements" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Campaign Requirements
              </h3>
              <div className="space-y-3">
                {/* Show minimum followers requirement for Visibility campaigns */}
                {campaign.campaign.type === CampaignType.VISIBILITY &&
                  (campaign.campaign as VisibilityCampaignDetails)
                    .minFollowers && (
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">
                        Minimum{" "}
                        {(
                          campaign.campaign as VisibilityCampaignDetails
                        ).minFollowers?.toLocaleString()}{" "}
                        followers required on social media
                      </span>
                    </div>
                  )}

                {/* Show consultant-specific requirements */}
                {campaign.campaign.type === CampaignType.CONSULTANT && (
                  <>
                    {(campaign.campaign as ConsultantCampaignDetails)
                      .expertiseRequired && (
                      <div className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <span className="text-gray-700 font-medium">
                            Required Expertise:{" "}
                          </span>
                          <span className="text-gray-600">
                            {
                              (campaign.campaign as ConsultantCampaignDetails)
                                .expertiseRequired
                            }
                          </span>
                        </div>
                      </div>
                    )}
                    {(campaign.campaign as ConsultantCampaignDetails)
                      .meetingPlan && (
                      <div className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-purple-500 mt-0.5" />
                        <span className="text-gray-700">
                          Meeting Schedule:{" "}
                          {
                            (campaign.campaign as ConsultantCampaignDetails)
                              .meetingPlan
                          }{" "}
                          meetings
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Show salesman-specific requirements */}
                {campaign.campaign.type === CampaignType.SALESMAN &&
                  (campaign.campaign as SalesmanCampaignDetails)
                    .minFollowers && (
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="h-5 w-5 text-orange-500 mt-0.5" />
                      <span className="text-gray-700">
                        Minimum{" "}
                        {(
                          campaign.campaign as SalesmanCampaignDetails
                        ).minFollowers?.toLocaleString()}{" "}
                        followers for sales promotion
                      </span>
                    </div>
                  )}

                {/* Show other campaign requirements */}
                {campaign.campaign.requirements &&
                  campaign.campaign.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
              </div>

              {/* Campaign-specific additional info */}
              {campaign.campaign.type === CampaignType.CONSULTANT && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">
                    Consultant Guidelines
                  </h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Prepare detailed reports and recommendations</li>
                    <li>• Maintain professional communication at all times</li>
                    <li>• Meet all scheduled meetings and deadlines</li>
                    <li>
                      • Provide actionable insights based on data analysis
                    </li>
                  </ul>
                </div>
              )}

              {campaign.campaign.type === CampaignType.VISIBILITY && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Content Guidelines
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Always include your tracking link in posts</li>
                    <li>
                      • Disclose sponsored content as required by platform
                      policies
                    </li>
                    <li>
                      • Create authentic, engaging content that resonates with
                      your audience
                    </li>
                    <li>
                      • Track and report your campaign performance regularly
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {activeTab === "messages" && (
            <div className="text-center py-8">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No messages yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start a conversation with the advertiser
              </p>
              <Link
                href={routes.messageThread(campaignId)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Message
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Share Your Tracking Link
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your unique tracking link:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={
                      (campaign.campaign as VisibilityCampaignDetails)
                        .trackingLink
                    }
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        (campaign.campaign as VisibilityCampaignDetails)
                          .trackingLink
                      )
                    }
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Use this link to track your referrals and earn money for each
                valid view or conversion.
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
