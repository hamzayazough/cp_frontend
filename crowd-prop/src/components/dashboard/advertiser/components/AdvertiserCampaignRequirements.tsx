"use client";

import { CampaignAdvertiser } from "@/app/interfaces/campaign/advertiser-campaign";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface AdvertiserCampaignRequirementsProps {
  campaign: CampaignAdvertiser;
}

export default function AdvertiserCampaignRequirements({ 
  campaign 
}: AdvertiserCampaignRequirementsProps) {
  const baseRequirements = campaign.campaign.requirements || [];
  
  // Create a copy of requirements and add minFollowers if it exists and is greater than 0
  const requirements = [...baseRequirements];
  
  // Check if minFollowers is defined and greater than 0
  if ('minFollowers' in campaign.campaign && campaign.campaign.minFollowers && campaign.campaign.minFollowers > 0) {
    requirements.push(`Minimum ${campaign.campaign.minFollowers.toLocaleString()} followers required`);
  }

  if (requirements.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Requirements Set</h3>
        <p className="text-gray-600">
          This campaign doesn&apos;t have any specific requirements for promoters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Campaign Requirements
        </h3>
        <div className="space-y-3">
          {requirements.map((requirement, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{requirement}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
