'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { User as AppUser } from '@/app/interfaces/user';
import { userService } from '@/services/user.service';
import UserProfileContent from '@/components/user/UserProfileContent';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params?.userId as string;
  const router = useRouter();

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [viewedUser, setViewedUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authenticate and get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setFirebaseUser(authUser);
      
      if (!authUser) {
        router.push('/auth');
        setLoading(false);
        return;
      }

      try {
        // Get current user from userService
        const current = userService.getCurrentUserSync();
        if (current) {
          setCurrentUser(current);
        } else {
          // If no user in service, try to fetch from API
          const fetchedUser = await userService.getCurrentUser();
          userService.setCurrentUser(fetchedUser);
          setCurrentUser(fetchedUser);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        router.push('/auth');
        return;
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch the viewed user profile
  useEffect(() => {
    const fetchViewedUser = async () => {
      if (!userId || !currentUser) return;

      try {
        setError(null);
        const userData = await userService.getUserById(userId);
        setViewedUser(userData);
      } catch (err) {
        console.error('Error fetching viewed user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user profile');
      }
    };

    fetchViewedUser();
  }, [userId, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading user profile...</span>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!firebaseUser || !currentUser) {
    return null;
  }

  // If current user is not set up, redirect to onboarding
  if (!currentUser.isSetupDone) {
    router.push('/onboarding');
    return null;
  }

  if (error) {
    return (
      <DashboardLayout
        userRole={currentUser.role}
        userName={currentUser.name}
        userEmail={currentUser.email}
        userAvatar={currentUser.avatarUrl}
      >
        <div className="flex items-center justify-center min-h-96">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!viewedUser) {
    return (
      <DashboardLayout
        userRole={currentUser.role}
        userName={currentUser.name}
        userEmail={currentUser.email}
        userAvatar={currentUser.avatarUrl}
      >
        <div className="flex items-center justify-center min-h-96">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
            <p className="text-gray-600 mb-4">The user profile you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userRole={currentUser.role}
      userName={currentUser.name}
      userEmail={currentUser.email}
      userAvatar={currentUser.avatarUrl}
    >
      <UserProfileContent user={viewedUser} isViewOnly={true} />
    </DashboardLayout>
  );
}
