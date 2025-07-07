'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  className?: string;
}

export default function ImageUpload({ onUpload, currentUrl, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // For now, we'll use a placeholder URL
      // In a real app, you'd upload to S3 or similar service
      const mockUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`;
      onUpload(mockUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-sm text-gray-500">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-gray-500">Click to upload media</span>
          </div>
        )}
      </label>
      {currentUrl && (
        <div className="mt-2">
          <Image
            src={currentUrl}
            alt="Preview"
            width={200}
            height={96}
            className="w-full h-24 object-cover rounded-lg border border-gray-200"
            unoptimized
          />
        </div>
      )}
    </div>
  );
}
