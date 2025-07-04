'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { OnboardingData } from '../UserOnboarding';

interface PromoterWorksUploadProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface WorkFormData {
  title: string;
  description: string;
  file: File | null;
}

export default function PromoterWorksUpload({
  data,
  onUpdate,
  onNext,
  onBack,
}: PromoterWorksUploadProps) {
  const [workFormData, setWorkFormData] = useState<WorkFormData>({
    title: '',
    description: '',
    file: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWorkFormData(prev => ({ ...prev, file }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddWork = async () => {
    if (!workFormData.title.trim() || !workFormData.file) {
      setError('Title and file are required');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await authService.uploadPromoterWork(
        workFormData.file,
        workFormData.title.trim(),
        workFormData.description.trim() || undefined
      );

      // Add the new work to the data
      const updatedWorks = [...data.promoterWorks, response.work];
      onUpdate({ promoterWorks: updatedWorks });

      // Reset form
      setWorkFormData({
        title: '',
        description: '',
        file: null,
      });

      // Reset file input
      const fileInput = document.getElementById('work-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Failed to upload work:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload work');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveWork = (index: number) => {
    const updatedWorks = data.promoterWorks.filter((_, i) => i !== index);
    onUpdate({ promoterWorks: updatedWorks });
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Showcase Your Content
        </h2>
        <p className="text-gray-600">
          Add examples of your best promotional content to attract advertisers
        </p>
      </div>

      {/* Add Work Form */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Content Sample</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={workFormData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Tech Product Review Video"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={workFormData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your content style and approach..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content File *
            </label>
            <input
              type="file"
              id="work-file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPEG, PNG, WebP, GIF, MP4, WebM, MOV (Max 50MB)
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleAddWork}
            disabled={isUploading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Add Content Sample'}
          </button>
        </div>
      </div>

      {/* Uploaded Works */}
      {data.promoterWorks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Content Samples ({data.promoterWorks.length})
          </h3>
          <div className="space-y-4">
            {data.promoterWorks.map((work, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{work.title}</h4>
                  <button
                    onClick={() => handleRemoveWork(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                {work.description && (
                  <p className="text-gray-600 text-sm mb-2">{work.description}</p>
                )}
                <div className="mt-2">
                  {work.mediaUrl.includes('video') ? (
                    <video src={work.mediaUrl} controls className="w-full max-w-xs h-32 object-cover rounded" />
                  ) : (
                    <img src={work.mediaUrl} alt={work.title} className="w-full max-w-xs h-32 object-cover rounded" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Skip for Now
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
