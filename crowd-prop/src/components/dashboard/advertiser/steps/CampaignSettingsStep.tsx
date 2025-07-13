'use client';

import { CampaignType } from '@/app/enums/campaign-type';
import { Deliverable, MeetingPlan, SalesTrackingMethod } from '@/app/enums/campaign-type';
import { CampaignWizardFormData } from '../CreateCampaignWizard';
import { 
  EyeIcon, 
  UserIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  LinkIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface CampaignSettingsStepProps {
  formData: CampaignWizardFormData;
  updateFormData: (updates: Partial<CampaignWizardFormData>) => void;
  onNext?: () => void;
}

export default function CampaignSettingsStep({ formData, updateFormData }: CampaignSettingsStepProps) {
  const handleDeliverablesChange = (deliverables: Deliverable[], field: 'expectedDeliverables' | 'sellerRequirements' | 'deliverables') => {
    updateFormData({ [field]: deliverables });
  };

  const toggleDeliverable = (deliverable: Deliverable, currentList: Deliverable[], field: 'expectedDeliverables' | 'sellerRequirements' | 'deliverables') => {
    const newList = currentList.includes(deliverable)
      ? currentList.filter(d => d !== deliverable)
      : [...currentList, deliverable];
    handleDeliverablesChange(newList, field);
  };

  const renderVisibilitySettings = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <EyeIcon className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Visibility Campaign Settings</h3>
        </div>
        <p className="text-sm text-gray-600">Configure pricing and audience targeting for your visibility campaign</p>
      </div>

      <div className="space-y-6">
        {/* Pricing Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-600" />
            Pricing Configuration
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost Per 100 Views (CPV) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.50"
                  step="0.01"
                  value={formData.cpv ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      updateFormData({ cpv: undefined });
                      return;
                    }
                    let num = parseFloat(value);
                    if (isNaN(num)) return;
                    if (num < 0.5) {
                      num = 0.5;
                    }
                    num = Math.round(num * 100) / 100;
                    updateFormData({ cpv: num });
                  }}
                  placeholder="0.50"
                  className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-200 ${formData.cpv && formData.cpv < 0.5 ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-gray-500 text-sm font-medium">$/100 views</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                💰 Minimum $0.50 per 100 views
              </p>
              {formData.cpv !== null && formData.cpv !== undefined && formData.cpv < 0.5 && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">CPV must be at least $0.50 per 100 views.</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Views *
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxViews || ''}
                onChange={(e) => updateFormData({ maxViews: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="10,000"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 hover:border-gray-400 transition-all duration-200"
              />
              <p className="mt-2 text-sm text-gray-500">
                📊 Maximum number of views to purchase
              </p>
            </div>
          </div>
        </div>

        {/* Audience Targeting */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-purple-600" />
            Audience Requirements (Optional)
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Followers
            </label>
            <input
              type="number"
              min="0"
              value={formData.minFollowers || ''}
              onChange={(e) => updateFormData({ minFollowers: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="1,000"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 hover:border-gray-400 transition-all duration-200"
            />
            <p className="mt-2 text-sm text-gray-500">
              👥 Minimum follower count required for promoters to participate
            </p>
          </div>
        </div>

        {/* Destination URL */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <LinkIcon className="h-5 w-5 mr-2 text-green-600" />
            Campaign Destination
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination URL *
            </label>
            <input
              type="url"
              value={formData.trackingLink || ''}
              onChange={(e) => updateFormData({ trackingLink: e.target.value })}
              placeholder="https://example.com/your-page"
              className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-200 ${formData.trackingLink && !formData.trackingLink.startsWith('https://') ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
            />
            <p className="mt-2 text-sm text-gray-500">
              🔗 Enter the web address where you want users to be directed
            </p>
            {formData.trackingLink && !formData.trackingLink.startsWith('https://') && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">URL must start with https://</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsultantSettings = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <UserIcon className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Consultant Campaign Settings</h3>
        </div>
        <p className="text-sm text-gray-600">Define deliverables, budget, and meeting requirements for your consultant campaign</p>
      </div>

      <div className="space-y-6">
        {/* Expected Deliverables */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-600" />
              Expected Deliverables *
            </div>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.values(Deliverable).map(deliverable => (
              <button
                key={deliverable}
                type="button"
                onClick={() => toggleDeliverable(deliverable, formData.expectedDeliverables || [], 'expectedDeliverables')}
                className={`px-4 py-3 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                  (formData.expectedDeliverables || []).includes(deliverable)
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md transform scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300 hover:bg-purple-50 hover:shadow-sm'
                }`}
              >
                {deliverable.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-500">
            📋 Select what you expect the consultant to deliver
          </p>
        </div>

        {/* Budget Configuration */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
            Budget Range
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Budget ($) *
              </label>
              <input
                type="number"
                min="10"
                step="1"
                required
                value={formData.minBudget || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  updateFormData({ minBudget: value });
                }}
                placeholder="100"
                className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-200 ${
                  formData.minBudget && formData.maxBudget && formData.minBudget >= formData.maxBudget
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              <p className="mt-2 text-sm text-gray-500">
                💰 Minimum budget you&apos;re willing to pay
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Budget ($) *
              </label>
              <input
                type="number"
                min="10"
                step="1"
                required
                value={formData.maxBudget || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  updateFormData({ maxBudget: value });
                }}
                placeholder="500"
                className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-200 ${
                  formData.minBudget && formData.maxBudget && formData.minBudget >= formData.maxBudget
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              <p className="mt-2 text-sm text-gray-500">
                🔒 Maximum budget (will be held until campaign completion)
              </p>
            </div>
          </div>
          
          {/* Budget Validation Message */}
          {formData.minBudget && formData.maxBudget && formData.minBudget >= formData.maxBudget && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">
                ⚠️ Maximum budget must be higher than minimum budget
              </p>
            </div>
          )}
          
          {/* Budget Information */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Budget Holding:</strong> The maximum budget amount will be temporarily held in your account when the campaign starts and released upon completion or if the campaign is cancelled.
            </p>
          </div>
        </div>

        {/* Meeting Configuration */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-blue-600" />
            Meeting Setup
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Plan *
              </label>
              <select
                value={formData.meetingPlan || ''}
                onChange={(e) => {
                  const plan = e.target.value as MeetingPlan;
                  updateFormData({ 
                    meetingPlan: plan,
                    // Auto-set meeting count to 1 for ONE_TIME meetings
                    meetingCount: plan === 'ONE_TIME' ? 1 : formData.meetingCount
                  });
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 hover:border-gray-400 transition-all duration-200"
              >
                <option value="">Select meeting plan</option>
                {Object.values(MeetingPlan).map(plan => (
                  <option key={plan} value={plan}>
                    {plan.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Count *
              </label>
              <input
                type="number"
                min="1"
                value={formData.meetingPlan === 'ONE_TIME' ? 1 : (formData.meetingCount || '')}
                onChange={(e) => updateFormData({ meetingCount: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="1"
                disabled={formData.meetingPlan === 'ONE_TIME'}
                className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none text-gray-900 transition-all duration-200 ${
                  formData.meetingPlan === 'ONE_TIME' 
                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500' 
                    : 'border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {formData.meetingPlan === 'ONE_TIME' && (
                <p className="mt-2 text-sm text-blue-600">
                  ℹ️ One-time meetings are automatically set to 1 meeting
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Expertise Required */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-orange-600" />
              Expertise Required
            </div>
          </label>
          <textarea
            value={formData.expertiseRequired || ''}
            onChange={(e) => updateFormData({ expertiseRequired: e.target.value })}
            rows={4}
            placeholder="Describe the specific expertise you're looking for..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 hover:border-gray-400 transition-all duration-200 resize-none"
          />
          <p className="mt-2 text-sm text-gray-500">
            💡 Be specific about the skills and experience you need
          </p>
        </div>
      </div>
    </div>
  );

  const renderSellerSettings = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <ShoppingBagIcon className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Seller Campaign Settings</h3>
        </div>
        <p className="text-sm text-gray-600">Configure requirements, deliverables, and budget for your seller campaign</p>
      </div>

      <div className="space-y-6">
        {/* Seller Requirements */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-orange-600" />
              Seller Requirements
            </div>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.values(Deliverable).map(deliverable => (
              <button
                key={deliverable}
                type="button"
                onClick={() => toggleDeliverable(deliverable, formData.sellerRequirements || [], 'sellerRequirements')}
                className={`px-4 py-3 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                  (formData.sellerRequirements || []).includes(deliverable)
                    ? 'bg-orange-600 text-white border-orange-600 shadow-md transform scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300 hover:bg-orange-50 hover:shadow-sm'
                }`}
              >
                {deliverable.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-500">
            📋 What capabilities should the seller have?
          </p>
        </div>

        {/* Expected Deliverables */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-green-600" />
              Expected Deliverables *
            </div>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.values(Deliverable).map(deliverable => (
              <button
                key={deliverable}
                type="button"
                onClick={() => toggleDeliverable(deliverable, formData.deliverables || [], 'deliverables')}
                className={`px-4 py-3 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                  (formData.deliverables || []).includes(deliverable)
                    ? 'bg-green-600 text-white border-green-600 shadow-md transform scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-300 hover:bg-green-50 hover:shadow-sm'
                }`}
              >
                {deliverable.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-500">
            🎯 What should the seller deliver to you?
          </p>
        </div>

        {/* Budget Configuration */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-600" />
            Budget Range
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Budget ($) *
              </label>
              <input
                type="number"
                min="10"
                step="1"
                required
                value={formData.sellerMinBudget || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  updateFormData({ sellerMinBudget: value });
                }}
                placeholder="100"
                className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-200 ${
                  formData.sellerMinBudget && formData.sellerMaxBudget && formData.sellerMinBudget >= formData.sellerMaxBudget
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              <p className="mt-2 text-sm text-gray-500">
                💰 Minimum budget you&apos;re willing to pay
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Budget ($) *
              </label>
              <input
                type="number"
                min="10"
                step="1"
                required
                value={formData.sellerMaxBudget || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  updateFormData({ sellerMaxBudget: value });
                }}
                placeholder="500"
                className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-200 ${
                  formData.sellerMinBudget && formData.sellerMaxBudget && formData.sellerMinBudget >= formData.sellerMaxBudget
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              <p className="mt-2 text-sm text-gray-500">
                🔒 Maximum budget (will be held until campaign completion)
              </p>
            </div>
          </div>
          
          {/* Budget Validation Message */}
          {formData.sellerMinBudget && formData.sellerMaxBudget && formData.sellerMinBudget >= formData.sellerMaxBudget && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">
                ⚠️ Maximum budget must be higher than minimum budget
              </p>
            </div>
          )}
          
          {/* Budget Information */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Budget Holding:</strong> The maximum budget amount will be temporarily held in your account when the campaign starts and released upon completion or if the campaign is cancelled.
            </p>
          </div>
        </div>

        {/* Meeting Requirements */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-purple-600" />
            Meeting Requirements
          </h4>
          
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.needMeeting || false}
                onChange={(e) => updateFormData({ needMeeting: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">Require meeting before starting campaign</span>
            </label>
            <p className="mt-2 ml-7 text-sm text-gray-500">
              💬 Check this if you want to meet with the seller before they start working
            </p>
          </div>

          {formData.needMeeting && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-purple-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Plan
                </label>
                <select
                  value={formData.sellerMeetingPlan || ''}
                  onChange={(e) => {
                    const plan = e.target.value as MeetingPlan;
                    updateFormData({ 
                      sellerMeetingPlan: plan,
                      // Auto-set meeting count to 1 for ONE_TIME meetings
                      sellerMeetingCount: plan === 'ONE_TIME' ? 1 : formData.sellerMeetingCount
                    });
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 hover:border-gray-400 transition-all duration-200"
                >
                  <option value="">Select meeting plan</option>
                  {Object.values(MeetingPlan).map(plan => (
                    <option key={plan} value={plan}>
                      {plan.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.sellerMeetingPlan === 'ONE_TIME' ? 1 : (formData.sellerMeetingCount || '')}
                  onChange={(e) => updateFormData({ sellerMeetingCount: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="1"
                  disabled={formData.sellerMeetingPlan === 'ONE_TIME'}
                  className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none text-gray-900 transition-all duration-200 ${
                    formData.sellerMeetingPlan === 'ONE_TIME' 
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500' 
                      : 'border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {formData.sellerMeetingPlan === 'ONE_TIME' && (
                  <p className="mt-2 text-sm text-blue-600">
                    ℹ️ One-time meetings are automatically set to 1 meeting
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Audience Requirements */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Audience Requirements
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Followers
            </label>
            <input
              type="number"
              min="0"
              value={formData.minFollowers || ''}
              onChange={(e) => updateFormData({ minFollowers: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="1,000"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 hover:border-gray-400 transition-all duration-200"
            />
            <p className="mt-2 text-sm text-gray-500">
              👥 Minimum follower count required for sellers to participate
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSalesmanSettings = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <CurrencyDollarIcon className="h-6 w-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Salesman Campaign Settings</h3>
        </div>
        <p className="text-sm text-gray-600">Configure commission structure and sales tracking for your salesman campaign</p>
      </div>

      <div className="space-y-6">
        {/* Commission & Tracking */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-orange-600" />
            Commission & Tracking Setup
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Per Sale ($) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.commissionPerSale || ''}
                onChange={(e) => updateFormData({ commissionPerSale: e.target.value ? parseFloat(e.target.value) : undefined })}
                placeholder="10.00"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 hover:border-gray-400 transition-all duration-200"
              />
              <p className="mt-2 text-sm text-gray-500">
                💰 Amount paid to salesman per successful sale
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Track Sales Via *
              </label>
              <select
                value={formData.trackSalesVia || ''}
                onChange={(e) => updateFormData({ trackSalesVia: e.target.value as SalesTrackingMethod })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 hover:border-gray-400 transition-all duration-200"
              >
                <option value="">Select tracking method</option>
                {Object.values(SalesTrackingMethod).map(method => (
                  <option key={method} value={method}>
                    {method.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                📊 How will you track sales made by salesmen?
              </p>
            </div>
          </div>
        </div>

        {/* Code Configuration */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
            Coupon Code Setup
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code Prefix (Optional)
            </label>
            <input
              type="text"
              value={formData.codePrefix || ''}
              onChange={(e) => updateFormData({ codePrefix: e.target.value })}
              placeholder="PROMO"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 hover:border-gray-400 transition-all duration-200"
            />
            <p className="mt-2 text-sm text-gray-500">
              🏷️ Prefix for generated coupon codes (e.g., PROMO-ABC123)
            </p>
            {formData.codePrefix && (
              <div className="mt-3 p-3 bg-blue-100 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Preview:</strong> {formData.codePrefix}-ABC123
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Audience Requirements */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-purple-600" />
            Audience Requirements
          </h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Followers
            </label>
            <input
              type="number"
              min="0"
              value={formData.salesmanMinFollowers || ''}
              onChange={(e) => updateFormData({ salesmanMinFollowers: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="1,000"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 hover:border-gray-400 transition-all duration-200"
            />
            <p className="mt-2 text-sm text-gray-500">
              👥 Minimum follower count required for salesmen to participate
            </p>
          </div>
        </div>

        {/* Summary Card */}
        {(formData.commissionPerSale || formData.trackSalesVia) && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              📋 Campaign Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {formData.commissionPerSale && (
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2 text-orange-600" />
                  <span><strong>Commission:</strong> ${formData.commissionPerSale} per sale</span>
                </div>
              )}
              {formData.trackSalesVia && (
                <div className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-600" />
                  <span><strong>Tracking:</strong> {formData.trackSalesVia.replace(/_/g, ' ')}</span>
                </div>
              )}
              {formData.codePrefix && (
                <div className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-2 text-green-600" />
                  <span><strong>Code Prefix:</strong> {formData.codePrefix}</span>
                </div>
              )}
              {formData.salesmanMinFollowers && (
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-purple-600" />
                  <span><strong>Min Followers:</strong> {formData.salesmanMinFollowers.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => {
    switch (formData.type) {
      case CampaignType.VISIBILITY:
        return renderVisibilitySettings();
      case CampaignType.CONSULTANT:
        return renderConsultantSettings();
      case CampaignType.SELLER:
        return renderSellerSettings();
      case CampaignType.SALESMAN:
        return renderSalesmanSettings();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderSettings()}
    </div>
  );
}
