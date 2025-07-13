'use client';

import { CampaignType } from '@/app/enums/campaign-type';
import { CampaignWizardFormData } from '../CreateCampaignWizard';
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
  formData: CampaignWizardFormData;
  updateFormData: (updates: Partial<CampaignWizardFormData>) => void;
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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Review Your Campaign
        </h3>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Please review all the details before creating your campaign
        </p>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Campaign Header */}
        <div className={`bg-gradient-to-r from-${typeInfo.color}-50 to-${typeInfo.color}-100 border-b-2 border-${typeInfo.color}-200 p-8`}>
          <div className="flex items-center space-x-6">
            <div className={`p-4 bg-white rounded-xl shadow-md border-2 border-${typeInfo.color}-200`}>
              <Icon className={`h-8 w-8 text-${typeInfo.color}-600`} />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h4>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 bg-${typeInfo.color}-200 text-${typeInfo.color}-800 text-sm font-semibold rounded-full`}>
                  {typeInfo.title}
                </span>
                <span className="text-gray-600 text-sm">{typeInfo.description}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="p-8 space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h5 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <DocumentTextIcon className="h-6 w-6 mr-3 text-blue-600" />
              Basic Information
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-900 leading-relaxed">{formData.description}</p>
                </div>
              </div>
              {formData.advertiserTypes && formData.advertiserTypes.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Advertiser Types</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.advertiserTypes.map(type => (
                      <span key={type} className="px-3 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg border border-blue-200">
                        {type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Campaign Visibility</label>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold border-2 ${
                    formData.type === CampaignType.VISIBILITY && formData.isPublic
                      ? 'bg-green-50 text-green-800 border-green-200'
                      : 'bg-orange-50 text-orange-800 border-orange-200'
                  }`}>
                    {formData.type === CampaignType.VISIBILITY && formData.isPublic ? 'Public Campaign' : 'Private Campaign'}
                  </span>
                  <p className="text-sm text-gray-600 mt-2">
                    {formData.type === CampaignType.VISIBILITY && formData.isPublic
                      ? 'Any promoter can accept this campaign'
                      : 'Promoters must apply and you choose one'}
                  </p>
                </div>
              </div>
              {formData.targetAudience && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Target Audience</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-900">{formData.targetAudience}</p>
                  </div>
                </div>
              )}
              {formData.startDate && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Start Date</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-900 flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                      {formData.startDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {/* Show budget for Consultant and Seller campaigns */}
              {(formData.type === CampaignType.CONSULTANT && formData.minBudget && formData.maxBudget) && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Budget Range</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-lg font-bold text-green-600">${formData.minBudget} - ${formData.maxBudget}</p>
                    <p className="text-xs text-gray-500 mt-1">💰 Maximum budget will be held until completion</p>
                  </div>
                </div>
              )}
              {(formData.type === CampaignType.SELLER && formData.sellerMinBudget && formData.sellerMaxBudget) && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Budget Range</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-lg font-bold text-green-600">${formData.sellerMinBudget} - ${formData.sellerMaxBudget}</p>
                    <p className="text-xs text-gray-500 mt-1">💰 Maximum budget will be held until completion</p>
                  </div>
                </div>
              )}
              {formData.deadline && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Campaign Deadline</label>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-900 flex items-center mb-1">
                      <CalendarIcon className="h-5 w-5 mr-2 text-red-600" />
                      {formData.deadline.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-red-600 font-medium">⏰ Campaign will be automatically deactivated after this date</p>
                  </div>
                </div>
              )}
            </div>
            {formData.file && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Supporting Media</label>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                    <span className="text-blue-600 text-lg">📁</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{formData.file.name}</p>
                    <p className="text-xs text-gray-500">{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          {((formData.requirements && formData.requirements.length > 0) || 
            (formData.preferredPlatforms && formData.preferredPlatforms.length > 0)) && (
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h5 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-3 text-purple-600" />
                Additional Information
              </h5>
              <div className="space-y-6">
                {formData.requirements && formData.requirements.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Campaign Requirements</label>
                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                      <ul className="text-sm text-gray-900 space-y-2">
                        {formData.requirements.filter(req => req.trim()).map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-500 mr-3 mt-1">•</span>
                            <span className="flex-1">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {formData.preferredPlatforms && formData.preferredPlatforms.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Preferred Platforms</label>
                    <div className="flex flex-wrap gap-3">
                      {formData.preferredPlatforms.map(platform => (
                        <span key={platform} className="px-4 py-2 bg-purple-100 text-purple-800 text-sm font-medium rounded-lg border border-purple-200">
                          {platform.charAt(0) + platform.slice(1).toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Campaign-specific settings */}
          {formData.type === CampaignType.VISIBILITY && (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h5 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <EyeIcon className="h-6 w-6 mr-3 text-blue-600" />
                Visibility Settings
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Cost Per View</label>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-lg font-bold text-blue-600">${formData.cpv}/view</p>
                  </div>
                </div>
                {formData.maxViews && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Max Views</label>
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <p className="text-lg font-bold text-blue-600">{formData.maxViews.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Target URL</label>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-900 flex items-center">
                      <LinkIcon className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                      <a href={formData.trackingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 truncate font-medium">
                        {formData.trackingLink}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.type === CampaignType.CONSULTANT && (
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h5 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <UserIcon className="h-6 w-6 mr-3 text-purple-600" />
                Consultant Settings
              </h5>
              <div className="space-y-6">
                {formData.expectedDeliverables && formData.expectedDeliverables.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Expected Deliverables</label>
                    <div className="flex flex-wrap gap-3">
                      {formData.expectedDeliverables.map(deliverable => (
                        <span key={deliverable} className="px-4 py-2 bg-purple-100 text-purple-800 text-sm font-medium rounded-lg border border-purple-200">
                          {deliverable.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.meetingCount && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Meeting Count</label>
                      <div className="bg-white p-4 rounded-lg border border-purple-200">
                        <p className="text-lg font-bold text-purple-600">{formData.meetingCount}</p>
                      </div>
                    </div>
                  )}
                  {formData.maxBudget && formData.minBudget && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Budget Range</label>
                      <div className="bg-white p-4 rounded-lg border border-purple-200">
                        <p className="text-lg font-bold text-green-600">${formData.minBudget} - ${formData.maxBudget}</p>
                        <p className="text-xs text-gray-500 mt-1">💰 Maximum budget will be held until completion</p>
                      </div>
                    </div>
                  )}
                </div>
                {formData.referenceUrl && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Reference URL</label>
                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                      <a href={formData.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
                        <LinkIcon className="h-5 w-5 mr-2" />
                        {formData.referenceUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {formData.type === CampaignType.SELLER && (
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h5 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <ShoppingBagIcon className="h-6 w-6 mr-3 text-green-600" />
                Seller Settings
              </h5>
              <div className="space-y-6">
                {formData.sellerRequirements && formData.sellerRequirements.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Seller Requirements</label>
                    <div className="flex flex-wrap gap-3">
                      {formData.sellerRequirements.map(requirement => (
                        <span key={requirement} className="px-4 py-2 bg-orange-100 text-orange-800 text-sm font-medium rounded-lg border border-orange-200">
                          {requirement.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {formData.deliverables && formData.deliverables.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Expected Deliverables</label>
                    <div className="flex flex-wrap gap-3">
                      {formData.deliverables.map(deliverable => (
                        <span key={deliverable} className="px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg border border-green-200">
                          {deliverable.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {formData.meetingPlan && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Meeting Plan</label>
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <p className="text-sm font-bold text-green-600">{formData.meetingPlan.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Strict Deadline</label>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${
                        formData.deadlineStrict 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {formData.deadlineStrict ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  {formData.sellerMinBudget && formData.sellerMaxBudget && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Budget Range</label>
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <p className="text-lg font-bold text-green-600">${formData.sellerMinBudget} - ${formData.sellerMaxBudget}</p>
                        <p className="text-xs text-gray-500 mt-1">💰 Maximum budget will be held until completion</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {formData.type === CampaignType.SALESMAN && (
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <h5 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 mr-3 text-orange-600" />
                Salesman Settings
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Commission Per Sale</label>
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <p className="text-lg font-bold text-orange-600">${formData.commissionPerSale}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Track Sales Via</label>
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <p className="text-sm font-semibold text-orange-600">{formData.trackSalesVia?.replace(/_/g, ' ')}</p>
                  </div>
                </div>
                {formData.codePrefix && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700">Code Prefix</label>
                    <div className="bg-white p-4 rounded-lg border border-orange-200">
                      <p className="text-sm font-mono font-bold text-orange-600">{formData.codePrefix}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 mb-2">🚀 Ready to Launch Your Campaign?</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your campaign will be created and made available to promoters immediately. 
              You can always edit, pause, or manage it later from your campaign dashboard.
            </p>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                💡 <strong>Next Steps:</strong> Once created, promoters will be able to see and apply for your campaign. You&apos;ll receive notifications when applications come in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
