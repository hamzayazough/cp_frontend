import { useState } from 'react';
import { User } from 'firebase/auth';
import { stripeService } from '@/services/stripe.service';
import { STRIPE_ONBOARDING_CONSTANTS } from '@/app/const/stripe-onboarding';

interface StripeConnectSetupProps {
  user: User;
  onComplete: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function StripeConnectSetup({ 
  user, 
  onBack, 
  isLoading: externalLoading = false 
}: StripeConnectSetupProps) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('US');

  const handleSetupStripe = async () => {
    setIsCreatingAccount(true);
    setError(null);

    try {
      // First, create the Stripe Connect account
      const accountResponse = await stripeService.createConnectAccount({
        email: user.email || '',
        country: selectedCountry,
        isBusiness: false, // For now, we'll assume individual accounts
        firstName: user.displayName?.split(' ')[0],
        lastName: user.displayName?.split(' ').slice(1).join(' '),
      });

      if (!accountResponse.success) {
        throw new Error(accountResponse.message || 'Failed to create payment account');
      }

      // Get the onboarding link
      const onboardingLink = await stripeService.getOnboardingLink();
      
      // Redirect to Stripe onboarding
      window.location.href = onboardingLink.url;

    } catch (error) {
      console.error('Failed to setup Stripe Connect:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Failed to setup payment account. Please try again.'
      );
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const isLoading = externalLoading || isCreatingAccount;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Setup Payment Account
        </h2>
        <p className="text-gray-600 mb-6">
          {STRIPE_ONBOARDING_CONSTANTS.ONBOARDING_MESSAGES.SETUP_REQUIRED}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg 
            className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              Why do we need this?
            </h3>
            <p className="text-sm text-blue-700">
              To receive payments from campaigns, we need to verify your identity and setup your payment account through our secure payment processor.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Country/Region
          </label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            {STRIPE_ONBOARDING_CONSTANTS.COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            What happens next:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You&apos;ll be redirected to our secure payment processor</li>
            <li>• Provide your personal and banking information</li>
            <li>• Verify your identity with required documents</li>
            <li>• Return to CrowdProp once setup is complete</li>
          </ul>
        </div>
      </div>

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
        
        <button
          type="button"
          onClick={handleSetupStripe}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
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
              Setting up...
            </>
          ) : (
            'Setup Payment Account'
          )}
        </button>
      </div>
    </div>
  );
}
