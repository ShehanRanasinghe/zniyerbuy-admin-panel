// API utility functions for admin panel
// All requests go through the backend API
// The backend handles all Supabase database operations securely

import { getAuthToken } from "./auth";

// Backend API endpoint
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const API_BASE = `${BACKEND_URL}/api/v1`;

// Helper function to make authenticated requests to backend
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || "API request failed",
        data: null,
      };
    }

    return { error: null, data: data.data || data };
  } catch (error: any) {
    return {
      error: error.message || "Failed to connect to backend",
      data: null,
    };
  }
};

// USERS API
// Fetch all users from backend admin endpoint
export const fetchUsers = async () => {
  return apiCall("/admin/users", {
    method: "GET",
  });
};

// Update user role via backend
export const updateUserRole = async (userId: string, newRole: string) => {
  return apiCall(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role: newRole }),
  });
};

// Delete user account via backend
export const deleteUser = async (userId: string) => {
  return apiCall(`/admin/users/${userId}`, {
    method: "DELETE",
  });
};

// SHOPS API
// Fetch all shops from backend
export const fetchShops = async () => {
  return apiCall("/admin/shops", {
    method: "GET",
  });
};

// Verify shop via backend admin endpoint
export const verifyShop = async (shopId: string) => {
  return apiCall(`/admin/shops/${shopId}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ status: "approved" }),
  });
};

// Reject shop via backend admin endpoint
export const rejectShop = async (shopId: string) => {
  return apiCall(`/admin/shops/${shopId}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ status: "rejected" }),
  });
};

// Delete shop via backend
export const deleteShop = async (shopId: string) => {
  return apiCall(`/admin/shops/${shopId}`, {
    method: "DELETE",
  });
};

// PRODUCTS API
// Fetch all products from backend
export const fetchProducts = async () => {
  return apiCall("/admin/products", {
    method: "GET",
  });
};

// Flag product via backend admin endpoint
export const flagProduct = async (productId: string) => {
  return apiCall(`/admin/products/${productId}/flag`, {
    method: "PATCH",
    body: JSON.stringify({ is_flagged: true }),
  });
};

// Unflag product via backend
export const unflagProduct = async (productId: string) => {
  return apiCall(`/admin/products/${productId}/flag`, {
    method: "PATCH",
    body: JSON.stringify({ is_flagged: false }),
  });
};

// Remove/Delete product via backend
export const removeProduct = async (productId: string) => {
  return apiCall(`/admin/products/${productId}`, {
    method: "DELETE",
  });
};

// ANALYTICS API
// Fetch dashboard statistics from backend
export const fetchDashboardStats = async () => {
  return apiCall("/admin/stats", {
    method: "GET",
  });
};

// Fetch recent user registrations from backend
export const fetchRecentUsers = async (limit: number = 4) => {
  return apiCall(`/admin/users/recent?limit=${limit}`, {
    method: "GET",
  });
};

// AI API
// Generate AI insights for admin dashboard via backend (connects to AI module)
export const generateAIInsights = async (platformData: any) => {
  return apiCall("/ai/insights", {
    method: "POST",
    body: JSON.stringify({ platformData }),
  });
};

// Fetch top products by revenue/engagement
export const fetchTopProducts = async (limit: number = 5) => {
  return apiCall(`/analytics/top-products?limit=${limit}`, {
    method: "GET",
  });
};

// Fetch customer behavior statistics
export const fetchCustomerBehavior = async () => {
  return apiCall("/analytics/customer-behavior", {
    method: "GET",
  });
};

// Fetch detailed dashboard metrics (for platform data calculations)
export const fetchDetailedMetrics = async () => {
  return apiCall("/admin/metrics", {
    method: "GET",
  });
};
