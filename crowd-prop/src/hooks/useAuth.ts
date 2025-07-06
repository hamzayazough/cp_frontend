import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import { User } from "@/app/interfaces/user";

interface UseAuthGuardReturn {
  user: User | null;
  loading: boolean;
  needsOnboarding: boolean;
}

export const useAuthGuard = (): UseAuthGuardReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if user exists in our backend and get profile
          const profileResponse = await authService.getProfile();
          const userData = profileResponse.user;

          // Save user data to user service
          userService.setCurrentUser(userData);
          setUser(userData);

          // Check if user needs onboarding
          if (!userData.isSetupDone) {
            setNeedsOnboarding(true);
          } else {
            setNeedsOnboarding(false);
          }
        } catch (error) {
          console.error("Failed to get user profile:", error);
          // User might not exist in backend, redirect to create account
          setUser(null);
          setNeedsOnboarding(false);
        }
      } else {
        // No Firebase user, clear everything
        setUser(null);
        userService.clearCurrentUser();
        setNeedsOnboarding(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to user service changes
  useEffect(() => {
    const unsubscribe = userService.onUserChange((userData) => {
      setUser(userData);
      if (userData) {
        setNeedsOnboarding(!userData.isSetupDone);
      } else {
        setNeedsOnboarding(false);
      }
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    needsOnboarding,
  };
};

// Hook for protecting routes that require authentication
export const useProtectedRoute = () => {
  const { user, loading, needsOnboarding } = useAuthGuard();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // No user, redirect to auth
        router.push("/auth");
      } else if (needsOnboarding) {
        // User exists but needs onboarding
        router.push("/onboarding");
      }
    }
  }, [user, loading, needsOnboarding, router]);

  return { user, loading, needsOnboarding };
};

// Hook for auth pages (redirect away if already authenticated)
export const useAuthRedirect = () => {
  const { user, loading, needsOnboarding } = useAuthGuard();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (needsOnboarding) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, loading, needsOnboarding, router]);

  return { user, loading };
};
