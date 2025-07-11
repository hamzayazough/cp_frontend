"use client";

import { useState } from "react";
import {
  CampaignPromoter,
  VisibilityCampaignDetails,
} from "@/interfaces/campaign-promoter";
import { CampaignType } from "@/app/enums/campaign-type";
import {
  MOCK_CAMPAIGN_PROMOTER1,
  MOCK_CAMPAIGN_PROMOTER2,
  MOCK_CAMPAIGN_PROMOTER3,
  MOCK_CAMPAIGN_PROMOTER4,
} from "@/app/mocks/campaign-promoter-mock";

// Import all the smaller components
import CampaignHeader from "./components/CampaignHeader";
import CampaignStatsCards from "./components/CampaignStatsCards";
import CampaignProgress from "./components/CampaignProgress";
import PromoterLinks from "./components/PromoterLinks";
import CampaignTabs from "./components/CampaignTabs";
import CampaignOverview from "./components/CampaignOverview";
import CampaignPerformance from "./components/CampaignPerformance";
import CampaignRequirements from "./components/CampaignRequirements";
import CampaignMessages from "./components/CampaignMessages";
import ShareModal from "./components/ShareModal";
import CampaignNotFound from "./components/CampaignNotFound";

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
  
  const campaign = mockCampaignData[campaignId as keyof typeof mockCampaignData];

  // Helper functions for styling
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

  const daysLeft = campaign?.campaign.deadline
    ? Math.ceil(
        (new Date(campaign.campaign.deadline).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : "N/A";

  if (!campaign) {
    return <CampaignNotFound />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <CampaignOverview campaign={campaign} />;
      case "performance":
        return <CampaignPerformance campaign={campaign} />;
      case "requirements":
        return <CampaignRequirements campaign={campaign} />;
      case "messages":
        return <CampaignMessages campaignId={campaignId} />;
      default:
        return <CampaignOverview campaign={campaign} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <CampaignHeader
        campaign={campaign}
        campaignId={campaignId}
        onShareClick={() => setShowShareModal(true)}
        getStatusColor={getStatusColor}
        getTypeColor={getTypeColor}
      />

      {/* Stats Cards */}
      <CampaignStatsCards campaign={campaign} daysLeft={daysLeft} />

      {/* Progress Bar */}
      <CampaignProgress campaign={campaign} />

      {/* PromoterLinks Section - Only for Consultant Campaigns */}
      <PromoterLinks campaignType={campaign.campaign.type} />

      {/* Tabs */}
      <CampaignTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && campaign.campaign.type === CampaignType.VISIBILITY && (
        <ShareModal
          campaign={campaign as { campaign: VisibilityCampaignDetails }}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
