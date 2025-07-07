'use client';

import { useState } from 'react';
import { Campaign } from '@/app/interfaces/campaign';
import { CampaignType, Deliverable, MeetingPlan, SalesTrackingMethod } from '@/app/enums/campaign-type';
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

export interface CampaignFormData {
  // Basic Info
  title: string;
  description: string;
  type: CampaignType | null;
  budget: number | null;
  deadline: Date | null;
  expiryDate: Date | null;
  mediaUrl: string;
  file: File | null; // For Salesman campaigns only
  advertiserTypes: string[]; // Array of AdvertiserType enums

  // Type-specific fields
  // VISIBILITY
  cpv: number | null;
  maxViews: number | null;
  trackUrl: string;

  // CONSULTANT
  expectedDeliverables: Deliverable[];
  meetingCount: number | null;
  referenceUrl: string;
  maxQuote: number | null;

  // SELLER
  sellerRequirements: Deliverable[];
  deliverables: Deliverable[];
  meetingPlan: MeetingPlan | null;
  deadlineStrict: boolean;

  // SALESMAN
  commissionPerSale: number | null;
  trackSalesVia: SalesTrackingMethod | null;
  codePrefix: string;
  onlyApprovedCanSell: boolean;
}

const initialFormData: CampaignFormData = {
  title: '',
  description: '',
  type: null,
  budget: null,
  deadline: null,
  expiryDate: null,
  mediaUrl: '',
  file: null,
  advertiserTypes: [],

  cpv: null,
  maxViews: null,
  trackUrl: '',

  expectedDeliverables: [],
  meetingCount: null,
  referenceUrl: '',
  maxQuote: null,

  sellerRequirements: [],
  deliverables: [],
  meetingPlan: null,
  deadlineStrict: false,

  commissionPerSale: null,
  trackSalesVia: null,
  codePrefix: '',
  onlyApprovedCanSell: false,
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
        return formData.title.trim() !== '' && formData.description.trim() !== '';
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
          formData.cpv !== null &&
          formData.cpv >= 0.5 &&
          formData.trackUrl.trim() !== ''
        );
      case CampaignType.CONSULTANT:
        return formData.expectedDeliverables.length > 0;
      case CampaignType.SELLER:
        return formData.sellerRequirements.length > 0 && formData.deliverables.length > 0;
      case CampaignType.SALESMAN:
        return formData.commissionPerSale !== null && formData.trackSalesVia !== null;
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
      // Ensure deadline and expiryDate are always ISO strings if present
      const getISODate = (val: Date | string | null | undefined) => {
        if (!val) return undefined;
        if (val instanceof Date) return val.toISOString();
        // If it's a string, try to parse as date
        const d = new Date(val);
        return isNaN(d.getTime()) ? undefined : d.toISOString();
      };


      const campaignData: any = {
        title: formData.title,
        description: formData.description,
        type: formData.type!,
        budget: formData.budget || undefined,
        deadline: getISODate(formData.deadline),
        expiryDate: getISODate(formData.expiryDate),
        advertiserTypes: formData.advertiserTypes,

        // Type-specific fields
        ...(formData.type === CampaignType.VISIBILITY && {
          mediaUrl: formData.mediaUrl || undefined,
          cpv: formData.cpv || undefined,
          maxViews: formData.maxViews || undefined,
          trackUrl: formData.trackUrl || undefined,
          isPublic: true,
        }),

        ...(formData.type === CampaignType.CONSULTANT && {
          mediaUrl: formData.mediaUrl || undefined,
          expectedDeliverables: formData.expectedDeliverables,
          meetingCount: formData.meetingCount || undefined,
          referenceUrl: formData.referenceUrl || undefined,
          maxQuote: formData.maxQuote || undefined,
        }),

        ...(formData.type === CampaignType.SELLER && {
          mediaUrl: formData.mediaUrl || undefined,
          sellerRequirements: formData.sellerRequirements,
          deliverables: formData.deliverables,
          meetingPlan: formData.meetingPlan || undefined,
          deadlineStrict: formData.deadlineStrict,
        }),

        ...(formData.type === CampaignType.SALESMAN && {
          // Do NOT include mediaUrl for Salesman
          commissionPerSale: formData.commissionPerSale || undefined,
          trackSalesVia: formData.trackSalesVia || undefined,
          codePrefix: formData.codePrefix || undefined,
          onlyApprovedCanSell: true,
          isPublic: false,
        }),
      };

      // For Salesman, add file if present
      if (formData.type === CampaignType.SALESMAN && formData.file) {
        campaignData.file = formData.file;
      }

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
