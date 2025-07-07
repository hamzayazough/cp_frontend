'use client';

import Image from 'next/image';
import { CampaignType } from '@/app/enums/campaign-type';
import { CampaignFormData } from '../CreateCampaignWizard';
import { 
  EyeIcon, 
  UserIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  LinkIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ReviewStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
  onNext?: () => void;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  const getCampaignTypeInfo = () => {
    switch (formData.type) {
      case CampaignType.VISIBILITY:
        return {
          icon: EyeIcon,
          title: 'Visibility Campaign',
          color: 'blue',
          description: 'Drive traffic and views to your content'
        };
      case CampaignType.CONSULTANT:
        return {
          icon: UserIcon,
          title: 'Consultant Campaign',
          color: 'purple',
          description: 'Get expert advice and strategic help'
        };
      case CampaignType.SELLER:
        return {
          icon: ShoppingBagIcon,
          title: 'Seller Campaign',
          color: 'green',
          description: 'Have promoters create and sell for you'
        };
      case CampaignType.SALESMAN:
        return {
          icon: CurrencyDollarIcon,
          title: 'Salesman Campaign',
          color: 'orange',
          description: 'Commission-based sales through promoters'
        };
      default:
        return null;
    }
  };

  const typeInfo = getCampaignTypeInfo();
  if (!typeInfo) return null;

  const Icon = typeInfo.icon;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Review Your Campaign
        </h3>
        <p className="text-sm text-gray-600">
          Please review all the details before creating your campaign
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Campaign Header */}
        <div className={`bg-${typeInfo.color}-50 border-b border-${typeInfo.color}-100 p-6`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-${typeInfo.color}-100 rounded-lg`}>
              <Icon className={`h-6 w-6 text-${typeInfo.color}-600`} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">{formData.title}</h4>
              <p className="text-sm text-gray-600">{typeInfo.title}</p>
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <p className="text-sm text-gray-900">{formData.description}</p>
              </div>
              {formData.budget && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Budget</label>
                  <p className="text-sm text-gray-900">${formData.budget}</p>
                </div>
              )}
              {formData.deadline && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Deadline</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formData.deadline.toLocaleDateString()}
                  </p>
                </div>
              )}
              {formData.expiryDate && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formData.expiryDate.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            {formData.mediaUrl && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Media</label>
                <Image 
                  src={formData.mediaUrl} 
                  alt="Campaign media" 
                  width={128}
                  height={128}
                  className="object-cover rounded-lg border border-gray-200"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Campaign-specific settings */}
          {formData.type === CampaignType.VISIBILITY && (
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Visibility Settings</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Cost Per View</label>
                  <p className="text-sm text-gray-900">${formData.cpv}/view</p>
                </div>
                {formData.maxViews && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Max Views</label>
                    <p className="text-sm text-gray-900">{formData.maxViews.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Target URL</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <LinkIcon className="h-4 w-4 mr-1" />
                    <a href={formData.trackUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 truncate">
                      {formData.trackUrl}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {formData.type === CampaignType.CONSULTANT && (
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Consultant Settings</h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Expected Deliverables</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.expectedDeliverables.map(deliverable => (
                      <span key={deliverable} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {deliverable.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.meetingCount && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Meeting Count</label>
                      <p className="text-sm text-gray-900">{formData.meetingCount}</p>
                    </div>
                  )}
                  {formData.maxQuote && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Max Quote</label>
                      <p className="text-sm text-gray-900">${formData.maxQuote}</p>
                    </div>
                  )}
                </div>
                {formData.referenceUrl && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Reference URL</label>
                    <p className="text-sm text-gray-900">
                      <a href={formData.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        {formData.referenceUrl}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {formData.type === CampaignType.SELLER && (
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Seller Settings</h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Seller Requirements</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.sellerRequirements.map(requirement => (
                      <span key={requirement} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {requirement.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Expected Deliverables</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.deliverables.map(deliverable => (
                      <span key={deliverable} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {deliverable.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.meetingPlan && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Meeting Plan</label>
                      <p className="text-sm text-gray-900">{formData.meetingPlan.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Strict Deadline</label>
                    <p className="text-sm text-gray-900">{formData.deadlineStrict ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.type === CampaignType.SALESMAN && (
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-3">Salesman Settings</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Commission Per Sale</label>
                  <p className="text-sm text-gray-900">${formData.commissionPerSale}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Track Sales Via</label>
                  <p className="text-sm text-gray-900">{formData.trackSalesVia?.replace(/_/g, ' ')}</p>
                </div>
                {formData.codePrefix && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Code Prefix</label>
                    <p className="text-sm text-gray-900">{formData.codePrefix}</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Only Approved Can Sell</label>
                  <p className="text-sm text-gray-900">{formData.onlyApprovedCanSell ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Access */}
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-3">Campaign Access</h5>
            <div className="flex space-x-4">
              <span className={`px-3 py-1 text-sm rounded-full ${
                formData.type === CampaignType.VISIBILITY || formData.type === CampaignType.SALESMAN
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {formData.type === CampaignType.VISIBILITY || formData.type === CampaignType.SALESMAN ? 'Public' : 'Private'}
              </span>
              <span className={`px-3 py-1 text-sm rounded-full ${
                formData.type === CampaignType.CONSULTANT || formData.type === CampaignType.SELLER
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {formData.type === CampaignType.CONSULTANT || formData.type === CampaignType.SELLER ? 'Application Required' : 'Instant Access'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <DocumentTextIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Ready to launch?</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your campaign will be created and made available to promoters immediately. 
              You can always edit or pause it later from your campaign dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
