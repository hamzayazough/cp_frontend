'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { userService } from '@/services/user.service';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('=== AUTH PAGE: Timeout reached - forcing loading to false ===');
      setLoading(false);
    }, 2000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, []);

  // Check initial auth state
  useEffect(() => {
    console.log('=== AUTH PAGE: Checking initial auth state ===');
    const checkInitialAuth = () => {
      const user = auth.currentUser;
      console.log('Initial Firebase user:', user);
      if (!user) {
        console.log('No initial user - setting loading to false');
        setLoading(false);
      }
    };

    // Small delay to let Firebase initialize
    const timer = setTimeout(checkInitialAuth, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('=== AUTH PAGE: Setting up Firebase auth listener ===');
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      console.log('=== FIREBASE AUTH STATE CHANGED ===');
      console.log('Auth user:', authUser);
      console.log('Auth user email:', authUser?.email);
      console.log('Auth user UID:', authUser?.uid);
      
      if (!authUser) {
        console.log('No Firebase user - clearing user service and setting loading to false');
        userService.clearCurrentUser();
        setLoading(false);
      } else {
        console.log('Firebase user exists - checking if user service has data');
        const currentUser = userService.getCurrentUserSync();
        if (!currentUser) {
          console.log('No user in service yet - will wait for login/register to handle it');
          // Don't set loading to false here, wait for login/register to handle the backend calls
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('=== AUTH PAGE: Setting up user service listener ===');
    const unsubscribe = userService.onUserChange((currentUser) => {
      console.log('=== USER SERVICE CHANGED ===');
      console.log('Current user:', currentUser);
      console.log('Current user isSetupDone:', currentUser?.isSetupDone);
      console.log('Firebase auth current user:', auth.currentUser);
      
      const firebaseUser = auth.currentUser;
      
      if (firebaseUser && currentUser) {
        console.log('Both Firebase and user service have user data');
        if (!currentUser.isSetupDone) {
          console.log('User needs onboarding - redirecting');
          router.push('/onboarding');
        } else {
          console.log('User setup complete - redirecting to dashboard');
          const role = currentUser.role?.toLowerCase();
          if (role === 'promoter') {
            router.push('/dashboard/promoter');
          } else if (role === 'advertiser') {
            router.push('/dashboard/advertiser');
          } else {
            router.push('/dashboard');
          }
        }
      } else {
        console.log('Missing user data - Firebase user:', !!firebaseUser, 'Current user:', !!currentUser);
      }
      
      console.log('Setting loading to false');
      setLoading(false);
    });

    return unsubscribe;
  }, [router]);

  const handleAuthSuccess = (needsOnboarding: boolean) => {
    console.log('Auth success called with needsOnboarding:', needsOnboarding);
    if (needsOnboarding) {
      console.log('Redirecting to onboarding');
      router.push('/onboarding');
    } else {
      console.log('Redirecting to dashboard');
      const currentUser = userService.getCurrentUserSync();
      if (currentUser) {
        const role = currentUser.role?.toLowerCase();
        if (role === 'promoter') {
          router.push('/dashboard/promoter');
        } else if (role === 'advertiser') {
          router.push('/dashboard/advertiser');
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to CrowdProp
          </h1>
          <p className="text-gray-600">
            The performance-based marketplace where businesses get promoted, and promoters get paid.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-t-lg ${
                currentView === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setCurrentView('login')}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-t-lg ${
                currentView === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setCurrentView('register')}
            >
              Sign Up
            </button>
          </div>

          {currentView === 'login' ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <RegisterForm onSuccess={handleAuthSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
