"use client";

import { CampaignAdvertiser } from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType } from "@/app/enums/campaign-type";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";

interface AdvertiserCampaignPerformanceProps {
  campaign: CampaignAdvertiser;
}

export default function AdvertiserCampaignPerformance({
  campaign,
}: AdvertiserCampaignPerformanceProps) {
  const renderVisibilityPerformance = () => {
    if (campaign.campaign.type !== CampaignType.VISIBILITY) return null;
    
    const visibilityCampaign = campaign.campaign;
    const currentViews = visibilityCampaign.currentViews || 0;
    const maxViews = visibilityCampaign.maxViews || 1;
    const spentBudget = visibilityCampaign.spentBudget || 0;
    const budgetAllocated = parseFloat(visibilityCampaign.budgetAllocated) || 0;
    const cpv = parseFloat(visibilityCampaign.cpv) || 0;
    
    const viewsProgress = (currentViews / maxViews) * 100;
    const budgetProgress = budgetAllocated > 0 ? (spentBudget / budgetAllocated) * 100 : 0;

    return (
      <div className="space-y-6">
        {/* Overall Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Views Generated</p>
                <p className="text-2xl font-bold text-blue-900">
                  {currentViews.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-blue-600">
                <span>Target: {maxViews.toLocaleString()}</span>
                <span>{viewsProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(viewsProgress, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Budget Spent</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(spentBudget)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-green-600">
                <span>Budget: {formatCurrency(budgetAllocated)}</span>
                <span>{budgetProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Cost Per View</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(cpv)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-purple-600">
                Avg. cost per view impression
              </p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Active Promoters</p>
                <p className="text-2xl font-bold text-orange-900">
                  {campaign.chosenPromoters?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-orange-600">
                Promoters working on campaign
              </p>
            </div>
          </div>
        </div>

        {/* Promoter Performance */}
        {campaign.chosenPromoters && campaign.chosenPromoters.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Promoter Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Promoter</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Views Generated</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Joined Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Earnings</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaign.chosenPromoters.map((promoter) => (
                    <tr key={promoter.promoter.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {promoter.promoter.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'N/A'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {promoter.promoter.name || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-500">@{promoter.promoter.email?.split('@')[0] || 'unknown'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-900">
                          {promoter.viewsGenerated?.toLocaleString() || '0'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {promoter.joinedAt ? formatDate(promoter.joinedAt) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(parseFloat(promoter.earnings) || 0)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          promoter.status === 'ONGOING' 
                            ? 'bg-green-100 text-green-800' 
                            : promoter.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {promoter.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderConsultantSellerPerformance = () => {
    if (campaign.campaign.type !== CampaignType.CONSULTANT && campaign.campaign.type !== CampaignType.SELLER) return null;
    
    const campaignDetails = campaign.campaign;
    const minBudget = campaignDetails.minBudget || 0;
    const maxBudget = campaignDetails.maxBudget || 0;
    const spentBudget = campaignDetails.spentBudget || 0;
    const meetingCount = campaignDetails.meetingCount || 0;
    
    return (
      <div className="space-y-6">
        {/* Overall Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Budget Range</p>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(minBudget)} - {formatCurrency(maxBudget)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Budget Spent</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(spentBudget)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Meetings</p>
                <p className="text-2xl font-bold text-purple-900">
                  {campaign.chosenPromoters?.reduce((total, promoter) => total + (promoter.numberMeetingsDone || 0), 0) || 0}
                  <span className="text-sm text-purple-600">/{meetingCount * (campaign.chosenPromoters?.length || 0)}</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 3v4H10V3" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-purple-600">
                Total meetings completed
              </p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Active Promoters</p>
                <p className="text-2xl font-bold text-orange-900">
                  {campaign.chosenPromoters?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Promoter Performance */}
        {campaign.chosenPromoters && campaign.chosenPromoters.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Promoter Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Promoter</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Meetings Done</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Links Shared</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Budget Allocated</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Joined Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaign.chosenPromoters.map((promoter) => (
                    <tr key={promoter.promoter.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {promoter.promoter.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'N/A'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {promoter.promoter.name || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-500">@{promoter.promoter.email?.split('@')[0] || 'unknown'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-900">
                          {promoter.numberMeetingsDone || 0}/{meetingCount}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(parseFloat(promoter.budgetAllocated) || 0)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {promoter.joinedAt ? formatDate(promoter.joinedAt) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          promoter.status === 'ONGOING' 
                            ? 'bg-green-100 text-green-800' 
                            : promoter.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {promoter.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Deliverables Progress */}
        {(() => {
          let deliverables = [];
          
          if (campaign.campaign.type === CampaignType.CONSULTANT) {
            deliverables = campaignDetails.expectedDeliverables || [];
          } else if (campaign.campaign.type === CampaignType.SELLER) {
            deliverables = campaignDetails.deliverables || [];
          }

          if (deliverables.length === 0) {
            return (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Deliverables Progress
                </h3>
                <div className="text-center text-gray-500 py-4">
                  No specific deliverables defined yet
                </div>
              </div>
            );
          }

          return (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Deliverables Progress
              </h3>
              <div className="space-y-4">
                {deliverables.map((deliverable, index) => {
                  const completionPercentage = deliverable.isFinished ? 100 : deliverable.isSubmitted ? 75 : 0;
                  const workCount = deliverable.promoterWork?.length || 0;
                  
                  return (
                    <div
                      key={deliverable.id || index}
                      className="bg-orange-50 p-4 rounded-lg border border-orange-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-orange-900 mb-1">
                            {deliverable.deliverable.replace(/_/g, " ")}
                          </h5>
                          <div className="flex items-center space-x-2 text-xs text-orange-700">
                            <span>Created: {new Date(deliverable.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Updated: {new Date(deliverable.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              deliverable.isFinished
                                ? "bg-green-100 text-green-800"
                                : deliverable.isSubmitted
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {deliverable.isFinished ? "Completed" : deliverable.isSubmitted ? "Under Review" : "Pending"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-orange-600">Progress</span>
                          <span className="text-xs text-orange-600 font-medium">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-orange-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              deliverable.isFinished
                                ? "bg-green-500"
                                : deliverable.isSubmitted
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                            }`}
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Work Submissions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-orange-700">
                          <span className="font-medium">Work Submissions:</span>
                          <span className="bg-orange-100 px-2 py-1 rounded-full">
                            {workCount} item{workCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {workCount > 0 && (
                          <button className="text-xs text-orange-600 hover:text-orange-800 underline">
                            View Submissions
                          </button>
                        )}
                      </div>

                      {/* Work Items Preview */}
                      {workCount > 0 && (
                        <div className="mt-3 pt-3 border-t border-orange-200">
                          <div className="space-y-2">
                            {deliverable.promoterWork?.slice(0, 2).map((work, workIndex) => (
                              <div key={work.id || workIndex} className="flex items-center space-x-2 text-xs text-orange-700">
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                <span className="flex-1 truncate">{work.description || 'Work submission'}</span>
                                <span className="text-orange-500">
                                  {new Date(work.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                            {workCount > 2 && (
                              <div className="text-xs text-orange-600 pl-4">
                                +{workCount - 2} more submission{workCount - 2 !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  const renderSalesmanPerformance = () => {
    if (campaign.campaign.type !== CampaignType.SALESMAN) return null;
    
    const salesmanCampaign = campaign.campaign;
    const totalSales = campaign.performance?.totalSalesMade || 0;
    const commissionPerSale = salesmanCampaign.commissionPerSale || 0;
    const totalCommissions = totalSales * commissionPerSale;
    
    return (
      <div className="space-y-6">
        {/* Overall Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Sales</p>
                <p className="text-2xl font-bold text-green-900">
                  {totalSales}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-green-600">
                Sales made through promoters
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Commission Rate</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(commissionPerSale)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-blue-600">
                Per sale commission
              </p>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Commissions</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(totalCommissions)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-purple-600">
                Total paid to promoters
              </p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Active Promoters</p>
                <p className="text-2xl font-bold text-orange-900">
                  {campaign.chosenPromoters?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sales Tracking Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Tracking Method</p>
              <span className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                {salesmanCampaign.trackSalesVia}
              </span>
            </div>
            {salesmanCampaign.codePrefix && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Code Prefix</p>
                <span className="inline-flex px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full font-mono">
                  {salesmanCampaign.codePrefix}
                </span>
              </div>
            )}
            {salesmanCampaign.refLink && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Reference Link</p>
                <a 
                  href={salesmanCampaign.refLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm truncate"
                >
                  {salesmanCampaign.refLink}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Promoter Performance */}
        {campaign.chosenPromoters && campaign.chosenPromoters.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Promoter Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Promoter</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Earnings</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Joined Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaign.chosenPromoters.map((promoter) => (
                    <tr key={promoter.promoter.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {promoter.promoter.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'N/A'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {promoter.promoter.name || 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-500">@{promoter.promoter.email?.split('@')[0] || 'unknown'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(parseFloat(promoter.earnings) || 0)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {promoter.joinedAt ? formatDate(promoter.joinedAt) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          promoter.status === 'ONGOING' 
                            ? 'bg-green-100 text-green-800' 
                            : promoter.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {promoter.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Performance Analytics
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Live Data</span>
        </div>
      </div>

      {campaign.campaign.type === CampaignType.VISIBILITY && renderVisibilityPerformance()}
      {(campaign.campaign.type === CampaignType.CONSULTANT || campaign.campaign.type === CampaignType.SELLER) && renderConsultantSellerPerformance()}
      {campaign.campaign.type === CampaignType.SALESMAN && renderSalesmanPerformance()}
    </div>
  );
}
