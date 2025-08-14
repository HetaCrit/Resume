//types/user.ts

// Role types for better type safety
export type UserRole = "superadmin" | "admin" | "poweruser" | "user";
export type AccountType = "Admin" | "Member" | "Guest";
export type AuthProvider = "local" | "github" | "google" | "oauth";

// Core user interface compatible with nuxt-auth-utils
export interface User {
    id: string;
    name?: string;
    email?: string;
    username?: string;
    avatar?: string;
    provider?: AuthProvider;
    providerId?: string; // ID from the OAuth provider
    loginTime?: string;
    roles?: UserRole[];
}

// Extended user account interface for your application
export interface UserAccount {
    // Core fields (compatible with nuxt-auth-utils User)
    id: string;
    DisplayName: string;
    FirstName: string;
    LastName: string;
    PrimaryEmail: string;

    // Optional profile fields
    SecondaryEmail?: string;
    PrimaryPhone?: string;
    SecondaryPhone?: string;
    avatar?: string;
    username?: string;

    // Authentication fields
    Password?: string; // Optional - OAuth users won't have passwords
    provider?: AuthProvider;
    providerId?: string; // OAuth provider user ID

    // Account management
    AccountType: AccountType;
    AccountRole: UserRole;
    roles?: UserRole[]; // Array of roles for multi-role support
    ActiveActiveFlag: boolean;

    // Timestamps
    DateCreated: Date;
    DateLastLogin: Date;
    DateUpdated?: Date;

    // Additional metadata
    emailVerified?: boolean;
    phoneVerified?: boolean;
    twoFactorEnabled?: boolean;
    lastLoginIP?: string;
    loginCount?: number;
}

// User session data (what gets stored in the session)
export interface UserSession {
    user: User;
    loggedInAt: string;
    provider?: AuthProvider;
    remember?: boolean;
    expiresAt?: string;
}

// User profile update payload (excludes sensitive fields)
export interface UserProfileUpdate {
    DisplayName?: string;
    FirstName?: string;
    LastName?: string;
    PrimaryEmail?: string;
    SecondaryEmail?: string;
    PrimaryPhone?: string;
    SecondaryPhone?: string;
    avatar?: string;
    username?: string;
    AccountType?: AccountType;
    AccountRole?: UserRole;
}
