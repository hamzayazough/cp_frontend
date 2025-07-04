'use client';

import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
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
        return;
      }

      // In a real app, you would get the user's role from your database
      // For now, we'll assume they're a promoter and redirect accordingly
      // You can modify this logic based on how you store user roles
      
      // Mock role detection - in production, get this from your user data
      const userRole = 'PROMOTER'; // This should come from your user profile/database
      
      if (userRole === 'PROMOTER') {
        router.push(routes.promoter.dashboard);
      } else if (userRole === 'ADVERTISER') {
        router.push(routes.advertiser.dashboard);
      } else {
        // Default fallback dashboard
        router.push(routes.promoter.dashboard);
      }
    });

    return () => unsubscribe();
  }, [router]);

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

  // This component should redirect, so we shouldn't reach this point
  // But just in case, show a loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
