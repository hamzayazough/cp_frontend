"use client";

import { useState, useEffect } from "react";
import { AdvertiserType } from "@/app/enums/advertiser-type";
import { SocialPlatform } from "@/app/enums/social-platform";
import Image from "next/image";
import { CampaignWizardFormData } from "../CreateCampaignWizard";
import { CampaignType } from "@/app/enums/campaign-type";
import { PhotoIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { userService } from "@/services/user.service";

interface BasicInfoStepProps {
  formData: CampaignWizardFormData;
  updateFormData: (updates: Partial<CampaignWizardFormData>) => void;
  onNext?: () => void;
}

export default function BasicInfoStep({
  formData,
  updateFormData,
}: BasicInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentUser, setCurrentUser] = useState(
    userService.getCurrentUserSync()
  );

  // Get current user and listen for changes
  useEffect(() => {
    const unsubscribe = userService.onUserChange((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  // Auto-set isPublic to false for non-visibility campaigns
  useEffect(() => {
    if (formData.type && formData.type !== CampaignType.VISIBILITY) {
      updateFormData({ isPublic: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.type]); // updateFormData is memoized with useCallback, safe to omit

  // Set default start date to today if not already set
  useEffect(() => {
    if (!formData.startDate) {
      updateFormData({ startDate: new Date() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.startDate]); // updateFormData is memoized with useCallback, safe to omit

  const handleInputChange = (
    field: keyof CampaignWizardFormData,
    value: string | number | Date | null | string[] | File | File[] | boolean
  ) => {
    updateFormData({ [field]: value });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Re-validate deadline when start date changes
    if (field === "startDate" && formData.deadline) {
      const deadlineError = validateField("deadline", formData.deadline);
      if (deadlineError) {
        setErrors((prev) => ({ ...prev, deadline: deadlineError }));
      } else {
        setErrors((prev) => ({ ...prev, deadline: "" }));
      }
    }
  };

  const validateField = (
    field: keyof CampaignWizardFormData,
    value: unknown
  ) => {
    switch (field) {
      case "title":
        if (!value || typeof value !== "string" || value.trim().length < 3) {
          return "Title must be at least 3 characters long";
        }
        if (value.length > 100) {
          return "Title must be less than 100 characters";
        }
        break;
      case "description":
        if (!value || typeof value !== "string" || value.trim().length < 10) {
          return "Description must be at least 10 characters long";
        }
        if (value.length > 10000) {
          return "Description must be less than 10,000 characters";
        }
        break;
      case "files":
        if (!value || !Array.isArray(value) || value.length === 0) {
          return "Please upload at least one file for your campaign";
        }
        break;
      case "advertiserTypes":
        if (!value || !Array.isArray(value) || value.length === 0) {
          return "Please select at least one advertiser type";
        }
        break;
      case "requirements":
        // Optional field, no validation needed
        break;
      case "preferredPlatforms":
        // Optional field, no validation needed
        break;
      case "deadline":
        if (!value) {
          return "Deadline is required";
        }
        if (value instanceof Date) {
          const today = new Date();
          const selectedDate = new Date(value);

          // Normalize both dates to midnight in local timezone for comparison
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            return "Deadline cannot be in the past";
          }

          // Check if deadline is at least 30 days after start date
          if (formData.startDate) {
            const startDate = new Date(formData.startDate);
            startDate.setHours(0, 0, 0, 0);
            const minDeadline = new Date(startDate);
            minDeadline.setDate(minDeadline.getDate() + 30);

            if (selectedDate < minDeadline) {
              return "Deadline must be at least 30 days after start date";
            }
          }
        }
        break;
      case "startDate":
        if (!value) {
          return "Start date is required";
        }
        // No additional validation needed - HTML input already prevents past dates
        break;
    }
    return "";
  };

  // Helper for toggling advertiser type selection
  const toggleAdvertiserType = (type: AdvertiserType) => {
    const newTypes = formData.advertiserTypes.includes(type)
      ? formData.advertiserTypes.filter((t) => t !== type)
      : [...formData.advertiserTypes, type];
    handleInputChange("advertiserTypes", newTypes);
    if (errors.advertiserTypes) {
      setErrors((prev) => ({ ...prev, advertiserTypes: "" }));
    }
  };

  // Helper for toggling social platform selection
  const toggleSocialPlatform = (platform: SocialPlatform) => {
    const newPlatforms = (formData.preferredPlatforms || []).includes(platform)
      ? (formData.preferredPlatforms || []).filter((p) => p !== platform)
      : [...(formData.preferredPlatforms || []), platform];
    handleInputChange("preferredPlatforms", newPlatforms);
  };

  // Helper for adding/removing requirements
  const addRequirement = () => {
    const requirements = formData.requirements || [];
    requirements.push("");
    handleInputChange("requirements", [...requirements]);
  };

  const updateRequirement = (index: number, value: string) => {
    const requirements = [...(formData.requirements || [])];
    requirements[index] = value;
    handleInputChange("requirements", requirements);
  };

  const removeRequirement = (index: number) => {
    const requirements = [...(formData.requirements || [])];
    requirements.splice(index, 1);
    handleInputChange("requirements", requirements);
  };

  const handleBlur = (field: keyof CampaignWizardFormData) => {
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    console.log("Files selected:", files);
    if (files.length === 0) return;

    // Check if adding these files would exceed the 10 file limit
    const currentFiles = formData.files || [];
    if (currentFiles.length + files.length > 10) {
      setErrors((prev) => ({ ...prev, files: "Maximum 10 files allowed" }));
      return;
    }

    const validFiles: File[] = [];
    const errorMessages: string[] = [];

    for (const file of files) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        errorMessages.push(`${file.name}: File size must be less than 10MB`);
        continue;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/webm",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        errorMessages.push(
          `${file.name}: Please upload a valid image, video, or PDF file`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (errorMessages.length > 0) {
      setErrors((prev) => ({ ...prev, files: errorMessages.join(", ") }));
      return;
    }

    try {
      // Add valid files to existing files
      const updatedFiles = [...currentFiles, ...validFiles];
      console.log("Setting files in form data:", updatedFiles);
      handleInputChange("files", updatedFiles);

      // Clear any previous errors
      setErrors((prev) => ({ ...prev, files: "" }));
      console.log("Files set successfully in form data");
    } catch (error) {
      console.error("Error setting files:", error);
      setErrors((prev) => ({ ...prev, files: "Failed to upload files" }));
    }
  };

  const removeFile = (indexToRemove: number) => {
    const currentFiles = formData.files || [];
    const updatedFiles = currentFiles.filter(
      (_, index) => index !== indexToRemove
    );
    handleInputChange("files", updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {/* Campaign Access Type - Only for Visibility Campaigns */}
        {formData.type === CampaignType.VISIBILITY && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Campaign Access Type
              </h3>
              <p className="text-xs text-gray-600">
                How promoters can join your visibility campaign
              </p>
            </div>

            <div className="space-y-3">
              <div
                className={`relative rounded-md border p-3 cursor-pointer transition-all ${
                  formData.isPublic
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => handleInputChange("isPublic", true)}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id="visibility-public"
                    name="visibility"
                    checked={formData.isPublic}
                    onChange={() => handleInputChange("isPublic", true)}
                    className="h-3 w-3 text-green-600 focus:ring-green-500 border-gray-300 mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="visibility-public"
                      className="block text-xs font-medium text-gray-900 cursor-pointer"
                    >
                      🌍 Public - Open to All Promoters
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      Everyone can participate. Better for fast reach and more engagement.
                    </p>
                    <div className="mt-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded inline-block">
                      ✓ Faster • ✓ Multiple promoters
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`relative rounded-md border p-3 cursor-pointer transition-all ${
                  !formData.isPublic
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => handleInputChange("isPublic", false)}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id="visibility-private"
                    name="visibility"
                    checked={!formData.isPublic}
                    onChange={() => handleInputChange("isPublic", false)}
                    className="h-3 w-3 text-orange-600 focus:ring-orange-500 border-gray-300 mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="visibility-private"
                      className="block text-xs font-medium text-gray-900 cursor-pointer"
                    >
                      🔒 Private - Application Required
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      Choose ONE promoter. Better quality control.
                    </p>
                    <div className="mt-1 text-xs text-orange-700 bg-orange-100 px-2 py-0.5 rounded inline-block">
                      ✓ Handpicked • ✓ Exclusive
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info for non-visibility campaigns */}
        {formData.type && formData.type !== CampaignType.VISIBILITY && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-gray-600 font-bold text-xs">🔒</span>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900">
                  Private Campaign
                </p>
                <p className="text-xs text-gray-600">
                  {formData.type === CampaignType.CONSULTANT &&
                    "Promoters apply and you select the best expert."}
                  {formData.type === CampaignType.SELLER &&
                    "Promoters apply and you choose one to create and sell your products."}
                  {formData.type === CampaignType.SALESMAN &&
                    "Promoters apply and you select the best sales representatives."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Advertiser Types Multi-select */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Product Type(s) *
            </h3>
            <p className="text-xs text-gray-600">
              Select categories that describe your business
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.values(AdvertiserType).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleAdvertiserType(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-200 ${
                  formData.advertiserTypes.includes(type)
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {type.charAt(0) +
                  type.slice(1).toLowerCase().replace(/_/g, " ")}
              </button>
            ))}
          </div>
          {errors.advertiserTypes && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs text-red-600">{errors.advertiserTypes}</p>
            </div>
          )}
        </div>

        {/* Campaign Title & Description */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              📝 Campaign Details
            </h3>
            <p className="text-xs text-gray-600">
              Essential information about your campaign
            </p>
          </div>

          <div className="space-y-4">
            {/* Campaign Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-medium text-gray-700 mb-2"
              >
                Campaign Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                onBlur={() => handleBlur("title")}
                placeholder="Enter a catchy title for your campaign"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 transition-all duration-200 ${
                  errors.title
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.title && (
                <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-600">{errors.title}</p>
                </div>
              )}
              <div className="mt-1 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Make it clear and engaging
                </p>
                <span
                  className={`text-xs ${
                    formData.title.length > 90
                      ? "text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  {formData.title.length}/100
                </span>
              </div>
            </div>

            {/* Campaign Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-xs font-medium text-gray-700 mb-2"
              >
                Campaign Description *
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                onBlur={() => handleBlur("description")}
                placeholder="Describe your campaign goals, business, target audience, and requirements..."
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 transition-all duration-200 resize-none ${
                  errors.description
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.description && (
                <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-600">{errors.description}</p>
                </div>
              )}
              <div className="mt-1 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Be specific about your goals and requirements
                </p>
                <span
                  className={`text-xs ${
                    formData.description.length > 9000
                      ? "text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  {formData.description.length}/10,000
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Target Audience & Campaign Timing */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              🎯 Audience & Timeline
            </h3>
            <p className="text-xs text-gray-600">
              Target audience and campaign schedule
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Target Audience */}
            <div className="lg:col-span-2">
              <label
                htmlFor="targetAudience"
                className="block text-xs font-medium text-gray-700 mb-2"
              >
                Target Audience (Optional)
              </label>
              <input
                type="text"
                id="targetAudience"
                value={formData.targetAudience || ""}
                onChange={(e) =>
                  handleInputChange("targetAudience", e.target.value)
                }
                placeholder="e.g., Young professionals, Tech enthusiasts, Fitness enthusiasts"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 hover:border-gray-400 transition-all duration-200"
              />
              <p className="mt-1 text-xs text-gray-500">
                💡 Describe your ideal audience demographics or interests
              </p>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-xs font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-green-600" />
                  Start Date *
                </div>
              </label>
              <input
                type="date"
                id="startDate"
                value={
                  formData.startDate
                    ? formData.startDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange(
                    "startDate",
                    e.target.value ? new Date(e.target.value) : null
                  )
                }
                onBlur={() => handleBlur("startDate")}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 transition-all duration-200 ${
                  errors.startDate
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.startDate && (
                <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-600">{errors.startDate}</p>
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                When to start? (Can start today)
              </p>
            </div>

            {/* Deadline */}
            <div>
              <label
                htmlFor="deadline"
                className="block text-xs font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-red-600" />
                  Campaign Deadline *
                </div>
              </label>
              <input
                type="date"
                id="deadline"
                value={
                  formData.deadline
                    ? formData.deadline.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange(
                    "deadline",
                    e.target.value ? new Date(e.target.value) : null
                  )
                }
                onBlur={() => handleBlur("deadline")}
                min={
                  formData.startDate
                    ? (() => {
                        const minDate = new Date(formData.startDate);
                        minDate.setDate(minDate.getDate() + 30);
                        return minDate.toISOString().split("T")[0];
                      })()
                    : new Date().toISOString().split("T")[0]
                }
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 transition-all duration-200 ${
                  errors.deadline
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
              {errors.deadline && (
                <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-600">{errors.deadline}</p>
                </div>
              )}
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-xs text-orange-800">
                  <strong>⏰ Important:</strong> Must be 30+ days after start date
                </p>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                When should campaign complete and auto-deactivate?
              </p>
            </div>
          </div>
        </div>

        {/* Campaign Requirements & Preferences */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              📋 Requirements & Preferences
            </h3>
            <p className="text-xs text-gray-600">
              Set specific requirements and platform preferences
            </p>
          </div>

          <div className="space-y-4">
            {/* Requirements */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Campaign Requirements (Optional)
              </label>
              <div className="space-y-2">
                {(formData.requirements || []).map((requirement, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 group"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) =>
                          updateRequirement(index, e.target.value)
                        }
                        placeholder="e.g., Must have marketing experience"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 hover:border-gray-400 transition-all duration-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 rounded-md text-xs font-medium transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="flex items-center px-3 py-2 border border-dashed border-gray-300 rounded-md text-blue-600 hover:border-blue-400 hover:bg-blue-50 text-xs font-medium transition-all duration-200 w-full justify-center"
                >
                  <span className="mr-1">+</span> Add Requirement
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                💡 Specific requirements or qualifications for promoters
              </p>
            </div>

            {/* Preferred Platforms */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Preferred Social Platforms (Optional)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.values(SocialPlatform).map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => toggleSocialPlatform(platform)}
                    className={`px-3 py-2 rounded-md text-xs font-medium border transition-all duration-200 ${
                      (formData.preferredPlatforms || []).includes(platform)
                        ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    {platform.charAt(0) + platform.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                📱 Select preferred social media platforms for this campaign
              </p>
            </div>
          </div>
        </div>

        {/* Media File Upload */}
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              📁 Supporting Media
            </h3>
            <p className="text-xs text-gray-600">
              Upload content to help promoters understand your campaign
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Media File Upload */}
            <div>
              <label
                htmlFor="mediaFile"
                className="block text-xs font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center">
                  <PhotoIcon className="h-4 w-4 mr-1 text-blue-600" />
                  Supporting Media *
                </div>
              </label>
              <div
                className={`mt-1 flex justify-center px-4 pt-5 pb-5 border border-dashed rounded-md transition-all duration-200 ${
                  errors.files
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <div className="space-y-1 text-center">
                  <PhotoIcon className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="flex text-xs text-gray-600">
                    <label
                      htmlFor="mediaFile"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-1 focus-within:ring-offset-1 focus-within:ring-blue-500 px-1 py-0.5"
                    >
                      <span>Upload a file</span>
                      <input
                        id="mediaFile"
                        name="mediaFile"
                        type="file"
                        accept="image/*,video/*,.pdf"
                        multiple
                        className="sr-only"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop (up to 10 files)</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, MP4, PDF up to 10MB each
                  </p>
                </div>
              </div>
              {formData.files && formData.files.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-medium text-gray-700">
                    Uploaded Files ({formData.files.length}/10):
                  </div>
                  {formData.files.map((file, index) => (
                    <div
                      key={index}
                      className="p-3 bg-green-50 rounded-md border border-green-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <PhotoIcon className="h-4 w-4 text-green-600 mr-2" />
                          <div>
                            <span className="text-xs font-medium text-gray-900 block">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 rounded-md text-xs font-medium transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {errors.files && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-600">{errors.files}</p>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">
                🎯 Upload supporting content like product images, demo videos,
                or PDFs to help promoters understand your campaign and brand.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Preview Card */}
      {(formData.title || formData.description) && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xs">👁️</span>
            </div>
            <h4 className="text-sm font-semibold text-gray-900">
              Campaign Preview
            </h4>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-start space-x-3">
              {currentUser?.avatarUrl ? (
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={currentUser.avatarUrl}
                      alt="Advertiser Profile"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs font-medium">
                      {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h5 className="text-base font-semibold text-gray-900 mb-2">
                  {formData.title || "Campaign Title"}
                </h5>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                  {formData.description
                    ? formData.description.length > 100
                      ? `${formData.description.substring(0, 100)}...`
                      : formData.description
                    : "Campaign description will appear here..."}
                </p>

                <div className="flex flex-wrap items-center gap-1 mb-2">
                  {formData.type && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {formData.type === CampaignType.VISIBILITY &&
                        "👁️ Visibility"}
                      {formData.type === CampaignType.CONSULTANT &&
                        "🎯 Consultant"}
                      {formData.type === CampaignType.SELLER && "🛍️ Seller"}
                      {formData.type === CampaignType.SALESMAN && "💼 Salesman"}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      formData.isPublic
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {formData.isPublic ? "🌍 Public" : "🔒 Private"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                  {formData.startDate && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1 text-green-600" />
                      <span>
                        Starts: {formData.startDate.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {formData.deadline && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1 text-red-600" />
                      <span>
                        Deadline: {formData.deadline.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Show additional info if available */}
                {(formData.targetAudience ||
                  (formData.requirements && formData.requirements.length > 0) ||
                  (formData.preferredPlatforms &&
                    formData.preferredPlatforms.length > 0)) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {formData.targetAudience && (
                      <p className="text-xs text-gray-600 mb-1">
                        <strong className="text-gray-800">🎯 Target:</strong>{" "}
                        {formData.targetAudience}
                      </p>
                    )}
                    {formData.requirements &&
                      formData.requirements.length > 0 && (
                        <p className="text-xs text-gray-600 mb-1">
                          <strong className="text-gray-800">
                            📋 Requirements:
                          </strong>{" "}
                          {formData.requirements.filter((r) => r.trim()).length}{" "}
                          specified
                        </p>
                      )}
                    {formData.preferredPlatforms &&
                      formData.preferredPlatforms.length > 0 && (
                        <p className="text-xs text-gray-600">
                          <strong className="text-gray-800">
                            📱 Platforms:
                          </strong>{" "}
                          {formData.preferredPlatforms.join(", ")}
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
