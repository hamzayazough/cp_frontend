"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  XMarkIcon,
  CreditCardIcon,
  BanknotesIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { usePaymentManagement } from "@/hooks/usePaymentManagement";
import {
  PAYMENT_CONSTANTS,
  calculateStripeFees,
} from "@/app/const/payment-constants";

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export default function AddFundsModal({
  isOpen,
  onClose,
  onSuccess,
}: AddFundsModalProps) {
  const [amount, setAmount] = useState<number>(
    PAYMENT_CONSTANTS.DEFAULT_FUNDING_AMOUNTS[1]
  ); // Default to $100
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { paymentMethods, addFunds, refreshPaymentMethods } =
    usePaymentManagement();

  // Calculate fees whenever amount changes
  const feeCalculation = useMemo(() => {
    return calculateStripeFees(amount);
  }, [amount]);

  useEffect(() => {
    if (isOpen) {
      refreshPaymentMethods();
      setError(null);
    }
  }, [isOpen, refreshPaymentMethods]); // Include refreshPaymentMethods dependency

  // Separate effect to select default payment method when payment methods change
  useEffect(() => {
    if (isOpen && paymentMethods.length > 0 && !selectedPaymentMethod) {
      const defaultMethod = paymentMethods.find((m) => m.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      } else {
        // If no default, select the first one
        setSelectedPaymentMethod(paymentMethods[0].id);
      }
    }
  }, [isOpen, paymentMethods, selectedPaymentMethod]);

  const handleAddFunds = async () => {
    if (!selectedPaymentMethod) {
      setError("Please select a payment method");
      return;
    }

    if (amount < PAYMENT_CONSTANTS.MINIMUM_WALLET_FUNDING) {
      setError(
        `Minimum funding amount is $${PAYMENT_CONSTANTS.MINIMUM_WALLET_FUNDING}`
      );
      return;
    }

    if (amount > PAYMENT_CONSTANTS.MAXIMUM_WALLET_FUNDING) {
      setError(
        `Maximum funding amount is $${PAYMENT_CONSTANTS.MAXIMUM_WALLET_FUNDING}`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addFunds({
        amount: amount * 100, // Convert wallet amount to cents for backend (server will add fees)
        paymentMethodId: selectedPaymentMethod,
        description: `Add $${amount} to wallet`,
      });

      onSuccess(amount);
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add funds");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount(PAYMENT_CONSTANTS.DEFAULT_FUNDING_AMOUNTS[1]);
    setSelectedPaymentMethod(null);
    setError(null);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BanknotesIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Add Funds to Wallet
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3 text-gray-700">
                {PAYMENT_CONSTANTS.DEFAULT_FUNDING_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                      amount === preset
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                placeholder="Custom amount"
                min={PAYMENT_CONSTANTS.MINIMUM_WALLET_FUNDING}
                max={PAYMENT_CONSTANTS.MAXIMUM_WALLET_FUNDING}
                step="10"
              />
              <p className="mt-1 text-xs text-gray-500">
                Min: ${PAYMENT_CONSTANTS.MINIMUM_WALLET_FUNDING}, Max: $
                {PAYMENT_CONSTANTS.MAXIMUM_WALLET_FUNDING}
              </p>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Cost Breakdown
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>Wallet amount:</span>
                      <span>${feeCalculation.walletAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Processing fee (2.9%):</span>
                      <span>${feeCalculation.percentageFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Fixed fee:</span>
                      <span>${feeCalculation.fixedFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-1 mt-2">
                      <div className="flex justify-between font-medium text-blue-900">
                        <span>Total charge:</span>
                        <span>${feeCalculation.totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    You pay ${feeCalculation.totalCost.toFixed(2)}, you receive
                    ${feeCalculation.walletAmount.toFixed(2)} for your wallet
                    (2.9% + 30¢)
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            {paymentMethods.length > 0 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <CreditCardIcon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          •••• •••• •••• {method.card?.last4}
                        </div>
                        <div className="text-sm text-gray-600">
                          {method.card?.brand?.toUpperCase()} •{" "}
                          {method.card?.expMonth}/{method.card?.expYear}
                          {method.isDefault && (
                            <span className="ml-2 text-xs text-green-600 font-medium">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <CreditCardIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  No payment methods available
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Add a payment method first
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFunds}
                disabled={
                  loading ||
                  !selectedPaymentMethod ||
                  paymentMethods.length === 0
                }
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : `Pay $${feeCalculation.totalCost.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
