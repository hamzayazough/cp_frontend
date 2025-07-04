'use client';

import { OnboardingData } from '../UserOnboarding';
import { AdvertiserType } from '@/app/enums/advertiser-type';

interface AdvertiserDetailsProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AdvertiserDetails({ data, onUpdate, onNext, onBack }: AdvertiserDetailsProps) {
  // Create a mapping for display names
  const advertiserTypeLabels: Record<AdvertiserType, string> = {
    [AdvertiserType.EDUCATION]: 'Education',
    [AdvertiserType.CLOTHING]: 'Clothing & Fashion',
    [AdvertiserType.TECH]: 'Technology',
    [AdvertiserType.BEAUTY]: 'Beauty & Cosmetics',
    [AdvertiserType.FOOD]: 'Food & Beverage',
    [AdvertiserType.HEALTH]: 'Health & Fitness',
    [AdvertiserType.ENTERTAINMENT]: 'Entertainment',
    [AdvertiserType.TRAVEL]: 'Travel & Tourism',
    [AdvertiserType.FINANCE]: 'Finance',
    [AdvertiserType.OTHER]: 'Other',
    [AdvertiserType.SPORTS]: 'Sports',
    [AdvertiserType.AUTOMOTIVE]: 'Automotive',
    [AdvertiserType.ART]: 'Art',
    [AdvertiserType.GAMING]: 'Gaming',
    [AdvertiserType.ECOMMERCE]: 'E-commerce',
    [AdvertiserType.MEDIA]: 'Media',
    [AdvertiserType.NON_PROFIT]: 'Non-Profit',
    [AdvertiserType.REAL_ESTATE]: 'Real Estate',
    [AdvertiserType.HOME_SERVICES]: 'Home & Garden',
    [AdvertiserType.EVENTS]: 'Events',
    [AdvertiserType.CONSULTING]: 'Consulting',
    [AdvertiserType.BOOKS]: 'Books',
    [AdvertiserType.MUSIC]: 'Music',
    [AdvertiserType.PETS]: 'Pets',
    [AdvertiserType.TOYS]: 'Toys',
    [AdvertiserType.BABY]: 'Baby',
    [AdvertiserType.JEWELRY]: 'Jewelry',
    [AdvertiserType.SCIENCE]: 'Science',
    [AdvertiserType.HARDWARE]: 'Hardware',
    [AdvertiserType.ENERGY]: 'Energy',
    [AdvertiserType.AGRICULTURE]: 'Agriculture',
    [AdvertiserType.GOVERNMENT]: 'Government',
  };

  const advertiserTypes = Object.values(AdvertiserType);

  const handleCompanyNameChange = (value: string) => {
    onUpdate({
      advertiserDetails: {
        ...data.advertiserDetails,
        companyName: value,
        advertiserTypes: data.advertiserDetails?.advertiserTypes || [],
        companyWebsite: data.advertiserDetails?.companyWebsite || ''
      }
    });
  };

  const handleWebsiteChange = (value: string) => {
    onUpdate({
      advertiserDetails: {
        ...data.advertiserDetails,
        companyName: data.advertiserDetails?.companyName || '',
        advertiserTypes: data.advertiserDetails?.advertiserTypes || [],
        companyWebsite: value
      }
    });
  };

  const handleTypeToggle = (type: AdvertiserType) => {
    const currentTypes = data.advertiserDetails?.advertiserTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];

    onUpdate({
      advertiserDetails: {
        ...data.advertiserDetails,
        companyName: data.advertiserDetails?.companyName || '',
        companyWebsite: data.advertiserDetails?.companyWebsite || '',
        advertiserTypes: newTypes
      }
    });
  };

  const isValid = 
    (data.advertiserDetails?.companyName || '').trim().length > 0 &&
    (data.advertiserDetails?.advertiserTypes || []).length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Business Information
        </h2>
        <p className="text-gray-600">
          Tell us about your company and what you promote
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
            Company/Business Name *
          </label>
          <input
            id="company-name"
            type="text"
            value={data.advertiserDetails?.companyName || ''}
            onChange={(e) => handleCompanyNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="Enter your company name"
          />
        </div>

        <div>
          <label htmlFor="company-website" className="block text-sm font-medium text-gray-700 mb-1">
            Company Website
          </label>
          <input
            id="company-website"
            type="url"
            value={data.advertiserDetails?.companyWebsite || ''}
            onChange={(e) => handleWebsiteChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="https://yourcompany.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Business Categories * (Select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {advertiserTypes.map((type) => {
              const isSelected = (data.advertiserDetails?.advertiserTypes || []).includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeToggle(type)}
                  className={`p-3 text-sm border rounded-lg text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {advertiserTypeLabels[type]}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {(data.advertiserDetails?.advertiserTypes || []).length} categories
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Verification Process
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Your business information will be reviewed for verification. This helps build trust with promoters and ensures quality partnerships.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
