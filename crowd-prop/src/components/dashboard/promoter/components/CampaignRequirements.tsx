"use client";

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { 
  CampaignPromoter, 
  VisibilityCampaignDetails,
  ConsultantCampaignDetails,
  SalesmanCampaignDetails
} from "@/interfaces/campaign-promoter";
import { CampaignType } from "@/app/enums/campaign-type";

interface CampaignRequirementsProps {
  campaign: CampaignPromoter;
}

export default function CampaignRequirements({ campaign }: CampaignRequirementsProps) {
  const renderSpecificRequirements = () => {
    const requirements = [];

    switch (campaign.campaign.type) {
      case CampaignType.VISIBILITY:
        const visibilityDetails = campaign.campaign as VisibilityCampaignDetails;
        if (visibilityDetails.minFollowers) {
          requirements.push(
            <div key="minFollowers" className="flex items-start space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="text-gray-700">
                Minimum {visibilityDetails.minFollowers.toLocaleString()} followers required on social media
              </span>
            </div>
          );
        }
        break;

      case CampaignType.CONSULTANT:
        const consultantDetails = campaign.campaign as ConsultantCampaignDetails;
        if (consultantDetails.expertiseRequired) {
          requirements.push(
            <div key="expertise" className="flex items-start space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <span className="text-gray-700 font-medium">Required Expertise: </span>
                <span className="text-gray-600">{consultantDetails.expertiseRequired}</span>
              </div>
            </div>
          );
        }
        if (consultantDetails.meetingPlan) {
          requirements.push(
            <div key="meetings" className="flex items-start space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-purple-500 mt-0.5" />
              <span className="text-gray-700">
                Meeting Schedule: {consultantDetails.meetingPlan} meetings
              </span>
            </div>
          );
        }
        break;

      case CampaignType.SALESMAN:
        const salesmanDetails = campaign.campaign as SalesmanCampaignDetails;
        if (salesmanDetails.minFollowers) {
          requirements.push(
            <div key="salesFollowers" className="flex items-start space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-orange-500 mt-0.5" />
              <span className="text-gray-700">
                Minimum {salesmanDetails.minFollowers.toLocaleString()} followers for sales promotion
              </span>
            </div>
          );
        }
        break;
    }

    return requirements;
  };

  const renderGeneralRequirements = () => {
    if (!campaign.campaign.requirements) return null;

    return campaign.campaign.requirements.map((requirement, index) => (
      <div key={index} className="flex items-start space-x-3">
        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
        <span className="text-gray-700">{requirement}</span>
      </div>
    ));
  };

  const renderCampaignGuidelines = () => {
    switch (campaign.campaign.type) {
      case CampaignType.CONSULTANT:
        return (
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">
              Consultant Guidelines
            </h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Prepare detailed reports and recommendations</li>
              <li>• Maintain professional communication at all times</li>
              <li>• Meet all scheduled meetings and deadlines</li>
              <li>• Provide actionable insights based on data analysis</li>
            </ul>
          </div>
        );

      case CampaignType.VISIBILITY:
        return (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">
              Content Guidelines
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Always include your tracking link in posts</li>
              <li>• Disclose sponsored content as required by platform policies</li>
              <li>• Create authentic, engaging content that resonates with your audience</li>
              <li>• Track and report your campaign performance regularly</li>
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Campaign Requirements
      </h3>
      
      <div className="space-y-3">
        {renderSpecificRequirements()}
        {renderGeneralRequirements()}
      </div>

      {renderCampaignGuidelines()}
    </div>
  );
}
