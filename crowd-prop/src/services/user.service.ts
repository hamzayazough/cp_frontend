import { httpService } from "./http.service";
import { User } from "@/app/interfaces/user";
import { PromoterWork } from "@/app/interfaces/promoter-work";
import { OnboardingData } from "@/components/auth/UserOnboarding";
import { ProfileResponse } from "./auth.service";

export interface CreateUserRequest {
  firebaseUid: string;
  email: string;
  onboardingData: OnboardingData;
}

export interface UpdateUserRequest {
  name?: string;
  bio?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  snapchatUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  advertiserDetails?: {
    companyName?: string;
    advertiserTypes?: string[];
    companyWebsite?: string;
  };
  promoterDetails?: {
    location?: string;
    languagesSpoken?: string[];
    skills?: string[];
    works?: PromoterWork[];
  };
}

export interface UserProfileResponse {
  user: User;
  profile: {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export class UserService {
  private currentUser: User | null = null;
  private userListeners: Array<(user: User | null) => void> = [];

  /**
   * Set current user data in memory
   */
  setCurrentUser(user: User | null): void {
    this.currentUser = user;
    this.notifyUserListeners();
  }

  /**
   * Get current user from memory (synchronous)
   */
  getCurrentUserSync(): User | null {
    return this.currentUser;
  }

  /**
   * Subscribe to user changes
   */
  onUserChange(callback: (user: User | null) => void): () => void {
    this.userListeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.userListeners.indexOf(callback);
      if (index > -1) {
        this.userListeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of user changes
   */
  private notifyUserListeners(): void {
    this.userListeners.forEach((callback) => callback(this.currentUser));
  }

  /**
   * Check if current user needs onboarding
   */
  needsOnboarding(): boolean {
    return this.currentUser ? !this.currentUser.isSetupDone : false;
  }

  /**
   * Check if the user has completed setup and can use full features
   */
  isSetupComplete(): boolean {
    return this.currentUser ? this.currentUser.isSetupDone : false;
  }

  /**
   * Check if API calls that require completed setup should be allowed
   */
  canMakeSetupRequiredCalls(): boolean {
    return this.isSetupComplete();
  }

  /**
   * Clear current user data (logout)
   */
  clearCurrentUser(): void {
    this.currentUser = null;
    this.notifyUserListeners();
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await httpService.get<ProfileResponse>(
        `/auth/profile`,
        true
      );

      return response.data.user;
    } catch (error) {
      console.error("Failed to get user profile:", error);

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          throw new Error("Invalid or missing Firebase token");
        }
        if (error.message.includes("404")) {
          throw new Error("User account not found. Please create an account.");
        }
      }

      throw new Error("Failed to load user profile. Please try again.");
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserById(userId: string): Promise<User> {
    try {
      if (!userId || userId.trim().length === 0) {
        throw new Error("User ID is required");
      }

      const response = await httpService.get<{
        success: boolean;
        user: User;
        message?: string;
      }>(`/user/${userId.trim()}`, true);

      if (!response.data.success) {
        throw new Error("Failed to fetch user profile");
      }

      return response.data.user;
    } catch (error) {
      console.error(`Failed to get user profile for ID ${userId}:`, error);

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          throw new Error("Invalid user ID provided");
        }
        if (error.message.includes("404")) {
          throw new Error("User not found");
        }
        if (error.message.includes("401")) {
          throw new Error("Authentication required to view user profile");
        }
      }

      throw new Error("Failed to load user profile. Please try again.");
    }
  }

  /**
   * Check if a username/name is available
   */
  async checkNameAvailability(name: string): Promise<{
    success: boolean;
    available: boolean;
    message: string;
  }> {
    try {
      if (!name || name.trim().length === 0) {
        throw new Error("Name is required");
      }

      const response = await httpService.get<{
        success: boolean;
        available: boolean;
        message: string;
      }>(
        `/user/check/username?username=${encodeURIComponent(name.trim())}`,
        true
      );

      return response.data;
    } catch (error) {
      console.error(`Failed to check name availability for ${name}:`, error);

      return {
        success: false,
        available: false,
        message:
          error instanceof Error && error.message
            ? error.message
            : "Failed to check name availability. Please try again.",
      };
    }
  }

  /**
   * Check if a company name is available
   */
  async checkCompanyNameAvailability(companyName: string): Promise<{
    success: boolean;
    available: boolean;
    message: string;
  }> {
    try {
      if (!companyName || companyName.trim().length === 0) {
        throw new Error("Company name is required");
      }

      const response = await httpService.get<{
        success: boolean;
        available: boolean;
        message: string;
      }>(
        `/user/check/company-name?companyName=${encodeURIComponent(
          companyName.trim()
        )}`,
        true
      );

      return response.data;
    } catch (error) {
      console.error(
        `Failed to check company name availability for ${companyName}:`,
        error
      );

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          throw new Error("Invalid company name provided");
        }
        if (error.message.includes("401")) {
          throw new Error("Authentication required");
        }
      }

      throw new Error(
        "Failed to check company name availability. Please try again."
      );
    }
  }
}

// Create and export a singleton instance
export const userService = new UserService();
