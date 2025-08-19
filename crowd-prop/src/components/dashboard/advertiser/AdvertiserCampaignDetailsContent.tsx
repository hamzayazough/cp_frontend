"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CampaignAdvertiser,
  PromoterApplicationInfo,
} from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType } from "@/app/enums/campaign-type";
import { ADVERTISER_CAMPAIGN_MOCKS } from "@/app/mocks/advertiser-campaign-mock";
import { useAdvertiserCampaigns } from "@/hooks/useAdvertiserCampaigns";
import { useNewMessageNotification } from "@/hooks/useNewMessageNotification";
import { auth } from "@/lib/firebase";
import CreateCampaignWizard from "./CreateCampaignWizard";
import ApplicationReviewModal from "./ApplicationReviewModal";

// Import new components
import AdvertiserCampaignHeader from "./components/AdvertiserCampaignHeader";
import AdvertiserCampaignStatsCards from "./components/AdvertiserCampaignStatsCards";
import AdvertiserCampaignTabs from "./components/AdvertiserCampaignTabs";
import AdvertiserCampaignOverview from "./components/AdvertiserCampaignOverview";
import AdvertiserCampaignMedia from "./components/AdvertiserCampaignMedia";
import AdvertiserCampaignPromoters from "./components/AdvertiserCampaignPromoters";
import AdvertiserCampaignPerformance from "./components/AdvertiserCampaignPerformance";
import AdvertiserPromoterLinks from "./components/AdvertiserPromoterLinks";
import AdvertiserCampaignMessages from "./components/AdvertiserCampaignMessages";

interface AdvertiserCampaignDetailsContentProps {
  campaignId: string;
}

export default function AdvertiserCampaignDetailsContent({
  campaignId,
}: AdvertiserCampaignDetailsContentProps) {
  const router = useRouter();
  const { getCampaignDetails, reviewApplication } = useAdvertiserCampaigns();

  const [isCreateMode, setIsCreateMode] = useState(false);
  const [campaign, setCampaign] = useState<CampaignAdvertiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    campaign: CampaignAdvertiser | null;
    applications: PromoterApplicationInfo[];
  }>({
    isOpen: false,
    campaign: null,
    applications: [],
  });

  // Get Firebase auth token
  useEffect(() => {
    const getToken = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          setFirebaseToken(token);
        }
      } catch (error) {
        console.error("Failed to get Firebase token:", error);
      }
    };

    getToken();
  }, []);

  // Use notification hook
  const { hasNewMessages, unreadCount, resetNotification } =
    useNewMessageNotification(campaignId as string, firebaseToken);

  useEffect(() => {
    // Check if this is the create route
    if (campaignId === "create") {
      setIsCreateMode(true);
      setLoading(false);
      return;
    }

    // Load campaign data
    const loadCampaign = async () => {
      try {
        setLoading(true);
        setError(null);
        const campaignData = await getCampaignDetails(campaignId);
        setCampaign(campaignData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load campaign"
        );
        console.error("Error loading campaign:", err);
        // Fallback to mock data for now
        const foundCampaign = ADVERTISER_CAMPAIGN_MOCKS.campaigns.find(
          (c) => c.id === campaignId
        );
        setCampaign(foundCampaign || null);
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId, getCampaignDetails]);

  const getTypeColor = (type: CampaignType) => {
    switch (type) {
      case CampaignType.VISIBILITY:
        return "bg-blue-100 text-blue-800";
      case CampaignType.CONSULTANT:
        return "bg-purple-100 text-purple-800";
      case CampaignType.SELLER:
        return "bg-green-100 text-green-800";
      case CampaignType.SALESMAN:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      // Fallback to campaign applicants data
      setModalState({
        isOpen: true,
        campaign,
        applications: campaign.applicants || [],
      });
    }
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      campaign: null,
      applications: [],
    });
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

        // Refresh campaign data
        const updatedCampaign = await getCampaignDetails(
          modalState.campaign.id
        );
        setCampaign(updatedCampaign);
      }
    } catch (error) {
      console.error("Error accepting application:", error);
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

        // Refresh campaign data
        const updatedCampaign = await getCampaignDetails(
          modalState.campaign.id
        );
        setCampaign(updatedCampaign);
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // If switching to messages tab, reset notification
    if (tab === "messages" && hasNewMessages) {
      // Reset notification when user opens messages tab
      setTimeout(() => resetNotification(), 1000);
    }
  };

  const handleShareClick = () => {
    // TODO: Implement share functionality
    console.log("Share campaign:", campaign?.id);
  };

  const getDaysLeft = () => {
    if (!campaign) return 0;
    return Math.ceil(
      (new Date(campaign.campaign.deadline).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const renderTabContent = () => {
    if (!campaign) return null;

    switch (activeTab) {
      case "overview":
        return <AdvertiserCampaignOverview campaign={campaign} />;
      case "media":
        return <AdvertiserCampaignMedia campaign={campaign} />;
      case "performance":
        return <AdvertiserCampaignPerformance campaign={campaign} />;
      case "messages":
        // Only show messages if there are chosen promoters
        if (!campaign.chosenPromoters || campaign.chosenPromoters.length === 0) {
          return (
            <div className="text-center py-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Promoters Selected
                </h3>
                <p className="text-gray-600">
                  Messages will be available once you have selected promoters for this campaign.
                </p>
              </div>
            </div>
          );
        }
        return (
          <div className="h-[400px]">
            <AdvertiserCampaignMessages
              campaignId={campaignId}
              campaignTitle={campaign.title}
            />
          </div>
        );
      default:
        return <AdvertiserCampaignOverview campaign={campaign} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (isCreateMode) {
    return (
      <CreateCampaignWizard
        onComplete={(createdCampaign) => {
          // Navigate to the newly created campaign
          router.push(`/dashboard/campaigns/${createdCampaign.id}`);
        }}
        onCancel={() => {
          // Navigate back to campaigns list
          router.push("/dashboard/campaigns");
        }}
      />
    );
  }

  if (!campaign) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Campaign Not Found
          </h2>
          <p className="text-gray-600 mb-3">
            The campaign you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/dashboard/campaigns")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <AdvertiserCampaignHeader
        campaign={campaign}
        onShareClick={handleShareClick}
        getTypeColor={getTypeColor}
      />

      {/* Stats Cards */}
      <AdvertiserCampaignStatsCards
        campaign={campaign}
        daysLeft={getDaysLeft()}
      />

      {/* Promoters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4">
          <AdvertiserCampaignPromoters
            campaign={campaign}
            onViewApplications={handleViewApplications}
          />
        </div>
      </div>

      {/* Promoter Links */}
      <AdvertiserPromoterLinks campaign={campaign} />

      {/* Tabs */}
      <AdvertiserCampaignTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasNewMessages={hasNewMessages}
        unreadCount={unreadCount}
      />

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4">{renderTabContent()}</div>
      </div>

      {/* Application Review Modal */}
      {modalState.isOpen && modalState.campaign && (
        <ApplicationReviewModal
          isOpen={modalState.isOpen}
          campaignTitle={modalState.campaign.title}
          applications={modalState.applications}
          onClose={handleCloseModal}
          onAcceptApplication={handleAcceptApplication}
          onRejectApplication={handleRejectApplication}
          onRefresh={async () => {
            if (modalState.campaign) {
              const updatedCampaign = await getCampaignDetails(modalState.campaign.id);
              setCampaign(updatedCampaign);
            }
          }}
        />
      )}
    </div>
  );
}
