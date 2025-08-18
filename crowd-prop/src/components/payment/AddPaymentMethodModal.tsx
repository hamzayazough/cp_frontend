'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import {
  CreditCardIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { PAYMENT_CONSTANTS } from '@/app/const/payment-constants';
import { advertiserPaymentService } from '@/services/advertiser-payment.service';
import DevelopmentPaymentForm from './DevelopmentPaymentForm';

// Initialize Stripe only if we have a valid key
const isValidStripeKey = PAYMENT_CONSTANTS.STRIPE_PUBLISHABLE_KEY && 
  PAYMENT_CONSTANTS.STRIPE_PUBLISHABLE_KEY !== 'pk_test_demo_key' &&
  PAYMENT_CONSTANTS.STRIPE_PUBLISHABLE_KEY !== 'pk_test_your_stripe_publishable_key_here' &&
  PAYMENT_CONSTANTS.STRIPE_PUBLISHABLE_KEY.startsWith('pk_');

const stripePromise = isValidStripeKey ? 
  loadStripe(PAYMENT_CONSTANTS.STRIPE_PUBLISHABLE_KEY) : 
  null;

interface SetupIntentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function SetupIntentForm({ onSuccess, onCancel }: SetupIntentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe is not ready');
      return;
    }

    setIsLoading(true);

    try {
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?setup=complete`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Failed to setup payment method');
        return;
      }

      if (setupIntent && setupIntent.status === 'succeeded') {
        setSucceeded(true);
        // The payment method is now attached to the customer
        // Refresh the payment methods list
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Setup intent confirmation error:', error);
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
          <PaymentElement 
            options={{
              layout: 'tabs',
              paymentMethodOrder: ['card'],
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

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPaymentMethodModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPaymentMethodModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !clientSecret) {
      createSetupIntent();
    }
  }, [isOpen, clientSecret]);

  const createSetupIntent = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Creating setup intent...');
      const response = await advertiserPaymentService.createSetupIntent();
      console.log('Setup intent response:', response);
      setClientSecret(response.clientSecret);
    } catch (error) {
      console.error('Setup intent creation failed:', error);
      
      // Check if it's a network error, auth error, or server error
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          setError('Please log in to add payment methods');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          setError('Unable to connect to server. Please check if the backend is running.');
        } else if (error.message.includes('404') || error.message.includes('Not Found')) {
          setError('Setup intent endpoint not found. Backend endpoint may not be implemented yet.');
        } else {
          setError(`Setup intent creation failed: ${error.message}`);
        }
      } else {
        setError('Unknown error occurred while creating setup intent');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setClientSecret(null); // Reset for next time
    onSuccess();
    onClose();
  };

  const handleCancel = () => {
    setClientSecret(null); // Reset for next time
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
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Add Payment Method
            </h3>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Initializing secure payment setup...</p>
            </div>
          )}

          {error && stripePromise && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  <div>
                    <span className="text-sm text-red-600 font-medium">Backend Setup Required</span>
                    <p className="text-sm text-red-500 mt-1">
                      The setup intent endpoint is not implemented yet.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Using Development Mode</h4>
                <DevelopmentPaymentForm
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          )}

          {!stripePromise && (
            <DevelopmentPaymentForm
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          )}

          {stripePromise && clientSecret && !loading && !error && (
            <Elements 
              stripe={stripePromise} 
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#2563eb',
                  },
                },
                loader: 'auto',
              }}
            >
              <SetupIntentForm
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
