"use client";
import { useState } from "react";

const stats = [
  { icon: "👥", num: "1,284", label: "Total users", change: "↑ 12% this month", up: true },
  { icon: "🏪", num: "86", label: "Total shops", change: "↑ 8% this month", up: true },
  { icon: "📦", num: "342", label: "Total products", change: "↑ 5% this month", up: true },
  { icon: "🏷️", num: "54", label: "Active deals", change: "↓ 3% this month", up: false },
];

const userBars = [
  { month: "Nov", val: 142, h: 55 },
  { month: "Dec", val: 168, h: 65 },
  { month: "Jan", val: 120, h: 46 },
  { month: "Feb", val: 195, h: 75 },
  { month: "Mar", val: 210, h: 82 },
  { month: "Apr", val: 248, h: 96 },
];

const dealBars = [
  { month: "Nov", val: 28, h: 44 },
  { month: "Dec", val: 35, h: 55 },
  { month: "Jan", val: 22, h: 34 },
  { month: "Feb", val: 41, h: 64 },
  { month: "Mar", val: 38, h: 59 },
  { month: "Apr", val: 54, h: 84 },
];

const recentUsers = [
  { name: "Kasun Perera", time: "2 mins ago", role: "User", color: "#1a3a2a", textColor: "#1d9e75", initials: "KP" },
  { name: "Nimali Fernando", time: "18 mins ago", role: "Seller", color: "#2a2a10", textColor: "#f0a500", initials: "NF" },
  { name: "Ruwan Wickrama", time: "1 hr ago", role: "User", color: "#1a2a3a", textColor: "#6b9aaa", initials: "RW" },
  { name: "Sanduni De Silva", time: "3 hrs ago", role: "Seller", color: "#1a3a2a", textColor: "#1d9e75", initials: "SD" },
];

const roleBadge: Record<string, string> = {
  User: "bg-[#1a2a3a] text-[#6b9aaa]",
  Seller: "bg-[#2a2a10] text-[#f0a500]",
};

const platformData = {
  totalUsers: 1284,
  activeUsers: 1190,
  totalShops: 86,
  verifiedShops: 61,
  pendingShops: 18,
  rejectedShops: 7,
  totalProducts: 342,
  flaggedProducts: 6,
  activeDeals: 54,
  newUsersThisMonth: 248,
  dealsThisMonth: 54,
};

export default function DashboardPage() {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

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
          messages: [
            {
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
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setInsights(parsed);
      setGenerated(true);
    } catch (err) {
      setInsights(["Failed to generate insights. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d2128] p-6">

      <h1 className="text-xl font-medium text-white">Analytics Dashboard</h1>
      <p className="text-[#6b9aaa] text-sm mt-1 mb-6">Platform overview and key metrics</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-4">
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="text-2xl font-medium text-white">{s.num}</div>
            <div className="text-[#6b9aaa] text-xs mt-1">{s.label}</div>
            <div className={`text-xs mt-2 ${s.up ? "text-[#1d9e75]" : "text-[#e24b4a]"}`}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span className="text-sm font-medium text-white">AI Insights & Recommendations</span>
            </div>
            <p className="text-xs text-[#6b9aaa] mt-1">Powered by Claude AI — based on your live platform data</p>
          </div>
          <button
            onClick={generateInsights}
            disabled={loading}
            className="bg-[#1d9e75] hover:bg-[#0f6e56] disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Analyzing...
              </>
            ) : generated ? "Regenerate" : "Generate Insights"}
          </button>
        </div>

        {!generated && !loading && (
          <div className="border border-dashed border-[#1a4a5a] rounded-lg p-6 text-center">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-sm text-[#6b9aaa]">Click "Generate Insights" to get AI-powered recommendations based on your platform data</p>
          </div>
        )}

        {loading && (
          <div className="border border-dashed border-[#1a4a5a] rounded-lg p-6 text-center">
            <div className="text-3xl mb-2 animate-pulse">🤖</div>
            <p className="text-sm text-[#6b9aaa]">Claude is analyzing your platform data...</p>
          </div>
        )}

        {!loading && insights.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#0d2128] rounded-lg p-3 border border-[#1a4a5a]">
                <span className="text-[#1d9e75] font-medium text-sm min-w-[20px]">{i + 1}.</span>
                <p className="text-sm text-[#c8dde6]">{insight}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-4">
          <div className="text-sm font-medium text-white mb-4">New users — last 6 months</div>
          <div className="flex items-end gap-2 h-28">
            {userBars.map((b) => (
              <div key={b.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[#6b9aaa]">{b.val}</span>
                <div className="w-full bg-[#1d9e75] rounded-t" style={{ height: `${b.h}px` }}></div>
                <span className="text-[10px] text-[#4a7a8a]">{b.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-4">
          <div className="text-sm font-medium text-white mb-4">Deals posted — last 6 months</div>
          <div className="flex items-end gap-2 h-28">
            {dealBars.map((b) => (
              <div key={b.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[#6b9aaa]">{b.val}</span>
                <div className="w-full bg-[#f0a500] rounded-t" style={{ height: `${b.h}px` }}></div>
                <span className="text-[10px] text-[#4a7a8a]">{b.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-4">
          <div className="text-sm font-medium text-white mb-4">Recent user registrations</div>
          {recentUsers.map((u) => (
            <div key={u.name} className="flex items-center justify-between py-2 border-b border-[#0d2128] last:border-none">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                  style={{ background: u.color, color: u.textColor }}>
                  {u.initials}
                </div>
                <div>
                  <div className="text-sm text-white">{u.name}</div>
                  <div className="text-xs text-[#4a7a8a]">{u.time}</div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${roleBadge[u.role]}`}>{u.role}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-4">
          <div className="text-sm font-medium text-white mb-4">Shop status breakdown</div>
          <div className="flex items-center gap-8 mt-4">
            <svg width="110" height="110" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#0d2128" strokeWidth="18"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#1d9e75" strokeWidth="18"
                strokeDasharray="152 87" strokeDashoffset="25" transform="rotate(-90 50 50)"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#f0a500" strokeWidth="18"
                strokeDasharray="45 194" strokeDashoffset="-127" transform="rotate(-90 50 50)"/>
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e24b4a" strokeWidth="18"
                strokeDasharray="17 222" strokeDashoffset="-172" transform="rotate(-90 50 50)"/>
              <text x="50" y="46" textAnchor="middle" fontSize="14" fontWeight="500" fill="#ffffff">86</text>
              <text x="50" y="60" textAnchor="middle" fontSize="9" fill="#6b9aaa">shops</text>
            </svg>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-[#6b9aaa]">
                <span className="w-3 h-3 rounded-full bg-[#1d9e75]"></span>Verified — 61
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6b9aaa]">
                <span className="w-3 h-3 rounded-full bg-[#f0a500]"></span>Pending — 18
              </div>
              <div className="flex items-center gap-2 text-sm text-[#6b9aaa]">
                <span className="w-3 h-3 rounded-full bg-[#e24b4a]"></span>Rejected — 7
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}