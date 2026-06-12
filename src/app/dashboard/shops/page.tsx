"use client";
import { useState, useEffect } from "react";
import { fetchShops, verifyShop, rejectShop, deleteShop } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore, faCheckCircle, faClock, faTimesCircle,
  faSearch, faTrash, faSpinner, faCheck, faXmark,
} from "@fortawesome/free-solid-svg-icons";

const statusBadge: Record<string, string> = {
  Verified: "bg-[#0a2a0a] text-[#1a8a1a] border border-[#1a8a1a]",
  Pending: "bg-[#0a2a2a] text-[#1a8a8a] border border-[#1a8a8a]",
  Rejected: "bg-[#2a1a1a] text-[#e24b4a] border border-[#e24b4a]",
};

export default function ShopsPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      const { error: e, data } = await fetchShops();
      if (e) setError(e);
      else setShops(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = shops.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All status" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleVerify = async (shopId: string) => {
    setUpdatingId(shopId);
    setError("");
    const { error: e } = await verifyShop(shopId);
    if (e) setError(e);
    else setShops(shops.map((s) => (s.id === shopId ? { ...s, status: "Verified" } : s)));
    setUpdatingId(null);
  };

  const handleReject = async (shopId: string) => {
    setUpdatingId(shopId);
    setError("");
    const { error: e } = await rejectShop(shopId);
    if (e) setError(e);
    else setShops(shops.map((s) => (s.id === shopId ? { ...s, status: "Rejected" } : s)));
    setUpdatingId(null);
  };

  const handleDelete = async (shopId: string, shopName: string) => {
    if (!confirm(`Delete ${shopName}? This cannot be undone.`)) return;
    setUpdatingId(shopId);
    setError("");
    const { error: e } = await deleteShop(shopId);
    if (e) setError(e);
    else setShops(shops.filter((s) => s.id !== shopId));
    setUpdatingId(null);
  };

  const counts = {
    total: shops.length,
    verified: shops.filter((s) => s.status === "Verified").length,
    pending: shops.filter((s) => s.status === "Pending").length,
    rejected: shops.filter((s) => s.status === "Rejected").length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Shop Management</h1>
        <p className="text-[#666] text-sm mt-1">Verify, manage and monitor all shops on the platform</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-[#2a1a1a] border border-[#e24b4a] rounded-lg">
          <p className="text-[#e24b4a] text-sm">{error}</p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: faStore, value: counts.total, label: "Total Shops", color: "#f05a1a" },
          { icon: faCheckCircle, value: counts.verified, label: "Verified", color: "#1a8a1a" },
          { icon: faClock, value: counts.pending, label: "Pending", color: "#1a8a8a" },
          { icon: faTimesCircle, value: counts.rejected, label: "Rejected", color: "#e24b4a" },
        ].map((s) => (
          <div key={s.label} className="bg-[#111] border border-[#222] rounded-xl p-4">
            <FontAwesomeIcon icon={s.icon} className="w-4 h-4 mb-2" style={{ color: s.color }} />
            <div className="text-xl font-semibold text-white">{loading ? "—" : s.value}</div>
            <div className="text-[#666] text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
          <input
            type="text"
            placeholder="Search by shop name or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-[#222] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#f05a1a] transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-sm text-[#888] focus:outline-none focus:border-[#f05a1a] transition-colors"
        >
          <option>All status</option>
          <option>Verified</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-[#555]">
          <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading shops...</span>
        </div>
      ) : (
        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0d0d0d]">
                  {["Shop", "Category", "Status", "Registered", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-[#555] font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((shop) => (
                  <tr key={shop.id} className="border-t border-[#0d0d0d] hover:bg-[#161616] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0"
                          style={{ background: shop.color || "#1a1a1a", color: shop.textColor || "#888" }}
                        >
                          {shop.initials}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{shop.name}</div>
                          <div className="text-xs text-[#555]">{shop.owner}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#888] capitalize whitespace-nowrap">{shop.category}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[shop.status] || statusBadge.Pending}`}>{shop.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#666] whitespace-nowrap">{shop.registered}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {shop.status !== "Verified" && (
                          <button
                            onClick={() => handleVerify(shop.id)}
                            disabled={updatingId === shop.id}
                            className="text-xs text-[#1a8a1a] border border-[#0a2a0a] rounded px-2 py-1 hover:bg-[#0a2a0a] transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                            {shop.status === "Rejected" ? "Re-verify" : "Verify"}
                          </button>
                        )}
                        {shop.status === "Pending" && (
                          <button
                            onClick={() => handleReject(shop.id)}
                            disabled={updatingId === shop.id}
                            className="text-xs text-[#e24b4a] border border-[#2a1a1a] rounded px-2 py-1 hover:bg-[#2a1a1a] transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(shop.id, shop.name)}
                          disabled={updatingId === shop.id}
                          className="text-xs text-[#e24b4a] border border-[#2a1a1a] rounded px-2 py-1 hover:bg-[#2a1a1a] transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {updatingId === shop.id
                            ? <FontAwesomeIcon icon={faSpinner} className="w-3 h-3 animate-spin" />
                            : <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-[#555]">No shops found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 bg-[#0d0d0d] border-t border-[#1a1a1a] text-xs text-[#555]">
            Showing {filtered.length} of {shops.length} shops
          </div>
        </div>
      )}
    </div>
  );
}
