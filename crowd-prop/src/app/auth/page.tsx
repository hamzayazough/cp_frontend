'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import UserOnboarding from '@/components/auth/UserOnboarding';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'onboarding'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authChecked || loading) return;

    if (user && isNewUser) {
      setCurrentView('onboarding');
    } else if (user && !isNewUser) {
      router.push('/dashboard');
    }
  }, [user, isNewUser, authChecked, loading, router]);

  const handleAuthSuccess = (newUser: boolean = false) => {
    console.log('Auth success called with newUser:', newUser);
    setIsNewUser(newUser);
    if (newUser) {
      console.log('Setting current view to onboarding');
      setCurrentView('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user && currentView === 'onboarding') {
    return <UserOnboarding user={user} onComplete={handleOnboardingComplete} />;
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
