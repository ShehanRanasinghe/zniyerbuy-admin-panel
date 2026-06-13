# ZniyerBuy Admin Panel

A comprehensive administrative dashboard for managing the ZniyerBuy marketplace platform, built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Core Features](#core-features)
- [User Interface Components](#user-interface-components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [Data Visualization](#data-visualization)
- [Database Management](#database-management)
- [AI Integration](#ai-integration)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Build & Deployment](#build--deployment)

## Overview

The ZniyerBuy Admin Panel is a modern, responsive web application that provides platform administrators with comprehensive tools to manage users, shops, products, deals, reviews, and notifications. It features real-time analytics, AI-powered insights, and full database management capabilities.

**Key Capabilities:**
- **User Management** - View, edit roles, and delete users
- **Shop Verification** - Approve/reject shop registrations
- **Product Moderation** - Flag/unflag and remove products
- **Deal Management** - Toggle active status and delete deals
- **Review Moderation** - Delete inappropriate reviews
- **Notification Management** - Create and delete notifications
- **Analytics Dashboard** - Platform statistics and growth trends
- **AI Insights** - Data-driven recommendations from AI module
- **Real-time Updates** - Live data refresh and interactive charts

## Architecture

### System Design

```
┌─────────────────────────────────────────┐
│         Next.js Application             │
│  ┌───────────────────────────────────┐  │
│  │   App Router (Next.js 16)         │  │
│  │   - /dashboard (main layout)      │  │
│  │   - /dashboard/users              │  │
│  │   - /dashboard/shops              │  │
│  │   - /dashboard/products           │  │
│  │   - /login (authentication)       │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   React Components (RSC + Client) │  │
│  │   - Server Components (data fetch)│  │
│  │   - Client Components (interactiv│  │
│  │   - Shared UI Components          │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   State Management                │  │
│  │   - React useState/useEffect      │  │
│  │   - Client-side caching           │  │
│  │   - Optimistic updates            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   API Integration Layer           │  │
│  │   - Fetch wrapper with auth       │  │
│  │   - Error handling                │  │
│  │   - Response formatting           │  │
│  └───────────────────────────────────┘  │
└─────────┬───────────────────┬───────────┘
          │                   │
          ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│  Firebase Auth   │  │  Backend API     │
│  - Token verify  │  │  - REST endpoints│
│  - Session mgmt  │  │  - Supabase DB   │
└──────────────────┘  └──────────────────┘
                              │
                              ▼
                      ┌──────────────────┐
                      │   AI Module      │
                      │  - Insights gen  │
                      │  - Analytics     │
                      └──────────────────┘
```

### Component Hierarchy

```
App Layout
├── Sidebar (navigation)
├── TopBar (user info, logout)
└── Page Content
    ├── Dashboard (/)
    │   ├── Stats Cards (10 metrics)
    │   ├── Growth Charts (Area + Bar)
    │   ├── Database Management
    │   │   ├── Deals Table
    │   │   ├── Reviews Table
    │   │   └── Notifications Table
    │   ├── AI Insights Panel
    │   └── Recent Users List
    ├── Users (/users)
    │   ├── Search & Filter
    │   ├── Users Table
    │   └── Role Management
    ├── Shops (/shops)
    │   ├── Status Filter
    │   ├── Shops Table
    │   └── Verification Actions
    └── Products (/products)
        ├── Search & Filter
        ├── Products Table
        └── Flag/Delete Actions
```

## Technology Stack

### Core Technologies

- **Framework:** Next.js 16.2.6 (App Router)
- **UI Library:** React 19.2.4
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Authentication:** Firebase 12.14.0
- **Database Client:** Supabase JS 2.107.0
- **Charts:** Recharts 3.8.1
- **Icons:** Font Awesome 7.2.0

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.6 | React framework with SSR/SSG |
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | React DOM renderer |
| `typescript` | 5 | Type safety |
| `tailwindcss` | 4 | Utility-first CSS |
| `@supabase/supabase-js` | 2.107.0 | Database client |
| `firebase` | 12.14.0 | Authentication |
| `recharts` | 3.8.1 | Data visualization |
| `@fortawesome/react-fontawesome` | 3.3.1 | Icon components |
| `dotenv` | 17.4.2 | Environment variables |

## Core Features

### 1. Dashboard Overview

**Location:** `src/app/dashboard/page.tsx`

**Features:**
- 10 real-time statistics cards
- Platform growth trends (6-month charts)
- Engagement metrics visualization
- Database management interface
- AI-powered insights generation
- Recent user registrations

**Statistics Tracked:**
- Total Users
- Total Shops
- Total Products
- Active Deals
- Total Favorites
- Total Reviews
- Total Notifications
- Total Interactions
- Recently Viewed Items
- User Interests

**Chart Types:**
- **Area Chart:** User and product growth trends
- **Bar Chart:** Interactions and deal views

### 2. User Management

**Location:** `src/app/dashboard/users/page.tsx`

**Features:**
- Paginated user list with search
- Role-based filtering (All, Consumer, Seller, Admin)
- Role editing (dropdown selection)
- User deletion with confirmation
- Real-time search across name and email
- Color-coded role badges

**User Actions:**
- **Update Role:** Change user role (Consumer/Seller/Admin)
- **Delete User:** Remove user from platform

**Search Algorithm:**
```typescript
const filteredUsers = users.filter(user => {
  const matchesSearch = 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase());
  
  const matchesRole = 
    roleFilter === 'all' || user.role === roleFilter;
  
  return matchesSearch && matchesRole;
});
```

### 3. Shop Management

**Location:** `src/app/dashboard/shops/page.tsx`

**Features:**
- Shop verification workflow
- Status filtering (All, Pending, Approved, Rejected)
- Shop details display (name, owner, address, phone)
- Approve/Reject actions
- Shop deletion
- Status-based color coding

**Shop Statuses:**
- **Pending:** Awaiting admin review (yellow badge)
- **Approved:** Verified and active (green badge)
- **Rejected:** Denied verification (red badge)

**Verification Actions:**
- **Approve:** Set status to "approved"
- **Reject:** Set status to "rejected"
- **Delete:** Remove shop and all associated products

### 4. Product Management

**Location:** `src/app/dashboard/products/page.tsx`

**Features:**
- Product catalog with search
- Category filtering
- Flag/unflag products
- Product deletion
- Stock quantity display
- Price and shop information

**Product Actions:**
- **Flag:** Mark product as inappropriate/suspicious
- **Unflag:** Remove flag from product
- **Delete:** Remove product from platform

**Search & Filter:**
```typescript
const filteredProducts = products.filter(product => {
  const matchesSearch = 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.shop_name.toLowerCase().includes(searchQuery.toLowerCase());
  
  const matchesCategory = 
    categoryFilter === 'all' || product.category === categoryFilter;
  
  return matchesSearch && matchesCategory;
});
```

### 5. Database Management

**Location:** `src/app/dashboard/page.tsx` (integrated)

**Tables Managed:**
- **Deals:** Toggle active status, delete deals
- **Reviews:** Delete inappropriate reviews
- **Notifications:** Delete notifications

**Features:**
- Expandable table interface
- Real-time search within tables
- Inline actions (toggle, delete)
- Record count display
- Loading states and error handling

**Deal Management:**
```typescript
const handleToggleDeal = async (dealId: string, currentStatus: boolean) => {
  setUpdatingId(dealId);
  const res = await toggleDeal(dealId, !currentStatus);
  if (!res.error) {
    setTableData(prev => 
      prev.map(d => 
        d.id === dealId ? { ...d, isActive: !currentStatus } : d
      )
    );
  }
  setUpdatingId(null);
};
```

### 6. Analytics & Insights

**Growth Trends:**
- Monthly user registration trends
- Product addition trends
- Interaction volume trends
- Deal view trends

**AI Insights:**
- User growth analysis
- Shop verification bottleneck detection
- Product quality monitoring
- Deal activity optimization
- User engagement analysis

**Insight Generation:**
```typescript
const generateInsights = async () => {
  setLoading(true);
  const { data, error } = await generateAIInsights({
    totalUsers: stats.totalUsers,
    activeUsers: stats.activeUsers,
    totalShops: stats.totalShops,
    verifiedShops: stats.verifiedShops,
    pendingShops: stats.pendingShops,
    rejectedShops: stats.rejectedShops,
    totalProducts: stats.totalProducts,
    flaggedProducts: stats.flaggedProducts,
    activeDeals: stats.activeDeals,
    newUsersThisMonth: stats.newUsersThisMonth,
    dealsThisMonth: stats.dealsThisMonth
  });
  
  if (data) setInsights(data);
  setLoading(false);
};
```

## User Interface Components

### Sidebar Component

**Location:** `src/components/Sidebar.tsx`

**Features:**
- Navigation menu with active state
- Icon-based menu items
- Responsive design (collapsible on mobile)
- Route highlighting

**Menu Items:**
- Dashboard (home icon)
- Users (users icon)
- Shops (store icon)
- Products (box icon)

### TopBar Component

**Location:** `src/components/TopBar.tsx`

**Features:**
- User profile display
- Logout button
- Responsive layout

### Stat Cards

**Design Pattern:**
```typescript
interface StatCard {
  icon: IconDefinition;
  num: number;
  label: string;
  color: string;
  route: string | null;
}
```

**Features:**
- Click-to-navigate (if route provided)
- Hover effects
- Color-coded icons
- Loading states

### Data Tables

**Common Features:**
- Sticky headers
- Hover row highlighting
- Inline action buttons
- Loading spinners
- Empty state messages
- Search integration

**Table Structure:**
```typescript
<table className="w-full border-collapse text-sm">
  <thead className="sticky top-0 bg-[#0d0d0d]">
    <tr>
      {headers.map(h => (
        <th key={h} className="text-left px-4 py-2.5">
          {h}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {data.map(row => (
      <tr key={row.id} className="border-t hover:bg-[#161616]">
        {/* Row cells */}
      </tr>
    ))}
  </tbody>
</table>
```

## State Management

### Local State Pattern

**useState for UI State:**
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [data, setData] = useState([]);
```

**useEffect for Data Fetching:**
```typescript
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await apiCall();
    if (data) setData(data);
    if (error) setError(error);
    setLoading(false);
  };
  
  fetchData();
}, []);
```

### Optimistic Updates

**Pattern:**
```typescript
const handleUpdate = async (id: string, newValue: any) => {
  // Optimistically update UI
  setData(prev => 
    prev.map(item => 
      item.id === id ? { ...item, field: newValue } : item
    )
  );
  
  // Make API call
  const { error } = await updateAPI(id, newValue);
  
  // Revert on error
  if (error) {
    setData(originalData);
    showError(error);
  }
};
```

### Search & Filter State

**Pattern:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [filterValue, setFilterValue] = useState('all');

const filteredData = useMemo(() => {
  return data.filter(item => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterValue === 'all' || item.category === filterValue;
    
    return matchesSearch && matchesFilter;
  });
}, [data, searchQuery, filterValue]);
```

## API Integration

### API Client

**Location:** `src/lib/api.ts`

**Base Configuration:**
```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 
  "http://localhost:5000";
const API_BASE = `${BACKEND_URL}/api/v1`;

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.error || "API request failed", data: null };
    }
    
    return { error: null, data: data.data || data };
  } catch (error: any) {
    return { 
      error: error.message || "Failed to connect to backend", 
      data: null 
    };
  }
};
```

### API Functions

**User Management:**
```typescript
export const fetchUsers = async () => 
  apiCall("/admin/users");

export const updateUserRole = async (userId: string, newRole: string) =>
  apiCall(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role: newRole })
  });

export const deleteUser = async (userId: string) =>
  apiCall(`/admin/users/${userId}`, { method: "DELETE" });
```

**Shop Management:**
```typescript
export const fetchShops = async () => 
  apiCall("/admin/shops");

export const verifyShop = async (shopId: string) =>
  apiCall(`/admin/shops/${shopId}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ status: "approved" })
  });

