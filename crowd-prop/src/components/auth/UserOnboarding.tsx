'use client';

import { useState } from 'react';
import { User } from 'firebase/auth';
import { UserRole } from '@/app/interfaces/user';
import RoleSelection from './onboarding/RoleSelection';
import BasicInformation from './onboarding/BasicInformation';
import AdvertiserDetails from './onboarding/AdvertiserDetails';
import PromoterDetails from './onboarding/PromoterDetails';
import OnboardingComplete from './onboarding/OnboardingComplete';

interface UserOnboardingProps {
  user: User;
  onComplete: () => void;
}

export interface OnboardingData {
  name: string;
  bio: string;
  role: UserRole | null;
  
  tiktokUrl: string;
  instagramUrl: string;
  snapchatUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  websiteUrl: string;

  advertiserDetails?: {
    companyName: string;
    advertiserTypes: string[];
    companyWebsite: string;
  };

  promoterDetails?: {
    location: string;
    languagesSpoken: string[];
    skills: string[];
  };
}

export default function UserOnboarding({ user, onComplete }: UserOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: user.displayName || '',
    bio: '',
    role: null,
    tiktokUrl: '',
    instagramUrl: '',
    snapchatUrl: '',
    youtubeUrl: '',
    twitterUrl: '',
    websiteUrl: '',
  });

  const totalSteps = onboardingData.role === 'ADVERTISER' ? 4 : onboardingData.role === 'PROMOTER' ? 4 : 3;

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    // Console log the final data
    console.log('=== ONBOARDING COMPLETE ===');
    console.log('User Email:', user.email);
    console.log('Firebase UID:', user.uid);
    console.log('Complete Onboarding Data:', onboardingData);
    console.log('===========================');
    
    onComplete();
  };

  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RoleSelection
            selectedRole={onboardingData.role}
            onRoleSelect={(role) => updateData({ role })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <BasicInformation
            data={onboardingData}
            onUpdate={updateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        if (onboardingData.role === 'ADVERTISER') {
          return (
            <AdvertiserDetails
              data={onboardingData}
              onUpdate={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else if (onboardingData.role === 'PROMOTER') {
          return (
            <PromoterDetails
              data={onboardingData}
              onUpdate={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        }
        break;
      case 4:
        return (
          <OnboardingComplete
            data={onboardingData}
            userEmail={user.email || ''}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Help us personalize your CrowdProp experience
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
