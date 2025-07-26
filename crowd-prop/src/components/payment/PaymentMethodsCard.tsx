'use client';

import React, { useState } from 'react';
import {
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';
import { PAYMENT_CONSTANTS } from '@/app/const/payment-constants';
import AddPaymentMethodModal from './AddPaymentMethodModal';

// Initialize Stripe only if we have a valid key  
const stripeAvailable = PAYMENT_CONSTANTS.STRIPE_PUBLISHABLE_KEY && 
  PAYMENT_CONSTANTS.STRIPE_PUBLISHABLE_KEY !== 'pk_test_demo_key';

interface PaymentMethodsCardProps {
  className?: string;
}

export default function PaymentMethodsCard({ className = '' }: PaymentMethodsCardProps) {
  const {
    paymentMethods,
    isPaymentMethodsLoading,
    paymentMethodsError,
    refreshPaymentMethods,
    removePaymentMethod,
    setDefaultPaymentMethod,
  } = usePaymentManagement();

  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAddSuccess = () => {
    setShowAddModal(false);
    refreshPaymentMethods();
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    setActionLoading(paymentMethodId);
    try {
      await setDefaultPaymentMethod(paymentMethodId);
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (paymentMethodId: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    setActionLoading(paymentMethodId);
    try {
      await removePaymentMethod(paymentMethodId);
    } catch (error) {
      console.error('Failed to remove payment method:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefresh = async () => {
    await refreshPaymentMethods();
  };

  if (isPaymentMethodsLoading && paymentMethods.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
            <button
              onClick={handleRefresh}
              disabled={isPaymentMethodsLoading}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh payment methods"
            >
              <ArrowPathIcon className={`h-4 w-4 ${isPaymentMethodsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {!showAddModal && (
            <button
              onClick={() => setShowAddModal(true)}
              disabled={!stripeAvailable}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!stripeAvailable ? "Stripe configuration required" : "Add a new payment method"}
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Card</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {paymentMethodsError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-600">{paymentMethodsError}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <CreditCardIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">
                      •••• •••• •••• {method.card?.last4}
                    </div>
                    <div className="text-sm text-gray-600">
                      {method.card?.brand?.toUpperCase()} • Expires {method.card?.expMonth}/{method.card?.expYear}
                    </div>
                  </div>
                  {method.isDefault && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span className="text-xs font-medium">Default</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      disabled={actionLoading === method.id}
                      className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    disabled={actionLoading === method.id}
                    className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">
                No payment methods
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Add a payment method to start making payments.
              </p>
            </div>
          )}
        </div>

        {/* Add Payment Method Modal */}
        <AddPaymentMethodModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      </div>
    </div>
  );
}
