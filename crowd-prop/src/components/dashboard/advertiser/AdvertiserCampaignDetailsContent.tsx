'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateCampaignWizard from './CreateCampaignWizard';

interface AdvertiserCampaignDetailsContentProps {
  campaignId: string;
}

export default function AdvertiserCampaignDetailsContent({ campaignId }: AdvertiserCampaignDetailsContentProps) {
  const router = useRouter();
  const [isCreateMode, setIsCreateMode] = useState(false);

  useEffect(() => {
    // Check if this is the create route
    setIsCreateMode(campaignId === 'create');
  }, [campaignId]);

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

  // Regular campaign details view (for existing campaigns)
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Campaign Details
      </h2>
      <p className="text-gray-600 mb-4">
        Campaign ID: {campaignId}
      </p>
      <p className="text-gray-600">
        Here you can view and manage the details of your advertising campaign.
      </p>
    </div>
  );
}
