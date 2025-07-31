"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { UserRole } from "@/app/interfaces/user";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { CreateUserDto } from "@/app/interfaces/user-dto";
import { AdvertiserType } from "@/app/enums/advertiser-type";
import { Language } from "@/app/enums/language";
import { PromoterWork } from "@/app/interfaces/promoter-work";
import { AdvertiserWork } from "@/app/interfaces/advertiser-work";
import RoleSelection from "./onboarding/RoleSelection";
import BasicInformation from "./onboarding/BasicInformation";
import AdvertiserDetails from "./onboarding/AdvertiserDetails";
import PromoterDetails from "./onboarding/PromoterDetails";
import ProfileImages from "./onboarding/ProfileImages";
import AdvertiserWorksUpload from "./onboarding/AdvertiserWorksUpload";
import PromoterWorksUpload from "./onboarding/PromoterWorksUpload";
import OnboardingComplete from "./onboarding/OnboardingComplete";
import StripeConnectSetup from "./onboarding/StripeConnectSetup";
import StripeOnboardingStatus from "./onboarding/StripeOnboardingStatus";

interface UserOnboardingProps {
  user: User;
  onComplete: () => void;
}

export interface OnboardingData {
  name: string;
  bio: string;
  role: UserRole | null;
  usedCurrency: "USD" | "CAD";

  tiktokUrl: string;
  instagramUrl: string;
  snapchatUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  websiteUrl: string;

  // Profile images
  avatarUrl?: string;
  backgroundUrl?: string;

  // Portfolio/Works
  promoterWorks: PromoterWork[];
  advertiserWorks: AdvertiserWork[];

  advertiserDetails?: {
    companyName: string;
    advertiserTypes: AdvertiserType[];
    companyWebsite: string;
  };

  promoterDetails?: {
    location: string;
    languagesSpoken: Language[];
    skills: string[];
  };
}

