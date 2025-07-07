'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CampaignFormData } from '../CreateCampaignWizard';
import { CampaignType } from '@/app/enums/campaign-type';
import { PhotoIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface BasicInfoStepProps {
  formData: CampaignFormData;
  updateFormData: (updates: Partial<CampaignFormData>) => void;
  onNext?: () => void;
}

export default function BasicInfoStep({ formData, updateFormData }: BasicInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CampaignFormData, value: string | number | Date | null) => {
    updateFormData({ [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateField = (field: keyof CampaignFormData, value: unknown) => {
    switch (field) {
      case 'title':
        if (!value || typeof value !== 'string' || value.trim().length < 3) {
          return 'Title must be at least 3 characters long';
        }
        if (value.length > 100) {
          return 'Title must be less than 100 characters';
        }
        break;
      case 'description':
        if (!value || typeof value !== 'string' || value.trim().length < 10) {
          return 'Description must be at least 10 characters long';
        }
        if (value.length > 1000) {
          return 'Description must be less than 1000 characters';
        }
        break;
      case 'budget':
        if (value !== null && typeof value === 'number' && value <= 0) {
          return 'Budget must be greater than 0';
        }
        break;
      case 'mediaUrl':
        // No validation needed for file upload since we handle it in the upload function
        break;
    }
    return '';
  };

  const handleBlur = (field: keyof CampaignFormData) => {
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, mediaUrl: 'File size must be less than 10MB' }));
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, mediaUrl: 'Please upload a valid image, video, or PDF file' }));
      return;
    }

    try {
      // For now, we'll create a local URL for preview
      // In a real app, you'd upload to a cloud storage service
      const fileUrl = URL.createObjectURL(file);
      handleInputChange('mediaUrl', fileUrl);
      
      // Clear any previous errors
      setErrors(prev => ({ ...prev, mediaUrl: '' }));
    } catch {
      setErrors(prev => ({ ...prev, mediaUrl: 'Failed to upload file' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Campaign Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            placeholder="Enter a catchy title for your campaign"
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Campaign Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Description *
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder="Describe your campaign goals, your business, target audience, and what you're looking for..."
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/1000 characters
          </p>
        </div>

        {/* Media File Upload */}
        <div>
          <label htmlFor="mediaFile" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <PhotoIcon className="h-4 w-4 mr-1" />
              Supporting Media (Optional)
            </div>
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="mediaFile"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="mediaFile"
                    name="mediaFile"
                    type="file"
                    accept="image/*,video/*,.pdf"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, MP4, PDF up to 10MB
              </p>
            </div>
          </div>
          {formData.mediaUrl && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PhotoIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    {formData.mediaUrl.split('/').pop() || 'Uploaded file'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange('mediaUrl', '')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
          {errors.mediaUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.mediaUrl}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Upload supporting content like product images, demo videos, or PDFs to help promoters better understand your campaign and brand
          </p>
        </div>

        {/* Budget and Dates Row */}
        <div className={`grid grid-cols-1 gap-4 ${
          formData.type === CampaignType.VISIBILITY || formData.type === CampaignType.SALESMAN 
            ? 'md:grid-cols-1' 
            : 'md:grid-cols-3'
        }`}>
          {/* Budget - Hidden for Visibility and Salesman campaigns */}
          {formData.type !== CampaignType.VISIBILITY && formData.type !== CampaignType.SALESMAN && (
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                  Budget {formData.type === CampaignType.SELLER && <span className="text-red-600">*</span>}
                </div>
              </label>
              <input
                type="number"
                id="budget"
                min="0.01"
                step="0.01"
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', e.target.value ? parseFloat(e.target.value) : null)}
                onBlur={() => handleBlur('budget')}
                placeholder="0.00"
                required={formData.type === CampaignType.SELLER}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                  errors.budget ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formData.type === CampaignType.SELLER && (
                <p className="mt-1 text-sm text-gray-500">This is the maximum amount you are willing to pay to the seller for this campaign. This field is required.</p>
              )}
              {errors.budget && (
                <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
              )}
            </div>
          )}

          {/* Deadline - Hidden for Visibility and Salesman campaigns */}
          {formData.type !== CampaignType.VISIBILITY && formData.type !== CampaignType.SALESMAN && (
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Deadline (Optional)
                </div>
              </label>
              <input
                type="date"
                id="deadline"
                value={formData.deadline ? formData.deadline.toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('deadline', e.target.value ? new Date(e.target.value) : null)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          )}

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Expiry Date (Optional)
              </div>
            </label>
            <input
              type="date"
              id="expiryDate"
              value={formData.expiryDate ? formData.expiryDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('expiryDate', e.target.value ? new Date(e.target.value) : null)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Preview Card */}
      {(formData.title || formData.description) && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Campaign Preview</h4>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start space-x-3">
              {formData.mediaUrl && (
                <div className="flex-shrink-0">
                  <Image 
                    src={formData.mediaUrl} 
                    alt="Campaign media" 
                    width={64}
                    height={64}
                    className="object-cover rounded-lg"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 mb-1">
                  {formData.title || 'Campaign Title'}
                </h5>
                <p className="text-sm text-gray-600 mb-2">
                  {formData.description 
                    ? formData.description.length > 100 
                      ? `${formData.description.substring(0, 100)}...` 
                      : formData.description
                    : 'Campaign description will appear here...'
                  }
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                  {formData.type && (
                    <span className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {formData.type === CampaignType.VISIBILITY && 'Visibility'}
                      {formData.type === CampaignType.CONSULTANT && 'Consultant'}
                      {formData.type === CampaignType.SELLER && 'Seller'}
                      {formData.type === CampaignType.SALESMAN && 'Salesman'}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  {/* Show budget and deadline for Consultant and Seller campaigns */}
                  {formData.type !== CampaignType.VISIBILITY && formData.type !== CampaignType.SALESMAN && (
                    <>
                      {formData.budget && (
                        <span className="flex items-center">
                          <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                          ${formData.budget}
                        </span>
                      )}
                      {formData.deadline && (
                        <span className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          Due: {formData.deadline.toLocaleDateString()}
                        </span>
                      )}
                    </>
                  )}
                  {/* Show expiry date for all campaigns */}
                  {formData.expiryDate && (
                    <span className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      Expires: {formData.expiryDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
