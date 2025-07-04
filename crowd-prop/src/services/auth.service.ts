import { httpService } from "./http.service";
import { User } from "@/app/interfaces/user";
import { CreateUserDto } from "@/app/interfaces/user-dto";
import { PromoterWork } from "@/app/interfaces/promoter-work";
import { AdvertiserWork } from "@/app/interfaces/advertiser-work";

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}

export interface UploadResult {
  publicUrl: string;
  key: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  result: UploadResult;
}

export interface UsernameCheckResponse {
  available: boolean;
  exists: boolean;
}

export interface UserByIdResponse {
  success: boolean;
  user: User;
}

export interface PromoterWorkUploadResponse {
  success: boolean;
  message: string;
  result: UploadResult;
  work: PromoterWork;
}

export interface AdvertiserWorkUploadResponse {
  success: boolean;
  message: string;
  result?: UploadResult;
  work: AdvertiserWork;
}

export class AuthService {
  private readonly baseEndpoint = "/auth";

  /**
   * Create a basic user account from Firebase token
   * Requires authentication
   */
  async createAccount(): Promise<AuthResponse> {
    try {
      const response = await httpService.post<AuthResponse>(
        `${this.baseEndpoint}/create-account`,
        undefined,
        true
      );

      return response.data;
    } catch (error) {
      console.error("Failed to create account:", error);

      if (error instanceof Error) {
        if (error.message.includes("409")) {
          throw new Error("User already exists");
        }
        if (error.message.includes("401")) {
          throw new Error("Invalid or missing Firebase token");
        }
      }

      throw new Error("Failed to create account. Please try again.");
    }
  }

  /**
   * Complete user account setup with full profile details
   * Requires authentication
   */
  async completeAccount(userData: CreateUserDto): Promise<AuthResponse> {
    try {
      if (userData.role === "ADVERTISER" && !userData.advertiserDetails) {
        throw new Error("Advertiser details are required for advertiser role");
      }

      if (userData.role === "PROMOTER" && !userData.promoterDetails) {
        throw new Error("Promoter details are required for promoter role");
      }

      const response = await httpService.post<AuthResponse>(
        `${this.baseEndpoint}/complete-account`,
        userData,
        true
      );

      return response.data;
    } catch (error) {
      console.error("Failed to complete account setup:", error);

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          throw new Error("Invalid user data provided");
        }
        if (error.message.includes("401")) {
          throw new Error("Invalid or missing Firebase token");
        }
        if (error.message.includes("404")) {
          throw new Error(
            "User account not found. Please create an account first."
          );
        }
        if (error.message.includes("409")) {
          throw new Error(
            "Username already taken. Please choose a different username."
          );
        }
      }

