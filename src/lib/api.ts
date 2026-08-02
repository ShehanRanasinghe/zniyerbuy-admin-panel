// API utility functions for admin panel
// All requests go through the backend API
// The backend handles all Supabase database operations securely

import { getAuthToken } from "./auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const API_BASE = `${BACKEND_URL}/api/v1`;

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await response.json();
    if (!response.ok) return { error: data.error || "API request failed", data: null };
    return { error: null, data: data.data || data };
  } catch (error: any) {
    return { error: error.message || "Failed to connect to backend", data: null };
  }
};

// USERS
export const fetchUsers = async () => apiCall("/admin/users");
export const updateUserRole = async (userId: string, newRole: string) =>
  apiCall(`/admin/users/${userId}/role`, { method: "PATCH", body: JSON.stringify({ role: newRole }) });
export const toggleUserStatus = async (userId: string, isActive: boolean) =>
  apiCall(`/admin/users/${userId}/status`, { method: "PATCH", body: JSON.stringify({ is_active: isActive }) });
export const deleteUser = async (userId: string) =>
  apiCall(`/admin/users/${userId}`, { method: "DELETE" });

// SHOPS
export const fetchShops = async () => apiCall("/admin/shops");
export const verifyShop = async (shopId: string) =>
  apiCall(`/admin/shops/${shopId}/verify`, { method: "PATCH", body: JSON.stringify({ status: "approved" }) });
export const rejectShop = async (shopId: string) =>
  apiCall(`/admin/shops/${shopId}/verify`, { method: "PATCH", body: JSON.stringify({ status: "rejected" }) });
export const deleteShop = async (shopId: string) =>
  apiCall(`/admin/shops/${shopId}`, { method: "DELETE" });

// PRODUCTS
export const fetchProducts = async () => apiCall("/admin/products");
export const flagProduct = async (productId: string) =>
  apiCall(`/admin/products/${productId}/flag`, { method: "PATCH", body: JSON.stringify({ is_flagged: true }) });
export const unflagProduct = async (productId: string) =>
  apiCall(`/admin/products/${productId}/flag`, { method: "PATCH", body: JSON.stringify({ is_flagged: false }) });
export const removeProduct = async (productId: string) =>
  apiCall(`/admin/products/${productId}`, { method: "DELETE" });

// DEALS
export const fetchDeals = async () => apiCall("/admin/deals");
export const toggleDeal = async (dealId: string, isActive: boolean) =>
  apiCall(`/admin/deals/${dealId}/toggle`, { method: "PATCH", body: JSON.stringify({ is_active: isActive }) });
export const deleteDeal = async (dealId: string) =>
  apiCall(`/admin/deals/${dealId}`, { method: "DELETE" });

// REVIEWS
export const fetchReviews = async () => apiCall("/admin/reviews");
export const deleteReview = async (reviewId: string) =>
  apiCall(`/admin/reviews/${reviewId}`, { method: "DELETE" });

// NOTIFICATIONS
export const fetchNotifications = async () => apiCall("/admin/notifications");
export const deleteNotification = async (notifId: string) =>
  apiCall(`/admin/notifications/${notifId}`, { method: "DELETE" });

// ANALYTICS
export const fetchDashboardStats = async () => apiCall("/admin/stats");
export const fetchTrendData = async () => apiCall("/admin/trends");
export const fetchBreakdownData = async () => apiCall("/admin/breakdown");
export const fetchRecentUsers = async (limit: number = 4) =>
  apiCall(`/admin/users/recent?limit=${limit}`);

// AI
export const generateAIInsights = async (platformData: any) =>
  apiCall("/ai/insights", { method: "POST", body: JSON.stringify({ platformData }) });

// EXTENDED ANALYTICS
export const fetchTopProducts = async (limit: number = 5) =>
  apiCall(`/analytics/top-products?limit=${limit}`);
export const fetchCustomerBehavior = async () => apiCall("/analytics/customer-behavior");
export const fetchDetailedMetrics = async () => apiCall("/admin/metrics");
