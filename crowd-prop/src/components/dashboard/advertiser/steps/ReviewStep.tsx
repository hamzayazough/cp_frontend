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
  UserGroupIcon,
  ChartBarIcon,
  TagIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  calculateEstimatedBudget,
  getBudgetCalculationDescription,
  canCalculateBudget,
} from "@/utils/campaign-budget";
import { formatCurrency } from "@/utils/currency";
import { useState } from "react";

interface ReviewStepProps {
  formData: CampaignWizardFormData;
  updateFormData: (updates: Partial<CampaignWizardFormData>) => void;
  onNext?: () => void;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'settings' | 'investment'>('overview');

  const getCampaignTypeInfo = () => {
    switch (formData.type) {
      case CampaignType.VISIBILITY:
        return {
          icon: EyeIcon,
          title: "Visibility Campaign",
          color: "blue",
          description: "Drive traffic and views to your content",
          gradient: "from-blue-500 to-blue-600",
          lightGradient: "from-blue-50 to-blue-100",
          keyMetric: formData.maxViews ? `${formData.maxViews.toLocaleString()} views` : "Visibility boost",
          costModel: formData.cpv ? `$${formData.cpv}/100 views` : "Performance-based",
        };
      case CampaignType.CONSULTANT:
        return {
          icon: UserIcon,
          title: "Consultant Campaign",
          color: "purple",
          description: "Get expert advice and strategic help",
          gradient: "from-purple-500 to-purple-600",
          lightGradient: "from-purple-50 to-purple-100",
          keyMetric: formData.meetingCount ? `${formData.meetingCount} meetings` : "Expert consultation",
          costModel: formData.maxBudget ? `$${formData.minBudget}-$${formData.maxBudget}` : "Fixed budget",
        };
      case CampaignType.SELLER:
        return {
          icon: ShoppingBagIcon,
          title: "Seller Campaign",
          color: "green",
          description: "Have promoters create and sell for you",
          gradient: "from-green-500 to-green-600",
          lightGradient: "from-green-50 to-green-100",
          keyMetric: "Product creation & sales",
          costModel: formData.sellerMaxBudget ? `$${formData.sellerMinBudget}-$${formData.sellerMaxBudget}` : "Revenue share",
        };
      case CampaignType.SALESMAN:
        return {
          icon: CurrencyDollarIcon,
          title: "Salesman Campaign",
          color: "orange",
          description: "Commission-based sales through promoters",
          gradient: "from-orange-500 to-orange-600",
          lightGradient: "from-orange-50 to-orange-100",
          keyMetric: "Commission-based sales",
          costModel: formData.commissionPerSale ? `$${formData.commissionPerSale}/sale` : "Per sale",
        };
      default:
        return null;
    }
  };

  const formatDateRange = () => {
    if (!formData.startDate && !formData.deadline) return "Flexible";
    
    if (formData.startDate && formData.deadline) {
      const diffTime = Math.abs(formData.deadline.getTime() - formData.startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
    
    if (formData.startDate) return `From ${formData.startDate.toLocaleDateString()}`;
    if (formData.deadline) return `Until ${formData.deadline.toLocaleDateString()}`;
    
    return "Flexible";
  };

  const typeInfo = getCampaignTypeInfo();
  if (!typeInfo) return null;

  const Icon = typeInfo.icon;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'requirements', label: 'Requirements', icon: DocumentTextIcon },
    { id: 'settings', label: 'Configuration', icon: LockClosedIcon },
    { id: 'investment', label: 'Investment', icon: CurrencyDollarIcon },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="mx-auto w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-3 shadow-sm">
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Review Your Campaign
        </h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Your campaign is ready to launch
        </p>
      </div>

      {/* Hero Summary Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className={`bg-gradient-to-r ${typeInfo.lightGradient} p-4 border-b border-gray-200`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`p-2 bg-gradient-to-r ${typeInfo.gradient} rounded-lg shadow-sm`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-gray-900 mb-1 truncate">
                  {formData.title}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 bg-${typeInfo.color}-200 text-${typeInfo.color}-800 text-xs font-semibold rounded-full`}>
                    {typeInfo.title}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Investment</p>
              <p className="text-sm font-bold text-gray-900">{typeInfo.costModel}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Goal</p>
              <p className="text-sm font-bold text-gray-900">{typeInfo.keyMetric}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Duration</p>
              <p className="text-sm font-bold text-gray-900">{formatDateRange()}</p>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? `border-${typeInfo.color}-500 text-${typeInfo.color}-600`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Campaign Description */}
              {formData.description && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                    <h6 className="text-sm font-semibold text-gray-900">Description</h6>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {formData.description}
                  </p>
                </div>
              )}

