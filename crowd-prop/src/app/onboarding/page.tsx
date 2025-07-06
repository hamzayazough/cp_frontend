'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { userService } from '@/services/user.service';
import UserOnboarding from '@/components/auth/UserOnboarding';

export default function OnboardingPage() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const currentUser = userService.getCurrentUserSync();
        
        // Check if user is authenticated and needs onboarding
        if (currentUser) {
          if (currentUser.isSetupDone) {
            // User has already completed setup, redirect to dashboard
            router.push('/dashboard');
            return;
          }
        }
        
        setFirebaseUser(user);
      } else {
        // No Firebase user, redirect to auth
        router.push('/auth');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleOnboardingComplete = () => {
    const currentUser = userService.getCurrentUserSync();
    if (currentUser) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null; // Will redirect to auth
  }

  return (
    <UserOnboarding 
      user={firebaseUser} 
      onComplete={handleOnboardingComplete}
    />
  );
}
