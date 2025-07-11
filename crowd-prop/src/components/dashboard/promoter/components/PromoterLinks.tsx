"use client";

import { useState } from "react";
import {
  PlusIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface PromoterLinksProps {
  campaignType: string;
}

export default function PromoterLinks({ campaignType }: PromoterLinksProps) {
  const [promoterLinks, setPromoterLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [editingLinkValue, setEditingLinkValue] = useState("");

  const addPromoterLink = () => {
    if (newLink.trim()) {
      setPromoterLinks([...promoterLinks, newLink.trim()]);
      setNewLink("");
    }
  };

  const deletePromoterLink = (index: number) => {
    setPromoterLinks(promoterLinks.filter((_, i) => i !== index));
  };

  const startEditingLink = (index: number) => {
    setEditingLinkIndex(index);
    setEditingLinkValue(promoterLinks[index]);
  };

  const saveEditedLink = () => {
    if (editingLinkIndex !== null && editingLinkValue.trim()) {
      const updatedLinks = [...promoterLinks];
      updatedLinks[editingLinkIndex] = editingLinkValue.trim();
      setPromoterLinks(updatedLinks);
      setEditingLinkIndex(null);
      setEditingLinkValue("");
    }
  };

  const cancelEditing = () => {
    setEditingLinkIndex(null);
    setEditingLinkValue("");
  };

  if (campaignType !== "CONSULTANT") {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Your Campaign Links
        </h3>
        <span className="text-sm text-gray-600">
          Add links to your work (posts, videos, docs, etc.)
        </span>
      </div>
      
      {/* Add New Link */}
      <div className="mb-4">
        <div className="flex gap-3">
          <input
            type="url"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            placeholder="Enter a link (Instagram post, TikTok video, Google Doc, etc.)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <button
            onClick={addPromoterLink}
            disabled={!newLink.trim()}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Link
          </button>
        </div>
      </div>
      
      {/* Links List */}
      <div className="space-y-3">
        {promoterLinks.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No work links added yet
            </p>
            <p className="text-gray-400 text-sm">
              Share Google Docs, PowerPoints, designs, or reports that your
              client needs to review
            </p>
          </div>
        ) : (
          promoterLinks.map((link, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {editingLinkIndex === index ? (
                // Edit mode
                <>
                  <input
                    type="url"
                    value={editingLinkValue}
                    onChange={(e) => setEditingLinkValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    autoFocus
                  />
                  <button
                    onClick={saveEditedLink}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </>
              ) : (
                // View mode
                <>
                  <LinkIcon className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-blue-600 hover:text-blue-800 truncate text-sm font-medium"
                  >
                    {link}
                  </a>
                  <button
                    onClick={() => startEditingLink(index)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deletePromoterLink(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Helper text */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-purple-700 text-sm">
          <strong>💡 Important:</strong> These links will be{" "}
          <strong>visible to your client</strong>. Share links to your
          deliverables and work progress such as:
        </p>
        <ul className="text-purple-700 text-sm mt-2 ml-4 space-y-1">
          <li>• Google Docs with strategy documents or reports</li>
          <li>• PowerPoint presentations with your recommendations</li>
          <li>• Spreadsheets with data analysis or campaign metrics</li>
          <li>• Figma/Canva designs for marketing materials</li>
          <li>• Live campaign examples or case studies you&apos;ve created</li>
        </ul>
      </div>
    </div>
  );
}