              {/* General Campaign Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Advertiser Types (tags) */}
                {formData.advertiserTypes && formData.advertiserTypes.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <TagIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-semibold text-gray-700">Advertiser Types (Tags)</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.advertiserTypes.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md"
                        >
                          {type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Audience */}
                {formData.targetAudience && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserGroupIcon className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-semibold text-gray-700">Target Audience</span>
                    </div>
                    <p className="text-xs text-gray-900">{formData.targetAudience}</p>
                  </div>
                )}

                {/* Campaign Timeline */}
                {(formData.startDate || formData.deadline) && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-3">
                      <CalendarIcon className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold text-gray-700">Campaign Timeline</span>
                    </div>
                    
                    {/* Visual Timeline */}
                    <div className="relative px-6 py-4">
                      {/* Timeline Line */}
                      <div className="h-1.5 bg-gradient-to-r from-green-400 via-blue-400 to-red-400 rounded-full shadow-sm"></div>
                      
                      {/* Timeline Labels */}
                      <div className="flex justify-between items-center mt-3">
                        {/* Start Date */}
                        <div className="text-left">
                          <p className="text-xs font-semibold text-gray-900">
                            {formData.startDate ? formData.startDate.toLocaleDateString() : "TBD"}
                          </p>
                          <p className="text-xs text-green-600 font-medium">Start</p>
                        </div>
                        
                        {/* End Date */}
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-900">
                            {formData.deadline ? formData.deadline.toLocaleDateString() : "Ongoing"}
                          </p>
                          <p className="text-xs text-red-600 font-medium">Deadline</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Duration Display */}
                    {formData.startDate && formData.deadline && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-900">
                            {Math.ceil(Math.abs(formData.deadline.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                          <p className="text-xs text-gray-500">Total Campaign Duration</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Supporting Media */}
                {formData.files && formData.files.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <DocumentTextIcon className="h-4 w-4 text-orange-600" />
                      <span className="text-xs font-semibold text-gray-700">Supporting Media</span>
                    </div>
                    <div className="space-y-2">
                      {formData.files.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-blue-600 text-xs">📁</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-4">
              {/* General Requirements */}
              {formData.requirements && formData.requirements.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h6 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <DocumentTextIcon className="h-4 w-4 text-red-600 mr-2" />
                    General Requirements
                  </h6>
                  <ul className="space-y-2">
                    {formData.requirements.filter(req => req.trim()).map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs text-gray-900">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Minimum Followers Requirement (Campaign Type Specific) */}
              {((formData.type === CampaignType.VISIBILITY && formData.minFollowers) ||
                (formData.type === CampaignType.SALESMAN && formData.salesmanMinFollowers) ||
                (formData.type === CampaignType.SELLER && formData.minFollowers)) && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h6 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <UserGroupIcon className="h-4 w-4 text-blue-600 mr-2" />
                    Minimum Followers Required
                  </h6>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-md border border-blue-200">
                      {formData.type === CampaignType.SALESMAN 
                        ? formData.salesmanMinFollowers?.toLocaleString()
                        : formData.minFollowers?.toLocaleString()
                      } followers
                    </span>
                  </div>
                </div>
              )}

              {/* Expertise Requirements (Consultant) */}
              {formData.type === CampaignType.CONSULTANT && formData.expertiseRequired && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h6 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <UserIcon className="h-4 w-4 text-purple-600 mr-2" />
                    Expertise Required
                  </h6>
                  <p className="text-sm text-gray-900 bg-white rounded-md p-3 border border-purple-200">
                    {formData.expertiseRequired}
                  </p>
                </div>
              )}

              {/* Meeting Requirements */}
              {((formData.type === CampaignType.CONSULTANT && formData.meetingPlan) ||
                (formData.type === CampaignType.SELLER && formData.needMeeting && formData.sellerMeetingPlan)) && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h6 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <CalendarIcon className="h-4 w-4 text-green-600 mr-2" />
                    Meeting Requirements
                  </h6>
                  <div className="space-y-3">
                    {formData.type === CampaignType.CONSULTANT && (
                      <>
                        <div className="flex items-center justify-between bg-white rounded-md p-3 border border-green-200">
                          <span className="text-sm font-medium text-gray-700">Meeting Plan:</span>
                          <span className="text-sm font-semibold text-green-600">
                            {formData.meetingPlan?.replace(/_/g, " ")}
                          </span>
                        </div>
                        {formData.meetingCount && (
                          <div className="flex items-center justify-between bg-white rounded-md p-3 border border-green-200">
                            <span className="text-sm font-medium text-gray-700">Total Meetings:</span>
                            <span className="text-sm font-semibold text-green-600">
                              {formData.meetingCount}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {formData.type === CampaignType.SELLER && formData.needMeeting && (
                      <>
                        <div className="flex items-center justify-between bg-white rounded-md p-3 border border-green-200">
                          <span className="text-sm font-medium text-gray-700">Meeting Required:</span>
                          <span className="text-sm font-semibold text-green-600">Yes</span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-md p-3 border border-green-200">
                          <span className="text-sm font-medium text-gray-700">Meeting Plan:</span>
                          <span className="text-sm font-semibold text-green-600">
                            {formData.sellerMeetingPlan?.replace(/_/g, " ")}
                          </span>
                        </div>
                        {formData.sellerMeetingCount && (
                          <div className="flex items-center justify-between bg-white rounded-md p-3 border border-green-200">
                            <span className="text-sm font-medium text-gray-700">Total Meetings:</span>
                            <span className="text-sm font-semibold text-green-600">
                              {formData.sellerMeetingCount}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Deliverables Requirements */}
              {((formData.type === CampaignType.CONSULTANT && formData.expectedDeliverables && formData.expectedDeliverables.length > 0) ||
                (formData.type === CampaignType.SELLER && formData.sellerRequirements && formData.sellerRequirements.length > 0) ||
                (formData.type === CampaignType.SELLER && formData.deliverables && formData.deliverables.length > 0)) && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h6 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <DocumentTextIcon className="h-4 w-4 text-amber-600 mr-2" />
                    Deliverables Requirements
                  </h6>
                  <div className="space-y-3">
                    {formData.type === CampaignType.CONSULTANT && formData.expectedDeliverables && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Expected Deliverables:</p>
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
                    {formData.type === CampaignType.SELLER && formData.sellerRequirements && formData.sellerRequirements.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Seller Requirements:</p>
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
                    {formData.type === CampaignType.SELLER && formData.deliverables && formData.deliverables.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Expected Deliverables:</p>
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
                  </div>
                </div>
              )}

              {/* Platform Requirements */}
              {formData.preferredPlatforms && formData.preferredPlatforms.length > 0 && (
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <h6 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <GlobeAltIcon className="h-4 w-4 text-indigo-600 mr-2" />
                    Platform Requirements
                  </h6>
                  <div className="flex flex-wrap gap-2">
                    {formData.preferredPlatforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-md border border-indigo-200"
                      >
                        {platform.charAt(0) + platform.slice(1).toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* No Requirements State */}
              {!formData.requirements?.length && 
               !formData.minFollowers && 
               !formData.salesmanMinFollowers && 
               !formData.expertiseRequired && 
               !formData.meetingPlan && 
               !(formData.needMeeting && formData.sellerMeetingPlan) &&
               !formData.expectedDeliverables?.length && 
               !formData.sellerRequirements?.length && 
               !formData.deliverables?.length && 
               !formData.preferredPlatforms?.length && (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No specific requirements defined</p>
                  <p className="text-xs text-gray-400">Promoters will work with standard campaign expectations</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Configuration Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <LockClosedIcon className="h-4 w-4 text-gray-600" />
                  <h6 className="text-sm font-semibold text-gray-900">Campaign Configuration</h6>
                </div>
                <p className="text-xs text-gray-600">
                  Technical settings and parameters specific to your {getCampaignTypeInfo()?.title.toLowerCase()}
                </p>
              </div>

              {/* Visibility Campaign Configuration */}
              {formData.type === CampaignType.VISIBILITY && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <EyeIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-semibold text-gray-700">Cost Per 100 Views</span>
                      </div>
                      <p className="text-lg font-bold text-blue-600">${formData.cpv}/100 views</p>
                      <p className="text-xs text-gray-500 mt-1">Payment per 100 views delivered</p>
                    </div>
                    {formData.maxViews && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <ChartBarIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-semibold text-gray-700">Max Views</span>
                        </div>
                        <p className="text-lg font-bold text-blue-600">{formData.maxViews.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">Maximum views to deliver</p>
                      </div>
                    )}
                    {formData.trackingLink && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <LinkIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-semibold text-gray-700">Target URL</span>
                        </div>
                        <a
                          href={formData.trackingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 truncate font-medium flex items-center"
                        >
                          <LinkIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          Visit Link
                        </a>
                        <p className="text-xs text-gray-500 mt-1">Link to promote</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Consultant Campaign Configuration */}
              {formData.type === CampaignType.CONSULTANT && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.meetingCount && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <CalendarIcon className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-semibold text-gray-700">Meeting Sessions</span>
                        </div>
                        <p className="text-lg font-bold text-purple-600">{formData.meetingCount} sessions</p>
                        <p className="text-xs text-gray-500 mt-1">Total consultation meetings</p>
                      </div>
                    )}
                    {formData.meetingPlan && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <UserIcon className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-semibold text-gray-700">Meeting Format</span>
                        </div>
                        <p className="text-lg font-bold text-purple-600">{formData.meetingPlan.replace(/_/g, " ")}</p>
                        <p className="text-xs text-gray-500 mt-1">How meetings will be conducted</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Seller Campaign Configuration */}
              {formData.type === CampaignType.SELLER && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.needMeeting && formData.sellerMeetingPlan && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <CalendarIcon className="h-4 w-4 text-green-600" />
                          <span className="text-xs font-semibold text-gray-700">Meeting Setup</span>
                        </div>
                        <p className="text-lg font-bold text-green-600">{formData.sellerMeetingPlan.replace(/_/g, " ")}</p>
                        <p className="text-xs text-gray-500 mt-1">Required meeting before work starts</p>
                      </div>
                    )}
                    {formData.sellerMeetingCount && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <UserIcon className="h-4 w-4 text-green-600" />
                          <span className="text-xs font-semibold text-gray-700">Meeting Sessions</span>
                        </div>
                        <p className="text-lg font-bold text-green-600">{formData.sellerMeetingCount} sessions</p>
                        <p className="text-xs text-gray-500 mt-1">Total planned meetings</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Salesman Campaign Configuration */}
              {formData.type === CampaignType.SALESMAN && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <CurrencyDollarIcon className="h-4 w-4 text-orange-600" />
                        <span className="text-xs font-semibold text-gray-700">Commission Rate</span>
                      </div>
                      <p className="text-lg font-bold text-orange-600">${formData.commissionPerSale} per sale</p>
                      <p className="text-xs text-gray-500 mt-1">Payment per successful sale</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <ChartBarIcon className="h-4 w-4 text-orange-600" />
                        <span className="text-xs font-semibold text-gray-700">Tracking Method</span>
                      </div>
                      <p className="text-lg font-bold text-orange-600">{formData.trackSalesVia?.replace(/_/g, " ")}</p>
                      <p className="text-xs text-gray-500 mt-1">How sales will be tracked</p>
                    </div>
                    {formData.codePrefix && (
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <TagIcon className="h-4 w-4 text-orange-600" />
                          <span className="text-xs font-semibold text-gray-700">Tracking Code Prefix</span>
                        </div>
                        <p className="text-lg font-mono font-bold text-orange-600">{formData.codePrefix}</p>
                        <p className="text-xs text-gray-500 mt-1">Prefix for promoter discount codes</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No Configuration State */}
              {((formData.type === CampaignType.VISIBILITY && !formData.cpv && !formData.maxViews && !formData.trackingLink) ||
                (formData.type === CampaignType.CONSULTANT && !formData.meetingCount && !formData.meetingPlan) ||
                (formData.type === CampaignType.SELLER && !formData.needMeeting && !formData.sellerMeetingPlan && !formData.sellerMeetingCount) ||
                (formData.type === CampaignType.SALESMAN && !formData.commissionPerSale && !formData.trackSalesVia && !formData.codePrefix)) && (
                <div className="text-center py-8">
                  <LockClosedIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No specific configuration set</p>
                  <p className="text-xs text-gray-400">Using default campaign settings</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'investment' && (
            <div className="space-y-4">
              {/* Budget Display */}
              {((formData.type === CampaignType.CONSULTANT && formData.minBudget && formData.maxBudget) ||
                (formData.type === CampaignType.SELLER && formData.sellerMinBudget && formData.sellerMaxBudget)) && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">Budget Range</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    {formData.type === CampaignType.CONSULTANT 
                      ? `$${formData.minBudget} - $${formData.maxBudget}`
                      : `$${formData.sellerMinBudget} - $${formData.sellerMaxBudget}`
                    }
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    💰 Maximum budget will be held until completion
                  </p>
                </div>
              )}

              {/* Funding Requirements */}
              {canCalculateBudget(formData) && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <ExclamationTriangleIcon className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-semibold text-gray-900">Funding Requirements</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-amber-200 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Estimated Hold:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(calculateEstimatedBudget(formData))}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {getBudgetCalculationDescription(formData)}
                    </p>
                  </div>
                  <p className="text-xs text-amber-800">
                    This amount will be temporarily held in your wallet when you create the campaign.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Ready to Launch</h4>
              <p className="text-xs text-gray-600">Your campaign is configured and ready to go live</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-blue-700">
            <span className="font-medium">Next: Verify Funds</span>
            <ArrowRightIcon className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
