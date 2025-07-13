'use client';

import { Plus } from 'lucide-react';

export default function CreateCampaignButton() {
  const handleCreateCampaign = () => {
    // TODO: Navigate to campaign creation page or open modal
    console.log('Create new campaign');
  };

  return (
    <button
      onClick={handleCreateCampaign}
      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
    >
      <Plus className="h-4 w-4" />
      <span>Create Campaign</span>
    </button>
  );
}
