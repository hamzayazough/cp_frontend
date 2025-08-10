"use client";

import { CampaignType } from "@/app/enums/campaign-type";
import { CampaignWizardFormData } from "../CreateCampaignWizard";
import {
  EyeIcon,
  UserIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  LinkIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  calculateEstimatedBudget,
  getBudgetCalculationDescription,
  canCalculateBudget,
} from "@/utils/campaign-budget";
import { formatCurrency } from "@/utils/currency";

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
          title: "Visibility Campaign",
          color: "blue",
          description: "Drive traffic and views to your content",
        };
      case CampaignType.CONSULTANT:
        return {
          icon: UserIcon,
          title: "Consultant Campaign",
          color: "purple",
          description: "Get expert advice and strategic help",
        };
      case CampaignType.SELLER:
        return {
          icon: ShoppingBagIcon,
          title: "Seller Campaign",
          color: "green",
          description: "Have promoters create and sell for you",
        };
      case CampaignType.SALESMAN:
        return {
          icon: CurrencyDollarIcon,
          title: "Salesman Campaign",
          color: "orange",
          description: "Commission-based sales through promoters",
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
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4 shadow-md">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Review Your Campaign
        </h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Please review all details before creating your campaign
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Campaign Header */}
        <div
          className={`bg-gradient-to-r from-${typeInfo.color}-50 to-${typeInfo.color}-100 border-b border-${typeInfo.color}-200 p-4`}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`p-2 bg-white rounded-lg shadow-sm border border-${typeInfo.color}-200`}
            >
              <Icon className={`h-6 w-6 text-${typeInfo.color}-600`} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                {formData.title}
              </h4>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 bg-${typeInfo.color}-200 text-${typeInfo.color}-800 text-xs font-semibold rounded-full`}
                >
                  {typeInfo.title}
                </span>
                <span className="text-gray-600 text-xs">
                  {typeInfo.description}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="p-4 space-y-4">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h5 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-600" />
              Basic Information
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Description
                </label>
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-900 leading-relaxed">
                    {formData.description}
                  </p>
                </div>
              </div>
              {formData.advertiserTypes &&
                formData.advertiserTypes.length > 0 && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Advertiser Types
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {formData.advertiserTypes.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md border border-blue-200"
                        >
                          {type.charAt(0) +
                            type.slice(1).toLowerCase().replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Campaign Visibility
                </label>
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border ${
                      formData.type === CampaignType.VISIBILITY &&
                      formData.isPublic
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-orange-50 text-orange-800 border-orange-200"
                    }`}
                  >
                    {formData.type === CampaignType.VISIBILITY &&
                    formData.isPublic
                      ? "Public Campaign"
                      : "Private Campaign"}
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    {formData.type === CampaignType.VISIBILITY &&
                    formData.isPublic
                      ? "Any promoter can accept this campaign"
                      : "Promoters must apply and you choose one"}
                  </p>
                </div>
              </div>
              {formData.targetAudience && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Target Audience
                  </label>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-900">
                      {formData.targetAudience}
                    </p>
                  </div>
                </div>
              )}
              {formData.startDate && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Start Date
                  </label>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-900 flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1 text-blue-600" />
                      {formData.startDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {/* Show budget for Consultant and Seller campaigns */}
              {formData.type === CampaignType.CONSULTANT &&
                formData.minBudget &&
                formData.maxBudget && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Budget Range
                    </label>
                    <div className="bg-white p-3 rounded-md border border-gray-200">
                      <p className="text-sm font-bold text-green-600">
                        ${formData.minBudget} - ${formData.maxBudget}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        💰 Maximum budget will be held until completion
                      </p>
                    </div>
                  </div>
                )}
              {formData.type === CampaignType.SELLER &&
                formData.sellerMinBudget &&
                formData.sellerMaxBudget && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Budget Range
                    </label>
                    <div className="bg-white p-3 rounded-md border border-gray-200">
                      <p className="text-sm font-bold text-green-600">
                        ${formData.sellerMinBudget} - $
                        {formData.sellerMaxBudget}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        💰 Maximum budget will be held until completion
                      </p>
                    </div>
                  </div>
                )}
              {formData.deadline && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Campaign Deadline
                  </label>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-900 flex items-center mb-1">
                      <CalendarIcon className="h-3 w-3 mr-1 text-red-600" />
                      {formData.deadline.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-red-600 font-medium">
                      ⏰ Campaign will be automatically deactivated after this
                      date
                    </p>
                  </div>
                </div>
              )}
            </div>
            {formData.file && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Supporting Media
                </label>
                <div className="bg-white p-3 rounded-md border border-gray-200 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center border border-blue-200">
                    <span className="text-blue-600 text-sm">📁</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900">
                      {formData.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          {((formData.requirements && formData.requirements.length > 0) ||
            (formData.preferredPlatforms &&
              formData.preferredPlatforms.length > 0)) && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h5 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-2 text-purple-600" />
                Additional Information
              </h5>
              <div className="space-y-4">
                {formData.requirements && formData.requirements.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700">
                      Campaign Requirements
                    </label>
                    <div className="bg-white p-3 rounded-md border border-purple-200">
                      <ul className="text-xs text-gray-900 space-y-1">
                        {formData.requirements
                          .filter((req) => req.trim())
                          .map((requirement, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-purple-500 mr-2 mt-0.5">
                                •
                              </span>
                              <span className="flex-1">{requirement}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}
                {formData.preferredPlatforms &&
                  formData.preferredPlatforms.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-700">
                        Preferred Platforms
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {formData.preferredPlatforms.map((platform) => (
                          <span
                            key={platform}
                            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-md border border-purple-200"
                          >
                            {platform.charAt(0) +
                              platform.slice(1).toLowerCase()}
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
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h5 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                <EyeIcon className="h-4 w-4 mr-2 text-blue-600" />
                Visibility Settings
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Cost Per 100 Views
                  </label>
                  <div className="bg-white p-3 rounded-md border border-blue-200">
                    <p className="text-sm font-bold text-blue-600">
                      ${formData.cpv}/view
                    </p>
                  </div>
                </div>
                {formData.maxViews && (
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Max Views
                    </label>
                    <div className="bg-white p-3 rounded-md border border-blue-200">
                      <p className="text-sm font-bold text-blue-600">
                        {formData.maxViews.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Target URL
                  </label>
                  <div className="bg-white p-3 rounded-md border border-blue-200">
                    <p className="text-xs text-gray-900 flex items-center">
                      <LinkIcon className="h-3 w-3 mr-1 text-blue-600 flex-shrink-0" />
                      <a
                        href={formData.trackingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 truncate font-medium"
                      >
                        {formData.trackingLink}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.type === CampaignType.CONSULTANT && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h5 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-purple-600" />
                Consultant Settings
              </h5>
              <div className="space-y-4">
                {formData.expectedDeliverables &&
                  formData.expectedDeliverables.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-700">
                        Expected Deliverables
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {formData.expectedDeliverables.map((deliverable) => (
                          <span
                            key={deliverable}
                            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-md border border-purple-200"
                          >
                            {deliverable.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.meetingCount && (
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-700">
                        Meeting Count
                      </label>
                      <div className="bg-white p-3 rounded-md border border-purple-200">
                        <p className="text-sm font-bold text-purple-600">
                          {formData.meetingCount}
                        </p>
                      </div>
                    </div>
                  )}
                  {formData.maxBudget && formData.minBudget && (
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-700">
                        Budget Range
                      </label>
                      <div className="bg-white p-3 rounded-md border border-purple-200">
                        <p className="text-sm font-bold text-green-600">
                          ${formData.minBudget} - ${formData.maxBudget}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          💰 Maximum budget will be held until completion
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {formData.type === CampaignType.SELLER && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h5 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                <ShoppingBagIcon className="h-4 w-4 mr-2 text-green-600" />
                Seller Settings
              </h5>
              <div className="space-y-4">
                {formData.sellerRequirements &&
                  formData.sellerRequirements.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-700">
                        Seller Requirements
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {formData.sellerRequirements.map((requirement) => (
                          <span
                            key={requirement}
                            className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-md border border-orange-200"
                          >
                            {requirement.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                {formData.deliverables && formData.deliverables.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700">
                      Expected Deliverables
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.deliverables.map((deliverable) => (
                        <span
                          key={deliverable}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-md border border-green-200"
                        >
                          {deliverable.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.sellerMeetingPlan && (
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-700">
                        Meeting Plan
                      </label>
                      <div className="bg-white p-3 rounded-md border border-green-200">
                        <p className="text-xs font-bold text-green-600">
                          {formData.sellerMeetingPlan.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                  )}
                  {formData.sellerMinBudget && formData.sellerMaxBudget && (
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-700">
                        Budget Range
                      </label>
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <p className="text-lg font-bold text-green-600">
                          ${formData.sellerMinBudget} - $
                          {formData.sellerMaxBudget}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          💰 Maximum budget will be held until completion
                        </p>
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
                  <label className="block text-sm font-semibold text-gray-700">
                    Commission Per Sale
                  </label>
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <p className="text-lg font-bold text-orange-600">
                      ${formData.commissionPerSale}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Track Sales Via
                  </label>
                  <div className="bg-white p-4 rounded-lg border border-orange-200">
                    <p className="text-sm font-semibold text-orange-600">
                      {formData.trackSalesVia?.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
                {formData.codePrefix && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Code Prefix
                    </label>
                    <div className="bg-white p-4 rounded-lg border border-orange-200">
                      <p className="text-sm font-mono font-bold text-orange-600">
                        {formData.codePrefix}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Funding Estimate Section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 shadow-lg mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center border border-green-200">
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 mb-3">
              💰 Funding Requirements
            </h4>
            {canCalculateBudget(formData) ? (
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Estimated Maximum Hold:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(calculateEstimatedBudget(formData))}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {getBudgetCalculationDescription(formData)}
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800">
                      <strong>Important:</strong> This amount will be temporarily held in your wallet when you create the campaign. Unused funds are released when the campaign ends.
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Next step:</strong> We&apos;ll verify you have sufficient funds before creating the campaign.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Funding requirements will be calculated based on your campaign settings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              🚀 Ready to Launch Your Campaign?
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              After verifying your funding, your campaign will be created and made available to promoters
              immediately. You can always edit, pause, or manage it later from
              your campaign dashboard.
            </p>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                💡 <strong>Next Steps:</strong> Click &quot;Verify Funds&quot; to check your wallet balance, then create your campaign. You&apos;ll receive
                notifications when applications come in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
