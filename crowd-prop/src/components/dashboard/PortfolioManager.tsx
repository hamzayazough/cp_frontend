"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { PromoterWork } from "@/app/interfaces/promoter-work";
import { authService } from "@/services/auth.service";

interface PortfolioManagerProps {
  works: PromoterWork[];
  onClose: () => void;
}

export default function PortfolioManager({
  works,
  onClose,
}: PortfolioManagerProps) {
  const [editingWorks, setEditingWorks] = useState<PromoterWork[]>([...works]);
  const [isAdding, setIsAdding] = useState(false);
  const [newWork, setNewWork] = useState<PromoterWork>({
    title: "",
    description: "",
    mediaUrl: "",
  });
  const [newWorkFile, setNewWorkFile] = useState<File | null>(null);
  const [editingFiles, setEditingFiles] = useState<{
    [key: number]: File | null;
  }>({});
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Cleanup function to restore body scroll and revoke object URLs
    return () => {
      document.body.style.overflow = "unset";

      // Cleanup object URLs for file previews
      if (newWorkFile) {
        URL.revokeObjectURL(URL.createObjectURL(newWorkFile));
      }

      Object.values(editingFiles).forEach((file) => {
        if (file) {
          URL.revokeObjectURL(URL.createObjectURL(file));
        }
      });
    };
  }, [newWorkFile, editingFiles]);
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error:
          "Invalid file type. Only images (JPEG, PNG, WebP, GIF), videos (MP4, WebM, MOV), and PDFs are allowed.",
      };
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File size too large. Maximum size is 50MB.",
      };
    }

    return { isValid: true };
  };

  const handleAddWork = async () => {
    if (newWork.title.trim() && newWork.description.trim() && newWorkFile) {
      setUploading(true);
      try {
        const response = await authService.uploadPromoterWork(
          newWorkFile,
          newWork.title.trim(),
          newWork.description.trim()
        );

        const workWithMedia: PromoterWork = {
          title: newWork.title.trim(),
          description: newWork.description.trim(),
          mediaUrl: response.result.publicUrl,
        };

        setEditingWorks([...editingWorks, workWithMedia]);
        setNewWork({ title: "", description: "", mediaUrl: "" });
        setNewWorkFile(null);
        setIsAdding(false);
      } catch (error) {
        console.error("Failed to upload work:", error);
        alert("Failed to upload work. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSaveWork = async (index: number) => {
    const work = editingWorks[index];
    const file = editingFiles[index];

    if (!file) {
      alert("Please select a file before saving.");
      return;
    }

    if (!work.title.trim() || !work.description.trim()) {
      alert("Please fill in title and description before saving.");
      return;
    }

    setUploadingIndex(index);
    try {
      const response = await authService.uploadPromoterWork(
        file,
        work.title.trim(),
        work.description.trim()
      );

      const updatedWork: PromoterWork = {
        ...work,
        mediaUrl: response.result.publicUrl,
      };

      setEditingWorks(
        editingWorks.map((w, i) => (i === index ? updatedWork : w))
      );
      setEditingFiles({ ...editingFiles, [index]: null });

      // Clear the file input
      const fileInput = document.querySelector(
        `input[type="file"][data-index="${index}"]`
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Failed to save work:", error);
      alert("Failed to save work. Please try again.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleRemoveWork = (index: number) => {
    setEditingWorks(editingWorks.filter((_, i) => i !== index));
  };

  const handleUpdateWork = (index: number, updatedWork: PromoterWork) => {
    // Prevent title from being updated - title is used as identifier
    const currentWork = editingWorks[index];
    const workToUpdate = {
      ...updatedWork,
      title: currentWork.title, // Keep original title
    };
    setEditingWorks(
      editingWorks.map((work, i) => (i === index ? workToUpdate : work))
    );
  };

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
        className="bg-white rounded-lg max-w-4xl w-full h-[90vh] border border-gray-200 shadow-lg flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-xl font-semibold"
                style={{ color: "#000000" }}
              >
                Manage Portfolio
              </h2>
              {Object.values(editingFiles).some((file) => file !== null) && (
                <p className="text-sm text-yellow-600 mt-1">
                  ⚠️ You have unsaved changes. Please save all uploaded files.
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
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
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ maxHeight: "calc(90vh - 140px)" }}
        >
          <div className="p-4">
            {/* Existing Works */}
            <div className="space-y-4 mb-6">
              {editingWorks.map((work, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    editingFiles[index]
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-200"
                  }`}
                >
                  {editingFiles[index] && (
                    <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800">
                      <span className="font-medium">⚠️ Unsaved changes:</span>{" "}
                      Please save your uploaded file before closing.
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 space-y-3">
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          style={{ color: "#000000" }}
                        >
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={work.title}
                          readOnly
                          disabled
                          className="w-full p-2 border-2 border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                          placeholder="Work title"
                          style={{ color: "#666666" }}
                        />
                        <span className="text-xs text-gray-500 mt-1">
                          Title cannot be edited as it&apos;s used as identifier
                        </span>
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          style={{ color: "#000000" }}
                        >
                          Description
                        </label>
                        <textarea
                          value={work.description}
                          onChange={(e) =>
                            handleUpdateWork(index, {
                              ...work,
                              description: e.target.value,
                            })
                          }
                          className="w-full p-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          rows={2}
                          placeholder="Description"
                          style={{ color: "#000000" }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-1"
                          style={{ color: "#000000" }}
                        >
                          Media File
                        </label>{" "}
                        <input
                          type="file"
                          accept="image/*,video/*,.pdf"
                          data-index={index}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            console.log(
                              "File selected:",
                              file?.name,
                              "for index:",
                              index
                            );
                            if (file) {
                              const validation = validateFile(file);
                              if (!validation.isValid) {
                                alert(validation.error);
                                return;
                              }
                              console.log(
                                "Setting editing file for index:",
                                index,
                                file.name
                              );
                              setEditingFiles({
                                ...editingFiles,
                                [index]: file,
                              });
                            }
                          }}
                          className="w-full p-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{ color: "#000000" }}
                        />
                        {editingFiles[index] && (
                          <div className="mt-2 bg-white border-2 border-red-500 rounded-lg p-4 shadow-lg">
                            <div className="mb-3">
                              <span className="text-sm font-semibold text-gray-800 break-all">
                                Selected file: {editingFiles[index]?.name}
                              </span>
                            </div>{" "}
                            {editingFiles[index]!.type.startsWith("video/") ? (
                              <video
                                src={URL.createObjectURL(editingFiles[index]!)}
                                className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                                controls
                              />
                            ) : editingFiles[index]!.type ===
                              "application/pdf" ? (
                              <div className="w-32 h-24 rounded-lg border border-gray-200 flex flex-col items-center justify-center space-y-1 bg-gray-50">
                                <svg
                                  className="h-8 w-8 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                </svg>
                                <p className="text-xs text-gray-600 text-center">
                                  PDF
                                </p>
                              </div>
                            ) : (
                              <div className="w-32 h-24 rounded-lg border border-gray-200 overflow-hidden">
                                <Image
                                  src={URL.createObjectURL(
                                    editingFiles[index]!
                                  )}
                                  alt="Preview"
                                  width={128}
                                  height={96}
                                  className="object-cover"
                                  style={{ width: "100%", height: "100%" }}
                                  unoptimized
                                />
                              </div>
                            )}
                            {/* Save Button - Simple Icon */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "12px",
                              }}
                            >
                              <button
                                onClick={() => handleSaveWork(index)}
                                disabled={uploadingIndex === index}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: "#16a34a",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "50%",
                                  cursor:
                                    uploadingIndex === index
                                      ? "not-allowed"
                                      : "pointer",
                                  opacity:
                                    uploadingIndex === index ? "0.5" : "1",
                                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                  transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                  if (uploadingIndex !== index) {
                                    e.currentTarget.style.backgroundColor =
                                      "#15803d";
                                    e.currentTarget.style.transform =
                                      "scale(1.1)";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (uploadingIndex !== index) {
                                    e.currentTarget.style.backgroundColor =
                                      "#16a34a";
                                    e.currentTarget.style.transform =
                                      "scale(1)";
                                  }
                                }}
                              >
                                {uploadingIndex === index ? (
                                  <div
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                      border: "2px solid #ffffff",
                                      borderTop: "2px solid transparent",
                                      borderRadius: "50%",
                                    }}
                                    className="animate-spin"
                                  ></div>
                                ) : (
                                  <svg
                                    style={{ width: "20px", height: "20px" }}
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zM12 19c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H9V5h6v4z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveWork(index)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-full flex-shrink-0"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>{" "}
                  {work.mediaUrl && !editingFiles[index] && (
                    <div className="mt-3">
                      {work.mediaUrl.toLowerCase().includes(".mp4") ||
                      work.mediaUrl.toLowerCase().includes(".webm") ||
                      work.mediaUrl.toLowerCase().includes(".mov") ? (
                        <video
                          src={work.mediaUrl}
                          className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                          controls
                        />
                      ) : work.mediaUrl.toLowerCase().endsWith(".pdf") ? (
                        <div className="w-32 h-24 rounded-lg border border-gray-200 flex flex-col items-center justify-center space-y-2 bg-gray-50">
                          <svg
                            className="h-8 w-8 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          </svg>
                          <p className="text-xs text-gray-600">PDF</p>
                          <a
                            href={work.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 underline"
                          >
                            View
                          </a>
                        </div>
                      ) : (
                        <div className="w-32 h-24 rounded-lg border border-gray-200 overflow-hidden">
                          <Image
                            src={work.mediaUrl || "/placeholder.svg"}
                            alt={work.title}
                            width={128}
                            height={96}
                            className="object-cover"
                            style={{ width: "100%", height: "100%" }}
                            unoptimized
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement!.innerHTML = `
                                <div class="w-32 h-24 rounded-lg border border-gray-200 flex flex-col items-center justify-center space-y-1 bg-gray-50">
                                  <svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                  </svg>
                                  <p class="text-xs text-gray-600">Unavailable</p>
                                </div>
                              `;
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Work */}
            {isAdding ? (
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="space-y-3">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "#000000" }}
                    >
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={newWork.title}
                      onChange={(e) =>
                        setNewWork({ ...newWork, title: e.target.value })
                      }
                      className="w-full p-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Work title"
                      style={{ color: "#000000" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "#000000" }}
                    >
                      Description
                    </label>
                    <textarea
                      value={newWork.description}
                      onChange={(e) =>
                        setNewWork({ ...newWork, description: e.target.value })
                      }
                      className="w-full p-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={2}
                      placeholder="Description"
                      style={{ color: "#000000" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: "#000000" }}
                    >
                      Media File
                    </label>{" "}
                    <input
                      type="file"
                      accept="image/*,video/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const validation = validateFile(file);
                          if (!validation.isValid) {
                            alert(validation.error);
                            return;
                          }
                          setNewWorkFile(file);
                        }
                      }}
                      className="w-full p-2 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ color: "#000000" }}
                    />
                    {newWorkFile && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">
                          {newWorkFile.name}
                        </span>{" "}
                        <div className="mt-2">
                          {newWorkFile.type.startsWith("video/") ? (
                            <video
                              src={URL.createObjectURL(newWorkFile)}
                              className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                              controls
                            />
                          ) : newWorkFile.type === "application/pdf" ? (
                            <div className="w-32 h-24 rounded-lg border border-gray-200 flex flex-col items-center justify-center space-y-1 bg-gray-50">
                              <svg
                                className="h-8 w-8 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                              </svg>
                              <p className="text-xs text-gray-600 text-center">
                                PDF
                              </p>
                            </div>
                          ) : (
                            <div className="w-32 h-24 rounded-lg border border-gray-200 overflow-hidden">
                              <Image
                                src={URL.createObjectURL(newWorkFile)}
                                alt="Preview"
                                width={128}
                                height={96}
                                className="object-cover"
                                style={{ width: "100%", height: "100%" }}
                                unoptimized
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={handleAddWork}
                    disabled={
                      uploading ||
                      !newWork.title.trim() ||
                      !newWork.description.trim() ||
                      !newWorkFile
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Uploading..." : "Add Work"}
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewWork({ title: "", description: "", mediaUrl: "" });
                      setNewWorkFile(null);
                    }}
                    disabled={uploading}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    style={{ color: "#000000" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors mb-6"
                style={{ color: "#000000" }}
              >
                <div className="flex items-center justify-center space-x-2">
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Add New Work</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Fixed Footer with Action Buttons */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: "#000000" }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
