'use client';

import { useState, useCallback } from 'react';
import { Campaign } from '@/app/interfaces/campaign/campaign';
import { CampaignType } from '@/app/enums/campaign-type';
import { AdvertiserType } from '@/app/enums/advertiser-type';
import { SocialPlatform } from '@/app/enums/social-platform';
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

// Form data interface that mirrors Campaign union type structure
export interface CampaignWizardFormData {
  // Basic info (common to all types)
  title: string;
  description: string;
  type: CampaignType | null;
  advertiserTypes: AdvertiserType[];
  isPublic: boolean;
  file: File | null; // Changed from mediaUrl to file - required for upload
  
  // Optional common fields
  requirements?: string[];
  targetAudience?: string;
  preferredPlatforms?: SocialPlatform[];
  deadline: Date | null; // When the campaign should be deactivated and no longer visible to promoters
  startDate: Date | null;

  // Visibility-specific fields
  cpv?: number;
  maxViews?: number;
  trackingLink?: string;
  minFollowers?: number;

  // Consultant-specific fields
  meetingPlan?: import('@/app/enums/campaign-type').MeetingPlan;
  expertiseRequired?: string;
  expectedDeliverables?: import('@/app/enums/campaign-type').Deliverable[];
  meetingCount?: number;
  maxBudget?: number;
  minBudget?: number;

  // Seller-specific fields
  sellerRequirements?: import('@/app/enums/campaign-type').Deliverable[];
  deliverables?: import('@/app/enums/campaign-type').Deliverable[];
  needMeeting?: boolean;
  sellerMeetingPlan?: import('@/app/enums/campaign-type').MeetingPlan;
  sellerMeetingCount?: number;
  sellerMaxBudget?: number;
  sellerMinBudget?: number;

  // Salesman-specific fields
  commissionPerSale?: number;
  trackSalesVia?: import('@/app/enums/campaign-type').SalesTrackingMethod;
  codePrefix?: string;
  salesmanMinFollowers?: number;
}

const initialFormData: CampaignWizardFormData = {
  title: '',
  description: '',
  type: null,
  advertiserTypes: [],
  isPublic: true,
  file: null,
  requirements: [],
  targetAudience: '',
  preferredPlatforms: [],
  deadline: null,
  startDate: null,

  // Visibility fields
  cpv: undefined,
  maxViews: undefined,
  trackingLink: '',
  minFollowers: undefined,

  // Consultant fields
  meetingPlan: undefined,
  expertiseRequired: '',
  expectedDeliverables: [],
  meetingCount: undefined,
  maxBudget: undefined,
  minBudget: undefined,

  // Seller fields
  sellerRequirements: [],
  deliverables: [],
  needMeeting: false,
  sellerMeetingPlan: undefined,
  sellerMeetingCount: undefined,
  sellerMaxBudget: undefined,
  sellerMinBudget: undefined,

  // Salesman fields
  commissionPerSale: undefined,
  trackSalesVia: undefined,
  codePrefix: '',
  salesmanMinFollowers: undefined,
};

