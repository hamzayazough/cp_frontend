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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost Per View (CPV) *
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.cpv || ''}
              onChange={(e) => updateFormData({ cpv: e.target.value ? parseFloat(e.target.value) : null })}
              placeholder="0.05"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-500 text-sm">$/view</span>
            </div>
          </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              Meeting Count (Optional)
            </div>
          </label>
          <input
            type="number"
            min="0"
            value={formData.meetingCount || ''}
            onChange={(e) => updateFormData({ meetingCount: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Quote ($) (Optional)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.maxQuote || ''}
            onChange={(e) => updateFormData({ maxQuote: e.target.value ? parseFloat(e.target.value) : null })}
            placeholder="500"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reference URL (Optional)
        </label>
        <input
          type="url"
          value={formData.referenceUrl}
          onChange={(e) => updateFormData({ referenceUrl: e.target.value })}
          placeholder="https://example.com/reference"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Track Sales Via *
          </label>
          <select
            value={formData.trackSalesVia || ''}
            onChange={(e) => updateFormData({ trackSalesVia: e.target.value as SalesTrackingMethod })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          Code Prefix (Optional)
        </label>
        <input
          type="text"
          value={formData.codePrefix}
          onChange={(e) => updateFormData({ codePrefix: e.target.value })}
          placeholder="PROMO"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Prefix for generated coupon codes (e.g., PROMO-ABC123)
        </p>
      </div>

      <div className="flex items-center">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.onlyApprovedCanSell}
            onChange={(e) => updateFormData({ onlyApprovedCanSell: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Only approved promoters can sell</span>
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
