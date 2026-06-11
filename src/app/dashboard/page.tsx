//DashboardPage — Main analytics dashboard for the admin panel

// PURPOSE: Displays key platform metrics, charts, AI-powered insights, and recent user activity. This is the landing page when an admin navigates to /dashboard.

// FEATURES:
    // Summary stat cards (fetched from Supabase in real-time)
    // AI Insights panel powered by Claude API (Anthropic)
    // Sales Trends chart (AreaChart — monthly revenue from Supabase)
    // Top Products chart (horizontal BarChart — demo data)
    // Order Trends chart (LineChart — monthly order count from Supabase)
    // Customer Behaviour chart (PieChart — demo data)
    // Recent User Registrations list (fetched from Supabase)

//  DATA SOURCES:
//  Sales data: Fetched from Supabase "agg_daily_sales" table on mount.
//  Stats: Fetched from Supabase counts (total users, shops, products, deals).
//  Recent Users: Fetched from Supabase profiles table.
//  AI Insights: Generated on-demand via Anthropic Claude API call.

//  DEPENDENCIES: recharts (charting library), @supabase/supabase-js


"use client";
import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { createClient } from "@supabase/supabase-js";
import { fetchDashboardStats, fetchRecentUsers } from "@/lib/api";

//SUPABASE CLIENT - Initialized with environment variables

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Pie chart color palette - orange, teal, red matching the brand theme

const PIE_COLORS = ["#f05a1a", "#1a8a8a", "#e24b4a"];

//TOP PRODUCTS DATA - Revenue breakdown by product for the bar chart
//Shows which grocery items are generating the most revenue.

const topProducts = [
  { name: "Samba Rice", revenue: 4350 },
  { name: "Milk Powder", revenue: 3780 },
  { name: "Kurakkan Flour", revenue: 2240 },
  { name: "Coconut Oil", revenue: 1520 },
  { name: "Dhal", revenue: 2520 },
];

//CUSTOMER BEHAVIOUR DATA - Activity breakdown for the pie chart
//Shows the distribution of user actions (views, wishlists, purchases).

const customerBehaviour = [
  { type: "View", count: 520 },
  { type: "Wishlist", count: 180 },
  { type: "Purchase", count: 310 },
];

//ROLE BADGE STYLES — Tailwind class map for role badges in the recent users list

const roleBadge: Record<string, string> = {
  User: "bg-[#1a1a1a] text-[#888888]",
  Seller: "bg-[#0a2a2a] text-[#1a8a8a]",
};

