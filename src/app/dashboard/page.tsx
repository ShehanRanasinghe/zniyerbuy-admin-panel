"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import {
  fetchDashboardStats, fetchRecentUsers, fetchTrendData, generateAIInsights,
  fetchDeals, fetchReviews, fetchNotifications,
  toggleDeal, deleteDeal, deleteReview, deleteNotification,
} from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faStore, faBox, faTags, faHeart, faStar,
  faBell, faChartLine, faEye, faUserClock, faDatabase,
  faRobot, faWandMagicSparkles, faSpinner, faTrash,
  faToggleOn, faToggleOff, faSearch, faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

type Stats = {
  totalUsers: number; totalShops: number; totalProducts: number; activeDeals: number;
  totalFavorites: number; totalReviews: number; totalNotifications: number;
  totalInteractions: number; totalRecentlyViewed: number; totalUserInterests: number;
};

const EMPTY_STATS: Stats = {
  totalUsers: 0, totalShops: 0, totalProducts: 0, activeDeals: 0,
  totalFavorites: 0, totalReviews: 0, totalNotifications: 0,
  totalInteractions: 0, totalRecentlyViewed: 0, totalUserInterests: 0,
};

const roleBadge: Record<string, string> = {
  User: "bg-[#1a1a1a] text-[#888888] border border-[#333]",
  Seller: "bg-[#0a2a2a] text-[#1a8a8a] border border-[#1a8a8a]",
  Admin: "bg-[#2a1a0a] text-[#f05a1a] border border-[#f05a1a]",
};

