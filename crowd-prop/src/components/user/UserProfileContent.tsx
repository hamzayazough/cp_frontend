'use client';

import Image from 'next/image';
import { User } from '@/app/interfaces/user';
import AdvertiserProfileContent from '@/components/dashboard/AdvertiserProfileContent';
import PromoterProfileContent from '@/components/dashboard/PromoterProfileContent';

interface UserProfileContentProps {
  user: User;
  isViewOnly: boolean;
}

export default function UserProfileContent({ user, isViewOnly }: UserProfileContentProps) {
  // Mock onUserUpdate function since we're in view-only mode
  const handleUserUpdate = () => {
    // In view-only mode, this should never be called
    // But we need to provide it for component compatibility
    console.warn('User update attempted in view-only mode');
  };

  // Render different components based on user role
  switch (user.role) {
    case 'ADVERTISER':
      return (
        <AdvertiserProfileContent 
          user={user} 
          onUserUpdate={handleUserUpdate}
          isViewOnly={isViewOnly}
        />
      );
    
    case 'PROMOTER':
      return (
        <PromoterProfileContent 
          user={user} 
          onUserUpdate={handleUserUpdate}
          isViewOnly={isViewOnly}
        />
      );
    
    case 'ADMIN':
      // For admin users, we can show a generic profile or specific admin view
      return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4 mb-6">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-500">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    Administrator
                  </span>
                  {user.rating && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm text-gray-600">{user.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {user.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600 leading-relaxed">{user.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ADMIN
                </div>
                <div className="text-sm text-gray-500 mt-1">Role</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {new Date(user.createdAt).getFullYear()}
                </div>
                <div className="text-sm text-gray-500 mt-1">Member Since</div>
              </div>
              {user.walletBalance !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${user.walletBalance.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Wallet Balance</div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    
    default:
      return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unknown User Role</h2>
            <p className="text-gray-600">This user has an unrecognized role: {user.role}</p>
          </div>
        </div>
      );
  }
}
