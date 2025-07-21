'use client';

import { CampaignType } from '@/app/enums/campaign-type';
import { CampaignWizardFormData } from '../CreateCampaignWizard';
import { 
  EyeIcon, 
  UserIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

interface CampaignTypeStepProps {
  formData: CampaignWizardFormData;
  updateFormData: (updates: Partial<CampaignWizardFormData>) => void;
  onNext?: () => void;
}

const campaignTypes = [
  {
    type: CampaignType.VISIBILITY,
    icon: EyeIcon,
    title: 'Visibility Campaign',
    description: 'Get exposure and views on your content',
    features: [
      'Trackable shortlinks',
      'Cost per view pricing',
      'Instant promoter access',
      'View analytics'
    ],
    color: 'blue',
    isPublic: true,
  },
  {
    type: CampaignType.CONSULTANT,
    icon: UserIcon,
    title: 'Consultant Campaign',
    description: 'Get expert advice and strategic help',
    features: [
      'Expert consultations',
      'Custom deliverables',
      'Scheduled meetings',
      'Professional advice'
    ],
    color: 'purple',
    isPublic: false,
  },
  {
    type: CampaignType.SELLER,
    icon: ShoppingBagIcon,
    title: 'Seller Campaign',
    description: 'Have promoters create and sell for you',
    features: [
      'Full campaign creation',
      'Content production',
      'Audience targeting',
      'Sales execution'
    ],
    color: 'green',
    isPublic: false,
  },
  {
    type: CampaignType.SALESMAN,
    icon: CurrencyDollarIcon,
    title: 'Salesman Campaign',
    description: 'Commission-based sales through promoters',
    features: [
      'Commission per sale',
      'Referral tracking',
      'Coupon codes',
      'Sales analytics'
    ],
    color: 'orange',
    isPublic: false,
  },
];

export default function CampaignTypeStep({ formData, updateFormData }: CampaignTypeStepProps) {
  const handleTypeSelect = (type: CampaignType) => {
    // Reset all form data except type to avoid errors from previous step values
    updateFormData({
      type,
      // Reset all other fields to their initial values
      title: '',
      description: '',
      file: null,
      minBudget: undefined,
      maxBudget: undefined,
      deadline: null,
      cpv: undefined,
      maxViews: undefined,
      expectedDeliverables: [],
      sellerRequirements: [],
      deliverables: [],
      meetingCount: undefined,
      meetingPlan: undefined,
      sellerMaxBudget: undefined,
      sellerMinBudget: undefined,
      commissionPerSale: undefined,
      trackSalesVia: undefined,
      codePrefix: undefined,
      advertiserTypes: [],
      // Set isPublic based on campaign type
      isPublic: type === CampaignType.VISIBILITY || type === CampaignType.SALESMAN,
    });
  };

  const getSelectionClasses = (campaignType: CampaignType, isSelected: boolean) => {
    if (!isSelected) {
      return 'border-gray-200 hover:border-gray-300';
    }

    switch (campaignType) {
      case CampaignType.VISIBILITY:
        return 'border-blue-500 bg-blue-50 text-blue-700';
      case CampaignType.CONSULTANT:
        return 'border-purple-500 bg-purple-50 text-purple-700';
      case CampaignType.SELLER:
        return 'border-green-500 bg-green-50 text-green-700';
      case CampaignType.SALESMAN:
        return 'border-orange-500 bg-orange-50 text-orange-700';
      default:
        return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  const getIconClasses = (campaignType: CampaignType, isSelected: boolean) => {
    if (!isSelected) {
      return 'text-gray-400';
    }

    switch (campaignType) {
      case CampaignType.VISIBILITY:
        return 'text-blue-600';
      case CampaignType.CONSULTANT:
        return 'text-purple-600';
      case CampaignType.SELLER:
        return 'text-green-600';
      case CampaignType.SALESMAN:
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Choose Your Campaign Type
        </h3>
        <p className="text-sm text-gray-600">
          Select the type of campaign that best fits your goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaignTypes.map((campaign) => {
          const Icon = campaign.icon;
          const isSelected = formData.type === campaign.type;

          return (
            <button
              key={campaign.type}
              onClick={() => handleTypeSelect(campaign.type)}
              className={`relative p-6 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
                getSelectionClasses(campaign.type, isSelected)
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  isSelected 
                    ? 'bg-white shadow-sm' 
                    : 'bg-gray-50'
                }`}>
                  <Icon className={`h-6 w-6 ${getIconClasses(campaign.type, isSelected)}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {campaign.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {campaign.description}
                  </p>
                  <ul className="space-y-1">
                    {campaign.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-500 flex items-center">
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Single access badge */}
              <div className="flex mt-4">
                <span className={`px-3 py-1 text-xs rounded-full ${
                  campaign.isPublic 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {campaign.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {formData.type && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            {campaignTypes.find(c => c.type === formData.type)?.title} - Quick Overview
          </h4>
          <div className="text-sm text-gray-600">
            {formData.type === CampaignType.VISIBILITY && (
              <p>
                <strong>Visibility campaigns</strong> are perfect for driving traffic to your website, 
                social media, or content. Promoters get paid per view, and you can track everything 
                through our analytics dashboard.
              </p>
            )}
            {formData.type === CampaignType.CONSULTANT && (
              <p>
                <strong>Consultant campaigns</strong> connect you with expert promoters who can provide 
                strategic advice, create content plans, or offer specialized services. Perfect for 
                getting professional expertise.
              </p>
            )}
            {formData.type === CampaignType.SELLER && (
              <p>
                <strong>Seller campaigns</strong> let you delegate the entire campaign creation and 
                execution to a skilled promoter. They&apos;ll create content, build campaigns, and manage 
                everything for you.
              </p>
            )}
            {formData.type === CampaignType.SALESMAN && (
              <p>
                <strong>Salesman campaigns</strong> turn promoters into your sales team. They get 
                commission for each sale they generate using referral links or coupon codes.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
