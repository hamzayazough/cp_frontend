"use client";

import { CampaignType } from "@/app/enums/campaign-type";
import {
  Deliverable,
  MeetingPlan,
  SalesTrackingMethod,
} from "@/app/enums/campaign-type";
import { CampaignWizardFormData } from "../CreateCampaignWizard";
import {
  EyeIcon,
  UserIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  LinkIcon,
  ClockIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import DeliverableSelector from "../DeliverableSelector";

interface CampaignSettingsStepProps {
  formData: CampaignWizardFormData;
  updateFormData: (updates: Partial<CampaignWizardFormData>) => void;
  onNext?: () => void;
}

export default function CampaignSettingsStep({
  formData,
  updateFormData,
}: CampaignSettingsStepProps) {
  const calculatePaymentHold = () => {
    if (!formData.cpv || !formData.maxViews) return "0.00";
    const total = (formData.cpv * formData.maxViews) / 100;
    return total.toFixed(2);
  };

  const handleDeliverablesChange = (
    deliverables: Deliverable[],
    field: "expectedDeliverables" | "sellerRequirements" | "deliverables"
  ) => {
    updateFormData({ [field]: deliverables });
  };

  // Filter deliverables based on campaign type
  const getConsultantDeliverables = () => {
    return [
      Deliverable.MARKETING_STRATEGY,
      Deliverable.CONTENT_PLAN,
      Deliverable.SCRIPT,
      Deliverable.MARKET_ANALYSIS,
      Deliverable.BRAND_GUIDELINES,
      Deliverable.WEEKLY_REPORT,
      Deliverable.PERFORMANCE_AUDIT,
      Deliverable.LIVE_SESSION,
      Deliverable.PRODUCT_FEEDBACK,
      Deliverable.AD_CONCEPTS,
      Deliverable.CUSTOM
    ];
  };

  const getSellerDeliverables = () => {
    return [
      Deliverable.CREATE_SOCIAL_MEDIA_ACCOUNTS,
      Deliverable.SOCIAL_MEDIA_MANAGEMENT,
      Deliverable.SPAM_PROMOTION,
      Deliverable.PROMOTIONAL_VIDEO,
      Deliverable.VIDEO_EDITING,
      Deliverable.INSTAGRAM_POST,
      Deliverable.TIKTOK_VIDEO,
      Deliverable.BLOG_ARTICLE,
      Deliverable.EMAIL_CAMPAIGN,
      Deliverable.PAID_ADS_CREATION,
      Deliverable.PRODUCT_REVIEW,
      Deliverable.EVENT_PROMOTION,
      Deliverable.DIRECT_OUTREACH,
      Deliverable.CUSTOM
    ];
  };

  const renderVisibilitySettings = () => (
    <div className="bg-white border border-gray-200 rounded-md p-3">
      <div className="mb-2">
        <div className="flex items-center space-x-2 mb-1">
          <EyeIcon className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            Visibility Campaign Settings
          </h3>
        </div>
        <p className="text-xs text-gray-600">
          Configure pricing and audience targeting
        </p>
      </div>

      <div className="space-y-3">
        {/* Pricing Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
          <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
            <CurrencyDollarIcon className="h-3 w-3 mr-1 text-blue-600" />
            Pricing Configuration
          </h4>

          {/* Main Pricing Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cost Per 100 Views (CPV) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.50"
                  step="0.01"
                  value={formData.cpv ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
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
                  className={`w-full px-2 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs transition-all duration-200 ${
                    formData.cpv && formData.cpv < 0.5
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                  <span className="text-gray-500 text-xs">
                    $/100
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                💰 Min $0.50 per 100 views
              </p>
              {formData.cpv !== null &&
                formData.cpv !== undefined &&
                formData.cpv < 0.5 && (
                  <div className="mt-1 p-1 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-xs text-red-600">
                      CPV must be at least $0.50 per 100 views.
                    </p>
                  </div>
                )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Views *
              </label>
              <input
                type="number"
                min="10001"
                value={formData.maxViews || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    updateFormData({ maxViews: undefined });
                    return;
                  }
                  const num = parseInt(value);
                  if (isNaN(num)) return;
                  // Allow any number to be typed, validation will show errors but won't force changes
                  updateFormData({ maxViews: num });
                }}
                placeholder="10,001"
                className={`w-full px-2 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs transition-all duration-200 ${
                  formData.maxViews && formData.maxViews <= 10000
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              <p className="mt-1 text-xs text-gray-500">
                📊 Must be more than 10,000
              </p>
              {formData.maxViews !== null &&
                formData.maxViews !== undefined &&
                formData.maxViews <= 10000 && (
                  <div className="mt-1 p-1 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-xs text-red-600">
                      Max Views must be more than 10,000.
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Payment Hold Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2 mb-2">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-semibold text-gray-800 flex items-center">
                  <CurrencyDollarIcon className="h-3 w-3 mr-1 text-amber-600" />
                  Payment Hold
                </h5>
                <p className="text-xs text-gray-600">
                  Held until completion
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-amber-600">
                  ${calculatePaymentHold()}
                </span>
              </div>
            </div>
          </div>

          {/* View Tracking & Verification */}
          <div className="bg-green-50 border border-green-200 rounded-md p-2">
            <h5 className="text-xs font-semibold text-gray-800 mb-1 flex items-center">
              <ShieldCheckIcon className="h-3 w-3 mr-1 text-green-600" />
              View Tracking
            </h5>
            <div className="text-xs text-green-800">
              🛡️ Only genuine human engagement counted
            </div>
          </div>
        </div>

        {/* Audience Targeting */}
        <div className="bg-purple-50 border border-purple-200 rounded-md p-2">
          <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
            <UserIcon className="h-3 w-3 mr-1 text-purple-600" />
            Audience Requirements
          </h4>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Minimum Followers
            </label>
            <input
              type="number"
              min="0"
              value={formData.minFollowers || ""}
              onChange={(e) =>
                updateFormData({
                  minFollowers: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              placeholder="1,000"
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs hover:border-gray-400 transition-all duration-200"
            />
            <p className="mt-1 text-xs text-gray-500">
              👥 Min follower count required
            </p>
          </div>
        </div>

        {/* Destination URL */}
        <div className="bg-green-50 border border-green-200 rounded-md p-2">
          <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
            <LinkIcon className="h-3 w-3 mr-1 text-green-600" />
            Campaign Destination
          </h4>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Destination URL *
            </label>
            <input
              type="url"
              value={formData.trackingLink || ""}
              onChange={(e) => updateFormData({ trackingLink: e.target.value })}
              placeholder="https://example.com/your-page"
              className={`w-full px-2 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs transition-all duration-200 ${
                formData.trackingLink &&
                !formData.trackingLink.startsWith("https://")
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">
              🔗 Where users will be directed
            </p>
            {formData.trackingLink &&
              !formData.trackingLink.startsWith("https://") && (
                <div className="mt-1 p-1 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-600">
                    URL must start with https://
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsultantSettings = () => (
    <div className="bg-white border border-gray-200 rounded-md p-3">
      <div className="mb-2">
        <div className="flex items-center space-x-2 mb-1">
          <UserIcon className="h-4 w-4 text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            Consultant Campaign Settings
          </h3>
        </div>
        <p className="text-xs text-gray-600">
          Define deliverables, budget, and meetings
        </p>
      </div>

      <div className="space-y-3">
        {/* Expected Deliverables */}
        <DeliverableSelector
          selectedDeliverables={(formData.expectedDeliverables || []).filter(d => getConsultantDeliverables().includes(d))}
          availableDeliverables={getConsultantDeliverables()}
          onSelectionChange={(deliverables) => handleDeliverablesChange(deliverables, "expectedDeliverables")}
          title="Expected Deliverables *"
          description="📋 Select what you expect the consultant to deliver during the campaign"
          colorScheme="purple"
          campaignType="consultant"
        />

        {/* Budget Configuration */}
        <div className="bg-green-50 border border-green-200 rounded-md p-2">
          <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
            <CurrencyDollarIcon className="h-3 w-3 mr-1 text-green-600" />
            Budget Range
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Min Budget ($) *
              </label>
              <input
                type="number"
                min="10"
                step="1"
                required
                value={formData.minBudget || ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseInt(e.target.value)
                    : undefined;
                  updateFormData({ minBudget: value });
                }}
                placeholder="100"
                className={`w-full px-2 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs transition-all duration-200 ${
                  formData.minBudget &&
                  formData.maxBudget &&
                  formData.minBudget >= formData.maxBudget
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              <p className="mt-1 text-xs text-gray-500">
                💰 Minimum you&apos;ll pay
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Budget ($) *
              </label>
              <input
                type="number"
                min="10"
                step="1"
                required
                value={formData.maxBudget || ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseInt(e.target.value)
                    : undefined;
                  updateFormData({ maxBudget: value });
                }}
                placeholder="500"
                className={`w-full px-2 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs transition-all duration-200 ${
                  formData.minBudget &&
                  formData.maxBudget &&
                  formData.minBudget >= formData.maxBudget
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              <p className="mt-1 text-xs text-gray-500">
                🔒 Held until completion
              </p>
            </div>
          </div>

          {/* Budget Validation Message */}
          {formData.minBudget &&
            formData.maxBudget &&
            formData.minBudget >= formData.maxBudget && (
              <div className="mt-2 p-1 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-600">
                  ⚠️ Max budget must be higher than min budget
                </p>
              </div>
            )}
        </div>

        {/* Meeting Configuration */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
          <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
            <ClockIcon className="h-3 w-3 mr-1 text-blue-600" />
            Meeting Setup
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meeting Plan *
              </label>
              <select
                value={formData.meetingPlan || ""}
                onChange={(e) => {
                  const plan = e.target.value as MeetingPlan;
                  updateFormData({
                    meetingPlan: plan,
                    // Auto-set meeting count to 1 for ONE_TIME meetings
                    meetingCount:
                      plan === "ONE_TIME" ? 1 : formData.meetingCount,
                  });
                }}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs hover:border-gray-400 transition-all duration-200"
              >
                <option value="">Select meeting plan</option>
                {Object.values(MeetingPlan).map((plan) => (
                  <option key={plan} value={plan}>
                    {plan.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Meeting Count *
              </label>
              <input
                type="number"
                min="1"
                value={
                  formData.meetingPlan === "ONE_TIME"
                    ? 1
                    : formData.meetingCount || ""
                }
                onChange={(e) =>
                  updateFormData({
                    meetingCount: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="1"
                disabled={formData.meetingPlan === "ONE_TIME"}
                className={`w-full px-2 py-1.5 border rounded-md shadow-sm focus:outline-none text-gray-900 text-xs transition-all duration-200 ${
                  formData.meetingPlan === "ONE_TIME"
                    ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500"
                    : "border-gray-300 hover:border-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {formData.meetingPlan === "ONE_TIME" && (
                <p className="mt-1 text-xs text-blue-600">
                  ℹ️ Auto-set to 1 meeting
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Expertise Required */}
        <div className="bg-orange-50 border border-orange-200 rounded-md p-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            <div className="flex items-center">
              <UserIcon className="h-3 w-3 mr-1 text-orange-600" />
              Expertise Required
            </div>
          </label>
          <textarea
            value={formData.expertiseRequired || ""}
            onChange={(e) =>
              updateFormData({ expertiseRequired: e.target.value })
            }
            rows={2}
            placeholder="Describe the specific expertise you're looking for..."
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs hover:border-gray-400 transition-all duration-200 resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            💡 Specific skills and experience needed
          </p>
        </div>
      </div>
    </div>
  );

  const renderSellerSettings = () => (
    <div className="bg-white border border-gray-200 rounded-md p-3">
      <div className="mb-2">
        <div className="flex items-center space-x-2 mb-1">
          <ShoppingBagIcon className="h-4 w-4 text-green-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            Seller Campaign Settings
          </h3>
        </div>
        <p className="text-xs text-gray-600">
          Configure requirements, deliverables, and budget
        </p>
      </div>

      <div className="space-y-3">
        {/* Seller Requirements */}
        <DeliverableSelector
          selectedDeliverables={(formData.sellerRequirements || []).filter(d => getSellerDeliverables().includes(d))}
          availableDeliverables={getSellerDeliverables()}
          onSelectionChange={(deliverables) => handleDeliverablesChange(deliverables, "sellerRequirements")}
          title="Seller Requirements"
          description="📋 What capabilities should the seller have?"
          colorScheme="orange"
          campaignType="seller"
        />

        {/* Expected Deliverables */}
        <DeliverableSelector
          selectedDeliverables={(formData.deliverables || []).filter(d => getSellerDeliverables().includes(d))}
          availableDeliverables={getSellerDeliverables()}
          onSelectionChange={(deliverables) => handleDeliverablesChange(deliverables, "deliverables")}
          title="Expected Deliverables *"
          description="🎯 What should the seller deliver to you?"
          colorScheme="green"
          campaignType="seller"
        />

        {/* Budget Configuration */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
          <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
            <CurrencyDollarIcon className="h-3 w-3 mr-1 text-blue-600" />
            Budget Range
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Min Budget ($) *
              </label>
              <input
                type="number"
                min="10"
                step="1"
                required
                value={formData.sellerMinBudget || ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseInt(e.target.value)
                    : undefined;
                  updateFormData({ sellerMinBudget: value });
                }}
                placeholder="100"
                className={`w-full px-2 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs transition-all duration-200 ${
                  formData.sellerMinBudget &&
                  formData.sellerMaxBudget &&
                  formData.sellerMinBudget >= formData.sellerMaxBudget
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              <p className="mt-1 text-xs text-gray-500">
                💰 Minimum you&apos;ll pay
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Max Budget ($) *
              </label>
              <input
                type="number"
                min="10"
                step="1"
                required
                value={formData.sellerMaxBudget || ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseInt(e.target.value)
                    : undefined;
                  updateFormData({ sellerMaxBudget: value });
                }}
                placeholder="500"
                className={`w-full px-2 py-1.5 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs transition-all duration-200 ${
                  formData.sellerMinBudget &&
                  formData.sellerMaxBudget &&
                  formData.sellerMinBudget >= formData.sellerMaxBudget
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              <p className="mt-1 text-xs text-gray-500">
                🔒 Held until completion
              </p>
            </div>
          </div>

          {/* Budget Validation Message */}
          {formData.sellerMinBudget &&
            formData.sellerMaxBudget &&
            formData.sellerMinBudget >= formData.sellerMaxBudget && (
              <div className="mt-2 p-1 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-600">
                  ⚠️ Max budget must be higher than min budget
                </p>
              </div>
            )}
        </div>

        {/* Meeting Requirements */}
        <div className="bg-purple-50 border border-purple-200 rounded-md p-2">
          <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
            <ClockIcon className="h-3 w-3 mr-1 text-purple-600" />
            Meeting Requirements
          </h4>

          <div className="mb-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.needMeeting || false}
                onChange={(e) =>
                  updateFormData({ needMeeting: e.target.checked })
                }
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-xs font-medium text-gray-700">
                Require meeting before starting
              </span>
            </label>
          </div>

          {formData.needMeeting && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-2 border-t border-purple-200">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Meeting Plan
                </label>
                <select
                  value={formData.sellerMeetingPlan || ""}
                  onChange={(e) => {
                    const plan = e.target.value as MeetingPlan;
                    updateFormData({
                      sellerMeetingPlan: plan,
                      // Auto-set meeting count to 1 for ONE_TIME meetings
                      sellerMeetingCount:
                        plan === "ONE_TIME" ? 1 : formData.sellerMeetingCount,
                    });
                  }}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs hover:border-gray-400 transition-all duration-200"
                >
                  <option value="">Select meeting plan</option>
                  {Object.values(MeetingPlan).map((plan) => (
                    <option key={plan} value={plan}>
                      {plan.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Meeting Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={
                    formData.sellerMeetingPlan === "ONE_TIME"
                      ? 1
                      : formData.sellerMeetingCount || ""
                  }
                  onChange={(e) =>
                    updateFormData({
                      sellerMeetingCount: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="1"
                  disabled={formData.sellerMeetingPlan === "ONE_TIME"}
                  className={`w-full px-2 py-1.5 border rounded-md shadow-sm focus:outline-none text-gray-900 text-xs transition-all duration-200 ${
                    formData.sellerMeetingPlan === "ONE_TIME"
                      ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500"
                      : "border-gray-300 hover:border-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Audience Requirements */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-md p-2">
          <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
            <UserIcon className="h-3 w-3 mr-1 text-indigo-600" />
            Audience Requirements
          </h4>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Minimum Followers
            </label>
            <input
              type="number"
              min="0"
              value={formData.minFollowers || ""}
              onChange={(e) =>
                updateFormData({
                  minFollowers: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              placeholder="1,000"
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs hover:border-gray-400 transition-all duration-200"
            />
            <p className="mt-1 text-xs text-gray-500">
              👥 Min follower count required
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSalesmanSettings = () => (
    <div className="bg-white border border-gray-200 rounded-md p-3">
      <div className="mb-2">
        <div className="flex items-center space-x-2 mb-1">
          <CurrencyDollarIcon className="h-4 w-4 text-orange-600" />
          <h3 className="text-sm font-semibold text-gray-900">
            Salesman Campaign Settings
          </h3>
        </div>
        <p className="text-xs text-gray-600">
          Configure commission and sales tracking
        </p>
      </div>

      <div className="space-y-3">
        {/* Commission & Tracking */}
        <div className="bg-orange-50 border border-orange-200 rounded-md p-2">
          <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
            <CurrencyDollarIcon className="h-3 w-3 mr-1 text-orange-600" />
            Commission & Tracking
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Commission Per 1$ Sold ($) *
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={formData.commissionPerSale || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    updateFormData({ commissionPerSale: undefined });
                    return;
                  }
                  let num = parseFloat(value);
                  if (isNaN(num)) return;
                  if (num < 0) num = 0;
                  if (num > 1) num = 1;
                  num = Math.round(num * 100) / 100;
                  updateFormData({ commissionPerSale: num });
                }}
                placeholder="0.10"
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs hover:border-gray-400 transition-all duration-200"
              />
              <p className="mt-1 text-xs text-gray-500">
                💰 Per successful sale
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Track Sales Via *
              </label>
              <select
                value={formData.trackSalesVia || ""}
                onChange={(e) =>
                  updateFormData({
                    trackSalesVia: e.target.value as SalesTrackingMethod,
                  })
                }
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs hover:border-gray-400 transition-all duration-200"
              >
                <option value="">Select tracking method</option>
                {Object.values(SalesTrackingMethod).map((method) => (
                  <option key={method} value={method}>
                    {method.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                📊 How to track sales
              </p>
            </div>
          </div>
        </div>

        {/* Code Configuration */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
          <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
            <DocumentTextIcon className="h-3 w-3 mr-1 text-blue-600" />
            Coupon Code Setup
          </h4>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Code Prefix (Optional)
            </label>
            <input
              type="text"
              value={formData.codePrefix || ""}
              onChange={(e) => updateFormData({ codePrefix: e.target.value })}
              placeholder="PROMO"
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs hover:border-gray-400 transition-all duration-200"
            />
            <p className="mt-1 text-xs text-gray-500">
              🏷️ Prefix for coupon codes
            </p>
            {formData.codePrefix && (
              <div className="mt-1 p-1 bg-blue-100 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-800">
                  <strong>Preview:</strong> {formData.codePrefix}-ABC123
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Audience Requirements */}
        <div className="bg-purple-50 border border-purple-200 rounded-md p-2">
          <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
            <UserIcon className="h-3 w-3 mr-1 text-purple-600" />
            Audience Requirements
          </h4>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Minimum Followers
            </label>
            <input
              type="number"
              min="0"
              value={formData.salesmanMinFollowers || ""}
              onChange={(e) =>
                updateFormData({
                  salesmanMinFollowers: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              placeholder="1,000"
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-xs hover:border-gray-400 transition-all duration-200"
            />
            <p className="mt-1 text-xs text-gray-500">
              👥 Min follower count required
            </p>
          </div>
        </div>

        {/* Summary Card */}
        {(formData.commissionPerSale || formData.trackSalesVia) && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-md p-2">
            <h4 className="text-xs font-medium text-gray-900 mb-1 flex items-center">
              📋 Campaign Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
              {formData.commissionPerSale && (
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-3 w-3 mr-1 text-orange-600" />
                  <span>
                    <strong>Commission:</strong> ${formData.commissionPerSale}
                  </span>
                </div>
              )}
              {formData.trackSalesVia && (
                <div className="flex items-center">
                  <DocumentTextIcon className="h-3 w-3 mr-1 text-blue-600" />
                  <span>
                    <strong>Tracking:</strong>{" "}
                    {formData.trackSalesVia.replace(/_/g, " ")}
                  </span>
                </div>
              )}
              {formData.codePrefix && (
                <div className="flex items-center">
                  <DocumentTextIcon className="h-3 w-3 mr-1 text-green-600" />
                  <span>
                    <strong>Prefix:</strong> {formData.codePrefix}
                  </span>
                </div>
              )}
              {formData.salesmanMinFollowers && (
                <div className="flex items-center">
                  <UserIcon className="h-3 w-3 mr-1 text-purple-600" />
                  <span>
                    <strong>Min Followers:</strong>{" "}
                    {formData.salesmanMinFollowers.toLocaleString()}
                  </span>
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

  return <div className="space-y-3">{renderSettings()}</div>;
}
