import { httpService } from "./http.service";
import { User } from "@/app/interfaces/user";
import { OnboardingData } from "@/components/auth/UserOnboarding";

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
    console.log("=== USER SERVICE SET CURRENT USER ===");
    console.log("Setting user:", user);
    console.log("User isSetupDone:", user?.isSetupDone);
    console.log("=====================================");

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
   * Clear current user data (logout)
   */
  clearCurrentUser(): void {
    this.currentUser = null;
    this.notifyUserListeners();
  }
  /**
   * Create a new user profile after Firebase registration
   */
  async createUser(userData: CreateUserRequest): Promise<UserProfileResponse> {
    const response = await httpService.post<UserProfileResponse>(
      "/users",
      userData,
      true // requires authentication
    );
    return response.data;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await httpService.get<User>("/users/me", true);
    return response.data;
  }

  /**
   * Get user profile by ID
   */
  async getUserById(userId: string): Promise<User> {
    const response = await httpService.get<User>(`/users/${userId}`, true);
    return response.data;
  }

  /**
   * Update current user profile
   */
  async updateUser(userData: UpdateUserRequest): Promise<User> {
    const response = await httpService.patch<User>("/users/me", userData, true);
    return response.data;
  }

  /**
   * Delete current user account
   */
  async deleteUser(): Promise<{ message: string }> {
    const response = await httpService.delete<{ message: string }>(
      "/users/me",
      true
    );
    return response.data;
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const response = await httpService.uploadFile<{ avatarUrl: string }>(
      "/users/me/avatar",
      file,
      undefined,
      true
    );
    return response.data;
  }

  /**
   * Get user statistics (for promoters)
   */
  async getUserStats(): Promise<{
    totalCampaigns: number;
    completedCampaigns: number;
    totalEarnings: number;
    avgRating: number;
  }> {
    const response = await httpService.get<{
      totalCampaigns: number;
      completedCampaigns: number;
      totalEarnings: number;
      avgRating: number;
    }>("/users/me/stats", true);
    return response.data;
  }

  /**
   * Search users (for finding promoters/advertisers)
   */
  async searchUsers(params: {
    query?: string;
    role?: "PROMOTER" | "ADVERTISER";
    skills?: string[];
    location?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    users: User[];
    total: number;
    hasMore: boolean;
  }> {
    const searchParams = new URLSearchParams();

    if (params.query) searchParams.append("query", params.query);
    if (params.role) searchParams.append("role", params.role);
    if (params.skills?.length) {
      params.skills.forEach((skill) => searchParams.append("skills", skill));
    }
    if (params.location) searchParams.append("location", params.location);
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.offset) searchParams.append("offset", params.offset.toString());

    const response = await httpService.get<{
      users: User[];
      total: number;
      hasMore: boolean;
    }>(`/users/search?${searchParams.toString()}`, true);

    return response.data;
  }
}

// Create and export a singleton instance
export const userService = new UserService();