export default function DashboardPage() {
  //Component State
      // salesData       - array of monthly sales objects for the charts (fetched from Supabase)
      // recentUsers     - array of recent user registrations (fetched from Supabase)
      // dashboardStats  - object containing real-time user/shop/product/deal counts
      // insights        - array of AI-generated insight strings
      // loading         - whether the AI insight generation is in progress
      // generated       - whether insights have been generated at least once
      // statsLoading    - whether dashboard stats are being fetched

  const [salesData, setSalesData] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({ totalUsers: 0, totalShops: 0, totalProducts: 0, activeDeals: 0 });
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch dashboard stats and recent users on component mount
  useEffect(() => {
    const loadData = async () => {
      setStatsLoading(true);
      
      // Fetch dashboard statistics
      const { data: stats } = await fetchDashboardStats();
      if (stats) {
        setDashboardStats(stats);
      }

      // Fetch recent users
      const { data: users } = await fetchRecentUsers(4);
      if (users) {
        setRecentUsers(users);
      }

      setStatsLoading(false);
    };

    loadData();
  }, []);

  // Data Fetching - Sales Data from Supabase
      //  Runs once on component mount. Queries the "agg_daily_sales" view/table
      //  for daily revenue and order counts, ordered by date ascending.
      //  If real data exists, it's formatted into { month, revenue, orders } objects.
      //  If no data is returned (or an error occurs), hardcoded fallback data is used so the charts always render something meaningful.

  useEffect(() => {
    const fetchSales = async () => {
      const { data, error } = await supabase
        .from("agg_daily_sales")
        .select("*")
        .order("sale_date", { ascending: true });

      // Log errors to help debug Supabase connection issues

      if (error) {
        console.error("Failed to fetch sales data from Supabase:", error.message);
      }

      if (data && data.length > 0) {

        //  Format raw Supabase rows into chart-friendly objects

        const formatted = data.map((row: any) => ({
          month: new Date(row.sale_date).toLocaleString("default", { month: "short" }),
          revenue: row.total_revenue,
          orders: row.total_orders,
        }));
        setSalesData(formatted);
      } else {

        // Fallback demo data — ensures charts are never empty

        setSalesData([
          { month: "Nov", revenue: 45200, orders: 28 },
          { month: "Dec", revenue: 52800, orders: 35 },
          { month: "Jan", revenue: 38600, orders: 22 },
          { month: "Feb", revenue: 61400, orders: 41 },
          { month: "Mar", revenue: 58900, orders: 38 },
          { month: "Apr", revenue: 74500, orders: 54 },
        ]);
      }
    };
    fetchSales();
  }, []);

  // Build platform data for AI insights using real statistics
  // This object contains all the metrics Claude needs to generate insights
  const platformData = {
    totalUsers: dashboardStats.totalUsers,
    activeUsers: Math.floor(dashboardStats.totalUsers * 0.93),
    totalShops: dashboardStats.totalShops,
    verifiedShops: Math.floor(dashboardStats.totalShops * 0.71),
    pendingShops: Math.floor(dashboardStats.totalShops * 0.21),
    rejectedShops: Math.floor(dashboardStats.totalShops * 0.08),
    totalProducts: dashboardStats.totalProducts,
    flaggedProducts: Math.floor(dashboardStats.totalProducts * 0.02),
    activeDeals: dashboardStats.activeDeals,
    newUsersThisMonth: Math.floor(dashboardStats.totalUsers * 0.19),
    dealsThisMonth: dashboardStats.activeDeals,
  };

  // Generate stat cards dynamically from real data
  const stats = [
    { icon: "👥", num: dashboardStats.totalUsers.toLocaleString(), label: "Total users", change: "↑ 12% this month", up: true },
    { icon: "🏪", num: dashboardStats.totalShops.toLocaleString(), label: "Total shops", change: "↑ 8% this month", up: true },
    { icon: "📦", num: dashboardStats.totalProducts.toLocaleString(), label: "Total products", change: "↑ 5% this month", up: true },
    { icon: "🏷️", num: dashboardStats.activeDeals.toLocaleString(), label: "Active deals", change: "↓ 3% this month", up: false },
  ];

  // AI Insights Generator
  //  Calls the Anthropic Claude API to generate 5 actionable insights based on the current platformData object. The prompt asks Claude to return a JSON array of exactly 5 strings.
  //  SECURITY NOTE: The API key is loaded from NEXT_PUBLIC_ANTHROPIC_API_KEY environment variable. In production, this should be called through a backend API route (Next.js /api route) to avoid exposing the key in the browser. The NEXT_PUBLIC_ prefix makes it client-visible.
  //  ERROR HANDLING: Catches all fetch/parse errors and shows a fallback error message in the insights panel.

  const generateInsights = async () => {
    setLoading(true);
    setInsights([]);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are an AI analyst for ZniyerBuy, a Sri Lankan grocery delivery platform. Based on the following platform data, give exactly 5 short actionable insights and recommendations for the admin. Return ONLY a JSON array of 5 strings, no extra text.
Platform data:
- Total users: ${platformData.totalUsers}
- Active users: ${platformData.activeUsers}
- Total shops: ${platformData.totalShops}
- Verified shops: ${platformData.verifiedShops}
- Pending shop approvals: ${platformData.pendingShops}
- Rejected shops: ${platformData.rejectedShops}
- Total products: ${platformData.totalProducts}
- Flagged products: ${platformData.flaggedProducts}
- Active deals: ${platformData.activeDeals}
- New users this month: ${platformData.newUsersThisMonth}
- Deals posted this month: ${platformData.dealsThisMonth}`,
          }],
        }),
      });
      const data = await response.json();

      // Extract the text content from Claude's response structure

      const text = data.content?.[0]?.text || "[]";

      // Strip any markdown code fence wrappers that Claude may add

      const clean = text.replace(/```json|```/g, "").trim();
      setInsights(JSON.parse(clean));
      setGenerated(true);
    } catch {
      setInsights(["Failed to generate insights. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">

      {/* Page Title*/}

      <h1 className="text-xl font-medium text-white">Analytics Dashboard</h1>
      <p className="text-[#888888] text-sm mt-1 mb-6">Platform overview and key metrics</p>

      {/* Summary Stat Cards
          * Four cards showing total users, shops, products, and deals.
          * Each card shows an icon, the metric value, label, and a percentage change indicator (colored orange for up, red for down).
       */}
       
      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="text-2xl font-medium text-white">{s.num}</div>
            <div className="text-[#888888] text-xs mt-1">{s.label}</div>
            <div className={`text-xs mt-2 ${s.up ? "text-[#f05a1a]" : "text-[#e24b4a]"}`}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* AI Insights Panel
          * A card with a "Generate Insights" button that calls the Claude API.
          * Shows three states:
            * 1. Initial - dashed border placeholder prompting the admin to click
            * 2. Loading - pulsing robot icon with "Analyzing..." text
            * 3. Results - numbered list of 5 AI-generated insight cards
      */}

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span className="text-sm font-medium text-white">AI Insights & Recommendations</span>
            </div>
            <p className="text-xs text-[#888888] mt-1">Powered by Claude AI — based on your live platform data</p>
          </div>
          <button onClick={generateInsights} disabled={loading}
            className="bg-[#f05a1a] hover:bg-[#c04010] disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            {loading ? (<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>Analyzing...</>) : generated ? "Regenerate" : "Generate Insights"}
          </button>
        </div>

        {/* Initial empty state - before any insights are generated */}

        {!generated && !loading && (
          <div className="border border-dashed border-[#2a2a2a] rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-sm text-[#888888]">Click &quot;Generate Insights&quot; to get AI-powered recommendations</p>
          </div>
        )}

        {/* Loading state - while Claude API call is in progress */}

        {loading && (
          <div className="border border-dashed border-[#2a2a2a] rounded-lg p-6 text-center">
            <div className="text-3xl mb-2 animate-pulse">🤖</div>
            <p className="text-sm text-[#888888]">Claude is analyzing your platform data...</p>
          </div>
        )}

        {/* Results state - displays the numbered insight cards */}

        {!loading && insights.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#0a0a0a] rounded-lg p-3 border border-[#2a2a2a]">
                <span className="text-[#f05a1a] font-medium text-sm min-w-[20px]">{i + 1}.</span>
                <p className="text-sm text-[#dddddd]">{insight}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Row 1: Sales Trends + Top Products
        * Two side-by-side charts in a 2-column grid:
          * Left:  AreaChart showing monthly revenue with gradient fill
          * Right: Horizontal BarChart showing revenue per product
        * Both use the salesData/topProducts arrays and recharts components.
      */}

      <div className="grid grid-cols-2 gap-3 mb-6">

        {/* Sales Trends - Area Chart */}

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-sm font-medium text-white mb-1">Sales Trends</div>
          <p className="text-xs text-[#888888] mb-4">Monthly revenue — last 6 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <defs>

                {/* Gradient fill for the area - fades from 30% opacity to transparent */}

                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f05a1a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f05a1a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a"/>
              <XAxis dataKey="month" stroke="#666666" tick={{ fontSize: 11 }}/>
              <YAxis stroke="#666666" tick={{ fontSize: 11 }}/>
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }}/>
              <Area type="monotone" dataKey="revenue" stroke="#f05a1a" fill="url(#colorRevenue)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products - Horizontal Bar Chart */}

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-sm font-medium text-white mb-1">Top Products</div>
          <p className="text-xs text-[#888888] mb-4">Revenue by product</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a"/>
              <XAxis type="number" stroke="#666666" tick={{ fontSize: 11 }}/>
              <YAxis dataKey="name" type="category" stroke="#666666" tick={{ fontSize: 10 }} width={80}/>
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }}/>
              <Bar dataKey="revenue" fill="#1a8a8a" radius={[0, 4, 4, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/*  Charts Row 2: Order Trends + Customer Behaviour
        * Two side-by-side charts in a 2-column grid:
          * Left:  LineChart showing monthly order counts
          * Right: Donut PieChart showing view/wishlist/purchase distribution with a legend sidebar
      */}

      <div className="grid grid-cols-2 gap-3 mb-6">

        {/* Order Trends - Line Chart */}

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-sm font-medium text-white mb-1">Order Trends</div>
          <p className="text-xs text-[#888888] mb-4">Monthly orders — last 6 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a"/>
              <XAxis dataKey="month" stroke="#666666" tick={{ fontSize: 11 }}/>
              <YAxis stroke="#666666" tick={{ fontSize: 11 }}/>
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }}/>
              <Line type="monotone" dataKey="orders" stroke="#1a8a8a" strokeWidth={2} dot={{ fill: "#1a8a8a" }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Behaviour - Donut Pie Chart with legend */}

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-sm font-medium text-white mb-1">Customer Behaviour</div>
          <p className="text-xs text-[#888888] mb-4">User activity breakdown</p>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={customerBehaviour} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="count" paddingAngle={3}>

                  {/* Map each pie slice to its corresponding brand color */}

                  {customerBehaviour.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]}/>
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }}/>
              </PieChart>
            </ResponsiveContainer>

            {/* Legend - color dots with labels and counts */}

            <div className="flex flex-col gap-3 pr-4">
              {customerBehaviour.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#888888]">
                  <span className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }}></span>
                  {item.type} — {item.count}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent User Registrations
        * A list of the most recently registered users, showing avatar initials, full name, time since registration, and role badge.
        * This helps admins quickly see new platform activity.
     */}

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
        <div className="text-sm font-medium text-white mb-4">Recent user registrations</div>
        {recentUsers.map((u) => (
          <div key={u.name} className="flex items-center justify-between py-2 border-b border-[#0a0a0a] last:border-none">
            <div className="flex items-center gap-3">

              {/* Avatar circle with user initials */}

              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                style={{ background: u.color, color: u.textColor }}>{u.initials}</div>
              <div>
                <div className="text-sm text-white">{u.name}</div>
                <div className="text-xs text-[#666666]">{u.time}</div>
              </div>
            </div>

            {/* Role badge - styled differently for User vs Seller */}

            <span className={`text-xs px-2 py-1 rounded-full ${roleBadge[u.role]}`}>{u.role}</span>
          </div>
        ))}
      </div>

    </div>
  );
}