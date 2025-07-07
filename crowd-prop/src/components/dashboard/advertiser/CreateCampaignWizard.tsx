'use client';

import { useState } from 'react';
import { Campaign } from '@/app/interfaces/campaign';
import { CampaignType, CampaignStatus, Deliverable, MeetingPlan, SalesTrackingMethod } from '@/app/enums/campaign-type';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import StepIndicator from './StepIndicator';
import CampaignTypeStep from './steps/CampaignTypeStep';
import BasicInfoStep from './steps/BasicInfoStep';
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
      description: 'Campaign details and content',
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
        return formData.cpv !== null && formData.trackUrl.trim() !== '';
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
      // Here you would typically make an API call to create the campaign
      // For now, we'll simulate the creation
      const newCampaign: Campaign = {
        id: `campaign-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        type: formData.type!,
        status: CampaignStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        createdBy: 'current-user-id', // This would come from user context
        isPublic: formData.type === CampaignType.VISIBILITY || formData.type === CampaignType.SALESMAN,
        applicationRequired: formData.type === CampaignType.CONSULTANT || formData.type === CampaignType.SELLER,
        budget: formData.budget || undefined,
        deadline: formData.deadline || undefined,
        expiryDate: formData.expiryDate || undefined,
        mediaUrl: formData.mediaUrl || undefined,
        
        // Type-specific fields
        ...(formData.type === CampaignType.VISIBILITY && {
          cpv: formData.cpv || undefined,
          maxViews: formData.maxViews || undefined,
          trackUrl: formData.trackUrl || undefined,
        }),
        
        ...(formData.type === CampaignType.CONSULTANT && {
          expectedDeliverables: formData.expectedDeliverables,
          meetingCount: formData.meetingCount || undefined,
          referenceUrl: formData.referenceUrl || undefined,
          maxQuote: formData.maxQuote || undefined,
        }),
        
        ...(formData.type === CampaignType.SELLER && {
          sellerRequirements: formData.sellerRequirements,
          deliverables: formData.deliverables,
          meetingPlan: formData.meetingPlan || undefined,
          deadlineStrict: formData.deadlineStrict,
        }),
        
        ...(formData.type === CampaignType.SALESMAN && {
          commissionPerSale: formData.commissionPerSale || undefined,
          trackSalesVia: formData.trackSalesVia || undefined,
          codePrefix: formData.codePrefix || undefined,
          onlyApprovedCanSell: formData.onlyApprovedCanSell,
        }),
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onComplete(newCampaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
      // Handle error (show toast, etc.)
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
