'use client';

import { CampaignType } from '@/app/enums/campaign-type';
import { Deliverable, MeetingPlan, SalesTrackingMethod } from '@/app/enums/campaign-type';
import { CampaignFormData } from '../CreateCampaignWizard';
import { 
  EyeIcon, 
  UserIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  LinkIcon,
  ClockIcon,
  DocumentTextIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface CampaignSettingsStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
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
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <EyeIcon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Visibility Campaign Settings</h3>
      </div>

      {/* Access Type Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Access</label>
        <div className="flex space-x-4">
          <button
            type="button"
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${!formData.applicationRequired ? 'bg-green-100 text-green-800 border-green-300' : 'bg-white text-gray-700 border-gray-300'}`}
            onClick={() => updateFormData({ applicationRequired: false })}
          >
            Public
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${formData.applicationRequired ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-white text-gray-700 border-gray-300'}`}
            onClick={() => updateFormData({ applicationRequired: true })}
          >
            Private
          </button>
        </div>
      </div>

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
              value={formData.cpv || ''}
              onChange={(e) => updateFormData({ cpv: e.target.value ? parseFloat(e.target.value) : null })}
              placeholder="0.50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-500 text-sm">$/100 views</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Minimum $0.50 per 100 views
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Views (Optional)
          </label>
          <input
            type="number"
            min="0"
            value={formData.maxViews || ''}
            onChange={(e) => updateFormData({ maxViews: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="10000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center">
            <LinkIcon className="h-4 w-4 mr-1" />
            Target URL *
          </div>
        </label>
        <input
          type="url"
          value={formData.trackUrl}
          onChange={(e) => updateFormData({ trackUrl: e.target.value })}
          placeholder="https://example.com/your-page"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
        <p className="mt-1 text-sm text-gray-500">
          The URL where you want to drive traffic
        </p>
      </div>
    </div>
  );

  const renderConsultantSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <UserIcon className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-medium text-gray-900">Consultant Campaign Settings</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <div className="flex items-center">
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            Expected Deliverables *
          </div>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(Deliverable).map(deliverable => (
            <button
              key={deliverable}
              type="button"
              onClick={() => toggleDeliverable(deliverable, formData.expectedDeliverables, 'expectedDeliverables')}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                formData.expectedDeliverables.includes(deliverable)
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {deliverable.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 mr-1" />
              Minimum Weekly Meeting Count *
            </div>
          </label>
          <input
            type="number"
            min="1"
            required
            value={formData.meetingCount || ''}
            onChange={(e) => {
              let value = e.target.value ? parseInt(e.target.value) : null;
              if (value !== null && value < 1) value = 1;
              updateFormData({ meetingCount: value });
            }}
            placeholder="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
          <p className="mt-1 text-sm text-gray-500">Enter the minimum number of meetings required per week.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Budget ($) (Optional)
          </label>
          <input
            type="number"
            min="10"
            step="1"
            value={formData.maxQuote || ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : null;
              updateFormData({ maxQuote: value });
            }}
            placeholder="500"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
          <p className="mt-1 text-sm text-gray-500">Set the highest amount (minimum $10) you are willing to pay for all consultant deliverables in this campaign.</p>
          {formData.maxQuote !== undefined && formData.maxQuote !== null && formData.maxQuote !== '' && formData.maxQuote < 10 && (
            <p className="mt-1 text-sm text-red-600 font-medium">Warning: Minimum allowed is $10.</p>
          )}
        </div>
      </div>

      {/* Reference URL removed as it will be provided by the selected promoter */}
    </div>
  );

  const renderSellerSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <ShoppingBagIcon className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-medium text-gray-900">Seller Campaign Settings</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Seller Requirements *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(Deliverable).map(deliverable => (
            <button
              key={deliverable}
              type="button"
              onClick={() => toggleDeliverable(deliverable, formData.sellerRequirements, 'sellerRequirements')}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                formData.sellerRequirements.includes(deliverable)
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {deliverable.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Expected Deliverables *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(Deliverable).map(deliverable => (
            <button
              key={deliverable}
              type="button"
              onClick={() => toggleDeliverable(deliverable, formData.deliverables, 'deliverables')}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                formData.deliverables.includes(deliverable)
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {deliverable.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              Meeting Plan
            </div>
          </label>
          <select
            value={formData.meetingPlan || ''}
            onChange={(e) => updateFormData({ meetingPlan: e.target.value as MeetingPlan })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          >
            <option value="">Select meeting plan</option>
            {Object.values(MeetingPlan).map(plan => (
              <option key={plan} value={plan}>
                {plan.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.deadlineStrict}
              onChange={(e) => updateFormData({ deadlineStrict: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Strict deadline</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSalesmanSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <CurrencyDollarIcon className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-medium text-gray-900">Salesman Campaign Settings</h3>
      </div>

      {/* Access Type is fixed for Salesman: isPublic: false, onlyApprovedCanSell: true */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Access</label>
        <div className="flex space-x-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium border bg-blue-100 text-blue-800 border-blue-300 cursor-not-allowed opacity-70">
            Private (Only approved promoter can sell)
          </span>
        </div>
      </div>

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
            onChange={(e) => updateFormData({ commissionPerSale: e.target.value ? parseFloat(e.target.value) : null })}
            placeholder="10.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Track Sales Via *
          </label>
          <select
            value={formData.trackSalesVia || ''}
            onChange={(e) => updateFormData({ trackSalesVia: e.target.value as SalesTrackingMethod })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          >
            <option value="">Select tracking method</option>
            {Object.values(SalesTrackingMethod).map(method => (
              <option key={method} value={method}>
                {method.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Code Prefix {formData.type === CampaignType.SALESMAN && <span className="text-red-600">*</span>}
        </label>
        <input
          type="text"
          value={formData.codePrefix}
          onChange={(e) => updateFormData({ codePrefix: e.target.value })}
          placeholder="PROMO"
          required={formData.type === CampaignType.SALESMAN}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
            formData.type === CampaignType.SALESMAN && !formData.codePrefix ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <p className="mt-1 text-sm text-gray-500">
          Prefix for generated coupon codes (e.g., PROMO-ABC123){formData.type === CampaignType.SALESMAN && ' (required)'}
        </p>
        {formData.type === CampaignType.SALESMAN && !formData.codePrefix && (
          <p className="mt-1 text-sm text-red-600 font-medium">Code Prefix is required for Salesman campaigns.</p>
        )}
      </div>

      <div className="flex items-center">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={true}
            readOnly
            disabled
            className="h-4 w-4 text-blue-600 border-gray-300 rounded cursor-not-allowed bg-gray-100"
          />
          <span className="ml-2 text-sm text-gray-700 opacity-70">Only approved promoter can sell</span>
        </label>
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
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Please select a campaign type first</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderSettings()}
    </div>
  );
}
