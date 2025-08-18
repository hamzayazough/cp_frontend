import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { stripeService } from '@/services/stripe.service';
import { STRIPE_ONBOARDING_CONSTANTS } from '@/app/const/stripe-onboarding';
import { OnboardingStatusResponse } from '@/app/interfaces/stripe';

interface StripeOnboardingStatusProps {
  user: User;
  onComplete: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function StripeOnboardingStatus({ 
  user, 
  onComplete, 
  onBack, 
  isLoading: externalLoading = false 
}: StripeOnboardingStatusProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [statusData, setStatusData] = useState<OnboardingStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const maxRetries = 5;
  const retryInterval = 3000; // 3 seconds

  const checkOnboardingStatus = useCallback(async () => {
    try {
      setIsChecking(true);
      setError(null);

      const status = await stripeService.getOnboardingStatus(user.uid);
      setStatusData(status);

      if (status.onboarded && status.success) {
        // Account is fully set up, we can complete onboarding
        setTimeout(() => {
          onComplete();
        }, 2000); // Small delay to show success message
      } else if (retryCount < maxRetries) {
        // Not complete yet, retry after a delay
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryInterval);
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Failed to check payment setup status'
      );
    } finally {
      setIsChecking(false);
    }
  }, [user.uid, retryCount, onComplete, maxRetries]);

  useEffect(() => {
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);

  const handleRetry = () => {
    setRetryCount(0);
    checkOnboardingStatus();
  };

  const handleSkipForNow = () => {
    // For now, we'll allow users to skip this step
    // In production, you might want to restrict this
    onComplete();
  };

  const isLoading = externalLoading || isChecking;

  const renderStatusIcon = () => {
    if (isChecking) {
      return (
        <svg 
          className="animate-spin w-8 h-8 text-blue-600" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      );
    }

    if (statusData?.onboarded) {
      return (
        <svg 
          className="w-8 h-8 text-green-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      );
    }

    return (
      <svg 
        className="w-8 h-8 text-yellow-600" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.268 15.5c-.77.833.192 2.5 1.732 2.5z" 
        />
      </svg>
    );
  };

  const getStatusMessage = () => {
    if (isChecking) {
      return 'Checking payment setup status...';
    }

    if (statusData?.onboarded) {
      return STRIPE_ONBOARDING_CONSTANTS.ONBOARDING_MESSAGES.SETUP_COMPLETE;
    }

    if (error) {
      return error;
    }

    return STRIPE_ONBOARDING_CONSTANTS.ONBOARDING_MESSAGES.SETUP_INCOMPLETE;
  };

  const getStatusColor = () => {
    if (isChecking) return 'text-blue-600';
    if (statusData?.onboarded) return 'text-green-600';
    if (error) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {renderStatusIcon()}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Setup Status
        </h2>
        <p className={`text-sm mb-6 ${getStatusColor()}`}>
          {getStatusMessage()}
        </p>
      </div>

      {statusData && !statusData.onboarded && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg 
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-900 mb-1">
                Setup Not Complete
              </h3>
              <p className="text-sm text-yellow-700">
                Your payment account setup is still in progress. This may take a few minutes to complete.
              </p>
              {statusData.data && (
                <div className="mt-2 text-xs text-yellow-600">
                  <p>Account Status: {statusData.data.status}</p>
                  <p>Charges Enabled: {statusData.data.chargesEnabled ? 'Yes' : 'No'}</p>
                  <p>Payouts Enabled: {statusData.data.payoutsEnabled ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {statusData?.onboarded && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg 
              className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-green-900 mb-1">
                Payment Setup Complete!
              </h3>
              <p className="text-sm text-green-700">
                Your payment account is ready to receive earnings from campaigns.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>
        
        {statusData?.onboarded ? (
          <button
            type="button"
            onClick={onComplete}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Complete Setup
          </button>
        ) : error || retryCount >= maxRetries ? (
          <>
            <button
              type="button"
              onClick={handleRetry}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Retry Check
            </button>
            <button
              type="button"
              onClick={handleSkipForNow}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Skip for Now
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={true}
            className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
          >
            {isChecking ? 'Checking...' : `Retrying in ${Math.ceil((retryInterval * (retryCount + 1)) / 1000)}s`}
          </button>
        )}
      </div>
    </div>
  );
}
