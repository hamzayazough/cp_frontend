export interface FirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  disabled: boolean;
  providerData: Record<string, unknown>[];
  customClaims: Record<string, unknown>;
  createdAt: string;
  lastLoginAt: string;
}
