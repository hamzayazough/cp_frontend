"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CampaignAdvertiser } from "@/app/interfaces/campaign/advertiser-campaign";
import { ApplicationStatus } from "@/app/interfaces/campaign-application";
import { AdvertiserCampaignStatus } from "@/app/interfaces/dashboard/advertiser-dashboard";
import {
  PromoterCampaignStatus,
  CampaignType,
} from "@/app/enums/campaign-type";
import { Router } from "@/lib/router";
import PayPromoterModal from "../PayPromoterModal";
import {
  getPromoterDisplayName,
  getPromoterInitials,
} from "@/utils/promoter-name";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { Promoter } from "@/app/interfaces/user";

interface AdvertiserCampaignPromotersProps {
  campaign: CampaignAdvertiser;
  onViewApplications: (campaign: CampaignAdvertiser) => void;
}

export default function AdvertiserCampaignPromoters({
  campaign,
  onViewApplications,
}: AdvertiserCampaignPromotersProps) {
  const router = useRouter();
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPromoterForPayment, setSelectedPromoterForPayment] =
    useState<Promoter | null>(null);

  const handleUserClick = (userId: string) => {
    router.push(Router.userProfile(userId));
  };

  const handlePayNow = (promoter: Promoter) => {
    console.log("Pay Now clicked for promoter:", promoter);
    console.log("Campaign supports payments:", supportsPayments);
    console.log("Campaign type:", campaign.campaign.type);
    setSelectedPromoterForPayment(promoter);
    setShowPayModal(true);
    console.log("Modal state set to true");
  };

  const handlePaymentSuccess = (amount: number) => {
    // Refresh the component or show success message
    console.log(`Payment of $${amount} processed successfully`);
    // You might want to refresh the campaign data here
  };

  // Check if campaign supports payments (Seller or Consultant)
  const supportsPayments =
    campaign.campaign.type === CampaignType.CONSULTANT ||
    campaign.campaign.type === CampaignType.SELLER;

  // Check if payment button should be shown
  const shouldShowPayButton = (promoterStatus: PromoterCampaignStatus) => {
    return (
      supportsPayments &&
      campaign.status === AdvertiserCampaignStatus.ONGOING &&
      promoterStatus === PromoterCampaignStatus.ONGOING
    );
  };

  console.log("Campaign type:", campaign.campaign.type);
  console.log("Supports payments:", supportsPayments);
  console.log("CampaignType.CONSULTANT:", CampaignType.CONSULTANT);
  console.log("CampaignType.SELLER:", CampaignType.SELLER);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getApplicationStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case ApplicationStatus.ACCEPTED:
        return "bg-green-100 text-green-800";
      case ApplicationStatus.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPromoterStatusColor = (status: PromoterCampaignStatus) => {
    switch (status) {
      case PromoterCampaignStatus.AWAITING_REVIEW:
        return "bg-yellow-100 text-yellow-800";
      case PromoterCampaignStatus.ONGOING:
        return "bg-green-100 text-green-800";
      case PromoterCampaignStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      case PromoterCampaignStatus.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return <ClockIcon className="h-4 w-4" />;
      case ApplicationStatus.ACCEPTED:
        return <CheckCircleIcon className="h-4 w-4" />;
      case ApplicationStatus.REJECTED:
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const applicants = campaign.applicants || [];
  // Handle both single object and array for chosenPromoters
  const chosenPromotersArray = Array.isArray(campaign.chosenPromoters)
    ? campaign.chosenPromoters
    : campaign.chosenPromoters
    ? [campaign.chosenPromoters]
    : [];
  const chosenPromoter = chosenPromotersArray[0]; // For backwards compatibility

  const pendingApplications = applicants.filter(
    (app) => app.applicationStatus === ApplicationStatus.PENDING
  );
  const acceptedApplications = applicants.filter(
    (app) => app.applicationStatus === ApplicationStatus.ACCEPTED
  );
  const rejectedApplications = applicants.filter(
    (app) => app.applicationStatus === ApplicationStatus.REJECTED
  );

  // For private campaigns, show chosen promoter or application status
  if (!campaign.campaign.isPublic) {
    if (chosenPromoter) {
      return (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">
                Selected Promoter
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPromoterStatusColor(
                  chosenPromoter.status
                )}`}
              >
                <CheckCircleIcon className="h-3 w-3 mr-1" />
                {chosenPromoter.status}
              </span>
            </div>

            <div className="flex items-start space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserClick(chosenPromoter.promoter.id);
                }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer"
                title={`View ${getPromoterDisplayName(
                  chosenPromoter.promoter
                )}'s profile`}
              >
                {chosenPromoter.promoter.avatarUrl ? (
                  <Image
                    src={chosenPromoter.promoter.avatarUrl}
                    alt={getPromoterDisplayName(chosenPromoter.promoter)}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  getPromoterInitials(chosenPromoter.promoter)
                )}
              </button>
              <div className="flex-1">
                <h4 className="text-base font-medium text-gray-900">
                  {getPromoterDisplayName(chosenPromoter.promoter)}
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  {chosenPromoter.promoter.bio || "No bio available"}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="text-xs font-medium text-gray-900">
                      {chosenPromoter.joinedAt
                        ? new Date(chosenPromoter.joinedAt).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Earnings</p>
                    <p className="text-xs font-medium text-gray-900">
                      {formatCurrency(chosenPromoter.earnings || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Budget Allocated</p>
                    <p className="text-xs font-medium text-gray-900">
                      {formatCurrency(chosenPromoter.budgetAllocated)}
                    </p>
                  </div>
                  {chosenPromoter.viewsGenerated && (
                    <div>
                      <p className="text-xs text-gray-500">Views Generated</p>
                      <p className="text-xs font-medium text-gray-900">
                        {formatNumber(chosenPromoter.viewsGenerated)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pay Now Button for Seller and Consultant campaigns */}
                {shouldShowPayButton(chosenPromoter.status) ? (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <button
                      onClick={() => {
                        console.log(
                          "Pay Now button clicked (private campaign)"
                        );
                        handlePayNow(chosenPromoter.promoter);
                      }}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-xs flex items-center"
                    >
                      <CreditCardIcon className="h-3 w-3 mr-1" />
                      Pay Now
                    </button>
                  </div>
                ) : supportsPayments ? (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-gray-500">
                      Payment only available when campaign and promoter are both
                      active
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-gray-500">
                      Payment not available for {campaign.campaign.type}{" "}
                      campaigns
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pay Promoter Modal for Private Campaign */}
          {selectedPromoterForPayment && (
            <>
              {console.log(
                "Rendering PayPromoterModal (private campaign) with:",
                {
                  isOpen: showPayModal,
                  selectedPromoter: selectedPromoterForPayment?.name,
                  campaignTitle: campaign.title,
                }
              )}
              <PayPromoterModal
                isOpen={showPayModal}
                onClose={() => {
                  console.log("Modal close requested (private campaign)");
                  setShowPayModal(false);
                  setSelectedPromoterForPayment(null);
                }}
                onPaymentSuccess={handlePaymentSuccess}
                campaign={campaign}
                promoter={selectedPromoterForPayment}
              />
            </>
          )}
        </div>
      );
    } else if (pendingApplications.length > 0) {
      return (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <ClockIcon className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Applications Pending Review
            </h3>
            <p className="text-gray-600 mb-4">
              You have {pendingApplications.length} application
              {pendingApplications.length !== 1 ? "s" : ""} waiting for review.
            </p>
            <button
              onClick={() => onViewApplications(campaign)}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Review Applications
            </button>
          </div>
        </div>
      );
    } else {
      return (          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <EyeIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-600 mb-4">
              No promoters have applied to this private campaign yet.
            </p>
          </div>
        );
    }
  }

  // For public campaigns, show applications overview
  if (applicants.length === 0 && chosenPromotersArray.length === 0) {
    return (        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <EyeIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Promoters Yet
          </h3>
          <p className="text-gray-600 mb-4">
            No promoters have applied to this campaign yet.
          </p>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div
        className={`grid grid-cols-1 gap-4 ${
          campaign.campaign.isPublic ? "md:grid-cols-1" : "md:grid-cols-4"
        }`}
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Active Promoters
              </p>
              <p className="text-xl font-bold text-blue-900">
                {chosenPromotersArray.length}
              </p>
            </div>
          </div>
        </div>
        {/* Only show Pending Review card for private campaigns */}
        {!campaign.campaign.isPublic && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Pending Review
                </p>
                <p className="text-xl font-bold text-yellow-900">
                  {pendingApplications.length}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Only show Accepted and Rejected cards for private campaigns */}
        {!campaign.campaign.isPublic && (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Accepted</p>
                  <p className="text-xl font-bold text-green-900">
                    {acceptedApplications.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-red-800">Rejected</p>
                  <p className="text-xl font-bold text-red-900">
                    {rejectedApplications.length}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Active Promoters Section */}
      {chosenPromotersArray.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              Active Promoters
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {chosenPromotersArray.map((chosenPromoter) => (
              <div key={chosenPromoter.promoter.id} className="p-3">
                <div className="flex items-start space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserClick(chosenPromoter.promoter.id);
                    }}
                    className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer flex-shrink-0"
                    title={`View ${getPromoterDisplayName(
                      chosenPromoter.promoter
                    )}'s profile`}
                  >
                    {chosenPromoter.promoter.avatarUrl ? (
                      <Image
                        src={chosenPromoter.promoter.avatarUrl}
                        alt={getPromoterDisplayName(chosenPromoter.promoter)}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-xs">{getPromoterInitials(chosenPromoter.promoter)}</span>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {getPromoterDisplayName(chosenPromoter.promoter)}
                      </h4>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPromoterStatusColor(
                          chosenPromoter.status
                        )} flex-shrink-0 ml-2`}
                      >
                        <CheckCircleIcon className="h-3 w-3 mr-0.5" />
                        {chosenPromoter.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                      {chosenPromoter.promoter.bio || "No bio available"}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-gray-400 text-xs">Joined</p>
                        <p className="font-medium text-gray-900 text-xs">
                          {chosenPromoter.joinedAt
                            ? new Date(
                                chosenPromoter.joinedAt
                              ).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : "Recent"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Earnings</p>
                        <p className="font-medium text-gray-900 text-xs">
                          {formatCurrency(Number(chosenPromoter.earnings) || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Views</p>
                        <p className="font-medium text-gray-900 text-xs">
                          {formatNumber(chosenPromoter.viewsGenerated || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Pay Now Button for Seller and Consultant campaigns */}
                    {shouldShowPayButton(chosenPromoter.status) ? (
                      <div className="mt-2 pt-1.5 border-t border-gray-200">
                        <button
                          onClick={() => {
                            console.log(
                              "Pay Now button clicked (active promoters)"
                            );
                            handlePayNow(chosenPromoter.promoter);
                          }}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors text-xs flex items-center"
                        >
                          <CreditCardIcon className="h-3 w-3 mr-1" />
                          Pay Now
                        </button>
                      </div>
                    ) : supportsPayments ? (
                      <div className="mt-2 pt-1.5 border-t border-gray-200">
                        <p className="text-xs text-gray-400">
                          Payment only available when both campaign and promoter are active
                        </p>
                      </div>
                    ) : (
                      <div className="mt-2 pt-1.5 border-t border-gray-200">
                        <p className="text-xs text-gray-400">
                          Payment not available for {campaign.campaign.type} campaigns
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applications List */}
      {applicants.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Applications
            </h3>
            {pendingApplications.length > 0 && (
              <button
                onClick={() => onViewApplications(campaign)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Review All Applications
              </button>
            )}
          </div>
          <div className="divide-y divide-gray-200">
            {applicants.map((applicant) => (
              <div key={applicant.promoter.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserClick(applicant.promoter.id);
                      }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer"
                      title={`View ${getPromoterDisplayName(
                        applicant.promoter
                      )}'s profile`}
                    >
                      {applicant.promoter.avatarUrl ? (
                        <Image
                          src={applicant.promoter.avatarUrl}
                          alt={getPromoterDisplayName(applicant.promoter)}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        getPromoterInitials(applicant.promoter)
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {getPromoterDisplayName(applicant.promoter)}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApplicationStatusColor(
                            applicant.applicationStatus
                          )}`}
                        >
                          {getApplicationStatusIcon(
                            applicant.applicationStatus
                          )}
                          <span className="ml-1">
                            {applicant.applicationStatus}
                          </span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {applicant.promoter.bio || "No bio available"}
                      </p>

                      {applicant.applicationMessage && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700">
                            {applicant.applicationMessage}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Rating</p>
                          <p className="font-medium text-gray-900">
                            {applicant.promoter.rating || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Views</p>
                          <p className="font-medium text-gray-900">
                            {formatNumber(
                              applicant.promoter.totalViewsGenerated || 0
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Sales</p>
                          <p className="font-medium text-gray-900">
                            $
                            {formatNumber(
                              Number(applicant.promoter.totalSales) || 0
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Joined</p>
                          <p className="font-medium text-gray-900">
                            {new Date(
                              applicant.promoter.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pay Promoter Modal */}
      {selectedPromoterForPayment && (
        <>
          {console.log("Rendering PayPromoterModal with:", {
            isOpen: showPayModal,
            selectedPromoter: selectedPromoterForPayment?.name,
            campaignTitle: campaign.title,
          })}
          <PayPromoterModal
            isOpen={showPayModal}
            onClose={() => {
              console.log("Modal close requested");
              setShowPayModal(false);
              setSelectedPromoterForPayment(null);
            }}
            onPaymentSuccess={handlePaymentSuccess}
            campaign={campaign}
            promoter={selectedPromoterForPayment}
          />
        </>
      )}
    </div>
  );
}