export default function CreateCampaignWizard({ onComplete, onCancel }: CreateCampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CampaignWizardFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'creating'>('idle');

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

  const updateFormData = useCallback((updates: Partial<CampaignWizardFormData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      return newData;
    });
  }, []);

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Campaign Type
        return formData.type !== null;
      case 1: // Basic Info
        return (
          formData.title.trim() !== '' && 
          formData.description.trim() !== '' &&
          formData.advertiserTypes.length > 0 &&
          formData.startDate !== null &&
          formData.deadline !== null &&
          formData.file !== null
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
          typeof formData.trackingLink === 'string' &&
          formData.trackingLink.trim() !== '' &&
          typeof formData.maxViews === 'number' &&
          formData.maxViews > 0
        );
      case CampaignType.CONSULTANT:
        return (
          Array.isArray(formData.expectedDeliverables) && 
          formData.expectedDeliverables.length > 0 &&
          typeof formData.maxBudget === 'number' &&
          formData.maxBudget > 0 &&
          typeof formData.minBudget === 'number' &&
          formData.minBudget > 0 &&
          formData.minBudget <= formData.maxBudget &&
          formData.meetingPlan !== undefined &&
          typeof formData.meetingCount === 'number' &&
          formData.meetingCount > 0
        );
      case CampaignType.SELLER:
        return (
          // Both seller requirements AND deliverables are now required
          Array.isArray(formData.sellerRequirements) && 
          formData.sellerRequirements.length > 0 &&
          Array.isArray(formData.deliverables) && 
          formData.deliverables.length > 0 &&
          typeof formData.sellerMaxBudget === 'number' &&
          formData.sellerMaxBudget > 0 &&
          typeof formData.sellerMinBudget === 'number' &&
          formData.sellerMinBudget > 0 &&
          formData.sellerMinBudget <= formData.sellerMaxBudget &&
          (formData.needMeeting === false || 
           (formData.sellerMeetingPlan !== undefined && 
            typeof formData.sellerMeetingCount === 'number' &&
            formData.sellerMeetingCount > 0))
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
      // Scroll to top of the page when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top of the page when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setUploadStep('creating');

    // Debug: Log the entire form data at submission

    try {
      // Step 1: Create the campaign object first without media
      let campaignData: Campaign;

      const baseData = {
        title: formData.title,
        description: formData.description,
        advertiserTypes: formData.advertiserTypes,
        requirements: formData.requirements,
        targetAudience: formData.targetAudience,
        preferredPlatforms: formData.preferredPlatforms,
        deadline: formData.deadline!, // This serves as both deadline and expiry date
        startDate: formData.startDate!,
      };

      switch (formData.type) {
        case CampaignType.VISIBILITY:
          campaignData = {
            ...baseData,
            type: CampaignType.VISIBILITY,
            cpv: formData.cpv !== undefined ? formData.cpv : 0, 
            maxViews: formData.maxViews!, // Now required
            trackingLink: formData.trackingLink!,
            minFollowers: formData.minFollowers,
            isPublic: formData.isPublic, // Use the user's choice for visibility campaigns
          };
          break;

        case CampaignType.CONSULTANT:
          campaignData = {
            ...baseData,
            type: CampaignType.CONSULTANT,
            meetingPlan: formData.meetingPlan!,
            expertiseRequired: formData.expertiseRequired,
            expectedDeliverables: formData.expectedDeliverables!,
            meetingCount: formData.meetingCount!,
            maxBudget: formData.maxBudget!,
            minBudget: formData.minBudget!,
            isPublic: false, // Always false for consultant campaigns
          };
          break;

        case CampaignType.SELLER:
          campaignData = {
            ...baseData,
            type: CampaignType.SELLER,
            sellerRequirements: formData.sellerRequirements ?? [],
            deliverables: formData.deliverables ?? [],
            maxBudget: formData.sellerMaxBudget!,
            minBudget: formData.sellerMinBudget!,
            isPublic: false,
            minFollowers: formData.minFollowers,
            needMeeting: formData.needMeeting!,
            meetingPlan: formData.sellerMeetingPlan!,
            meetingCount: formData.sellerMeetingCount || 0,
          };
          break;

        case CampaignType.SALESMAN:
          campaignData = {
            ...baseData,
            type: CampaignType.SALESMAN,
            commissionPerSale: formData.commissionPerSale!,
            trackSalesVia: formData.trackSalesVia!,
            codePrefix: formData.codePrefix,
            isPublic: false,
            minFollowers: formData.salesmanMinFollowers,
          };
          break;

        default:
          throw new Error('Invalid campaign type');
      }

      // Step 2: Call the advertiser service to create the campaign
      const result = await advertiserService.createCampaign(campaignData);
      

      if (result.success && result.campaign) {
        let finalCampaign = result.campaign;
      
        // Step 3: Upload the file after campaign creation if there is one
        if (formData.file && result.campaign.id) {
          setUploadStep('uploading');
          const uploadResult = await advertiserService.uploadCampaignFile(
            formData.file,
            result.campaign.id
          );
          if (!uploadResult.success) {
            console.warn('Campaign created but file upload failed:', uploadResult.message);
            // Campaign was created successfully, but file upload failed
            // You might want to show a warning to the user here
          } else {
            // Use the updated campaign returned from the server
            if (uploadResult.campaign) {
              finalCampaign = uploadResult.campaign;
            }
          }
        } else {
          console.log('Skipping file upload - conditions not met');
          console.log('Missing file:', !formData.file);
          console.log('Missing campaign ID:', !result.campaign.id);
        }
        
        onComplete(finalCampaign);
      } else {
        throw new Error(result.message || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      // Handle error (show toast, etc.)
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
      setUploadStep('idle');
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
                  {uploadStep === 'creating' ? 'Creating Campaign...' : 
                   uploadStep === 'uploading' ? 'Uploading File...' : 'Creating...'}
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