export default function UserOnboarding({
  user,
  onComplete,
}: UserOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: user.displayName || "",
    bio: "",
    role: null,
    usedCurrency: "USD",
    tiktokUrl: "",
    instagramUrl: "",
    snapchatUrl: "",
    youtubeUrl: "",
    twitterUrl: "",
    websiteUrl: "",
    promoterWorks: [],
    advertiserWorks: [],
  });

  // Load existing user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await authService.getProfile();

        if (response.success && response.user) {
          // User profile exists, populate the form
          const existingUser = response.user;
          setOnboardingData({
            name: existingUser.name || user.displayName || "",
            bio: existingUser.bio || "",
            role: existingUser.role,
            usedCurrency: existingUser.usedCurrency || "USD",
            tiktokUrl: existingUser.tiktokUrl || "",
            instagramUrl: existingUser.instagramUrl || "",
            snapchatUrl: existingUser.snapchatUrl || "",
            youtubeUrl: existingUser.youtubeUrl || "",
            twitterUrl: existingUser.twitterUrl || "",
            websiteUrl: existingUser.websiteUrl || "",
            avatarUrl: existingUser.avatarUrl,
            backgroundUrl: existingUser.backgroundUrl,
            promoterWorks: existingUser.promoterDetails?.works || [],
            advertiserWorks:
              existingUser.advertiserDetails?.advertiserWork || [],
            advertiserDetails: existingUser.advertiserDetails
              ? {
                  companyName: existingUser.advertiserDetails.companyName || "",
                  advertiserTypes:
                    existingUser.advertiserDetails.advertiserTypes || [],
                  companyWebsite:
                    existingUser.advertiserDetails.companyWebsite || "",
                }
              : undefined,
            promoterDetails: existingUser.promoterDetails
              ? {
                  location: existingUser.promoterDetails.location || "",
                  languagesSpoken:
                    existingUser.promoterDetails.languagesSpoken || [],
                  skills: existingUser.promoterDetails.skills || [],
                }
              : undefined,
          });

          // Set current user in user service
          userService.setCurrentUser(existingUser);
        }
      } catch (error) {
        // User profile doesn't exist (404) or other error - continue with empty form
        console.log(
          "No existing user profile found, starting fresh onboarding:",
          error
        );
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user.displayName, user.uid]);

  const totalSteps =
    onboardingData.role === "ADVERTISER"
      ? 6
      : onboardingData.role === "PROMOTER"
      ? 8
      : 6;

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert onboarding data to CreateUserDto format
      const createUserDto: CreateUserDto = {
        firebaseUid: user.uid,
        email: user.email || "",
        name: onboardingData.name,
        bio: onboardingData.bio,
        role: onboardingData.role,
        usedCurrency: onboardingData.usedCurrency,
        tiktokUrl: onboardingData.tiktokUrl,
        instagramUrl: onboardingData.instagramUrl,
        snapchatUrl: onboardingData.snapchatUrl,
        youtubeUrl: onboardingData.youtubeUrl,
        twitterUrl: onboardingData.twitterUrl,
        websiteUrl: onboardingData.websiteUrl,
        avatarUrl: onboardingData.avatarUrl,
        backgroundUrl: onboardingData.backgroundUrl,
      };

      // Add role-specific details
      if (
        onboardingData.role === "ADVERTISER" &&
        onboardingData.advertiserDetails
      ) {
        createUserDto.advertiserDetails = {
          companyName: onboardingData.advertiserDetails.companyName,
          advertiserTypes: onboardingData.advertiserDetails
            .advertiserTypes as AdvertiserType[],
          companyWebsite: onboardingData.advertiserDetails.companyWebsite,
        };
      }

      if (
        onboardingData.role === "PROMOTER" &&
        onboardingData.promoterDetails
      ) {
        createUserDto.promoterDetails = {
          location: onboardingData.promoterDetails.location,
          languagesSpoken: onboardingData.promoterDetails
            .languagesSpoken as Language[],
          skills: onboardingData.promoterDetails.skills,
        };
      }

      // Complete account setup using auth service
      const response = await authService.completeAccount(createUserDto);

      // Update user data in user service
      userService.setCurrentUser(response.user);

      // Continue to next step (work upload)
      handleNext();
    } catch (error) {
      console.error("Failed to complete account setup:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to complete account setup. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the mark setup complete endpoint
      const response = await authService.markSetupComplete();

      if (response.success) {
        // Update current user with the response data
        const updatedUser = { ...response.user, isSetupDone: true };
        userService.setCurrentUser(updatedUser);

        // For promoters, continue to Stripe onboarding
        // For advertisers, complete onboarding
        if (onboardingData.role === "PROMOTER") {
          handleNext(); // Go to Stripe setup
        } else {
          onComplete();
        }
      } else {
        throw new Error(response.message || "Failed to mark setup as complete");
      }
    } catch (error) {
      console.error("Failed to mark setup as complete:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to complete setup. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
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
        if (onboardingData.role === "ADVERTISER") {
          return (
            <AdvertiserDetails
              data={onboardingData}
              onUpdate={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else if (onboardingData.role === "PROMOTER") {
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
          <ProfileImages
            data={onboardingData}
            onUpdate={updateData}
            onNext={handleComplete}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      case 5:
        if (onboardingData.role === "ADVERTISER") {
          return (
            <AdvertiserWorksUpload
              data={onboardingData}
              onUpdate={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else if (onboardingData.role === "PROMOTER") {
          return (
            <PromoterWorksUpload
              data={onboardingData}
              onUpdate={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        }
        break;
      case 6:
        return (
          <OnboardingComplete
            data={onboardingData}
            userEmail={user.email || ""}
            onComplete={handleFinalComplete}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      case 7:
        if (onboardingData.role === "PROMOTER") {
          return (
            <StripeConnectSetup
              user={user}
              onComplete={handleNext}
              onBack={handleBack}
              isLoading={isLoading}
            />
          );
        }
        break;
      case 8:
        if (onboardingData.role === "PROMOTER") {
          return (
            <StripeOnboardingStatus
              user={user}
              onComplete={onComplete}
              onBack={handleBack}
              isLoading={isLoading}
            />
          );
        }
        break;
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
          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <svg
                  className="animate-spin h-6 w-6 text-blue-600"
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
                <span className="text-gray-600 font-medium">
                  Loading your profile...
                </span>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              {renderStep()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
