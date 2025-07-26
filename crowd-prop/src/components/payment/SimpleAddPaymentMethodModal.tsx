'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  CreditCardIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';
import { PAYMENT_CONSTANTS } from '@/app/const/payment-constants';

// Initialize Stripe only if we have a valid key
const stripePromise = PAYMENT_CONSTANTS.STRIPE_PUBLISHABLE_KEY && 
  PAYMENT_CONSTANTS.STRIPE_PUBLISHABLE_KEY !== 'pk_test_demo_key' ? 
  loadStripe(PAYMENT_CONSTANTS.STRIPE_PUBLISHABLE_KEY) : 
  null;

interface SimpleAddPaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function SimpleAddPaymentForm({ onSuccess, onCancel }: SimpleAddPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const { addPaymentMethod } = usePaymentManagement();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe is not ready');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      return;
    }

    setIsLoading(true);

    try {
      // Create payment method with Stripe
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: 'Customer Name', // In a real app, you'd collect this
        },
      });

      if (pmError) {
        setError(pmError.message || 'Failed to create payment method');
        return;
      }

      if (paymentMethod) {
        // Attach the payment method to the customer via backend
        await addPaymentMethod(paymentMethod.id);
        setSucceeded(true);
        
        // Show success for a moment then close
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Payment method setup error:', error);
      setError(error instanceof Error ? error.message : 'Failed to add payment method');
    } finally {
      setIsLoading(false);
    }
  };

  if (succeeded) {
    return (
      <div className="text-center py-8">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Payment Method Added Successfully
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Your payment method has been securely saved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Payment Method
        </label>
        <div className="border border-gray-300 rounded-lg p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Adding Payment Method...' : 'Add Payment Method'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

interface SimpleAddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SimpleAddPaymentMethodModal({
  isOpen,
  onClose,
  onSuccess,
}: SimpleAddPaymentMethodModalProps) {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Add Payment Method
              </h3>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {!stripePromise ? (
            <div className="text-center py-8 bg-yellow-50 rounded-lg">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">
                Stripe Configuration Required
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Please configure your Stripe publishable key to add payment methods.
              </p>
              <button
                onClick={handleCancel}
                className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          ) : (
            <Elements 
              stripe={stripePromise}
              options={{
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#2563eb',
                  },
                },
              }}
            >
              <SimpleAddPaymentForm
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
