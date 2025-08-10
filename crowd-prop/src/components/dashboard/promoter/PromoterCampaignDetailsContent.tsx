"use client";

import { useState, useEffect } from "react";
import {
  CampaignPromoter,
  VisibilityCampaignDetails,
} from "@/app/interfaces/campaign/promoter-campaign-details";
import { CampaignType } from "@/app/enums/campaign-type";
import {
  MOCK_CAMPAIGN_PROMOTER1,
  MOCK_CAMPAIGN_PROMOTER2,
  MOCK_CAMPAIGN_PROMOTER3,
  MOCK_CAMPAIGN_PROMOTER4,
} from "@/app/mocks/campaign-promoter-mock";
import { getPromoterCampaignById } from "@/utils/promoter-campaigns-storage";
import { promoterService } from "@/services/promoter.service";
import { useNewMessageNotification } from "@/hooks/useNewMessageNotification";
import { auth } from "@/lib/firebase";

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
import CampaignMediaViewer from "@/components/ui/CampaignMediaViewer";
import { PromoterCampaignStatus } from "@/app/interfaces/promoter-campaign";

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
  const [campaign, setCampaign] = useState<CampaignPromoter | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);

  // Get Firebase token for message notifications
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setFirebaseToken(token);
        } catch (error) {
          console.error("Failed to get Firebase token:", error);
        }
      } else {
        setFirebaseToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Use the new message notification hook
  const { hasNewMessages, unreadCount, resetNotification } =
    useNewMessageNotification(campaignId, firebaseToken);

  // Reset notification when user switches to messages tab
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "messages" && hasNewMessages) {
      // Reset notification when user opens messages tab
      setTimeout(() => resetNotification(), 1000);
    }
  };

  // Load campaign data from localStorage, API, or fallback to mock
  useEffect(() => {
    const loadCampaign = async () => {
      setLoading(true);

      try {
        // First try to get from localStorage
        let campaignData = getPromoterCampaignById(campaignId);

        if (campaignData) {
          setCampaign(campaignData);
          setLoading(false);
          return;
        }

        // If not found in localStorage, try API call
        try {
          console.log("Campaign not found in localStorage, fetching from API");
          campaignData = await promoterService.getPromoterCampaignById(
            campaignId
          );
          setCampaign(campaignData);
          setLoading(false);
          return;
        } catch (apiError) {
          console.error("Failed to fetch campaign from API:", apiError);
        }

        // If API call fails, fallback to mock data
        console.log("Using mock data as fallback");
        campaignData =
          mockCampaignData[campaignId as keyof typeof mockCampaignData];
        setCampaign(campaignData || null);
        setLoading(false);
      } catch (error) {
        console.error("Error loading campaign:", error);
        setCampaign(null);
        setLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId]);

  // Helper functions for styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case PromoterCampaignStatus.ONGOING:
        return "bg-green-100 text-green-800";
      case PromoterCampaignStatus.AWAITING_REVIEW:
        return "bg-yellow-100 text-yellow-800";
      case PromoterCampaignStatus.COMPLETED:
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
        (new Date(campaign.campaign.deadline).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : "N/A";

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return <CampaignNotFound />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <CampaignOverview campaign={campaign} />;
      case "media":
        return <CampaignMediaViewer mediaUrls={campaign?.mediaUrls || []} />;
      case "performance":
        return <CampaignPerformance campaign={campaign} />;
      case "requirements":
        return <CampaignRequirements campaign={campaign} />;
      case "messages":
        return (
          <div className="h-[600px]">
            <CampaignMessages campaignId={campaignId} />
          </div>
        );
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
      <CampaignStatsCards campaign={campaign} daysLeft={daysLeft} />{" "}
      {/* Progress Bar */}
      <CampaignProgress campaign={campaign} />
      {/* PromoterLinks Section - Only for Consultant Campaigns */}
      <PromoterLinks
        campaign={campaign}
        campaignType={campaign.campaign.type}
        campaignStatus={campaign.status}
      />
      {/* Tabs */}
      <CampaignTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasNewMessages={hasNewMessages}
        unreadCount={unreadCount}
      />
      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">{renderTabContent()}</div>
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
