'use client';

import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/user.service';
import { User as AppUser } from '@/app/interfaces/user';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PromoterCampaignDetailsContent from '@/components/dashboard/promoter/PromoterCampaignDetailsContent';

interface CampaignDetailsPageProps {
  params: {
    id: string;
  };
}

export default function CampaignDetailsPage({ params }: CampaignDetailsPageProps) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        const currentUser = userService.getCurrentUserSync();
        if (currentUser) {
          setAppUser(currentUser);
        } else {
          // If no user in service, try to fetch from API
          const fetchedUser = await userService.getCurrentUser();
          userService.setCurrentUser(fetchedUser);
          setAppUser(fetchedUser);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/onboarding');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Subscribe to user changes from userService
  useEffect(() => {
    const unsubscribe = userService.onUserChange((user) => {
      setAppUser(user);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!firebaseUser || !appUser) {
    return null;
  }

  if (!appUser.isSetupDone) {
    router.push('/onboarding');
    return null;
  }

  // Render role-based campaign details content
  const renderCampaignDetailsContent = () => {
    switch (appUser.role) {
      case 'PROMOTER':
        return <PromoterCampaignDetailsContent campaignId={params.id} />;
      case 'ADVERTISER':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Campaign Details
            </h2>
            <p className="text-gray-600 mb-4">
              Campaign ID: {params.id}
            </p>
            <p className="text-gray-600">
              Here you can view and manage the details of your advertising campaign.
            </p>
          </div>
        );
      case 'ADMIN':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Campaign Details (Admin View)
            </h2>
            <p className="text-gray-600 mb-4">
              Campaign ID: {params.id}
            </p>
            <p className="text-gray-600">
              Here you can view and manage all campaign details as an admin.
            </p>
          </div>
        );
      default:
        return <PromoterCampaignDetailsContent campaignId={params.id} />;
    }
  };

  return (
    <DashboardLayout
      userRole={appUser.role}
      userName={appUser.name}
      userEmail={appUser.email}
      userAvatar={appUser.avatarUrl}
    >
      {renderCampaignDetailsContent()}
    </DashboardLayout>
  );
}
