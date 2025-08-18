'use client';

import { useState } from 'react';
import { CampaignType } from '@/app/enums/campaign-type';
import { CampaignWizardFormData } from '../CreateCampaignWizard';
import { 
  EyeIcon, 
  UserIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import CampaignTypeInfoModal from '../CampaignTypeInfoModal';

interface CampaignTypeStepProps {
  formData: CampaignWizardFormData;
  updateFormData: (updates: Partial<CampaignWizardFormData>) => void;
  onNext?: () => void;
}

interface CampaignTypeConfig {
  type: CampaignType;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  explanation: string;
  whyChoose: string;
  color: string;
  isPublic: boolean;
  pricing: string;
  disabled?: boolean;
  comingSoon?: boolean;
}

const campaignTypes: CampaignTypeConfig[] = [
  {
    type: CampaignType.VISIBILITY,
    icon: EyeIcon,
    title: 'Visibility Campaign',
    description: 'Effortless exposure - promoters drive traffic while you pay only for results',
    explanation: 'The ultimate hands-off approach to getting more eyes on your product. Set your target and budget, then let promoters do all the work driving quality traffic to your content. Zero upfront costs, zero ongoing management required.',
    whyChoose: 'Choose this if you want maximum exposure with minimal effort and only pay for actual views delivered.',
    color: 'blue',
    isPublic: true,
    pricing: 'Per view'
  },
  {
    type: CampaignType.CONSULTANT,
    icon: UserIcon,
    title: 'Consultant Campaign',
    description: 'Get strategic advice from marketing experts',
    explanation: 'Work with a marketing expert who specializes in scaling products, sales strategies, and growth tactics. They provide strategic guidance, create detailed plans, and share their expertise to help you succeed.',
    whyChoose: 'Choose this if you want expert advice on marketing strategy, scaling techniques, or need professional guidance on how to grow your business.',
    color: 'purple',
    isPublic: false,
    pricing: 'Fixed budget'
  },
  {
    type: CampaignType.SELLER,
    icon: ShoppingBagIcon,
    title: 'Seller Campaign',
    description: 'Get hands-on promotion and social media management',
    explanation: 'A promoter can create social media accounts for your product, handle daily posting, engage with audiences, run your social media presence, and actively promote your product across platforms.',
    whyChoose: 'Choose this if you want someone to create and manage social media accounts, handle daily promotion, or take care of the actual execution of marketing activities.',
    color: 'green',
    isPublic: false,
    pricing: 'Fixed budget'
  },
  {
    type: CampaignType.SALESMAN,
    icon: CurrencyDollarIcon,
    title: 'Salesman Campaign',
    description: 'Commission-based sales through affiliate promoters',
    explanation: 'Build a network of promoters who earn commission for every sale they generate. They use unique codes or links to drive sales directly to your business.',
    whyChoose: 'Choose this if you want to scale sales, only pay for results, or build an affiliate network without upfront costs.',
    color: 'orange',
    isPublic: false,
    pricing: 'Commission only',
    disabled: true,
    comingSoon: true
  },
];

export default function CampaignTypeStep({ formData, updateFormData }: CampaignTypeStepProps) {
  const [selectedInfoType, setSelectedInfoType] = useState<CampaignType | null>(null);
  
  const handleTypeSelect = (type: CampaignType) => {
    // Check if the campaign type is disabled
    const campaign = campaignTypes.find(c => c.type === type);
    if (campaign?.disabled) {
      console.log('Campaign type is disabled:', type);
      return; // Prevent selection of disabled campaign types
    }

    // Reset all form data except type to avoid errors from previous step values
    updateFormData({
      type,
      // Reset all other fields to their initial values
      title: '',
      description: '',
      files: [],
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
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Choose Your Campaign Type
        </h3>
        <p className="text-gray-600 text-sm">
          Select the campaign type that best matches your marketing goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {campaignTypes.map((campaign) => {
          const Icon = campaign.icon;
          const isSelected = formData.type === campaign.type;

          return (
            <div
              key={campaign.type}
              className={`relative rounded-lg border transition-all duration-200 ${
                campaign.disabled 
                  ? 'border-gray-200 cursor-not-allowed group' 
                  : `hover:shadow-md ${getSelectionClasses(campaign.type, isSelected)}`
              }`}
              title={campaign.disabled ? "Coming Soon" : ""}
            >
              {/* Coming Soon Tooltip */}
              {campaign.disabled && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200 pointer-events-none z-5 group-hover:backdrop-blur-sm">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                      Coming Soon
                    </div>
                  </div>
                </div>
              )}

              {/* Info Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedInfoType(campaign.type);
                }}
                className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-80 rounded-full transition-colors z-10"
                title="More information"
              >
                <InformationCircleIcon className="h-4 w-4" />
              </button>

              {/* Main Card Content */}
              <div
                onClick={(e) => {
                  if (campaign.disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                  handleTypeSelect(campaign.type);
                }}
                className={`w-full p-4 text-left ${
                  campaign.disabled 
                    ? 'cursor-not-allowed select-none' 
                    : 'cursor-pointer hover:bg-opacity-80'
                }`}
                role="button"
                tabIndex={campaign.disabled ? -1 : 0}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected 
                      ? 'bg-white shadow-sm' 
                      : 'bg-gray-50'
                  }`}>
                    <Icon className={`h-5 w-5 ${getIconClasses(campaign.type, isSelected)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 mb-1">
                      {campaign.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                      {campaign.description}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mb-3">
                  <p className="text-xs text-gray-700 leading-relaxed mb-2">
                    {campaign.explanation}
                  </p>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="text-xs font-medium text-gray-800">
                      💡 {campaign.whyChoose}
                    </p>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    campaign.isPublic 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {campaign.isPublic ? 'Public' : 'Private'}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {campaign.pricing}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Campaign Overview */}
      {formData.type && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-1.5 bg-blue-100 rounded-md">
              {(() => {
                const SelectedIcon = campaignTypes.find(c => c.type === formData.type)?.icon;
                return SelectedIcon ? <SelectedIcon className="h-4 w-4 text-blue-600" /> : null;
              })()}
            </div>
            <h4 className="text-sm font-semibold text-blue-900">
              {campaignTypes.find(c => c.type === formData.type)?.title} Selected
            </h4>
          </div>
          <div className="text-blue-800 text-xs leading-relaxed">
            {formData.type === CampaignType.VISIBILITY && (
              <p>
                <strong>Great choice!</strong> Visibility campaigns are perfect for driving targeted traffic. 
                You&apos;ll set your price per 100 views, and promoters will compete to deliver high-quality 
                traffic to your destination.
              </p>
            )}
            {formData.type === CampaignType.CONSULTANT && (
              <p>
                <strong>Excellent decision!</strong> You&apos;ll work with a marketing expert who specializes in scaling products. 
                They&apos;ll provide strategic guidance and create detailed growth plans.
              </p>
            )}
            {formData.type === CampaignType.SELLER && (
              <p>
                <strong>Smart choice!</strong> Your promoter will create and manage social media accounts for your product, 
                handle daily posting, and actively promote your business across platforms.
              </p>
            )}
            {formData.type === CampaignType.SALESMAN && (
              <p>
                <strong>Performance-focused!</strong> Build a network of promoters who only get paid when they deliver 
                sales. This risk-free model ensures you only pay for results.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Campaign Type Info Modal */}
      <CampaignTypeInfoModal
        isOpen={selectedInfoType !== null}
        onClose={() => setSelectedInfoType(null)}
        campaignType={selectedInfoType}
      />
    </div>
  );
}
