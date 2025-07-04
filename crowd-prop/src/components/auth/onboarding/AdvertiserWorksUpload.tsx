'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { OnboardingData } from '../UserOnboarding';

interface AdvertiserWorksUploadProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface WorkFormData {
  title: string;
  description: string;
  websiteUrl: string;
  price: string;
  file: File | null;
}

export default function AdvertiserWorksUpload({
  data,
  onUpdate,
  onNext,
  onBack,
}: AdvertiserWorksUploadProps) {
  const [workFormData, setWorkFormData] = useState<WorkFormData>({
    title: '',
    description: '',
    websiteUrl: '',
    price: '',
    file: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWorkFormData(prev => ({ ...prev, file }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setWorkFormData(prev => ({ ...prev, file: e.dataTransfer.files[0] }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddWork = async () => {
    if (!workFormData.title.trim() || !workFormData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const price = workFormData.price.trim() ? parseFloat(workFormData.price) : undefined;
      
      const response = await authService.uploadAdvertiserWork(
        workFormData.title.trim(),
        workFormData.description.trim(),
        workFormData.file || undefined,
        workFormData.websiteUrl.trim() || undefined,
        price
      );

      // Add the new work to the data
      const updatedWorks = [...data.advertiserWorks, response.work];
      onUpdate({ advertiserWorks: updatedWorks });

      // Reset form
      setWorkFormData({
        title: '',
        description: '',
        websiteUrl: '',
        price: '',
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
    const updatedWorks = data.advertiserWorks.filter((_, i) => i !== index);
    onUpdate({ advertiserWorks: updatedWorks });
  };

  const handleSkip = () => {
    onNext();
  };

  const formatPrice = (price: string | number | null | undefined): string => {
    if (!price) return '';
    
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numericPrice)) return '';
    
    return numericPrice.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Showcase Your Work
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Add examples of your products or services to attract the best promoters
        </p>
      </div>

      {/* Add Work Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Add Work Sample</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Product/Service Title *
              </label>
              <input
                type="text"
                name="title"
                value={workFormData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="e.g., Premium Skincare Collection"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Description *
              </label>
              <textarea
                name="description"
                value={workFormData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                placeholder="Describe your product or service in detail..."
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Website URL
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={workFormData.websiteUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="https://your-website.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  name="price"
                  value={workFormData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="29.99"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Product Image/Video
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="work-file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {workFormData.file ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-green-700 text-sm font-semibold">{workFormData.file.name}</span>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      Drop files here or <span className="text-blue-600">click to browse</span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Images & Videos up to 50MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleAddWork}
          disabled={isUploading || !workFormData.title.trim() || !workFormData.description.trim()}
          className="w-full mt-8 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </div>
          ) : (
            'Add Work Sample'
          )}
        </button>
      </div>

      {/* Uploaded Works Gallery */}
      {data.advertiserWorks.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Your Portfolio</h3>
            </div>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              {data.advertiserWorks.length} {data.advertiserWorks.length === 1 ? 'sample' : 'samples'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.advertiserWorks.map((work, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-6 group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-gray-900 text-lg pr-4">{work.title}</h4>
                  <button
                    onClick={() => handleRemoveWork(index)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">{work.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {work.price && formatPrice(work.price) && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      ${formatPrice(work.price)}
                    </span>
                  )}
                  {work.websiteUrl && (
                    <a 
                      href={work.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-200 transition-colors"
                    >
                      View Product →
                    </a>
                  )}
                </div>
                
                {work.mediaUrl && (
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    {work.mediaUrl.includes('video') ? (
                      <video 
                        src={work.mediaUrl} 
                        controls 
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <img 
                        src={work.mediaUrl} 
                        alt={work.title} 
                        className="w-full h-40 object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
        >
          ← Back
        </button>
        <div className="flex gap-4">
          <button
            onClick={handleSkip}
            className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
          >
            Skip for Now
          </button>
          <button
            onClick={onNext}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
