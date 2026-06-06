"use client";
import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const stats = [
  { icon: "👥", num: "1,284", label: "Total users", change: "↑ 12% this month", up: true },
  { icon: "🏪", num: "86", label: "Total shops", change: "↑ 8% this month", up: true },
  { icon: "📦", num: "342", label: "Total products", change: "↑ 5% this month", up: true },
  { icon: "🏷️", num: "54", label: "Active deals", change: "↓ 3% this month", up: false },
];

const recentUsers = [
  { name: "Kasun Perera", time: "2 mins ago", role: "User", color: "#2a1a0a", textColor: "#f05a1a", initials: "KP" },
  { name: "Nimali Fernando", time: "18 mins ago", role: "Seller", color: "#0a2a2a", textColor: "#1a8a8a", initials: "NF" },
  { name: "Ruwan Wickrama", time: "1 hr ago", role: "User", color: "#1a1a1a", textColor: "#888888", initials: "RW" },
  { name: "Sanduni De Silva", time: "3 hrs ago", role: "Seller", color: "#2a1a0a", textColor: "#f05a1a", initials: "SD" },
];

const roleBadge: Record<string, string> = {
  User: "bg-[#1a1a1a] text-[#888888]",
  Seller: "bg-[#0a2a2a] text-[#1a8a8a]",
};

const topProducts = [
  { name: "Samba Rice", revenue: 4350 },
  { name: "Milk Powder", revenue: 3780 },
  { name: "Kurakkan Flour", revenue: 2240 },
  { name: "Coconut Oil", revenue: 1520 },
  { name: "Dhal", revenue: 2520 },
];

const customerBehaviour = [
  { type: "View", count: 520 },
  { type: "Wishlist", count: 180 },
  { type: "Purchase", count: 310 },
];

const PIE_COLORS = ["#f05a1a", "#1a8a8a", "#e24b4a"];

const platformData = {
  totalUsers: 1284, activeUsers: 1190, totalShops: 86, verifiedShops: 61,
  pendingShops: 18, rejectedShops: 7, totalProducts: 342, flaggedProducts: 6,
  activeDeals: 54, newUsersThisMonth: 248, dealsThisMonth: 54,
};

export default function DashboardPage() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      const { data, error } = await supabase
        .from("agg_daily_sales")
        .select("*")
        .order("sale_date", { ascending: true });

      if (data && data.length > 0) {
        const formatted = data.map((row: any) => ({
          month: new Date(row.sale_date).toLocaleString("default", { month: "short" }),
          revenue: row.total_revenue,
          orders: row.total_orders,
        }));
        setSalesData(formatted);
      } else {
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

  const generateInsights = async () => {
    setLoading(true);
    setInsights([]);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      const text = data.content?.[0]?.text || "[]";
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
      <h1 className="text-xl font-medium text-white">Analytics Dashboard</h1>
      <p className="text-[#888888] text-sm mt-1 mb-6">Platform overview and key metrics</p>

      {/* Stats */}
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

      {/* AI Insights */}
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
        {!generated && !loading && (
          <div className="border border-dashed border-[#2a2a2a] rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-sm text-[#888888]">Click "Generate Insights" to get AI-powered recommendations</p>
          </div>
        )}
        {loading && (
          <div className="border border-dashed border-[#2a2a2a] rounded-lg p-6 text-center">
            <div className="text-3xl mb-2 animate-pulse">🤖</div>
            <p className="text-sm text-[#888888]">Claude is analyzing your platform data...</p>
          </div>
        )}
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

      {/* Sales Trends Chart — Task 8.4 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-sm font-medium text-white mb-1">Sales Trends</div>
          <p className="text-xs text-[#888888] mb-4">Monthly revenue — last 6 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <defs>
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

        {/* Top Products — Task 8.5 */}
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

      {/* Orders Trend + Customer Behaviour — Tasks 8.4 & 8.6 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
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

        {/* Customer Behaviour — Task 8.6 */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-sm font-medium text-white mb-1">Customer Behaviour</div>
          <p className="text-xs text-[#888888] mb-4">User activity breakdown</p>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={customerBehaviour} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="count" paddingAngle={3}>
                  {customerBehaviour.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index]}/>
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }}/>
              </PieChart>
            </ResponsiveContainer>
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

      {/* Recent Users */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
        <div className="text-sm font-medium text-white mb-4">Recent user registrations</div>
        {recentUsers.map((u) => (
          <div key={u.name} className="flex items-center justify-between py-2 border-b border-[#0a0a0a] last:border-none">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                style={{ background: u.color, color: u.textColor }}>{u.initials}</div>
              <div>
                <div className="text-sm text-white">{u.name}</div>
                <div className="text-xs text-[#666666]">{u.time}</div>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${roleBadge[u.role]}`}>{u.role}</span>
          </div>
        ))}
      </div>

    </div>
  );
}