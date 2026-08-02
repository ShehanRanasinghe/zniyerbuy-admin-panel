"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  fetchDashboardStats, fetchRecentUsers, fetchTrendData, fetchBreakdownData,
} from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faStore, faBox, faTags, faHeart, faStar,
  faEye, faUserClock,
} from "@fortawesome/free-solid-svg-icons";

type Stats = {
  totalUsers: number; totalShops: number; totalProducts: number; activeDeals: number;
  totalFavorites: number; totalReviews: number;
  totalRecentlyViewed: number; totalUserInterests: number;
};

const EMPTY_STATS: Stats = {
  totalUsers: 0, totalShops: 0, totalProducts: 0, activeDeals: 0,
  totalFavorites: 0, totalReviews: 0,
  totalRecentlyViewed: 0, totalUserInterests: 0,
};

const roleBadge: Record<string, string> = {
  User: "bg-[#1a1a1a] text-[#888888] border border-[#333]",
  Seller: "bg-[#0a2a2a] text-[#1a8a8a] border border-[#1a8a8a]",
  Admin: "bg-[#2a1a0a] text-[#f05a1a] border border-[#f05a1a]",
};

type RoleCount = { role: string; count: number };
type CategoryCount = { category: string; count: number };
type ShopCount = { shop_id: string; shop_name: string; count: number };

type Breakdown = {
  usersByRole: RoleCount[];
  productsByCategory: CategoryCount[];
  ordersByShop: ShopCount[];
  reviewsByShop: ShopCount[];
};

const EMPTY_BREAKDOWN: Breakdown = {
  usersByRole: [], productsByCategory: [], ordersByShop: [], reviewsByShop: [],
};

