import { auth } from "@/lib/firebase";

export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  requiresAuth?: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export class HttpService {
  private baseUrl: string;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3000/api"
  ) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the Firebase auth token
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }
      return await user.getIdToken();
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }

  /**
   * Prepare headers for the request
   */
  private async prepareHeaders(config: RequestConfig): Promise<Headers> {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...config.headers,
    });

    if (config.requiresAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        throw new Error("Authentication required but no valid token found");
      }
    }

    return headers;
  }

  /**
   * Make HTTP request
   */
  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = await this.prepareHeaders(config);

      const requestOptions: RequestInit = {
        method: config.method || "GET",
        headers,
      };

      if (config.body && config.method !== "GET") {
        requestOptions.body = JSON.stringify(config.body);
      }

      const response = await fetch(url, requestOptions);

      let data: T;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${
            typeof data === "object" && data && "message" in data
              ? (data as { message: string }).message
              : "Request failed"
          }`
        );
      }

      return {
        data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      console.error("HTTP Request failed:", error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    requiresAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "GET",
      requiresAuth,
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    requiresAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body,
      requiresAuth,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    requiresAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body,
      requiresAuth,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    requiresAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "PATCH",
      body,
      requiresAuth,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    requiresAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "DELETE",
      requiresAuth,
    });
  }

  /**
   * Upload file
   */
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, unknown>,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, JSON.stringify(value));
        });
      }

      const headers: Record<string, string> = {};

      if (requiresAuth) {
        const token = await this.getAuthToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        } else {
          throw new Error("Authentication required but no valid token found");
        }
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${data.message || "Upload failed"}`
        );
      }

      return {
        data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  }

  /**
   * Upload form data
   */
  async uploadFormData<T>(
    endpoint: string,
    formData: FormData,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {};

      if (requiresAuth) {
        const token = await this.getAuthToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        } else {
          throw new Error("Authentication required but no valid token found");
        }
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${data.message || "Upload failed"}`
        );
      }

      return {
        data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      console.error("Form data upload failed:", error);
      throw error;
    }
  }
}

export const httpService = new HttpService();