      throw new Error("Failed to complete account setup. Please try again.");
    }
  }

  /**
   * Check if a username is available
   * Does NOT require authentication
   */
  async checkUsername(username: string): Promise<UsernameCheckResponse> {
    try {
      if (!username || username.trim().length === 0) {
        throw new Error("Username is required");
      }

      const response = await httpService.get<UsernameCheckResponse>(
        `${this.baseEndpoint}/check-username?name=${encodeURIComponent(
          username.trim()
        )}`,
        false
      );

      return response.data;
    } catch (error) {
      console.error("Failed to check username:", error);

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          throw new Error("Username is required and cannot be empty");
        }
      }

      throw new Error(
        "Failed to check username availability. Please try again."
      );
    }
  }

  /**
   * Get current user profile
   * Requires authentication
   */
  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await httpService.get<ProfileResponse>(
        `${this.baseEndpoint}/profile`,
        true
      );

      return response.data;
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
   * Get user by ID (public endpoint for viewing profiles)
   * Does NOT require authentication
   */
  async getUserById(userId: string): Promise<UserByIdResponse> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const response = await httpService.get<UserByIdResponse>(
        `${this.baseEndpoint}/user?id=${encodeURIComponent(userId)}`,
        false
      );

      return response.data;
    } catch (error) {
      console.error("Failed to get user by ID:", error);

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          throw new Error("User ID is required");
        }
        if (error.message.includes("404")) {
          throw new Error("User not found");
        }
      }

      throw new Error("Failed to load user profile. Please try again.");
    }
  }

  /**
   * Check if user is authenticated and has a complete profile
   */
  async isUserSetupComplete(): Promise<boolean> {
    try {
      const profile = await this.getProfile();
      return profile.user.isSetupDone;
    } catch {
      return false;
    }
  }

  /**
   * Get user role for navigation purposes
   */
  async getUserRole(): Promise<string | null> {
    try {
      const profile = await this.getProfile();
      return profile.user.role;
    } catch {
      return null;
    }
  }

  /**
   * Validate username format (client-side validation)
   */
  validateUsername(username: string): { isValid: boolean; error?: string } {
    if (!username || username.trim().length === 0) {
      return { isValid: false, error: "Username is required" };
    }

    const trimmed = username.trim();

    if (trimmed.length < 3) {
      return {
        isValid: false,
        error: "Username must be at least 3 characters long",
      };
    }

    if (trimmed.length > 30) {
      return {
        isValid: false,
        error: "Username must be no more than 30 characters long",
      };
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmed)) {
      return {
        isValid: false,
        error:
          "Username can only contain letters, numbers, underscores, and hyphens",
      };
    }

    return { isValid: true };
  }

  /**
   * Validate user data before submission
   */
  validateUserData(userData: CreateUserDto): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!userData.name || userData.name.trim().length === 0) {
      errors.push("Name is required");
    }

    if (!userData.email || userData.email.trim().length === 0) {
      errors.push("Email is required");
    }

    if (!userData.role) {
      errors.push("Role selection is required");
    }

    if (userData.role === "ADVERTISER") {
      if (!userData.advertiserDetails) {
        errors.push("Advertiser details are required");
      } else {
        if (!userData.advertiserDetails.companyName?.trim()) {
          errors.push("Company name is required for advertisers");
        }
        if (!userData.advertiserDetails.advertiserTypes?.length) {
          errors.push("At least one advertiser type is required");
        }
        if (!userData.advertiserDetails.companyWebsite?.trim()) {
          errors.push("Company website is required for advertisers");
        }
      }
    }

    if (userData.role === "PROMOTER") {
      if (!userData.promoterDetails) {
        errors.push("Promoter details are required");
      } else {
        if (!userData.promoterDetails.location?.trim()) {
          errors.push("Location is required for promoters");
        }
        if (!userData.promoterDetails.languagesSpoken?.length) {
          errors.push("At least one language is required for promoters");
        }
        if (!userData.promoterDetails.skills?.length) {
          errors.push("At least one skill is required for promoters");
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Upload user avatar image
   * Requires authentication
   */
  async uploadAvatar(file: File): Promise<UploadResponse> {
    try {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Only JPEG, PNG, and WebP are allowed."
        );
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size too large. Maximum size is 5MB.");
      }

      const response = await httpService.uploadFile<UploadResponse>(
        `${this.baseEndpoint}/upload-avatar`,
        file,
        undefined,
        true
      );

      return response.data;
    } catch (error) {
      console.error("Failed to upload avatar:", error);

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          throw new Error("Invalid file provided");
        }
        if (error.message.includes("401")) {
          throw new Error("Invalid or missing Firebase token");
        }
      }

      throw new Error("Failed to upload avatar. Please try again.");
    }
  }

  /**
   * Upload user background image
   * Requires authentication
   */
  async uploadBackground(file: File): Promise<UploadResponse> {
    try {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Only JPEG, PNG, and WebP are allowed."
        );
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size too large. Maximum size is 10MB.");
      }

      const response = await httpService.uploadFile<UploadResponse>(
        `${this.baseEndpoint}/upload-background`,
        file,
        undefined,
        true
      );

      return response.data;
    } catch (error) {
      console.error("Failed to upload background:", error);

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          throw new Error("Invalid file provided");
        }
        if (error.message.includes("401")) {
          throw new Error("Invalid or missing Firebase token");
        }
      }

      throw new Error("Failed to upload background image. Please try again.");
    }
  }

  /**
   * Upload promoter work
   * Requires authentication
   */
  async uploadPromoterWork(
    file: File,
    title: string,
    description?: string,
    workId?: string
  ): Promise<PromoterWorkUploadResponse> {
    try {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Only images (JPEG, PNG, WebP, GIF) and videos (MP4, WebM, MOV) are allowed."
        );
      }

      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File size too large. Maximum size is 50MB.");
      }

      // Validate title
      if (!title || title.trim().length === 0) {
        throw new Error("Title is required");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      if (description) {
        formData.append("description", description.trim());
      }

      const url = workId
        ? `${
            this.baseEndpoint
          }/upload-promoter-work?workId=${encodeURIComponent(workId)}`
        : `${this.baseEndpoint}/upload-promoter-work`;

      const response =
        await httpService.uploadFormData<PromoterWorkUploadResponse>(
          url,
          formData,
          true
        );

      return response.data;
    } catch (error) {
      console.error("Failed to upload promoter work:", error);

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          throw new Error("Invalid file or missing required fields");
        }
        if (error.message.includes("401")) {
          throw new Error("Authentication required");
        }
      }

      throw new Error("Failed to upload work. Please try again.");
    }
  }

  /**
   * Upload advertiser work
   * Requires authentication
   */
  async uploadAdvertiserWork(
    title: string,
    description: string,
    file?: File,
    websiteUrl?: string,
    price?: number,
    workId?: string
  ): Promise<AdvertiserWorkUploadResponse> {
    try {
      // Validate required fields
      if (!title || title.trim().length === 0) {
        throw new Error("Title is required");
      }

      if (!description || description.trim().length === 0) {
        throw new Error("Description is required");
      }

      // Validate file if provided
      if (file) {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
          "video/mp4",
          "video/webm",
          "video/quicktime",
        ];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(
            "Invalid file type. Only images (JPEG, PNG, WebP, GIF) and videos (MP4, WebM, MOV) are allowed."
          );
        }

        // Validate file size (50MB max)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new Error("File size too large. Maximum size is 50MB.");
        }
      }

      // Validate price if provided
      if (price !== undefined && (price < 0 || isNaN(price))) {
        throw new Error("Price must be a valid positive number");
      }

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());

      if (file) {
        formData.append("file", file);
      }

      if (websiteUrl) {
        formData.append("websiteUrl", websiteUrl.trim());
      }

      if (price !== undefined) {
        formData.append("price", price.toString());
      }

      const url = workId
        ? `${
            this.baseEndpoint
          }/upload-advertiser-work?workId=${encodeURIComponent(workId)}`
        : `${this.baseEndpoint}/upload-advertiser-work`;

      const response =
        await httpService.uploadFormData<AdvertiserWorkUploadResponse>(
          url,
          formData,
          true
        );

      return response.data;
    } catch (error) {
      console.error("Failed to upload advertiser work:", error);

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          throw new Error("Invalid data or missing required fields");
        }
        if (error.message.includes("401")) {
          throw new Error("Authentication required");
        }
      }

      throw new Error("Failed to upload work. Please try again.");
    }
  }

  /**
   * Delete advertiser work
   * Requires authentication
   */
  async deleteAdvertiserWork(
    title: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpService.post<{
        success: boolean;
        message: string;
      }>(`${this.baseEndpoint}/delete-advertiser-work`, { title }, true);

      return response.data;
    } catch (error) {
      console.error("Failed to delete advertiser work:", error);

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          throw new Error("Title is required");
        }
        if (error.message.includes("401")) {
          throw new Error("Authentication required");
        }
        if (error.message.includes("404")) {
          throw new Error("Work not found");
        }
      }

      throw new Error("Failed to delete work. Please try again.");
    }
  }

  /**
   * Delete promoter work
   * Requires authentication
   */
  async deletePromoterWork(
    title: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await httpService.post<{
        success: boolean;
        message: string;
      }>(`${this.baseEndpoint}/delete-promoter-work`, { title }, true);

      return response.data;
    } catch (error) {
      console.error("Failed to delete promoter work:", error);

      if (error instanceof Error) {
        if (error.message.includes("400")) {
          throw new Error("Title is required");
        }
        if (error.message.includes("401")) {
          throw new Error("Authentication required");
        }
        if (error.message.includes("404")) {
          throw new Error("Work not found");
        }
      }

      throw new Error("Failed to delete work. Please try again.");
    }
  }
}

export const authService = new AuthService();
