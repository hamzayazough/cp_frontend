"use client";

import {
  CampaignAdvertiser,
  AdvertiserConsultantCampaignDetails,
  AdvertiserSellerCampaignDetails,
  AdvertiserVisibilityCampaignDetails,
} from "@/app/interfaces/campaign/advertiser-campaign";
import { CampaignType } from "@/app/enums/campaign-type";
import {
  CampaignDeliverable,
  CampaignWork,
} from "@/app/interfaces/campaign-work";
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

    const visibilityCampaign = campaign.campaign as AdvertiserVisibilityCampaignDetails;
    const currentViews = visibilityCampaign.currentViews || 0;
    const maxViews = visibilityCampaign.maxViews || 1;
    const spentBudget = visibilityCampaign.spentBudget || 0;
    const budgetAllocated = visibilityCampaign.budgetAllocated || 0;
    const cpv = visibilityCampaign.cpv || 0;

    const viewsProgress = (currentViews / maxViews) * 100;
    const budgetProgress = budgetAllocated > 0 ? (spentBudget / budgetAllocated) * 100 : 0;

    return (
      <div className="space-y-4">
        {/* Compact Performance Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-blue-600 font-medium">Views</p>
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-blue-900">{currentViews.toLocaleString()}</p>
            <div className="flex justify-between text-xs text-blue-600 mt-1">
              <span>of {maxViews.toLocaleString()}</span>
              <span>{viewsProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1 mt-1">
              <div className="bg-blue-600 h-1 rounded-full transition-all duration-500" style={{ width: `${Math.min(viewsProgress, 100)}%` }}></div>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-green-600 font-medium">Budget</p>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="text-lg font-bold text-green-900">{formatCurrency(spentBudget)}</p>
            <div className="flex justify-between text-xs text-green-600 mt-1">
              <span>of {formatCurrency(budgetAllocated)}</span>
              <span>{budgetProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-1 mt-1">
              <div className="bg-green-600 h-1 rounded-full transition-all duration-500" style={{ width: `${Math.min(budgetProgress, 100)}%` }}></div>
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-purple-600 font-medium">CPV</p>
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-purple-900">{formatCurrency(cpv)}</p>
            <p className="text-xs text-purple-600 mt-1">Cost per 100 views</p>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-orange-600 font-medium">Promoters</p>
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-orange-900">{campaign.chosenPromoters?.length || 0}</p>
            <p className="text-xs text-orange-600 mt-1">Active</p>
          </div>
        </div>

        {/* Promoter Performance Table */}
        {campaign.chosenPromoters && campaign.chosenPromoters.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Promoter Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Promoter</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Views</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Earnings</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaign.chosenPromoters.map((promoter) => (
                    <tr key={promoter.promoter.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-xs">
                              {promoter.promoter.name?.split(" ").map((n) => n[0]).join("").substring(0, 2) || "N/A"}
                            </span>
                          </div>
                          <div className="ml-2">
                            <p className="text-xs font-medium text-gray-900">{promoter.promoter.name || "Unknown"}</p>
                            <p className="text-xs text-gray-500">@{promoter.promoter.email?.split("@")[0] || "unknown"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs font-medium text-gray-900">{promoter.viewsGenerated?.toLocaleString() || "0"}</td>
                      <td className="py-2 px-3 text-xs text-gray-600">{promoter.joinedAt ? formatDate(promoter.joinedAt) : "N/A"}</td>
                      <td className="py-2 px-3 text-xs font-medium text-green-600">{formatCurrency(promoter.earnings || 0)}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          promoter.status === "ONGOING" ? "bg-green-100 text-green-800"
                          : promoter.status === "COMPLETED" ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
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
    if (
      campaign.campaign.type !== CampaignType.CONSULTANT &&
      campaign.campaign.type !== CampaignType.SELLER
    )
      return null;

    const campaignDetails = campaign.campaign;
    const minBudget = campaignDetails.minBudget || 0;
    const maxBudget = campaignDetails.maxBudget || 0;
    const spentBudget = campaignDetails.spentBudget || 0;
    const meetingCount = campaignDetails.meetingCount || 0;
    const totalMeetingsDone = campaign.chosenPromoters?.reduce(
      (total, promoter) => total + (promoter.numberMeetingsDone || 0),
      0
    ) || 0;

    // Get deliverables
    let deliverables: CampaignDeliverable[] = [];
    if (campaign.campaign.type === CampaignType.CONSULTANT) {
      const consultantCampaign = campaign.campaign as AdvertiserConsultantCampaignDetails;
      deliverables = consultantCampaign.expectedDeliverables || [];
    } else if (campaign.campaign.type === CampaignType.SELLER) {
      const sellerCampaign = campaign.campaign as AdvertiserSellerCampaignDetails;
      deliverables = sellerCampaign.deliverables || [];
    }

    const completedDeliverables = deliverables.filter(d => d.isFinished).length;

    return (
      <div className="space-y-4">
        {/* Compact Performance Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-blue-600 font-medium">Budget</p>
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="text-sm font-bold text-blue-900">{formatCurrency(minBudget)} - {formatCurrency(maxBudget)}</p>
            <p className="text-xs text-blue-600">Spent: {formatCurrency(spentBudget)}</p>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-purple-600 font-medium">Meetings</p>
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-purple-900">{totalMeetingsDone}/{meetingCount * (campaign.chosenPromoters?.length || 0)}</p>
            <p className="text-xs text-purple-600">Completed</p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-green-600 font-medium">Deliverables</p>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-green-900">{completedDeliverables}/{deliverables.length}</p>
            <p className="text-xs text-green-600">Finished</p>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-orange-600 font-medium">Promoters</p>
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-orange-900">{campaign.chosenPromoters?.length || 0}</p>
            <p className="text-xs text-orange-600">Active</p>
          </div>
        </div>

        {/* Promoter Performance Table */}
        {campaign.chosenPromoters && campaign.chosenPromoters.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Promoter Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Promoter</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Meetings</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Budget</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaign.chosenPromoters.map((promoter) => (
                    <tr key={promoter.promoter.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-xs">
                              {promoter.promoter.name?.split(" ").map((n) => n[0]).join("").substring(0, 2) || "N/A"}
                            </span>
                          </div>
                          <div className="ml-2">
                            <p className="text-xs font-medium text-gray-900">{promoter.promoter.name || "Unknown"}</p>
                            <p className="text-xs text-gray-500">@{promoter.promoter.email?.split("@")[0] || "unknown"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs font-medium text-gray-900">{promoter.numberMeetingsDone || 0}/{meetingCount}</td>
                      <td className="py-2 px-3 text-xs font-medium text-green-600">{formatCurrency(promoter.budgetAllocated || 0)}</td>
                      <td className="py-2 px-3 text-xs text-gray-600">{promoter.joinedAt ? formatDate(promoter.joinedAt) : "N/A"}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          promoter.status === "ONGOING" ? "bg-green-100 text-green-800"
                          : promoter.status === "COMPLETED" ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
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

        {/* Deliverables Progress - Compact */}
        {deliverables.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Deliverables Progress</h3>
            <div className="space-y-3">
              {deliverables.map((deliverable, index) => {
                const completionPercentage = deliverable.isFinished ? 100 : deliverable.isSubmitted ? 75 : 0;
                const workCount = deliverable.promoterWork?.length || 0;

                return (
                  <div key={deliverable.id || index} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="text-xs font-medium text-orange-900 mb-1">
                          {deliverable.deliverable.replace(/_/g, " ")}
                        </h5>
                        <div className="flex items-center space-x-2 text-xs text-orange-700">
                          <span>Created: {new Date(deliverable.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Updated: {new Date(deliverable.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        deliverable.isFinished ? "bg-green-100 text-green-800"
                        : deliverable.isSubmitted ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-600"
                      }`}>
                        {deliverable.isFinished ? "Done" : deliverable.isSubmitted ? "Review" : "Pending"}
                      </span>
                    </div>

                    {/* Compact Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-orange-600">Progress</span>
                        <span className="text-xs text-orange-600 font-medium">{completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-1">
                        <div className={`h-1 rounded-full transition-all duration-300 ${
                          deliverable.isFinished ? "bg-green-500"
                          : deliverable.isSubmitted ? "bg-yellow-500" : "bg-gray-400"
                        }`} style={{ width: `${completionPercentage}%` }} />
                      </div>
                    </div>

                    {/* Work Submissions - Compact */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-orange-700">
                        <span className="font-medium">Work:</span>
                        <span className="bg-orange-100 px-2 py-1 rounded-full">{workCount} item{workCount !== 1 ? "s" : ""}</span>
                      </div>
                      {workCount > 0 && (
                        <button className="text-orange-600 hover:text-orange-800 underline">View</button>
                      )}
                    </div>

                    {/* Work Items Preview - Very Compact */}
                    {workCount > 0 && (
                      <div className="mt-2 pt-2 border-t border-orange-200">
                        <div className="space-y-1">
                          {deliverable.promoterWork?.slice(0, 2).map((work: CampaignWork, workIndex: number) => (
                            <div key={work.id || workIndex} className="flex items-center space-x-2 text-xs text-orange-700">
                              <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                              <span className="flex-1 truncate">{work.description || "Work submission"}</span>
                              <span className="text-orange-500">{new Date(work.createdAt).toLocaleDateString()}</span>
                            </div>
                          ))}
                          {workCount > 2 && (
                            <div className="text-xs text-orange-600 pl-3">+{workCount - 2} more</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
      <div className="space-y-4">
        {/* Compact Performance Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-green-600 font-medium">Sales</p>
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-lg font-bold text-green-900">{totalSales}</p>
            <p className="text-xs text-green-600">Total made</p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-blue-600 font-medium">Commission</p>
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="text-lg font-bold text-blue-900">{formatCurrency(commissionPerSale)}</p>
            <p className="text-xs text-blue-600">Per sale</p>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-purple-600 font-medium">Total Paid</p>
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-purple-900">{formatCurrency(totalCommissions)}</p>
            <p className="text-xs text-purple-600">In commissions</p>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-orange-600 font-medium">Promoters</p>
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-orange-900">{campaign.chosenPromoters?.length || 0}</p>
            <p className="text-xs text-orange-600">Active</p>
          </div>
        </div>

        {/* Tracking Information - Compact */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Sales Tracking</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Method</p>
              <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {salesmanCampaign.trackSalesVia}
              </span>
            </div>
            {salesmanCampaign.codePrefix && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Code Prefix</p>
                <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full font-mono">
                  {salesmanCampaign.codePrefix}
                </span>
              </div>
            )}
            {salesmanCampaign.refLink && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Reference Link</p>
                <a href={salesmanCampaign.refLink} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:text-blue-800 text-xs truncate block">
                  {salesmanCampaign.refLink}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Promoter Performance Table */}
        {campaign.chosenPromoters && campaign.chosenPromoters.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Promoter Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Promoter</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Earnings</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaign.chosenPromoters.map((promoter) => (
                    <tr key={promoter.promoter.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-xs">
                              {promoter.promoter.name?.split(" ").map((n) => n[0]).join("").substring(0, 2) || "N/A"}
                            </span>
                          </div>
                          <div className="ml-2">
                            <p className="text-xs font-medium text-gray-900">{promoter.promoter.name || "Unknown"}</p>
                            <p className="text-xs text-gray-500">@{promoter.promoter.email?.split("@")[0] || "unknown"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs font-medium text-green-600">{formatCurrency(promoter.earnings || 0)}</td>
                      <td className="py-2 px-3 text-xs text-gray-600">{promoter.joinedAt ? formatDate(promoter.joinedAt) : "N/A"}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          promoter.status === "ONGOING" ? "bg-green-100 text-green-800"
                          : promoter.status === "COMPLETED" ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Performance</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Live</span>
        </div>
      </div>

      {campaign.campaign.type === CampaignType.VISIBILITY && renderVisibilityPerformance()}
      {(campaign.campaign.type === CampaignType.CONSULTANT ||
        campaign.campaign.type === CampaignType.SELLER) && renderConsultantSellerPerformance()}
      {campaign.campaign.type === CampaignType.SALESMAN && renderSalesmanPerformance()}
    </div>
  );
}
