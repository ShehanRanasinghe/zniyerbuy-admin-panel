"use client";
import { useState } from "react";

const initialShops = [
  { id: 1, name: "TechFix Store", owner: "Amal M.", category: "Electronics", status: "Verified", registered: "Mar 4, 2025", initials: "TF", color: "#1a3a2a", textColor: "#1d9e75" },
  { id: 2, name: "Style & Fashion", owner: "Kavya S.", category: "Clothing", status: "Pending", registered: "Apr 10, 2025", initials: "SF", color: "#2a2a10", textColor: "#f0a500" },
  { id: 3, name: "Fresh Greens", owner: "Nimal P.", category: "Groceries", status: "Pending", registered: "Apr 15, 2025", initials: "FG", color: "#1a2a3a", textColor: "#6b9aaa" },
  { id: 4, name: "Bargain Hub", owner: "Ruwan K.", category: "General", status: "Rejected", registered: "Feb 22, 2025", initials: "BH", color: "#2a1a1a", textColor: "#e24b4a" },
];

const statusBadge: Record<string, string> = {
  Verified: "bg-[#1a3a2a] text-[#1d9e75] border border-[#1d9e75]",
  Pending: "bg-[#2a2a10] text-[#f0a500] border border-[#f0a500]",
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
    <div className="min-h-screen bg-[#0d2128] p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-white">Shop Management</h1>
          <p className="text-[#6b9aaa] text-sm mt-1">Verify, manage and monitor all shops</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-4">
          <div className="text-xl font-medium text-white">{shops.length}</div>
          <div className="text-[#6b9aaa] text-xs mt-1">Total shops</div>
        </div>
        <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-4">
          <div className="text-xl font-medium text-[#1d9e75]">{shops.filter((s) => s.status === "Verified").length}</div>
          <div className="text-[#6b9aaa] text-xs mt-1">Verified</div>
        </div>
        <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-4">
          <div className="text-xl font-medium text-[#f0a500]">{shops.filter((s) => s.status === "Pending").length}</div>
          <div className="text-[#6b9aaa] text-xs mt-1">Pending</div>
        </div>
        <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-4">
          <div className="text-xl font-medium text-[#e24b4a]">{shops.filter((s) => s.status === "Rejected").length}</div>
          <div className="text-[#6b9aaa] text-xs mt-1">Rejected</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7a8a] text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by shop name or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#112a33] border border-[#1a4a5a] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-[#3a6070] focus:outline-none focus:border-[#1d9e75]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#112a33] border border-[#1a4a5a] rounded-lg px-3 py-2 text-sm text-[#6b9aaa] focus:outline-none"
        >
          <option>All status</option>
          <option>Verified</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0d2128]">
              <th className="text-left px-4 py-3 text-xs text-[#4a7a8a] font-medium uppercase tracking-wider">Shop</th>
              <th className="text-left px-4 py-3 text-xs text-[#4a7a8a] font-medium uppercase tracking-wider">Category</th>
              <th className="text-left px-4 py-3 text-xs text-[#4a7a8a] font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs text-[#4a7a8a] font-medium uppercase tracking-wider">Registered</th>
              <th className="text-left px-4 py-3 text-xs text-[#4a7a8a] font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((shop) => (
              <tr key={shop.id} className="border-t border-[#0d2128] hover:bg-[#0f2530] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0"
                      style={{ background: shop.color, color: shop.textColor }}>
                      {shop.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{shop.name}</div>
                      <div className="text-xs text-[#4a7a8a]">{shop.owner}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-[#6b9aaa]">{shop.category}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusBadge[shop.status]}`}>
                    {shop.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#6b9aaa]">{shop.registered}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  {shop.status !== "Verified" && (
                    <button
                      onClick={() => handleVerify(shop.id)}
                      className="text-xs text-[#1d9e75] border border-[#1d9e75] rounded-md px-2 py-1 hover:bg-[#1a3a2a] transition-colors"
                    >
                      {shop.status === "Rejected" ? "Re-verify" : "Verify"}
                    </button>
                  )}
                  {shop.status === "Pending" && (
                    <button
                      onClick={() => handleReject(shop.id)}
                      className="text-xs text-[#f0a500] border border-[#2a2a10] rounded-md px-2 py-1 hover:bg-[#2a2a10] transition-colors"
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(shop.id)}
                    className="text-xs text-[#e24b4a] border border-[#3a1a1a] rounded-md px-2 py-1 hover:bg-[#3a1a1a] transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#4a7a8a]">No shops found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}