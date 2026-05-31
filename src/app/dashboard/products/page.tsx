"use client";
import { useState } from "react";

const initialProducts = [
  { id: 1, name: "Samba Rice 5kg", shop: "Mahinda Fresh", category: "Rice & Grains", price: "LKR 1,450", status: "Active", initials: "SR", color: "#2a1a0a", textColor: "#f05a1a" },
  { id: 2, name: "Ceylon Pepper 100g", shop: "Spice Garden", category: "Spices", price: "LKR 380", status: "Flagged", initials: "CP", color: "#2a1a1a", textColor: "#e24b4a" },
  { id: 3, name: "Green Tomatoes 1kg", shop: "Dambulla Veggies", category: "Vegetables", price: "LKR 220", status: "Active", initials: "GT", color: "#1a1a1a", textColor: "#888888" },
  { id: 4, name: "Anchor Milk Powder 400g", shop: "Mahinda Fresh", category: "Dairy", price: "LKR 1,890", status: "Deal", initials: "AM", color: "#0a2a2a", textColor: "#1a8a8a" },
  { id: 5, name: "Kurakkan Flour 1kg", shop: "Dambulla Veggies", category: "Rice & Grains", price: "LKR 560", status: "Active", initials: "KC", color: "#2a1a0a", textColor: "#f05a1a" },
  { id: 6, name: "Coconut Oil 500ml", shop: "Spice Garden", category: "Cooking Oils", price: "LKR 760", status: "Active", initials: "CO", color: "#1a1a1a", textColor: "#888888" },
  { id: 7, name: "Dhal 1kg", shop: "Mahinda Fresh", category: "Rice & Grains", price: "LKR 420", status: "Deal", initials: "DH", color: "#0a2a2a", textColor: "#1a8a8a" },
  { id: 8, name: "Gotukola Bundles", shop: "Dambulla Veggies", category: "Vegetables", price: "LKR 60", status: "Active", initials: "GK", color: "#2a1a0a", textColor: "#f05a1a" },
];

const statusBadge: Record<string, string> = {
  Active: "bg-[#2a1a0a] text-[#f05a1a] border border-[#f05a1a]",
  Flagged: "bg-[#2a1a1a] text-[#e24b4a] border border-[#e24b4a]",
  Deal: "bg-[#0a2a2a] text-[#1a8a8a] border border-[#1a8a8a]",
};

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [activeTab, setActiveTab] = useState("Products");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [categoryFilter, setCategoryFilter] = useState("All categories");

  const handleFlag = (id: number) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, status: "Flagged" } : p)));
  };

  const handleUnflag = (id: number) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, status: "Active" } : p)));
  };

  const handleRemove = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.shop.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All status" || p.status === statusFilter;
    const matchCategory = categoryFilter === "All categories" || p.category === categoryFilter;
    const matchTab = activeTab === "Products" ? p.status !== "Deal" : p.status === "Deal";
    return matchSearch && matchStatus && matchCategory && matchTab;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium text-white">Product & Deal Monitoring</h1>
        <p className="text-[#888888] text-sm mt-1">Monitor all products and active deals on the platform</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-1 w-fit">
        {["Products", "Deals"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-[#f05a1a] text-white"
                : "text-[#888888] hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-xl font-medium text-white">{products.length}</div>
          <div className="text-[#888888] text-xs mt-1">Total products</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-xl font-medium text-[#f05a1a]">{products.filter((p) => p.status === "Active").length}</div>
          <div className="text-[#888888] text-xs mt-1">Active</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-xl font-medium text-[#e24b4a]">{products.filter((p) => p.status === "Flagged").length}</div>
          <div className="text-[#888888] text-xs mt-1">Flagged</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-xl font-medium text-[#1a8a8a]">{products.filter((p) => p.status === "Deal").length}</div>
          <div className="text-[#888888] text-xs mt-1">Active deals</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by product name or shop..."
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
          <option>Active</option>
          <option>Flagged</option>
          <option>Deal</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#888888] focus:outline-none"
        >
          <option>All categories</option>
          <option>Rice & Grains</option>
          <option>Vegetables</option>
          <option>Spices</option>
          <option>Dairy</option>
          <option>Cooking Oils</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0a0a0a]">
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Product</th>
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Category</th>
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Price</th>
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-t border-[#0a0a0a] hover:bg-[#222222] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0"
                      style={{ background: product.color, color: product.textColor }}>
                      {product.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{product.name}</div>
                      <div className="text-xs text-[#666666]">{product.shop}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-[#888888]">{product.category}</td>
                <td className="px-4 py-3 text-sm text-white">{product.price}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusBadge[product.status]}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  {product.status === "Flagged" ? (
                    <button
                      onClick={() => handleUnflag(product.id)}
                      className="text-xs text-[#888888] border border-[#2a2a2a] rounded-md px-2 py-1 hover:bg-[#1a1a1a] transition-colors"
                    >
                      Unflag
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFlag(product.id)}
                      className="text-xs text-[#1a8a8a] border border-[#0a2a2a] rounded-md px-2 py-1 hover:bg-[#0a2a2a] transition-colors"
                    >
                      Flag
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="text-xs text-[#e24b4a] border border-[#2a1a1a] rounded-md px-2 py-1 hover:bg-[#2a1a1a] transition-colors"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#666666]">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}