type ActiveTable = "deals" | "reviews" | "notifications" | null;

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  // DB management state
  const [activeTable, setActiveTable] = useState<ActiveTable>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setStatsLoading(true);
      const [statsRes, usersRes, trendRes] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentUsers(5),
        fetchTrendData(),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.data) setRecentUsers(usersRes.data);
      if (trendRes.data) setTrendData(trendRes.data);
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
    { icon: faBell, num: stats.totalNotifications, label: "Notifications", color: "#1a8a8a", route: null },
    { icon: faChartLine, num: stats.totalInteractions, label: "Interactions", color: "#f05a1a", route: null },
    { icon: faEye, num: stats.totalRecentlyViewed, label: "Recently Viewed", color: "#888888", route: null },
    { icon: faUserClock, num: stats.totalUserInterests, label: "User Interests", color: "#1a8a8a", route: null },
  ];

  const dbTables = [
    { key: "deals" as ActiveTable, label: "Deals", icon: faTags },
    { key: "reviews" as ActiveTable, label: "Reviews", icon: faStar },
    { key: "notifications" as ActiveTable, label: "Notifications", icon: faBell },
  ];

  const loadTable = async (table: ActiveTable) => {
    if (activeTable === table) { setActiveTable(null); setTableData([]); return; }
    setActiveTable(table);
    setTableLoading(true);
    setTableError("");
    setTableSearch("");
    let res: any;
    if (table === "deals") res = await fetchDeals();
    else if (table === "reviews") res = await fetchReviews();
    else if (table === "notifications") res = await fetchNotifications();
    if (res?.error) setTableError(res.error);
    else setTableData(res?.data || []);
    setTableLoading(false);
  };

  const handleToggleDeal = async (dealId: string, current: boolean) => {
    setUpdatingId(dealId);
    const res = await toggleDeal(dealId, !current);
    if (!res.error) setTableData((prev) => prev.map((d) => d.id === dealId ? { ...d, isActive: !current } : d));
    setUpdatingId(null);
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm("Delete this deal?")) return;
    setUpdatingId(dealId);
    const res = await deleteDeal(dealId);
    if (!res.error) setTableData((prev) => prev.filter((d) => d.id !== dealId));
    setUpdatingId(null);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    setUpdatingId(reviewId);
    const res = await deleteReview(reviewId);
    if (!res.error) setTableData((prev) => prev.filter((r) => r.id !== reviewId));
    setUpdatingId(null);
  };

  const handleDeleteNotification = async (notifId: string) => {
    if (!confirm("Delete this notification?")) return;
    setUpdatingId(notifId);
    const res = await deleteNotification(notifId);
    if (!res.error) setTableData((prev) => prev.filter((n) => n.id !== notifId));
    setUpdatingId(null);
  };

  const filteredTable = tableData.filter((row) => {
    const q = tableSearch.toLowerCase();
    if (!q) return true;
    if (activeTable === "deals") return row.title?.toLowerCase().includes(q) || row.shop?.toLowerCase().includes(q);
    if (activeTable === "reviews") return row.user?.toLowerCase().includes(q) || row.shop?.toLowerCase().includes(q) || row.comment?.toLowerCase().includes(q);
    if (activeTable === "notifications") return row.title?.toLowerCase().includes(q) || row.user?.toLowerCase().includes(q);
    return true;
  });

  const generateInsights = async () => {
    setLoading(true);
    setInsights([]);
    try {
      const { data, error } = await generateAIInsights(stats);
      if (error) throw new Error(error);
      if (data && Array.isArray(data)) { setInsights(data); setGenerated(true); }
    } catch { setInsights(["Failed to generate insights. Please ensure the AI module is running."]); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Analytics Dashboard</h1>
        <p className="text-[#666] text-sm mt-1">Platform overview and full database management</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#111] border border-[#222] rounded-xl p-5">
          <div className="text-sm font-medium text-white mb-1">Platform Growth Trends</div>
          <p className="text-xs text-[#555] mb-4">New users & products — last 6 months</p>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
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
            <div className="h-[200px] flex items-center justify-center text-[#444] text-sm">No trend data available</div>
          )}
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-5">
          <div className="text-sm font-medium text-white mb-1">Engagement Trends</div>
          <p className="text-xs text-[#555] mb-4">User interactions & deal views — last 6 months</p>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
                <XAxis dataKey="label" stroke="#444" tick={{ fontSize: 11 }} />
                <YAxis stroke="#444" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#888" }} />
                <Bar dataKey="interactions" name="Interactions" fill="#f05a1a" radius={[3, 3, 0, 0]} />
                <Bar dataKey="dealViews" name="Deal Views" fill="#1a8a8a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[#444] text-sm">No engagement data available</div>
          )}
        </div>
      </div>

      {/* Database Management */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FontAwesomeIcon icon={faDatabase} className="w-4 h-4 text-[#f05a1a]" />
          <span className="text-sm font-medium text-white">Database Management</span>
        </div>
        <p className="text-xs text-[#555] mb-4">
          Full access to all tables. Click a table to expand and manage records.
          For Users, Shops, and Products use the dedicated pages via the sidebar.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {dbTables.map((t) => (
            <button
              key={t.key}
              onClick={() => loadTable(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                activeTable === t.key
                  ? "bg-[#f05a1a] border-[#f05a1a] text-white"
                  : "bg-[#0a0a0a] border-[#2a2a2a] text-[#888] hover:border-[#f05a1a] hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={t.icon} className="w-3.5 h-3.5" />
              {t.label}
              <FontAwesomeIcon icon={faChevronDown} className={`w-3 h-3 transition-transform ${activeTable === t.key ? "rotate-180" : ""}`} />
            </button>
          ))}
        </div>

        {activeTable && (
          <div className="border border-[#222] rounded-xl overflow-hidden">
            {/* Table search */}
            <div className="p-3 bg-[#0a0a0a] border-b border-[#222] flex items-center gap-2">
              <FontAwesomeIcon icon={faSearch} className="w-3.5 h-3.5 text-[#555]" />
              <input
                type="text"
                placeholder={`Search ${activeTable}...`}
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white placeholder-[#444] focus:outline-none"
              />
              <span className="text-xs text-[#555]">{filteredTable.length} records</span>
            </div>

            {tableError && (
              <div className="p-3 bg-[#2a1a1a] border-b border-[#e24b4a]">
                <p className="text-[#e24b4a] text-xs">{tableError}</p>
              </div>
            )}

            {tableLoading ? (
              <div className="p-8 text-center text-[#555] text-sm">
                <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin mb-2" />
                <p>Loading {activeTable}...</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                {/* DEALS TABLE */}
                {activeTable === "deals" && (
                  <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 bg-[#0d0d0d]">
                      <tr>
                        {["Title", "Shop", "Discount", "Deal Price", "Views", "Status", "Ends", "Actions"].map((h) => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs text-[#555] font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTable.map((deal) => (
                        <tr key={deal.id} className="border-t border-[#111] hover:bg-[#161616] transition-colors">
                          <td className="px-4 py-2.5 text-white font-medium max-w-[180px] truncate">{deal.title}</td>
                          <td className="px-4 py-2.5 text-[#888] whitespace-nowrap">{deal.shop}</td>
                          <td className="px-4 py-2.5 text-[#888] whitespace-nowrap">
                            {deal.discountType === "percentage" ? `${deal.discountValue}%` : `LKR ${deal.discountValue}`}
                          </td>
                          <td className="px-4 py-2.5 text-[#f05a1a] whitespace-nowrap">
                            {deal.dealPrice ? `LKR ${Number(deal.dealPrice).toLocaleString()}` : "—"}
                          </td>
                          <td className="px-4 py-2.5 text-[#888]">{deal.viewsCount}</td>
                          <td className="px-4 py-2.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${deal.isActive ? "bg-[#0a2a0a] text-[#1a8a1a] border-[#1a8a1a]" : "bg-[#1a1a1a] text-[#555] border-[#333]"}`}>
                              {deal.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-[#888] whitespace-nowrap text-xs">{deal.endDate}</td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleDeal(deal.id, deal.isActive)}
                                disabled={updatingId === deal.id}
                                className="text-xs text-[#1a8a8a] border border-[#0a2a2a] rounded px-2 py-1 hover:bg-[#0a2a2a] transition-colors disabled:opacity-50"
                              >
                                <FontAwesomeIcon icon={deal.isActive ? faToggleOn : faToggleOff} className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDeal(deal.id)}
                                disabled={updatingId === deal.id}
                                className="text-xs text-[#e24b4a] border border-[#2a1a1a] rounded px-2 py-1 hover:bg-[#2a1a1a] transition-colors disabled:opacity-50"
                              >
                                <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredTable.length === 0 && (
                        <tr><td colSpan={8} className="px-4 py-8 text-center text-[#555] text-sm">No deals found</td></tr>
                      )}
                    </tbody>
                  </table>
                )}

                {/* REVIEWS TABLE */}
                {activeTable === "reviews" && (
                  <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 bg-[#0d0d0d]">
                      <tr>
                        {["User", "Shop", "Rating", "Comment", "Date", "Actions"].map((h) => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs text-[#555] font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTable.map((review) => (
                        <tr key={review.id} className="border-t border-[#111] hover:bg-[#161616] transition-colors">
                          <td className="px-4 py-2.5">
                            <div className="text-white text-sm">{review.user}</div>
                            <div className="text-[#555] text-xs">{review.email}</div>
                          </td>
                          <td className="px-4 py-2.5 text-[#888] whitespace-nowrap">{review.shop}</td>
                          <td className="px-4 py-2.5">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map((s) => (
                                <FontAwesomeIcon key={s} icon={faStar} className={`w-3 h-3 ${s <= review.rating ? "text-[#f0a01a]" : "text-[#333]"}`} />
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-[#888] max-w-[200px] truncate">{review.comment || "—"}</td>
                          <td className="px-4 py-2.5 text-[#555] text-xs whitespace-nowrap">{review.created}</td>
                          <td className="px-4 py-2.5">
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              disabled={updatingId === review.id}
                              className="text-xs text-[#e24b4a] border border-[#2a1a1a] rounded px-2 py-1 hover:bg-[#2a1a1a] transition-colors disabled:opacity-50"
                            >
                              <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredTable.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-[#555] text-sm">No reviews found</td></tr>
                      )}
                    </tbody>
                  </table>
                )}

                {/* NOTIFICATIONS TABLE */}
                {activeTable === "notifications" && (
                  <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 bg-[#0d0d0d]">
                      <tr>
                        {["Title", "User", "Type", "Status", "Date", "Actions"].map((h) => (
                          <th key={h} className="text-left px-4 py-2.5 text-xs text-[#555] font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTable.map((notif) => (
                        <tr key={notif.id} className="border-t border-[#111] hover:bg-[#161616] transition-colors">
                          <td className="px-4 py-2.5">
                            <div className="text-white text-sm">{notif.title}</div>
                            <div className="text-[#555] text-xs max-w-[180px] truncate">{notif.body}</div>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="text-[#888] text-sm">{notif.user}</div>
                            <div className="text-[#555] text-xs">{notif.email}</div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1a1a1a] text-[#888] border border-[#333] capitalize">{notif.type}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${notif.isRead ? "bg-[#1a1a1a] text-[#555] border-[#333]" : "bg-[#0a2a2a] text-[#1a8a8a] border-[#1a8a8a]"}`}>
                              {notif.isRead ? "Read" : "Unread"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-[#555] text-xs whitespace-nowrap">{notif.created}</td>
                          <td className="px-4 py-2.5">
                            <button
                              onClick={() => handleDeleteNotification(notif.id)}
                              disabled={updatingId === notif.id}
                              className="text-xs text-[#e24b4a] border border-[#2a1a1a] rounded px-2 py-1 hover:bg-[#2a1a1a] transition-colors disabled:opacity-50"
                            >
                              <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredTable.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-[#555] text-sm">No notifications found</td></tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faRobot} className="w-4 h-4 text-[#f05a1a]" />
              <span className="text-sm font-medium text-white">AI Insights</span>
            </div>
            <p className="text-xs text-[#555] mt-0.5">Powered by ZniyerBuy AI — based on live platform data</p>
          </div>
          <button
            onClick={generateInsights}
            disabled={loading}
            className="bg-[#f05a1a] hover:bg-[#c04010] disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin" /> : <FontAwesomeIcon icon={faWandMagicSparkles} className="w-3.5 h-3.5" />}
            {loading ? "Analyzing..." : generated ? "Regenerate" : "Generate Insights"}
          </button>
        </div>

        {!generated && !loading && (
          <div className="border border-dashed border-[#222] rounded-lg p-6 text-center">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-7 h-7 text-[#f05a1a] mb-2" />
            <p className="text-sm text-[#555]">Click &quot;Generate Insights&quot; to get AI-powered recommendations</p>
          </div>
        )}
        {loading && (
          <div className="border border-dashed border-[#222] rounded-lg p-6 text-center">
            <FontAwesomeIcon icon={faRobot} className="w-7 h-7 text-[#f05a1a] mb-2 animate-pulse" />
            <p className="text-sm text-[#555]">Analyzing platform data...</p>
          </div>
        )}
        {!loading && insights.length > 0 && (
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#0a0a0a] rounded-lg p-3 border border-[#1e1e1e]">
                <span className="text-[#f05a1a] font-semibold text-sm min-w-[20px]">{i + 1}.</span>
                <p className="text-sm text-[#ccc]">{insight}</p>
              </div>
            ))}
          </div>
        )}
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
