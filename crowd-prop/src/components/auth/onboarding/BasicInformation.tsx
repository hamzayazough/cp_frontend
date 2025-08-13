"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { OnboardingData } from "../UserOnboarding";
import { userService } from "@/services/user.service";

interface BasicInformationProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BasicInformation({
  data,
  onUpdate,
  onNext,
  onBack,
}: BasicInformationProps) {
  const [nameStatus, setNameStatus] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    message: string;
  }>({
    isChecking: false,
    isAvailable: null,
    message: "",
  });

  const nameTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkNameAvailability = useCallback(async (name: string) => {
    if (!name || name.trim().length < 2) {
      setNameStatus({
        isChecking: false,
        isAvailable: null,
        message: "Name must be at least 2 characters long",
      });
      return;
    }

    setNameStatus((prev) => ({ ...prev, isChecking: true }));

    try {
      const response = await userService.checkNameAvailability(name);
      setNameStatus({
        isChecking: false,
        isAvailable: response.available,
        message: response.message,
      });
    } catch (error) {
      console.error("Failed to check name availability:", error);
      setNameStatus({
        isChecking: false,
        isAvailable: false,
        message: "Failed to check name availability. Please try again.",
      });
    }
  }, []);

  useEffect(() => {
    if (nameTimeoutRef.current) {
      clearTimeout(nameTimeoutRef.current);
    }

    const name = data.name || "";

    if (name.trim().length > 0) {
      const timeout = setTimeout(() => {
        checkNameAvailability(name);
      }, 500); // Debounce for 500ms

      nameTimeoutRef.current = timeout;
    } else {
      setNameStatus({
        isChecking: false,
        isAvailable: null,
        message: "",
      });
    }

    return () => {
      if (nameTimeoutRef.current) {
        clearTimeout(nameTimeoutRef.current);
      }
    };
  }, [data.name, checkNameAvailability]);
  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    onUpdate({ [field]: value });
  };

  const handleCurrencyChange = (currency: string) => {
    // Auto-sync country with currency for better UX
    const countryMap: { [key: string]: "US" | "CA" } = {
      USD: "US",
      CAD: "CA",
    };

    onUpdate({
      usedCurrency: currency as "USD" | "CAD",
      country: countryMap[currency] || data.country,
    });
  };

  const handleCountryChange = (country: string) => {
    // Auto-sync currency with country for better UX
    const currencyMap: { [key: string]: "USD" | "CAD" } = {
      US: "USD",
      CA: "CAD",
    };

    onUpdate({
      country: country as "US" | "CA",
      usedCurrency: currencyMap[country] || data.usedCurrency,
    });
  };

  const isValid =
    data.name.trim().length > 0 &&
    data.country &&
    data.usedCurrency &&
    nameStatus.isAvailable === true;
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us about yourself
        </h2>
        <p className="text-gray-600">
          This information will be visible on your profile
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name *
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                nameStatus.isAvailable === false
                  ? "border-red-300 bg-red-50"
                  : nameStatus.isAvailable === true
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            {nameStatus.isChecking && (
              <div className="absolute right-3 top-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          {nameStatus.message && (
            <p
              className={`text-xs mt-1 ${
                nameStatus.isAvailable === false
                  ? "text-red-600"
                  : nameStatus.isAvailable === true
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {nameStatus.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={data.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
            placeholder="Tell us a bit about yourself..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {data.bio.length}/200 characters
          </p>
        </div>

        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Preferred Currency *
          </label>
          <select
            id="currency"
            value={data.usedCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            This will be used for payments and earnings display
          </p>
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Country *
          </label>
          <select
            id="country"
            value={data.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            This will be used for legal and payment purposes
          </p>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Social Media Links
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="instagram"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Instagram
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">
                  @
                </span>
                <input
                  id="instagram"
                  type="text"
                  value={data.instagramUrl}
                  onChange={(e) =>
                    handleInputChange("instagramUrl", e.target.value)
                  }
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="tiktok"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                TikTok
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">
                  @
                </span>
                <input
                  id="tiktok"
                  type="text"
                  value={data.tiktokUrl}
                  onChange={(e) =>
                    handleInputChange("tiktokUrl", e.target.value)
                  }
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="youtube"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                YouTube
              </label>
              <input
                id="youtube"
                type="url"
                value={data.youtubeUrl}
                onChange={(e) =>
                  handleInputChange("youtubeUrl", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="https://youtube.com/..."
              />
            </div>

            <div>
              <label
                htmlFor="twitter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Twitter/X
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">
                  @
                </span>
                <input
                  id="twitter"
                  type="text"
                  value={data.twitterUrl}
                  onChange={(e) =>
                    handleInputChange("twitterUrl", e.target.value)
                  }
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="snapchat"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Snapchat
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 text-sm">
                  @
                </span>
                <input
                  id="snapchat"
                  type="text"
                  value={data.snapchatUrl}
                  onChange={(e) =>
                    handleInputChange("snapchatUrl", e.target.value)
                  }
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Website
              </label>
              <input
                id="website"
                type="url"
                value={data.websiteUrl}
                onChange={(e) =>
                  handleInputChange("websiteUrl", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
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
