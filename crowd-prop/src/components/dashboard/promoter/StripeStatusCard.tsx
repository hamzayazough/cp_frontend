import React, { useState, useEffect } from "react";
import { useStripeOnboarding } from "@/hooks/useStripeOnboarding";
import {
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface StripeStatusCardProps {
  className?: string;
}

export default function StripeStatusCard({
  className = "",
}: StripeStatusCardProps) {
  const {
    isLoading,
    error,
    accountData,
    getAccountStatus,
    refreshAccountStatus,
    getOnboardingLink,
    createAccount,
    clearError,
  } = useStripeOnboarding();

  console.log("StripeStatusCard render:", { isLoading, error, accountData });

  const [actionLoading, setActionLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleRefreshStatus = async () => {
    setActionLoading(true);
    clearError();
    try {
      await refreshAccountStatus();
      console.log("StripeStatusCard: Account status refreshed successfully");
    } catch (err) {
      console.error("StripeStatusCard: Failed to refresh status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setActionLoading(true);
    clearError();
    try {
      await createAccount();
      setShowCreateForm(false);
      // Refresh status after creating
      await getAccountStatus();
    } catch (err) {
      console.error("Failed to create account:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartOnboarding = async () => {
    setActionLoading(true);
    try {
      const link = await getOnboardingLink();
      // Open in same window to redirect to Stripe
      window.location.href = link;
    } catch (err) {
      console.error("Failed to start onboarding:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusInfo = () => {
    if (!accountData) {
      return {
        status: "No Account",
        description: "No Stripe Connect account found",
        color: "gray",
        icon: XCircleIcon,
        action: "Create Account",
        canReceivePayments: false,
      };
    }

    if (accountData.chargesEnabled && accountData.payoutsEnabled) {
      return {
        status: "Active",
        description: "Ready to receive payments",
        color: "green",
        icon: CheckCircleIcon,
        action: null,
        canReceivePayments: true,
      };
    }

    if (accountData.detailsSubmitted) {
      return {
        status: "Under Review",
        description: "Account details submitted, pending verification",
        color: "yellow",
        icon: ClockIcon,
        action: "Refresh Status",
        canReceivePayments: false,
      };
    }

    return {
      status: "Incomplete",
      description: "Account setup not completed",
      color: "orange",
      icon: ExclamationTriangleIcon,
      action: "Complete Setup",
      canReceivePayments: false,
    };
  };

  const statusInfo = getStatusInfo();

  const getStatusColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "orange":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Auto-refresh account status on mount and periodically
  useEffect(() => {
    const refreshOnMount = async () => {
      // Only refresh if we don't have account data or if it might be stale
      if (
        !accountData ||
        (!accountData.chargesEnabled && !accountData.payoutsEnabled)
      ) {
        console.log(
          "StripeStatusCard: Auto-refreshing account status on mount"
        );
        try {
          await refreshAccountStatus();
        } catch (error) {
          console.error("StripeStatusCard: Auto-refresh failed:", error);
        }
      }
    };

    refreshOnMount();
  }, [accountData, refreshAccountStatus]); // Added dependencies

  if (isLoading && !accountData) {
    return (
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
      >
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">
            Checking Stripe Connect status...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CreditCardIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Payment Account Status
            </h3>
            <p className="text-sm text-gray-600">
              Stripe Connect account for receiving payments
            </p>
          </div>
        </div>
        <button
          onClick={handleRefreshStatus}
          disabled={actionLoading}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh status"
        >
          <ArrowPathIcon
            className={`h-5 w-5 ${actionLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-red-600 text-xs underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <statusInfo.icon
              className={`h-5 w-5 text-${statusInfo.color}-600`}
            />
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColorClasses(
                  statusInfo.color
                )}`}
              >
                {statusInfo.status}
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {statusInfo.description}
              </p>
            </div>
          </div>

          {statusInfo.canReceivePayments && (
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          )}
        </div>

        {accountData && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Account Type</p>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {accountData.accountType || "Express"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Country</p>
              <p className="text-sm font-medium text-gray-900">
                {accountData.country || "US"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Charges Enabled</p>
              <p
                className={`text-sm font-medium ${
                  accountData.chargesEnabled ? "text-green-600" : "text-red-600"
                }`}
              >
                {accountData.chargesEnabled ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payouts Enabled</p>
              <p
                className={`text-sm font-medium ${
                  accountData.payoutsEnabled ? "text-green-600" : "text-red-600"
                }`}
              >
                {accountData.payoutsEnabled ? "Yes" : "No"}
              </p>
            </div>
          </div>
        )}

        {accountData?.requirements && (
          <div className="space-y-2">
            {(accountData.requirements.currentlyDue?.length > 0 ||
              accountData.requirements.pastDue?.length > 0) && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800 mb-2">
                      Action Required: Complete Account Setup
                    </p>
                    <p className="text-sm text-orange-700 mb-3">
                      Your Stripe account needs additional information to
                      process payments. Complete the verification process to
                      start receiving payouts.
                    </p>
                    <div className="mb-3">
                      <p className="text-xs font-medium text-orange-800 mb-1">
                        Required Information:
                      </p>
                      <ul className="text-xs text-orange-700 space-y-1">
                        {accountData.requirements.pastDue?.map((req, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-1"
                          >
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                            <span>
                              {req.replace(/_/g, " ").replace(/\./g, " → ")}{" "}
                              (Past Due)
                            </span>
                          </li>
                        ))}
                        {accountData.requirements.currentlyDue?.map(
                          (req, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-1"
                            >
                              <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                              <span>
                                {req.replace(/_/g, " ").replace(/\./g, " → ")}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <button
                      onClick={handleStartOnboarding}
                      disabled={actionLoading}
                      className="inline-flex items-center space-x-2 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 text-sm font-medium"
                    >
                      <span>
                        {actionLoading ? "Opening..." : "Complete Verification"}
                      </span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          {!accountData ? (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Already have a Stripe account?</strong>
                </p>
                <p className="text-xs text-blue-600 mb-3">
                  If you&apos;ve already created a Stripe Connect account, click
                  refresh to check your latest status.
                </p>
                <button
                  onClick={handleRefreshStatus}
                  disabled={actionLoading}
                  className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <ArrowPathIcon
                    className={`h-4 w-4 ${actionLoading ? "animate-spin" : ""}`}
                  />
                  <span>
                    {actionLoading ? "Checking..." : "Check Account Status"}
                  </span>
                </button>
              </div>

              {!showCreateForm ? (
                <button
                  onClick={() => setShowCreateForm(true)}
                  disabled={actionLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Create Stripe Connect Account
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreateAccount}
                      disabled={actionLoading}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? "Creating..." : "Create Account"}
                    </button>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      disabled={actionLoading}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Status-specific guidance */}
              {statusInfo.status === "Active" && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Account Active & Ready
                      </p>
                      <p className="text-xs text-green-600">
                        Your Stripe account is fully set up and can receive
                        payments and payouts.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {statusInfo.status === "Under Review" && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Account Under Review
                  </p>
                  <p className="text-xs text-blue-600 mb-2">
                    Stripe is reviewing your account. This usually takes 1-2
                    business days. If there are outstanding requirements above,
                    complete them to speed up the process.
                  </p>
                </div>
              )}

              {statusInfo.status === "Incomplete" && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-medium text-orange-800 mb-1">
                    Setup Incomplete
                  </p>
                  <p className="text-xs text-orange-600 mb-2">
                    Your Stripe account needs additional setup to process
                    payments. Click &ldquo;Complete Stripe Setup&rdquo; to
                    continue where you left off.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {statusInfo.action === "Complete Setup" && (
                  <button
                    onClick={handleStartOnboarding}
                    disabled={actionLoading}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 font-medium"
                  >
                    <span>
                      {actionLoading
                        ? "Opening Stripe..."
                        : "Complete Stripe Setup"}
                    </span>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </button>
                )}

                {statusInfo.action === "Refresh Status" && (
                  <button
                    onClick={handleRefreshStatus}
                    disabled={actionLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {actionLoading ? "Checking..." : "Check Latest Status"}
                  </button>
                )}

                {accountData &&
                  !statusInfo.canReceivePayments &&
                  statusInfo.status !== "Under Review" && (
                    <button
                      onClick={handleStartOnboarding}
                      disabled={actionLoading}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 font-medium"
                    >
                      <span>
                        {actionLoading
                          ? "Opening Stripe..."
                          : "Continue Setup in Stripe"}
                      </span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </button>
                  )}

                {/* Always show refresh button as secondary action */}
                {statusInfo.action !== "Refresh Status" && (
                  <button
                    onClick={handleRefreshStatus}
                    disabled={actionLoading}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
                  >
                    {actionLoading ? "Refreshing..." : "Refresh Status"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
