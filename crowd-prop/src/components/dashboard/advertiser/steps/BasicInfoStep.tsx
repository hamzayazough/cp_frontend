'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CampaignFormData } from '../CreateCampaignWizard';
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
        if (value && typeof value === 'string' && !isValidUrl(value)) {
          return 'Please enter a valid URL';
        }
        break;
    }
    return '';
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleBlur = (field: keyof CampaignFormData) => {
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
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
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
            placeholder="Describe your campaign goals, target audience, and what you're looking for..."
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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

        {/* Media URL */}
        <div>
          <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <PhotoIcon className="h-4 w-4 mr-1" />
              Media URL (Optional)
            </div>
          </label>
          <input
            type="url"
            id="mediaUrl"
            value={formData.mediaUrl}
            onChange={(e) => handleInputChange('mediaUrl', e.target.value)}
            onBlur={() => handleBlur('mediaUrl')}
            placeholder="https://example.com/your-media.jpg"
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.mediaUrl ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.mediaUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.mediaUrl}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Add an image or video URL to showcase your campaign
          </p>
        </div>

        {/* Budget and Dates Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                Budget (Optional)
              </div>
            </label>
            <input
              type="number"
              id="budget"
              min="0"
              step="0.01"
              value={formData.budget || ''}
              onChange={(e) => handleInputChange('budget', e.target.value ? parseFloat(e.target.value) : null)}
              onBlur={() => handleBlur('budget')}
              placeholder="0.00"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.budget ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.budget && (
              <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
            )}
          </div>

          {/* Deadline */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  {formData.description || 'Campaign description will appear here...'}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
