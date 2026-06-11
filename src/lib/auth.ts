// Authentication utility functions for admin panel
// Handles Firebase authentication and backend auth endpoints
// Backend URL must be set in environment variables

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

// Initialize Firebase from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

// Backend API endpoint
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Login with email and password
// Authenticates with Firebase and verifies admin role via backend
export const loginAdmin = async (email: string, password: string) => {
  try {
    // Step 1: Authenticate with Firebase
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

    // Step 2: Get Firebase ID token
    const idToken = await user.getIdToken();

    // Step 3: Verify admin role with backend
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      await signOut(firebaseAuth);
      return { error: responseData.error || "Failed to fetch user profile", data: null };
    }

    // Step 4: Check if user is admin
    if (responseData.data?.role !== "admin") {
      await signOut(firebaseAuth);
      return { error: "Access denied. Admin role required.", data: null };
    }

    // Store token in session storage for API calls
    sessionStorage.setItem("adminAuthToken", idToken);
    
    // Also set cookie for middleware authentication check
    // Cookie expires in 1 hour (same as Firebase token)
    document.cookie = `adminAuthToken=${idToken}; path=/; max-age=3600; SameSite=Strict`;

    return { error: null, data: { uid: user.uid, email: user.email } };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred", data: null };
  }
};

// Logout current user
export const logoutAdmin = async () => {
  try {
    await signOut(firebaseAuth);
    sessionStorage.removeItem("adminAuthToken");
    
    // Clear the cookie
    document.cookie = "adminAuthToken=; path=/; max-age=0";
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message || "Failed to logout" };
  }
};

// Get current auth token
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("adminAuthToken");
};

// Get current user from Firebase
export const getCurrentUser = (): User | null => {
  return firebaseAuth.currentUser;
};

export { firebaseAuth };
