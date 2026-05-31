"use client";
import { useState } from "react";

const initialShops = [
  { id: 1, name: "TechFix Store", owner: "Amal M.", category: "Electronics", status: "Verified", registered: "Mar 4, 2025", initials: "TF", color: "#2a1a0a", textColor: "#f05a1a" },
  { id: 2, name: "Style & Fashion", owner: "Kavya S.", category: "Clothing", status: "Pending", registered: "Apr 10, 2025", initials: "SF", color: "#0a2a2a", textColor: "#1a8a8a" },
  { id: 3, name: "Fresh Greens", owner: "Nimal P.", category: "Groceries", status: "Pending", registered: "Apr 15, 2025", initials: "FG", color: "#1a1a1a", textColor: "#888888" },
  { id: 4, name: "Bargain Hub", owner: "Ruwan K.", category: "General", status: "Rejected", registered: "Feb 22, 2025", initials: "BH", color: "#2a1a1a", textColor: "#e24b4a" },
];

const statusBadge: Record<string, string> = {
  Verified: "bg-[#2a1a0a] text-[#f05a1a] border border-[#f05a1a]",
  Pending: "bg-[#0a2a2a] text-[#1a8a8a] border border-[#1a8a8a]",
  Rejected: "bg-[#2a1a1a] text-[#e24b4a] border border-[#e24b4a]",
};

export default function ShopsPage() {
  const [shops, setShops] = useState(initialShops);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");

  const filtered = shops.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All status" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleVerify = (id: number) => {
    setShops(shops.map((s) => (s.id === id ? { ...s, status: "Verified" } : s)));
  };

  const handleReject = (id: number) => {
    setShops(shops.map((s) => (s.id === id ? { ...s, status: "Rejected" } : s)));
  };

  const handleDelete = (id: number) => {
    setShops(shops.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-white">Shop Management</h1>
          <p className="text-[#888888] text-sm mt-1">Verify, manage and monitor all shops</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-xl font-medium text-white">{shops.length}</div>
          <div className="text-[#888888] text-xs mt-1">Total shops</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-xl font-medium text-[#f05a1a]">{shops.filter((s) => s.status === "Verified").length}</div>
          <div className="text-[#888888] text-xs mt-1">Verified</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-xl font-medium text-[#1a8a8a]">{shops.filter((s) => s.status === "Pending").length}</div>
          <div className="text-[#888888] text-xs mt-1">Pending</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-xl font-medium text-[#e24b4a]">{shops.filter((s) => s.status === "Rejected").length}</div>
          <div className="text-[#888888] text-xs mt-1">Rejected</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by shop name or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-[#444444] focus:outline-none focus:border-[#f05a1a]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#888888] focus:outline-none"
        >
          <option>All status</option>
          <option>Verified</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0a0a0a]">
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Shop</th>
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Category</th>
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Registered</th>
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((shop) => (
              <tr key={shop.id} className="border-t border-[#0a0a0a] hover:bg-[#222222] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0"
                      style={{ background: shop.color, color: shop.textColor }}>
                      {shop.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{shop.name}</div>
                      <div className="text-xs text-[#666666]">{shop.owner}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-[#888888]">{shop.category}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusBadge[shop.status]}`}>
                    {shop.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#888888]">{shop.registered}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  {shop.status !== "Verified" && (
                    <button
                      onClick={() => handleVerify(shop.id)}
                      className="text-xs text-[#f05a1a] border border-[#f05a1a] rounded-md px-2 py-1 hover:bg-[#2a1a0a] transition-colors"
                    >
                      {shop.status === "Rejected" ? "Re-verify" : "Verify"}
                    </button>
                  )}
                  {shop.status === "Pending" && (
                    <button
                      onClick={() => handleReject(shop.id)}
                      className="text-xs text-[#1a8a8a] border border-[#0a2a2a] rounded-md px-2 py-1 hover:bg-[#0a2a2a] transition-colors"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(shop.id)}
                    className="text-xs text-[#e24b4a] border border-[#2a1a1a] rounded-md px-2 py-1 hover:bg-[#2a1a1a] transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#666666]">No shops found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}