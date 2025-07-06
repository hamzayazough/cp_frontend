'use client';

import { useState } from 'react';
import { AdvertiserWork } from '@/app/interfaces/advertiser-work';

interface AdvertiserPortfolioManagerProps {
  works: AdvertiserWork[];
  onUpdate: (works: AdvertiserWork[]) => void;
  onClose: () => void;
}

export default function AdvertiserPortfolioManager({ works, onUpdate, onClose }: AdvertiserPortfolioManagerProps) {
  const [worksList, setWorksList] = useState<AdvertiserWork[]>(works);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newWork, setNewWork] = useState<AdvertiserWork>({
    title: '',
    description: '',
    mediaUrl: '',
    websiteUrl: '',
    price: undefined,
  });

  const handleAddWork = () => {
    if (newWork.title.trim() && newWork.description.trim()) {
      const cleanedWork = {
        ...newWork,
        title: newWork.title.trim(),
        description: newWork.description.trim(),
        mediaUrl: newWork.mediaUrl?.trim() || undefined,
        websiteUrl: newWork.websiteUrl?.trim() || undefined,
        price: newWork.price || undefined,
      };
      
      const updatedWorks = [...worksList, cleanedWork];
      setWorksList(updatedWorks);
      setNewWork({
        title: '',
        description: '',
        mediaUrl: '',
        websiteUrl: '',
        price: undefined,
      });
      setIsAddingNew(false);
    }
  };

  const handleUpdateWork = (index: number) => {
    if (newWork.title.trim() && newWork.description.trim()) {
      const cleanedWork = {
        ...newWork,
        title: newWork.title.trim(),
        description: newWork.description.trim(),
        mediaUrl: newWork.mediaUrl?.trim() || undefined,
        websiteUrl: newWork.websiteUrl?.trim() || undefined,
        price: newWork.price || undefined,
      };
      
      const updatedWorks = [...worksList];
      updatedWorks[index] = cleanedWork;
      setWorksList(updatedWorks);
      setEditingIndex(null);
      setNewWork({
        title: '',
        description: '',
        mediaUrl: '',
        websiteUrl: '',
        price: undefined,
      });
    }
  };

  const handleDeleteWork = (index: number) => {
    const updatedWorks = worksList.filter((_, i) => i !== index);
    setWorksList(updatedWorks);
  };

  const handleEditWork = (index: number) => {
    setNewWork(worksList[index]);
    setEditingIndex(index);
    setIsAddingNew(true);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingIndex(null);
    setNewWork({
      title: '',
      description: '',
      mediaUrl: '',
      websiteUrl: '',
      price: undefined,
    });
  };

  const handleSave = () => {
    onUpdate(worksList);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Products & Services</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Add New Work Form */}
          {isAddingNew && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingIndex !== null ? 'Edit Product/Service' : 'Add New Product/Service'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newWork.title}
                    onChange={(e) => setNewWork(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Product or service name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newWork.description}
                    onChange={(e) => setNewWork(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your product or service..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image/Media URL
                    </label>
                    <input
                      type="url"
                      value={newWork.mediaUrl || ''}
                      onChange={(e) => setNewWork(prev => ({ ...prev, mediaUrl: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={newWork.websiteUrl || ''}
                      onChange={(e) => setNewWork(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      placeholder="https://yourproduct.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newWork.price || ''}
                    onChange={(e) => setNewWork(prev => ({ ...prev, price: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    placeholder="0.00"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={editingIndex !== null ? () => handleUpdateWork(editingIndex) : handleAddWork}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingIndex !== null ? 'Update' : 'Add'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add New Button */}
          {!isAddingNew && (
            <div className="mb-6">
              <button
                onClick={() => setIsAddingNew(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Product/Service</span>
              </button>
            </div>
          )}

          {/* Works List */}
          <div className="space-y-4">
            {worksList.map((work, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{work.title}</h3>
                      {work.price && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          ${work.price}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{work.description}</p>
                    <div className="flex space-x-4 text-xs">
                      {work.mediaUrl && (
                        <a
                          href={work.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Media
                        </a>
                      )}
                      {work.websiteUrl && (
                        <a
                          href={work.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-4">
                    <button
                      onClick={() => handleEditWork(index)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteWork(index)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {worksList.length === 0 && !isAddingNew && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products or services yet</h3>
              <p className="text-gray-500">Add your first product or service to get started.</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
