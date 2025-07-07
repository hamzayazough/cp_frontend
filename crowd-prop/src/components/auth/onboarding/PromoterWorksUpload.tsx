
'use client';

import { useState } from 'react';
import Image from 'next/image';
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

  const handleRemoveWork = async (index: number) => {
    const work = data.promoterWorks[index];
    
    try {
      await authService.deletePromoterWork(work.title);
      
      // Remove from local state after successful API call
      const updatedWorks = data.promoterWorks.filter((_, i) => i !== index);
      onUpdate({ promoterWorks: updatedWorks });
    } catch (error) {
      console.error('Failed to delete work:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete work');
    }
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Showcase Your Content
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Share examples of your best work - marketing videos, editing skills, design projects, or any content that showcases your talents to your potential clients
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
          <h3 className="text-xl font-semibold text-gray-900">Add Content Sample</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Content Title *
              </label>
              <input
                type="text"
                name="title"
                value={workFormData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="e.g., Tech Product Review Video"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Description
              </label>
              <textarea
                name="description"
                value={workFormData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                placeholder="Describe your content style and approach..."
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Content File *
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
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: JPEG, PNG, WebP, GIF, MP4, WebM, MOV
              </p>
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
          disabled={isUploading || !workFormData.title.trim() || !workFormData.file}
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
            'Add Content Sample'
          )}
        </button>
      </div>

      {/* Uploaded Works Gallery */}
      {data.promoterWorks.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Your Content Portfolio</h3>
            </div>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              {data.promoterWorks.length} {data.promoterWorks.length === 1 ? 'sample' : 'samples'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.promoterWorks.map((work, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-6 group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-gray-900 text-lg pr-4">{work.title}</h4>
                  <button
                    onClick={() => handleRemoveWork(index)}
                    className="flex-shrink-0 p-1.5 rounded-md transition-all shadow-sm"
                    style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', border: '2px solid #ef4444' }}
                    title="Delete work"
                  >
                    <svg className="w-4 h-4" fill="white" stroke="white" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {work.description && (
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed h-12 overflow-hidden text-ellipsis" style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical' as const,
                    textOverflow: 'ellipsis'
                  }}>
                    {work.description}
                  </p>
                )}
                
                <div className="mt-4">
                  <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100" style={{ height: '192px' }}>
                    {work.mediaUrl.includes('video') ? (
                      <video 
                        src={work.mediaUrl} 
                        controls 
                        className="w-full h-full object-cover"
                        style={{ height: '192px' }}
                      />
                    ) : (
                      <Image
                        src={work.mediaUrl}
                        alt={work.title}
                        width={384}
                        height={192}
                        className="w-full h-full object-cover"
                        style={{ height: '192px' }}
                        unoptimized
                      />
                    )}
                  </div>
                </div>
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
