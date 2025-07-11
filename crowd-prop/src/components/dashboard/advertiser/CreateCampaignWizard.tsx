'use client';

import { useState } from 'react';
import { Campaign, CampaignFormData } from '@/app/interfaces/campaign';
import { CampaignType } from '@/app/enums/campaign-type';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { advertiserService } from '@/services/advertiser.service';
import StepIndicator from './StepIndicator';
import CampaignTypeStep from './steps/CampaignTypeStep';
import { BasicInfoStep } from './steps';
import CampaignSettingsStep from './steps/CampaignSettingsStep';
import ReviewStep from './steps/ReviewStep';

interface CreateCampaignWizardProps {
  onComplete: (campaign: Campaign) => void;
  onCancel: () => void;
}

const initialFormData: CampaignFormData = {
  title: '',
  description: '',
  type: null,
  expiryDate: null,
  mediaUrl: '',
  advertiserType: [],
  isPublic: true, // Default to true, will be set based on campaign type

  // VISIBILITY
  cpv: undefined,
  maxViews: null,
  trackUrl: '',

  // CONSULTANT
  expectedDeliverables: [],
  meetingCount: null,
  referenceUrl: '',
  maxBudget: undefined,
  minBudget: undefined,
  deadline: null,

  // SELLER
  sellerRequirements: [],
  deliverables: [],
  meetingPlan: null,
  deadlineStrict: false,
  sellerMaxBudget: undefined,
  sellerMinBudget: undefined,

  // SALESMAN
  commissionPerSale: undefined,
  trackSalesVia: null,
  codePrefix: '',

  // UI-only
  file: null,
};

export default function CreateCampaignWizard({ onComplete, onCancel }: CreateCampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CampaignFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      id: 'type',
      title: 'Campaign Type',
      description: 'Choose your campaign type',
      component: CampaignTypeStep,
    },
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Provide campaign details',
      component: BasicInfoStep,
    },
    {
      id: 'settings',
      title: 'Campaign Settings',
      description: 'Configure campaign parameters',
      component: CampaignSettingsStep,
    },
    {
      id: 'review',
      title: 'Review & Launch',
      description: 'Review and create your campaign',
      component: ReviewStep,
    },
  ];

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;

  const updateFormData = (updates: Partial<CampaignFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Campaign Type
        return formData.type !== null;
      case 1: // Basic Info
        return (
          formData.title.trim() !== '' && 
          formData.description.trim() !== '' &&
          formData.advertiserType.length > 0
        );
      case 2: // Settings
        return validateSettings();
      case 3: // Review
        return true;
      default:
        return false;
    }
  };

  const validateSettings = () => {
    if (!formData.type) return false;
    
    switch (formData.type) {
      case CampaignType.VISIBILITY:
        return (
          typeof formData.cpv === 'number' &&
          formData.cpv >= 0.5 &&
          typeof formData.trackUrl === 'string' &&
          formData.trackUrl.trim() !== ''
        );
      case CampaignType.CONSULTANT:
        return (
          Array.isArray(formData.expectedDeliverables) && 
          formData.expectedDeliverables.length > 0 &&
          typeof formData.maxBudget === 'number' &&
          formData.maxBudget > 0 &&
          typeof formData.minBudget === 'number' &&
          formData.minBudget > 0 &&
          formData.minBudget <= formData.maxBudget
        );
      case CampaignType.SELLER:
        return (
          // Either seller requirements OR deliverables should be specified
          ((Array.isArray(formData.sellerRequirements) && formData.sellerRequirements.length > 0) ||
           (Array.isArray(formData.deliverables) && formData.deliverables.length > 0)) &&
          typeof formData.sellerMaxBudget === 'number' &&
          formData.sellerMaxBudget > 0 &&
          typeof formData.sellerMinBudget === 'number' &&
          formData.sellerMinBudget > 0 &&
          formData.sellerMinBudget <= formData.sellerMaxBudget
        );
      case CampaignType.SALESMAN:
        return (
          typeof formData.commissionPerSale === 'number' &&
          formData.commissionPerSale > 0 &&
          formData.trackSalesVia !== null &&
          formData.trackSalesVia !== undefined
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {

      const campaignData = {
        title: formData.title,
        description: formData.description,
        type: formData.type!,
        expiryDate: formData.expiryDate,
        mediaUrl: formData.mediaUrl || undefined,
        advertiserType: formData.advertiserType,
        // Set isPublic based on campaign type
        isPublic: formData.type === CampaignType.VISIBILITY || formData.type === CampaignType.SALESMAN,

        // Type-specific fields based on new interface
        ...(formData.type === CampaignType.VISIBILITY && {
          cpv: formData.cpv!,
          maxViews: formData.maxViews || undefined,
          trackUrl: formData.trackUrl!,
        }),

        ...(formData.type === CampaignType.CONSULTANT && {
          expectedDeliverables: formData.expectedDeliverables || [],
          meetingCount: formData.meetingCount || undefined,
          maxBudget: formData.maxBudget!,
          minBudget: formData.minBudget!,
          deadline: formData.deadline,
        }),

        ...(formData.type === CampaignType.SELLER && {
          sellerRequirements: formData.sellerRequirements || undefined,
          deliverables: formData.deliverables || undefined,
          meetingPlan: formData.meetingPlan || undefined,
          deadlineStrict: formData.deadlineStrict || false,
          maxBudget: formData.sellerMaxBudget!,
          minBudget: formData.sellerMinBudget!,
        }),

        ...(formData.type === CampaignType.SALESMAN && {
          commissionPerSale: formData.commissionPerSale!,
          trackSalesVia: formData.trackSalesVia!,
          codePrefix: formData.codePrefix || undefined,
        }),
      };

      // // For Salesman, add file if present
      // if (formData.type === CampaignType.SALESMAN && formData.file) {
      //   campaignData.file = formData.file;
      // }

      // Print the payload being sent
      console.log('Submitting campaignData:', campaignData);

      // Call the advertiser service to create the campaign
      const result = await advertiserService.createCampaign(campaignData);

      if (result.success && result.campaign) {
        onComplete(result.campaign);
      } else {
        throw new Error(result.message || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      // Handle error (show toast, etc.)
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Create Campaign</h1>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Cancel
          </button>
        </div>
        <p className="text-gray-600">
          Create a new campaign to connect with promoters and grow your brand.
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        completedSteps={Array.from({ length: currentStep }, (_, i) => i)}
      />

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 text-sm">
            {currentStepData.description}
          </p>
        </div>

        <StepComponent
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-2" />
          Previous
        </button>

        <div className="flex space-x-3">
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Campaign'
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRightIcon className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
