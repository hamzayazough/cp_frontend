// HTTP Service - Base service for all API communications
export { HttpService, httpService } from "./http.service";
export type { RequestConfig, ApiResponse } from "./http.service";

// Authentication Service - Authentication and user account management
export { AuthService, authService } from "./auth.service";
export type {
  AuthResponse,
  ProfileResponse,
  UsernameCheckResponse,
  UserByIdResponse,
} from "./auth.service";

// User Service - User management and profile operations
export { UserService, userService } from "./user.service";
export type {
  CreateUserRequest,
  UpdateUserRequest,
  UserProfileResponse,
} from "./user.service";

// Import service instances separately for the services object
import { httpService } from "./http.service";
import { authService } from "./auth.service";
import { userService } from "./user.service";

// Re-export commonly used service instances for convenience
export const services = {
  http: httpService,
  auth: authService,
  user: userService,
} as const;
