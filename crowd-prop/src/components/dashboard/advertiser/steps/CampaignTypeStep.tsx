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

const campaignTypes = [
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
    pricing: 'Project budget'
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
    pricing: 'Commission only'
  },
];

export default function CampaignTypeStep({ formData, updateFormData }: CampaignTypeStepProps) {
  const [selectedInfoType, setSelectedInfoType] = useState<CampaignType | null>(null);
  
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
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          Choose Your Campaign Type
        </h3>
        <p className="text-gray-600 text-lg">
          Select the campaign type that best matches your marketing goals and budget
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaignTypes.map((campaign) => {
          const Icon = campaign.icon;
          const isSelected = formData.type === campaign.type;

          return (
            <div
              key={campaign.type}
              className={`relative rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                getSelectionClasses(campaign.type, isSelected)
              }`}
            >
              {/* Info Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedInfoType(campaign.type);
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-80 rounded-full transition-colors z-10"
                title="More information"
              >
                <InformationCircleIcon className="h-5 w-5" />
              </button>

              {/* Main Card Content */}
              <button
                onClick={() => handleTypeSelect(campaign.type)}
                className="w-full p-6 text-left"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`p-3 rounded-xl ${
                    isSelected 
                      ? 'bg-white shadow-sm' 
                      : 'bg-gray-50'
                  }`}>
                    <Icon className={`h-7 w-7 ${getIconClasses(campaign.type, isSelected)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {campaign.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {campaign.description}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {campaign.explanation}
                  </p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-800">
                      💡 {campaign.whyChoose}
                    </p>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
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
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Campaign Overview */}
      {formData.type && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              {(() => {
                const SelectedIcon = campaignTypes.find(c => c.type === formData.type)?.icon;
                return SelectedIcon ? <SelectedIcon className="h-5 w-5 text-blue-600" /> : null;
              })()}
            </div>
            <h4 className="text-lg font-semibold text-blue-900">
              {campaignTypes.find(c => c.type === formData.type)?.title} Selected
            </h4>
          </div>
          <div className="text-blue-800 text-sm leading-relaxed">
            {formData.type === CampaignType.VISIBILITY && (
              <p>
                <strong>Great choice!</strong> Visibility campaigns are perfect for driving targeted traffic and measuring 
                real engagement. You&apos;ll set your price per 100 views, and promoters will compete to deliver high-quality 
                traffic to your destination. Every click is tracked and verified for authenticity.
              </p>
            )}
            {formData.type === CampaignType.CONSULTANT && (
              <p>
                <strong>Excellent decision!</strong> You&apos;ll work with a marketing expert who specializes in scaling products and sales strategies. 
                They&apos;ll provide strategic guidance, create detailed growth plans, and share their expertise to help you succeed.
              </p>
            )}
            {formData.type === CampaignType.SELLER && (
              <p>
                <strong>Smart choice!</strong> Your promoter will create and manage social media accounts for your product, handle daily posting, 
                engage with audiences, and actively promote your business across social platforms. Perfect for hands-on execution.
              </p>
            )}
            {formData.type === CampaignType.SALESMAN && (
              <p>
                <strong>Performance-focused!</strong> Build a network of promoters who only get paid when they deliver 
                sales. This risk-free model ensures you only pay for results, making it perfect for e-commerce and 
                product-based businesses.
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
