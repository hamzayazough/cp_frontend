'use client';

import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, logout } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { routes } from "@/lib/router";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
      
      if (!authUser) {
        router.push('/auth');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to your Dashboard!
              </h1>
              <p className="text-gray-600 mt-2">
                Hello {user.displayName || user.email}, your account setup is complete.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Campaigns</h3>
              <p className="text-gray-600 mb-4">Manage your marketing campaigns</p>
              <Link
                href={routes.campaigns}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
              >
                View Campaigns
              </Link>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Messages</h3>
              <p className="text-gray-600 mb-4">Check your conversations</p>
              <Link
                href={routes.messages}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors inline-block"
              >
                View Messages
              </Link>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Profile</h3>
              <p className="text-gray-600 mb-4">Update your profile settings</p>
              <Link
                href={routes.profile}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors inline-block"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              🚀 Getting Started
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              Your profile information has been logged to the console. In a production environment, 
              this data would be saved to your backend database.
            </p>
            <p className="text-gray-600 text-xs">
              Check the browser console to see the complete onboarding data that was collected.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href={routes.home}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