// Maps raw DB role values (users.role: customer | shop_owner | admin) to
// friendly chart labels.
const ROLE_LABELS: Record<string, string> = {
  customer: "Customers",
  shop_owner: "Sellers",
  admin: "Admins",
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<Breakdown>(EMPTY_BREAKDOWN);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setStatsLoading(true);
      // All 4 requests run in parallel. The main slow-load cause was on
      // the backend (getDashboardStats previously ran 3 count queries
      // sequentially before even starting its own parallel batch) - see
      // admin.controller.js. That's fixed there; this stays parallel too.
      const [statsRes, usersRes, trendRes, breakdownRes] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentUsers(5),
        fetchTrendData(),
        fetchBreakdownData(),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.data) setRecentUsers(usersRes.data);
      if (trendRes.data) setTrendData(trendRes.data);
      if (breakdownRes.data) setBreakdown(breakdownRes.data);
      setStatsLoading(false);
    };
    load();
  }, []);

  const statCards = [
    { icon: faUsers, num: stats.totalUsers, label: "Total Users", color: "#f05a1a", route: "/dashboard/users" },
    { icon: faStore, num: stats.totalShops, label: "Total Shops", color: "#1a8a8a", route: "/dashboard/shops" },
    { icon: faBox, num: stats.totalProducts, label: "Total Products", color: "#f05a1a", route: "/dashboard/products" },
    { icon: faTags, num: stats.activeDeals, label: "Active Deals", color: "#1a8a8a", route: null },
    { icon: faHeart, num: stats.totalFavorites, label: "Favorites", color: "#e24b4a", route: null },
    { icon: faStar, num: stats.totalReviews, label: "Reviews", color: "#f0a01a", route: null },
    { icon: faEye, num: stats.totalRecentlyViewed, label: "Recently Viewed", color: "#888888", route: null },
    { icon: faUserClock, num: stats.totalUserInterests, label: "User Interests", color: "#1a8a8a", route: null },
  ];

  const usersByRoleChart = breakdown.usersByRole.map((r) => ({
    role: ROLE_LABELS[r.role] || r.role,
    count: Number(r.count),
  }));

  const productsByCategoryChart = breakdown.productsByCategory.map((c) => ({
    category: c.category ? c.category.charAt(0).toUpperCase() + c.category.slice(1) : "Other",
    count: Number(c.count),
  }));

  const ordersByShopChart = breakdown.ordersByShop.map((s) => ({
    shop: s.shop_name,
    count: Number(s.count),
  }));

  const reviewsByShopChart = breakdown.reviewsByShop.map((s) => ({
    shop: s.shop_name,
    count: Number(s.count),
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Analytics Dashboard</h1>
        <p className="text-[#666] text-sm mt-1">Platform overview</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {statCards.map((s) => (
          <div
            key={s.label}
            onClick={() => s.route && router.push(s.route)}
            className={`bg-[#111] border border-[#222] rounded-xl p-4 ${s.route ? "cursor-pointer hover:border-[#f05a1a] transition-colors" : ""}`}
          >
            <FontAwesomeIcon icon={s.icon} className="w-4 h-4 mb-2" style={{ color: s.color }} />
            <div className="text-xl font-semibold text-white">
              {statsLoading ? <span className="text-[#444]">—</span> : s.num.toLocaleString()}
            </div>
            <div className="text-[#666] text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Platform Growth Trends */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5 mb-6">
        <div className="text-sm font-medium text-white mb-1">Platform Growth Trends</div>
        <p className="text-xs text-[#555] mb-4">New users & products — last 6 months</p>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f05a1a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f05a1a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gProducts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a8a8a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1a8a8a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="label" stroke="#444" tick={{ fontSize: 11 }} />
              <YAxis stroke="#444" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#888" }} />
              <Area type="monotone" dataKey="newUsers" name="New Users" stroke="#f05a1a" fill="url(#gUsers)" strokeWidth={2} />
              <Area type="monotone" dataKey="newProducts" name="New Products" stroke="#1a8a8a" fill="url(#gProducts)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-[#444] text-sm">No trend data available</div>
        )}
      </div>

      {/* Breakdown Charts: users by role, products by category, orders by shop, reviews by shop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#111] border border-[#222] rounded-xl p-5">
          <div className="text-sm font-medium text-white mb-1">Users by Role</div>
          <p className="text-xs text-[#555] mb-4">Sellers vs customers on the platform</p>
          {usersByRoleChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={usersByRoleChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis dataKey="role" stroke="#444" tick={{ fontSize: 11 }} />
                <YAxis stroke="#444" tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Bar dataKey="count" name="Users" fill="#f05a1a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[#444] text-sm">No user data available</div>
          )}
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-5">
          <div className="text-sm font-medium text-white mb-1">Products by Category</div>
          <p className="text-xs text-[#555] mb-4">Product count across categories</p>
          {productsByCategoryChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={productsByCategoryChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis dataKey="category" stroke="#444" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis stroke="#444" tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Bar dataKey="count" name="Products" fill="#1a8a8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[#444] text-sm">No product data available</div>
          )}
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-5">
          <div className="text-sm font-medium text-white mb-1">Orders by Shop</div>
          <p className="text-xs text-[#555] mb-4">Top 10 shops by order count</p>
          {ordersByShopChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(200, ordersByShopChart.length * 32)}>
              <BarChart data={ordersByShopChart} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" horizontal={false} />
                <XAxis type="number" stroke="#444" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="shop" stroke="#444" tick={{ fontSize: 11 }} width={110} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Bar dataKey="count" name="Orders" fill="#f05a1a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[#444] text-sm">No order data available</div>
          )}
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-5">
          <div className="text-sm font-medium text-white mb-1">Reviews by Shop</div>
          <p className="text-xs text-[#555] mb-4">Top 10 shops by review count</p>
          {reviewsByShopChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(200, reviewsByShopChart.length * 32)}>
              <BarChart data={reviewsByShopChart} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" horizontal={false} />
                <XAxis type="number" stroke="#444" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="shop" stroke="#444" tick={{ fontSize: 11 }} width={110} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Bar dataKey="count" name="Reviews" fill="#f0a01a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[#444] text-sm">No review data available</div>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5">
        <div className="text-sm font-medium text-white mb-4">Recent User Registrations</div>
        {recentUsers.length > 0 ? (
          <div className="space-y-1">
            {recentUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#0d0d0d] last:border-none">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{ background: u.color || "#1a1a1a", color: u.textColor || "#888" }}
                  >
                    {u.initials}
                  </div>
                  <div>
                    <div className="text-sm text-white">{u.name}</div>
                    <div className="text-xs text-[#555]">{u.time}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge[u.role] || roleBadge.User}`}>{u.role}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#555] text-sm">No recent users</div>
        )}
      </div>
    </div>
  );
}
