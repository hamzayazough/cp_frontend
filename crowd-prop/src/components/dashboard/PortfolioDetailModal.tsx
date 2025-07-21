"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { PromoterWork } from "@/app/interfaces/promoter-work";

interface PortfolioDetailModalProps {
  work: PromoterWork;
  onClose: () => void;
}

export default function PortfolioDetailModal({
  work,
  onClose,
}: PortfolioDetailModalProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Cleanup function to restore body scroll
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 backdrop-blur-lg bg-black/30 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border-2 border-gray-200 ring-1 ring-gray-300/50"
        onClick={(e) => e.stopPropagation()}
        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
      >
        {/* Simple Header with just close button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg"
          >
            <svg
              className="w-5 h-5"
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
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden px-8 pb-8"
          style={{
            maxHeight: "calc(90vh - 80px)",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          <div className="space-y-10">
            {" "}
            {/* Media Section */}
            {work.mediaUrl && (
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className="relative w-full max-h-80 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {work.mediaUrl.toLowerCase().includes(".mp4") ||
                    work.mediaUrl.toLowerCase().includes(".webm") ||
                    work.mediaUrl.toLowerCase().includes(".mov") ||
                    work.mediaUrl.toLowerCase().includes(".avi") ? (
                      <video
                        src={work.mediaUrl}
                        controls
                        className="w-full h-full object-contain"
                        style={{ maxHeight: "320px" }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : work.mediaUrl.toLowerCase().endsWith(".pdf") ? (
                      <div className="w-full h-80 flex flex-col items-center justify-center space-y-4 bg-gray-50">
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
                          className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                        >
                          View PDF
                        </a>
                      </div>
                    ) : (
                      <Image
                        src={work.mediaUrl || "/placeholder.svg"}
                        alt={work.title}
                        width={800}
                        height={320}
                        className="object-contain"
                        style={{ width: "100%", height: "auto" }}
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML = `
                            <div class="w-full h-80 flex flex-col items-center justify-center space-y-4 bg-gray-100">
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
              </div>
            )}
            {/* Content Section */}
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              {/* Title */}
              <div className="space-y-4">
                <h1
                  className="text-4xl font-bold text-gray-900 leading-tight px-4"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    hyphens: "auto",
                  }}
                >
                  {work.title}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
              </div>

              {/* Description */}
              <div className="px-6 pb-8">
                <div
                  className="text-gray-700 leading-relaxed text-lg max-w-3xl mx-auto mb-8"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    hyphens: "auto",
                  }}
                >
                  {work.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
