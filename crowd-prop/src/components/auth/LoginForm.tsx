'use client';

import { useState } from 'react';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { FirebaseError } from 'firebase/app';

interface LoginFormProps {
  onSuccess: (needsOnboarding: boolean) => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      // Sign in with Firebase
      await signInWithEmail(email, password);
      
      // Check if user exists in our backend
      try {
        const profileResponse = await authService.getProfile();
        console.log('=== GET PROFILE RESPONSE ===');
        console.log('Response:', profileResponse);
        console.log('User isSetupDone:', profileResponse.user.isSetupDone);
        console.log('============================');
        
        // Save user data to user service
        userService.setCurrentUser(profileResponse.user);
        // Check if user needs onboarding
        onSuccess(!profileResponse.user.isSetupDone);
      } catch {
        // User doesn't exist in backend, create account
        try {
          const createResponse = await authService.createAccount();
          // Save user data to user service
          userService.setCurrentUser(createResponse.user);
          // New user needs onboarding
          onSuccess(true);
        } catch (createError) {
          if (createError instanceof Error) {
            if (createError.message.includes('User already exists')) {
              // User exists but profile fetch failed, try to get profile again
              try {
                const profileResponse = await authService.getProfile();
                userService.setCurrentUser(profileResponse.user);
                onSuccess(!profileResponse.user.isSetupDone);
              } catch {
                setError('Failed to load user profile. Please try again.');
              }
            } else {
              setError(createError.message);
            }
          } else {
            setError('Failed to create account. Please try again.');
          }
        }
      }
    } catch (error) {
      const firebaseError = error as FirebaseError;
      setError(getErrorMessage(firebaseError.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      // Sign in with Google
      const result = await signInWithGoogle();
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      
      if (isNewUser) {
        // New Google user - create account immediately
        try {
          const createResponse = await authService.createAccount();
          userService.setCurrentUser(createResponse.user);
          onSuccess(true); // New user needs onboarding
        } catch (createError) {
          if (createError instanceof Error) {
            if (createError.message.includes('User already exists')) {
              // User exists, get profile
              try {
                const profileResponse = await authService.getProfile();
                userService.setCurrentUser(profileResponse.user);
                onSuccess(!profileResponse.user.isSetupDone);
              } catch {
                setError('Failed to load user profile. Please try again.');
              }
            } else {
              setError(createError.message);
            }
          } else {
            setError('Failed to create account. Please try again.');
          }
        }
      } else {
        // Existing Google user - check if profile exists
        try {
          const profileResponse = await authService.getProfile();
          userService.setCurrentUser(profileResponse.user);
          onSuccess(!profileResponse.user.isSetupDone);
        } catch {
          // Profile doesn't exist, create account
          try {
            const createResponse = await authService.createAccount();
            userService.setCurrentUser(createResponse.user);
            onSuccess(true); // New user needs onboarding
          } catch (createError) {
            if (createError instanceof Error) {
              if (createError.message.includes('User already exists')) {
                // User exists, try to get profile again
                try {
                  const profileResponse = await authService.getProfile();
                  userService.setCurrentUser(profileResponse.user);
                  onSuccess(!profileResponse.user.isSetupDone);
                } catch {
                  setError('Failed to load user profile. Please try again.');
                }
              } else {
                setError(createError.message);
              }
            } else {
              setError('Failed to create account. Please try again.');
            }
          }
        }
      }
    } catch (error) {
      const firebaseError = error as FirebaseError;
      setError(getErrorMessage(firebaseError.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="Enter your email"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="Enter your password"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !email || !password}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>
    </form>
  );
}
