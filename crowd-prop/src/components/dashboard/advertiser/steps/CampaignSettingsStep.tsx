'use client';

import { CampaignType } from '@/app/enums/campaign-type';
import { Deliverable, MeetingPlan, SalesTrackingMethod } from '@/app/enums/campaign-type';
import { CampaignFormData } from '@/app/interfaces/campaign';
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
                // Allow empty string for clearing
                if (value === '') {
                  updateFormData({ cpv: undefined });
                  return;
                }
                let num = parseFloat(value);
                if (isNaN(num)) return;
                if (num < 0.5) {
                  num = 0.5;
                }
                // Always keep two decimals
                num = Math.round(num * 100) / 100;
                updateFormData({ cpv: num });
              }}
              placeholder="0.50"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${formData.cpv && formData.cpv < 0.5 ? 'border-red-500' : 'border-gray-300'}`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-500 text-sm">$/100 views</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Minimum $0.50 per 100 views
          </p>
          {formData.cpv !== null && formData.cpv !== undefined && formData.cpv < 0.5 && (
            <p className="mt-1 text-sm text-red-600 font-medium">CPV must be at least $0.50 per 100 views.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Views (Optional if you have a budget limit)
          </label>
          <input
            type="number"
            min="0"
            value={formData.maxViews || ''}
            onChange={(e) => updateFormData({ maxViews: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="10000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center">
            <LinkIcon className="h-4 w-4 mr-1" />
            Destination URL *
          </div>
        </label>
        <input
          type="url"
          value={formData.trackUrl || ''}
          onChange={(e) => updateFormData({ trackUrl: e.target.value })}
          placeholder="https://example.com/your-page"
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${formData.trackUrl && !formData.trackUrl.startsWith('https://') ? 'border-red-500' : 'border-gray-300'}`}
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter the web address where you want users to be directed.
        </p>
        {formData.trackUrl && !formData.trackUrl.startsWith('https://') && (
          <p className="mt-1 text-sm text-red-600 font-medium">URL must start with https://</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Campaign Access
        </label>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => updateFormData({ isPublic: true })}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${formData.isPublic ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            Public
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ isPublic: false })}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${!formData.isPublic ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            Private
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {formData.isPublic
            ? 'Anyone can participate in this campaign.'
            : 'People need to apply, and you are responsible for selecting participants for the campaign.'}
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
              onClick={() => toggleDeliverable(deliverable, formData.expectedDeliverables || [], 'expectedDeliverables')}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                (formData.expectedDeliverables || []).includes(deliverable)
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {deliverable.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 mr-1" />
              Meeting Count (Optional)
            </div>
          </label>
          <input
            type="number"
            min="1"
            value={formData.meetingCount || ''}
            onChange={(e) => {
              let value = e.target.value ? parseInt(e.target.value) : undefined;
              if (value && value < 1) value = 1;
              updateFormData({ meetingCount: value });
            }}
            placeholder="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
          <p className="mt-1 text-sm text-gray-500">Number of meetings required.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
              Min Budget ($) *
            </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
              Max Budget ($) *
            </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            Deadline (Optional)
          </div>
        </label>
        <input
          type="date"
          value={formData.deadline ? formData.deadline.toISOString().split('T')[0] : ''}
          onChange={(e) => updateFormData({ deadline: e.target.value ? new Date(e.target.value) : undefined })}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
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
              onClick={() => toggleDeliverable(deliverable, formData.sellerRequirements || [], 'sellerRequirements')}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                (formData.sellerRequirements || []).includes(deliverable)
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
              onClick={() => toggleDeliverable(deliverable, formData.deliverables || [], 'deliverables')}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                (formData.deliverables || []).includes(deliverable)
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
              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
              Min Budget ($) *
            </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
              Max Budget ($) *
            </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
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
            onChange={(e) => updateFormData({ commissionPerSale: e.target.value ? parseFloat(e.target.value) : undefined })}
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
