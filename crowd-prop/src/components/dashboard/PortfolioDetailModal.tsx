"use client"

import { useEffect } from "react"
import type { PromoterWork } from "@/app/interfaces/promoter-work"

interface PortfolioDetailModalProps {
  work: PromoterWork
  onClose: () => void
}

export default function PortfolioDetailModal({ work, onClose }: PortfolioDetailModalProps) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"

    // Cleanup function to restore body scroll
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <div
      className="fixed inset-0 backdrop-blur-lg bg-black/30 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
            {/* Media Section */}
            {work.mediaUrl && (
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <img
                    src={work.mediaUrl || "/placeholder.svg"}
                    alt={work.title}
                    className="w-full h-auto max-h-80 object-contain rounded-2xl shadow-lg border border-gray-200"
                  />
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
  )
}
