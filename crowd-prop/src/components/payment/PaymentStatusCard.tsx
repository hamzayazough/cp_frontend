"use client";

import React, { useState } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  ArrowPathIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { usePaymentManagement } from "@/hooks/usePaymentManagement";
import { userService } from "@/services/user.service";
import AddPaymentMethodModal from "./AddPaymentMethodModal";
import PaymentSetupSuccessModal from "./PaymentSetupSuccessModal";

interface PaymentStatusCardProps {
  className?: string;
}

export default function PaymentStatusCard({
  className = "",
}: PaymentStatusCardProps) {
  const {
    paymentStatus,
    isPaymentStatusLoading,
    paymentStatusError,
    refreshPaymentStatus,
    refreshAll,
    completePaymentSetup,
  } = usePaymentManagement();

  const [setupLoading, setSetupLoading] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const currentUser = userService.getCurrentUserSync();

  const handleSetupPayment = async () => {
    if (!currentUser) return;

    try {
      setSetupLoading(true);
      await completePaymentSetup();
      // Show success modal when setup is complete
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to setup payment:", error);
    } finally {
      setSetupLoading(false);
    }
  };

  const handleAddPaymentMethod = () => {
    setShowAddPaymentModal(true);
  };

  const handlePaymentMethodAdded = async () => {
    setShowAddPaymentModal(false);
    // Refresh all payment-related data to sync everything
    await refreshAll();
  };

  const handleRefresh = async () => {
    await refreshPaymentStatus();
  };

  if (isPaymentStatusLoading && !paymentStatus) {
    return (
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    if (!paymentStatus) {
      return {
        status: "Unknown",
        description: "Unable to load payment status",
        color: "gray",
        icon: XCircleIcon,
        action: "Retry",
      };
    }

    if (paymentStatus.setupComplete) {
      return {
        status: "Ready",
        description: `${paymentStatus.paymentMethodsCount} payment method${
          paymentStatus.paymentMethodsCount !== 1 ? "s" : ""
        } available`,
        color: "green",
        icon: CheckCircleIcon,
        action: null,
      };
    }

    if (paymentStatus.hasStripeCustomer && !paymentStatus.setupComplete) {
      return {
        status: "Setup Required",
        description: "Add a payment method to complete setup",
        color: "yellow",
        icon: ExclamationTriangleIcon,
        action: "Add Payment Method",
      };
    }

    return {
      status: "Setup Required",
      description: "Complete payment setup to fund campaigns",
      color: "yellow",
      icon: ExclamationTriangleIcon,
      action: "Setup Payment Account",
    };
  };

  const statusInfo = getStatusInfo();

  const getStatusColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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
              Manage your payment methods and billing
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isPaymentStatusLoading}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh status"
        >
          <ArrowPathIcon
            className={`h-5 w-5 ${
              isPaymentStatusLoading ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>

      {paymentStatusError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{paymentStatusError}</p>
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

          {statusInfo.color === "green" && (
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          )}
        </div>

        {paymentStatus && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Customer Status</p>
              <p className="text-sm font-medium text-gray-900">
                {paymentStatus.hasStripeCustomer ? "Active" : "Not Created"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Methods</p>
              <p className="text-sm font-medium text-gray-900">
                {paymentStatus.paymentMethodsCount} saved
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          {statusInfo.action && (
            <button
              onClick={
                statusInfo.action === "Add Payment Method"
                  ? handleAddPaymentMethod
                  : handleSetupPayment
              }
              disabled={setupLoading || isPaymentStatusLoading}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                statusInfo.color === "green"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-yellow-600 text-white hover:bg-yellow-700"
              }`}
            >
              {setupLoading ? "Setting up..." : statusInfo.action}
            </button>
          )}

          {statusInfo.color === "green" && (
            <div className="text-center mt-2">
              <p className="text-sm text-green-600 font-medium">
                ✓ Ready to fund campaigns
              </p>
            </div>
          )}
        </div>

        {/* Add Payment Method Modal */}
        <AddPaymentMethodModal
          isOpen={showAddPaymentModal}
          onClose={() => setShowAddPaymentModal(false)}
          onSuccess={handlePaymentMethodAdded}
        />

        {/* Payment Setup Success Modal */}
        <PaymentSetupSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
      </div>
    </div>
  );
}
