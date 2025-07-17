"use client";

import Image from "next/image";
import { AdvertiserWork } from "@/app/interfaces/advertiser-work";

interface AdvertiserPortfolioDetailModalProps {
  work: AdvertiserWork;
  onClose: () => void;
}

export default function AdvertiserPortfolioDetailModal({
  work,
  onClose,
}: AdvertiserPortfolioDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{work.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>{" "}
          {/* Media */}
          {work.mediaUrl && (
            <div className="mb-6">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {work.mediaUrl.toLowerCase().includes("video") ||
                work.mediaUrl.toLowerCase().includes(".mp4") ||
                work.mediaUrl.toLowerCase().includes(".webm") ||
                work.mediaUrl.toLowerCase().includes(".mov") ||
                work.mediaUrl.toLowerCase().includes(".avi") ? (
                  <video
                    src={work.mediaUrl}
                    controls
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : work.mediaUrl.toLowerCase().endsWith(".pdf") ? (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-gray-50">
                    <svg
                      className="h-16 w-16 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    <p className="text-gray-600 text-lg font-medium">
                      PDF Document
                    </p>
                    <a
                      href={work.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View PDF
                    </a>
                  </div>
                ) : (
                  <Image
                    src={work.mediaUrl}
                    alt={work.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                    unoptimized
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center space-y-4 bg-gray-100">
                          <svg class="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                          </svg>
                          <p class="text-gray-500 text-lg font-medium">Media unavailable</p>
                        </div>
                      `;
                    }}
                  />
                )}
              </div>
            </div>
          )}
          {/* Price */}
          {work.price && (
            <div className="mb-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span className="mr-1">💰</span>${work.price.toFixed(2)}
              </div>
            </div>
          )}
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {work.description}
            </p>
          </div>
          {/* Links */}
          <div className="space-y-3">
            {work.websiteUrl && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Website
                </h4>
                <a
                  href={work.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Visit Website
                </a>
              </div>
            )}

            {work.mediaUrl && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Media
                </h4>
                <a
                  href={work.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  View Media
                </a>
              </div>
            )}
          </div>
          {/* Footer */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
