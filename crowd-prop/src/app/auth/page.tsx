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
      setLoading(false);
    }, 2000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, []);

  // Check initial auth state
  useEffect(() => {
    const checkInitialAuth = () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
      }
    };

    // Small delay to let Firebase initialize
    const timer = setTimeout(checkInitialAuth, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      
      if (!authUser) {
        userService.clearCurrentUser();
        setLoading(false);
      } else {
        const currentUser = userService.getCurrentUserSync();
        if (!currentUser) {
          // Don't set loading to false here, wait for login/register to handle the backend calls
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = userService.onUserChange((currentUser) => {
      
      const firebaseUser = auth.currentUser;
      
      if (firebaseUser && currentUser) {
        if (!currentUser.isSetupDone) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      } else {
        console.log('Missing user data - Firebase user:', !!firebaseUser, 'Current user:', !!currentUser);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [router]);

  const handleAuthSuccess = (needsOnboarding: boolean) => {
    if (needsOnboarding) {
      router.push('/onboarding');
    } else {
      const currentUser = userService.getCurrentUserSync();
      if (currentUser) {
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
