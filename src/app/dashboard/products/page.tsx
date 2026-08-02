"use client";
import { useState, useEffect } from "react";
import { fetchProducts, fetchProductFilters, flagProduct, restoreProduct } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox, faCheckCircle, faFlag,
  faSearch, faTrash, faRotateLeft, faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const statusBadge: Record<string, string> = {
  Active: "bg-[#0a2a0a] text-[#1a8a1a] border border-[#1a8a1a]",
  Flagged: "bg-[#2a1a1a] text-[#e24b4a] border border-[#e24b4a]",
  Inactive: "bg-[#1a1a1a] text-[#888] border border-[#333]",
};

type Shop = { id: string; name: string };

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [shopFilter, setShopFilter] = useState("All shops");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      const [{ error: pErr, data: pData }, { error: fErr, data: fData }] = await Promise.all([
        fetchProducts(),
        fetchProductFilters(),
      ]);
      if (pErr) setError(pErr);
      else setProducts(pData || []);
      if (!fErr && fData) {
        setShops(fData.shops || []);
        setCategories(fData.categories || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleFlag = async (productId: string, productName: string) => {
    if (!confirm(`Remove ${productName}? It will be hidden from the shop but can be restored later.`)) return;
    setUpdatingId(productId);
    setError("");
    const { error: e } = await flagProduct(productId);
    if (e) setError(e);
    else setProducts(products.map((p) => (p.id === productId ? { ...p, status: "Flagged" } : p)));
    setUpdatingId(null);
  };

  const handleRestore = async (productId: string) => {
    setUpdatingId(productId);
    setError("");
    const { error: e } = await restoreProduct(productId);
    if (e) setError(e);
    else setProducts(products.map((p) => (p.id === productId ? { ...p, status: "Active" } : p)));
    setUpdatingId(null);
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.shop.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All status" || p.status === statusFilter;
    const matchShop = shopFilter === "All shops" || p.shopId === shopFilter;
    const matchCategory = categoryFilter === "All categories" || p.category === categoryFilter;
    return matchSearch && matchStatus && matchShop && matchCategory;
  });

  const counts = {
    total: products.length,
    active: products.filter((p) => p.status === "Active").length,
    flagged: products.filter((p) => p.status === "Flagged").length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Product Monitoring</h1>
        <p className="text-[#666] text-sm mt-1">Monitor all products across shops on the platform</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-[#2a1a1a] border border-[#e24b4a] rounded-lg">
          <p className="text-[#e24b4a] text-sm">{error}</p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: faBox, value: counts.total, label: "Total Products", color: "#f05a1a" },
          { icon: faCheckCircle, value: counts.active, label: "Active", color: "#1a8a1a" },
          { icon: faFlag, value: counts.flagged, label: "Flagged", color: "#e24b4a" },
        ].map((s) => (
          <div key={s.label} className="bg-[#111] border border-[#222] rounded-xl p-4">
            <FontAwesomeIcon icon={s.icon} className="w-4 h-4 mb-2" style={{ color: s.color }} />
            <div className="text-xl font-semibold text-white">{loading ? "—" : s.value}</div>
            <div className="text-[#666] text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
          <input
            type="text"
            placeholder="Search by product name or shop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-[#222] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#f05a1a] transition-colors"
          />
        </div>
        <select
          value={shopFilter}
          onChange={(e) => setShopFilter(e.target.value)}
          className="bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-sm text-[#888] focus:outline-none focus:border-[#f05a1a] transition-colors"
        >
          <option value="All shops">All shops</option>
          {shops.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-sm text-[#888] focus:outline-none focus:border-[#f05a1a] transition-colors"
        >
          <option value="All categories">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-sm text-[#888] focus:outline-none focus:border-[#f05a1a] transition-colors"
        >
          <option>All status</option>
          <option>Active</option>
          <option>Flagged</option>
          <option>Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-[#555]">
          <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading products...</span>
        </div>
      ) : (
        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0d0d0d]">
                  {["Product", "Shop", "Category", "Price", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-[#555] font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-t border-[#0d0d0d] hover:bg-[#161616] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0"
                          style={{ background: product.color || "#1a1a1a", color: product.textColor || "#888" }}
                        >
                          {product.initials}
                        </div>
                        <div className="text-sm font-medium text-white">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#888] whitespace-nowrap">{product.shop}</td>
                    <td className="px-4 py-3 text-xs text-[#888] capitalize whitespace-nowrap">{product.category}</td>
                    <td className="px-4 py-3 text-sm text-white whitespace-nowrap">{product.price}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge[product.status] || statusBadge.Active}`}>{product.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {product.status === "Flagged" ? (
                          <button
                            onClick={() => handleRestore(product.id)}
                            disabled={updatingId === product.id}
                            className="text-xs text-[#1a8a8a] border border-[#0a2a2a] rounded px-2 py-1 hover:bg-[#0a2a2a] transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {updatingId === product.id
                              ? <FontAwesomeIcon icon={faSpinner} className="w-3 h-3 animate-spin" />
                              : <FontAwesomeIcon icon={faRotateLeft} className="w-3 h-3" />}
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => handleFlag(product.id, product.name)}
                            disabled={updatingId === product.id}
                            className="text-xs text-[#e24b4a] border border-[#2a1a1a] rounded px-2 py-1 hover:bg-[#2a1a1a] transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {updatingId === product.id
                              ? <FontAwesomeIcon icon={faSpinner} className="w-3 h-3 animate-spin" />
                              : <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />}
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#555]">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 bg-[#0d0d0d] border-t border-[#1a1a1a] text-xs text-[#555]">
            Showing {filtered.length} of {products.length} products
          </div>
        </div>
      )}
    </div>
  );
}