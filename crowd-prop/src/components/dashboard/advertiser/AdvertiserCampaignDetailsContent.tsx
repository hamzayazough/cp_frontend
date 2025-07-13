'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CampaignAdvertiser, PromoterApplicationInfo } from '@/app/interfaces/campaign/advertiser-campaign';
import { CampaignType, CampaignStatus } from '@/app/enums/campaign-type';
import { ADVERTISER_CAMPAIGN_MOCKS } from '@/app/mocks/advertiser-campaign-mock';
import CreateCampaignWizard from './CreateCampaignWizard';
import ApplicationReviewModal from './ApplicationReviewModal';

// Import new components
import AdvertiserCampaignHeader from './components/AdvertiserCampaignHeader';
import AdvertiserCampaignStatsCards from './components/AdvertiserCampaignStatsCards';
import AdvertiserCampaignTabs from './components/AdvertiserCampaignTabs';
import AdvertiserCampaignOverview from './components/AdvertiserCampaignOverview';
import AdvertiserCampaignPromoters from './components/AdvertiserCampaignPromoters';
import AdvertiserCampaignRequirements from './components/AdvertiserCampaignRequirements';

interface AdvertiserCampaignDetailsContentProps {
  campaignId: string;
}

export default function AdvertiserCampaignDetailsContent({ campaignId }: AdvertiserCampaignDetailsContentProps) {
  const router = useRouter();
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [campaign, setCampaign] = useState<CampaignAdvertiser | null>(null);
  const [loading, setLoading] = useState(true);
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
    if (campaignId === 'create') {
      setIsCreateMode(true);
      setLoading(false);
      return;
    }

    // Load campaign data
    const loadCampaign = () => {
      // In a real app, this would be an API call
      const foundCampaign = ADVERTISER_CAMPAIGN_MOCKS.campaigns.find(c => c.id === campaignId);
      setCampaign(foundCampaign || null);
      setLoading(false);
    };

    loadCampaign();
  }, [campaignId]);

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case CampaignStatus.PAUSED:
        return 'bg-yellow-100 text-yellow-800';
      case CampaignStatus.ENDED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: CampaignType) => {
    switch (type) {
      case CampaignType.VISIBILITY:
        return 'bg-purple-100 text-purple-800';
      case CampaignType.CONSULTANT:
        return 'bg-blue-100 text-blue-800';
      case CampaignType.SELLER:
        return 'bg-orange-100 text-orange-800';
      case CampaignType.SALESMAN:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewApplications = (campaign: CampaignAdvertiser) => {
    setModalState({
      isOpen: true,
      campaign,
      applications: campaign.promoters || [],
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      campaign: null,
      applications: [],
    });
  };

  const handleAcceptApplication = (applicationId: string) => {
    // TODO: Implement accept application logic
    console.log('Accept application:', applicationId);
  };

  const handleRejectApplication = (applicationId: string) => {
    // TODO: Implement reject application logic
    console.log('Reject application:', applicationId);
  };

  const handleShareClick = () => {
    // TODO: Implement share functionality
    console.log('Share campaign:', campaign?.id);
  };

  const getDaysLeft = () => {
    if (!campaign) return 0;
    return Math.ceil(
      (new Date(campaign.campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const renderTabContent = () => {
    if (!campaign) return null;

    switch (activeTab) {
      case "overview":
        return <AdvertiserCampaignOverview campaign={campaign} />;
      case "promoters":
        return <AdvertiserCampaignPromoters campaign={campaign} onViewApplications={handleViewApplications} />;
      case "performance":
        return (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Analytics</h3>
            <p className="text-gray-600">Performance analytics coming soon...</p>
          </div>
        );
      case "requirements":
        return <AdvertiserCampaignRequirements campaign={campaign} />;
      case "messages":
        return (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Messages</h3>
            <p className="text-gray-600">Messaging system coming soon...</p>
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
          router.push('/dashboard/campaigns');
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
            The campaign you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/dashboard/campaigns')}
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

      {/* Tabs */}
      <AdvertiserCampaignTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          {renderTabContent()}
        </div>
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
