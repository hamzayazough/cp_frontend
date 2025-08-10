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
import CreateCampaignWizard from "./CreateCampaignWizard";
import ApplicationReviewModal from "./ApplicationReviewModal";

// Import new components
import AdvertiserCampaignHeader from "./components/AdvertiserCampaignHeader";
import AdvertiserCampaignStatsCards from "./components/AdvertiserCampaignStatsCards";
import AdvertiserCampaignTabs from "./components/AdvertiserCampaignTabs";
import AdvertiserCampaignOverview from "./components/AdvertiserCampaignOverview";
import AdvertiserCampaignMedia from "./components/AdvertiserCampaignMedia";
import AdvertiserCampaignPromoters from "./components/AdvertiserCampaignPromoters";
import AdvertiserCampaignRequirements from "./components/AdvertiserCampaignRequirements";
import AdvertiserCampaignPerformance from "./components/AdvertiserCampaignPerformance";
import AdvertiserPromoterLinks from "./components/AdvertiserPromoterLinks";
import AdvertiserCampaignMessages from "./components/AdvertiserCampaignMessages";
import { AdvertiserCampaignStatus } from "@/app/interfaces/dashboard/advertiser-dashboard";

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
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    campaign: CampaignAdvertiser | null;
    applications: PromoterApplicationInfo[];
  }>({
    isOpen: false,
    campaign: null,
    applications: [],
  });

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

  const getStatusColor = (status: AdvertiserCampaignStatus) => {
    switch (status) {
      case AdvertiserCampaignStatus.ONGOING:
        return "bg-green-100 text-green-800";
      case AdvertiserCampaignStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      case AdvertiserCampaignStatus.WAITING_FOR_APPLICATIONS:
        return "bg-gray-100 text-gray-800";
      case AdvertiserCampaignStatus.REVIEWING_APPLICATIONS:
        return "bg-yellow-100 text-yellow-800";
      case AdvertiserCampaignStatus.PENDING_PROMOTER:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: CampaignType) => {
    switch (type) {
      case CampaignType.VISIBILITY:
        return "bg-purple-100 text-purple-800";
      case CampaignType.CONSULTANT:
        return "bg-blue-100 text-blue-800";
      case CampaignType.SELLER:
        return "bg-orange-100 text-orange-800";
      case CampaignType.SALESMAN:
        return "bg-green-100 text-green-800";
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
      case "requirements":
        return <AdvertiserCampaignRequirements campaign={campaign} />;
      case "messages":
        return (
          <div className="h-[600px]">
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Campaign Not Found
          </h2>
          <p className="text-gray-600 mb-4">
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
    <div className="space-y-8">
      {/* Header */}
      <AdvertiserCampaignHeader
        campaign={campaign}
        campaignId={campaignId}
        onShareClick={handleShareClick}
        getStatusColor={getStatusColor}
        getTypeColor={getTypeColor}
      />

      {/* Stats Cards */}
      <AdvertiserCampaignStatsCards
        campaign={campaign}
        daysLeft={getDaysLeft()}
      />

      {/* Promoters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
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
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">{renderTabContent()}</div>
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
        />
      )}
    </div>
  );
}
