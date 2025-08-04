"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface MediaUrl {
  mediaUrl: string;
  fileName?: string;
  fileSize?: number;
}

interface CampaignMediaViewerProps {
  mediaUrls: MediaUrl[];
}

export default function CampaignMediaViewer({
  mediaUrls,
}: CampaignMediaViewerProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  if (!mediaUrls || mediaUrls.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? mediaUrls.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentMediaIndex((prev) =>
      prev === mediaUrls.length - 1 ? 0 : prev + 1
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentMediaIndex(index);
  };

  const currentMedia = mediaUrls[currentMediaIndex];

  const renderMedia = (media: MediaUrl) => {
    const mediaUrl = media.mediaUrl;

    if (
      mediaUrl.endsWith(".mp4") ||
      mediaUrl.endsWith(".webm") ||
      mediaUrl.endsWith(".mov") ||
      mediaUrl.endsWith(".avi")
    ) {
      return (
        <video
          src={mediaUrl}
          controls
          className="w-full h-full object-cover rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
      );
    } else if (mediaUrl.toLowerCase().endsWith(".pdf")) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-gray-50 rounded-lg">
          <DocumentTextIcon className="h-16 w-16 text-gray-400" />
          <p className="text-gray-600 text-lg font-medium">PDF Document</p>
          {media.fileName && (
            <p className="text-sm text-gray-500">{media.fileName}</p>
          )}
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            View PDF
          </a>
        </div>
      );
    } else {
      return (
        <Image
          src={mediaUrl}
          alt={`Campaign Media ${currentMediaIndex + 1}`}
          fill
          className="object-cover rounded-lg"
          unoptimized
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement!.innerHTML = `
              <div class="w-full h-full flex flex-col items-center justify-center space-y-4 bg-gray-100 rounded-lg">
                <svg class="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <p class="text-gray-500 text-lg font-medium">Media unavailable</p>
              </div>
            `;
          }}
        />
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Campaign Media
        </h3>
        <p className="text-gray-600">
          {currentMediaIndex + 1} of {mediaUrls.length} files
        </p>
      </div>

      {/* Main Media Display */}
      <div className="relative mb-6">
        <div className="w-full max-w-2xl h-80 bg-gray-200 rounded-xl overflow-hidden relative mx-auto">
          {renderMedia(currentMedia)}
        </div>

        {/* Navigation Arrows - Only show if more than 1 media */}
        {mediaUrls.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Media Info */}
      {currentMedia.fileName && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            File Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">File Name:</span>
              <p className="text-gray-600">{currentMedia.fileName}</p>
            </div>
            {currentMedia.fileSize && (
              <div>
                <span className="font-medium text-gray-700">File Size:</span>
                <p className="text-gray-600">
                  {(currentMedia.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dots Navigation - Only show if more than 1 media */}
      {mediaUrls.length > 1 && (
        <div className="flex justify-center space-x-2 mb-6">
          {mediaUrls.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentMediaIndex
                  ? "bg-blue-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Grid for Quick Navigation - Only show if more than 1 media */}
      {mediaUrls.length > 1 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">
            All Media Files
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaUrls.map((media, index) => (
              <button
                key={index}
                onClick={() => setCurrentMediaIndex(index)}
                className={`relative aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentMediaIndex
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                {media.mediaUrl.toLowerCase().endsWith(".pdf") ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                  </div>
                ) : media.mediaUrl.endsWith(".mp4") ||
                  media.mediaUrl.endsWith(".webm") ||
                  media.mediaUrl.endsWith(".mov") ||
                  media.mediaUrl.endsWith(".avi") ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 relative">
                    <video
                      src={media.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-gray-800"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.84A1 1 0 0 0 5 3.75v12.5a1 1 0 0 0 1.3.91l10.5-6.25a1 1 0 0 0 0-1.82L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={media.mediaUrl}
                    alt={`Media ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gray-100">
                          <svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                )}
                {index === currentMediaIndex && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