export const rejectShop = async (shopId: string) =>
  apiCall(`/admin/shops/${shopId}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ status: "rejected" })
  });
```

**Product Management:**
```typescript
export const fetchProducts = async () => 
  apiCall("/admin/products");

export const flagProduct = async (productId: string) =>
  apiCall(`/admin/products/${productId}/flag`, {
    method: "PATCH",
    body: JSON.stringify({ is_flagged: true })
  });

export const removeProduct = async (productId: string) =>
  apiCall(`/admin/products/${productId}`, { method: "DELETE" });
```

**Analytics:**
```typescript
export const fetchDashboardStats = async () => 
  apiCall("/admin/stats");

export const fetchTrendData = async () => 
  apiCall("/admin/trends");

export const fetchRecentUsers = async (limit: number = 4) =>
  apiCall(`/admin/users/recent?limit=${limit}`);
```

**AI Integration:**
```typescript
export const generateAIInsights = async (platformData: any) =>
  apiCall("/ai/insights", {
    method: "POST",
    body: JSON.stringify({ platformData })
  });
```

## Authentication Flow

### Firebase Authentication

**Location:** `src/lib/auth.ts`

**Login Flow:**
```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('token', token);
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};
```

**Token Management:**
```typescript
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};
```

**Logout Flow:**
```typescript
import { signOut } from 'firebase/auth';

export const logoutUser = async () => {
  try {
    await signOut(auth);
    clearAuthToken();
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};
```

### Protected Routes

**Middleware:** `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  // Redirect to login if no token
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
```

## Data Visualization

### Recharts Integration

**Area Chart (Growth Trends):**
```typescript
<ResponsiveContainer width="100%" height={200}>
  <AreaChart data={trendData}>
    <defs>
      <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#f05a1a" stopOpacity={0.3} />
        <stop offset="95%" stopColor="#f05a1a" stopOpacity={0} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
    <XAxis dataKey="label" stroke="#444" />
    <YAxis stroke="#444" />
    <Tooltip contentStyle={{ 
      background: "#111", 
      border: "1px solid #222" 
    }} />
    <Legend />
    <Area 
      type="monotone" 
      dataKey="newUsers" 
      stroke="#f05a1a" 
      fill="url(#gUsers)" 
    />
  </AreaChart>
</ResponsiveContainer>
```

**Bar Chart (Engagement Metrics):**
```typescript
<ResponsiveContainer width="100%" height={200}>
  <BarChart data={trendData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
    <XAxis dataKey="label" stroke="#444" />
    <YAxis stroke="#444" />
    <Tooltip contentStyle={{ 
      background: "#111", 
      border: "1px solid #222" 
    }} />
    <Legend />
    <Bar 
      dataKey="interactions" 
      fill="#f05a1a" 
      radius={[3, 3, 0, 0]} 
    />
    <Bar 
      dataKey="dealViews" 
      fill="#1a8a8a" 
      radius={[3, 3, 0, 0]} 
    />
  </BarChart>
</ResponsiveContainer>
```

### Chart Data Format

**Trend Data Structure:**
```typescript
interface TrendData {
  label: string;        // "Jan 2026"
  newUsers: number;     // 150
  newProducts: number;  // 75
  interactions: number; // 500
  dealViews: number;    // 200
}
```

## Database Management

### Expandable Table Interface

**Pattern:**
```typescript
const [activeTable, setActiveTable] = useState<'deals' | 'reviews' | 'notifications' | null>(null);
const [tableData, setTableData] = useState<any[]>([]);

const loadTable = async (table: string) => {
  if (activeTable === table) {
    setActiveTable(null);
    setTableData([]);
    return;
  }
  
  setActiveTable(table);
  setTableLoading(true);
  
  let res;
  if (table === 'deals') res = await fetchDeals();
  else if (table === 'reviews') res = await fetchReviews();
  else if (table === 'notifications') res = await fetchNotifications();
  
  if (res?.data) setTableData(res.data);
  setTableLoading(false);
};
```

### Table Search

**Pattern:**
```typescript
const [tableSearch, setTableSearch] = useState('');

const filteredTable = tableData.filter(row => {
  const query = tableSearch.toLowerCase();
  if (!query) return true;
  
  if (activeTable === 'deals') {
    return row.title?.toLowerCase().includes(query) ||
           row.shop?.toLowerCase().includes(query);
  }
  
  if (activeTable === 'reviews') {
    return row.user?.toLowerCase().includes(query) ||
           row.comment?.toLowerCase().includes(query);
  }
  
  if (activeTable === 'notifications') {
    return row.title?.toLowerCase().includes(query) ||
           row.user?.toLowerCase().includes(query);
  }
  
  return true;
});
```

## AI Integration

### Insights Generation

**Request Format:**
```typescript
interface PlatformData {
  totalUsers: number;
  activeUsers: number;
  totalShops: number;
  verifiedShops: number;
  pendingShops: number;
  rejectedShops: number;
  totalProducts: number;
  flaggedProducts: number;
  activeDeals: number;
  newUsersThisMonth: number;
  dealsThisMonth: number;
}
```

**API Call:**
```typescript
const { data, error } = await generateAIInsights({
  totalUsers: stats.totalUsers,
  activeUsers: stats.activeUsers,
  totalShops: stats.totalShops,
  verifiedShops: stats.verifiedShops,
  pendingShops: stats.pendingShops,
  rejectedShops: stats.rejectedShops,
  totalProducts: stats.totalProducts,
  flaggedProducts: stats.flaggedProducts,
  activeDeals: stats.activeDeals,
  newUsersThisMonth: stats.newUsersThisMonth,
  dealsThisMonth: stats.dealsThisMonth
});
```

**Response Format:**
```typescript
{
  success: true,
  insights: [
    "Strong user growth of 12.0% this month. Consider scaling infrastructure.",
    "User engagement is 85.0%. Platform health is good.",
    "Only 0.44 deals per verified shop. Encourage sellers to create more deals.",
    "Low flagged product rate (1.0%). Product quality monitoring is effective.",
    "Platform metrics are healthy. Continue monitoring KPIs."
  ],
  method: "rule_based_analysis"
}
```

## Installation & Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Firebase project
- Backend API running

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd zniyerbuy-admin-panel
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file:

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Supabase Configuration (optional, if direct access needed)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. **Start development server**
```bash
npm run dev
```

5. **Access the application**

Visit `http://localhost:3000`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anon key |

## Build & Deployment

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

### Environment Variables for Production

Set all `NEXT_PUBLIC_*` variables in your hosting platform's environment configuration.

---

**Version:** 0.1.0  
**Last Updated:** 2026-06-13  
**Maintained By:** ZniyerBuy Development Team
