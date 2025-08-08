"use client";

import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { userService } from "@/services/user.service";
import { User as AppUser } from "@/app/interfaces/user";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PromoterMessagesContent from "@/components/dashboard/promoter/PromoterMessagesContent";
import AdvertiserMessagesContent from "@/components/dashboard/advertiser/AdvertiserMessagesContent";

export default function MessagesPage() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setFirebaseUser(authUser);

      if (!authUser) {
        router.push("/auth");
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
        console.error("Error fetching user:", error);
        router.push("/onboarding");
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
    router.push("/onboarding");
    return null;
  }

  // Render role-based messages content
  const renderMessagesContent = () => {
    const currentUserData = {
      id: appUser.id,
      firebaseUid: firebaseUser?.uid || "",
      name: appUser.name,
    };

    switch (appUser.role) {
      case "PROMOTER":
        return <PromoterMessagesContent currentUser={currentUserData} />;
      case "ADVERTISER":
        return <AdvertiserMessagesContent currentUser={currentUserData} />;
      case "ADMIN":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Platform Messages
            </h2>
            <p className="text-gray-600">
              Here you can view and moderate platform communications.
            </p>
          </div>
        );
      default:
        return <PromoterMessagesContent currentUser={currentUserData} />;
    }
  };

  return (
    <DashboardLayout
      userRole={appUser.role}
      userName={appUser.name}
      userEmail={appUser.email}
      userAvatar={appUser.avatarUrl}
    >
      {renderMessagesContent()}
    </DashboardLayout>
  );
}
