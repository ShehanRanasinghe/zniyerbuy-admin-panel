//ProductsPage — Product and deal monitoring interface

//PURPOSE: Allows the admin to view, search, filter, flag, unflag, and remove products listed on the ZniyerBuy platform. 
// Also provides a "Deals" tab to view products that have active deals.

//FEATURES:
//  - Fetches real product data from Supabase on page load
//  - Tab switcher between "Products" and "Deals" views
//  - Summary stat cards (total, active, flagged, deals count)
//  - Search by product name or shop name
//  - Dropdown filters for status and category
//  - Action buttons: Flag/Unflag and Remove per product row
//  - Empty state message when no products match filters
//  - Error handling and loading states

"use client";
import { useState, useEffect } from "react";
import { fetchProducts, flagProduct, unflagProduct, removeProduct } from "@/lib/api";

//  STATUS BADGE STYLES - Tailwind class map for product status badges
//  Each status gets a unique background + text + border color:
    //  Active: orange theme (normal products)
    //  Flagged: red theme (reported/suspicious products)
    //  Deal: teal theme (products with active deals)

//  NOTE: This is intentionally different from the statusBadge in shops/page.tsx,
//  which uses Verified/Pending/Rejected statuses instead.

const statusBadge: Record<string, string> = {
  Active: "bg-[#2a1a0a] text-[#f05a1a] border border-[#f05a1a]",
  Flagged: "bg-[#2a1a1a] text-[#e24b4a] border border-[#e24b4a]",
  Deal: "bg-[#0a2a2a] text-[#1a8a8a] border border-[#1a8a8a]",
};

export default function ProductsPage() {

  // State Management

  //products       - mutable product list fetched from Supabase
  //activeTab      - which tab is selected: "Products" or "Deals"
  //search         - current search query string
  //statusFilter   - dropdown filter for status ("All status" = no filter)
  //categoryFilter - dropdown filter for category ("All categories" = no filter)
  //loading        - tracks whether data is being fetched
  //error          - displays error messages from API calls
  //updatingId     - tracks which product is being updated for loading UI
  
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Products");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch products from Supabase on component mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      const { error: fetchError, data } = await fetchProducts();
      
      if (fetchError) {
        setError(fetchError);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    loadProducts();
  }, []);

  // Action Handlers 

  //handleFlag   - marks a product as "Flagged" via API call
  //handleUnflag - marks a flagged product back to "Active"
  //handleRemove - permanently removes a product from the list
  //All handlers trigger API calls to persist changes

  const handleFlag = async (productId: string) => {
    setUpdatingId(productId);
    setError("");
    const { error: flagError } = await flagProduct(productId);
    
    if (flagError) {
      setError(flagError);
    } else {
      setProducts(products.map((p) => (p.id === productId ? { ...p, status: "Flagged" } : p)));
    }
    setUpdatingId(null);
  };

  const handleUnflag = async (productId: string) => {
    setUpdatingId(productId);
    setError("");
    const { error: unflagError } = await unflagProduct(productId);
    
    if (unflagError) {
      setError(unflagError);
    } else {
      setProducts(products.map((p) => (p.id === productId ? { ...p, status: "Active" } : p)));
    }
    setUpdatingId(null);
  };

  const handleRemove = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to remove ${productName}? This action cannot be undone.`)) {
      return;
    }

    setUpdatingId(productId);
    setError("");
    const { error: removeError } = await removeProduct(productId);
    
    if (removeError) {
      setError(removeError);
    } else {
      setProducts(products.filter((p) => p.id !== productId));
    }
    setUpdatingId(null);
  };

  // Filtering Logic
      //Combines search, status, category, and tab filters with AND logic.
      //The tab filter separates "Deal" items from non-deal items:
          //"Products" tab shows items where status !== "Deal"
          //"Deals" tab shows only items where status === "Deal"
          
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.shop.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All status" || p.status === statusFilter;
    const matchCategory = categoryFilter === "All categories" || p.category === categoryFilter;
    const matchTab = activeTab === "Products" ? p.status !== "Deal" : p.status === "Deal";
    return matchSearch && matchStatus && matchCategory && matchTab;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">

      {
      //Page Header
      }

      <div className="mb-6">
        <h1 className="text-xl font-medium text-white">Product & Deal Monitoring</h1>
        <p className="text-[#888888] text-sm mt-1">Monitor all products and active deals on the platform</p>
      </div>

      {/* Error Message Display
          * Shows error banner if an API call fails
      */}

      {error && (
        <div className="mb-4 p-3 bg-[#2a1a1a] border border-[#e24b4a] rounded-lg">
          <p className="text-[#e24b4a] text-sm">{error}</p>
        </div>
      )}

      {/* Loading State
          * Shows loading message while fetching products from Supabase
      */}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#888888]">Loading products...</p>
        </div>
      ) : (
        <>

      {//Tab Switcher
          //Toggles between "Products" and "Deals" views.
          //The active tab gets an orange background; inactive tabs are grey.
          //Switching tabs changes which products are shown via the matchTab filter.
      }

      <div className="flex gap-1 mb-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-1 w-fit">
        {["Products", "Deals"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-[#f05a1a] text-white" : "text-[#888888] hover:text-white"}`}>
            {tab}
          </button>
        ))}
      </div>

      {//Summary Stat Cards
          //Four cards showing total, active, flagged, and deal counts.
          //Values are computed dynamically from the products array, so they update when products are flagged/unflagged/removed.
      }

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

      {//Search & Filter Bar
          // Search input (by product name or shop), status dropdown, and category dropdown. All filters work together via AND logic.
      }

      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] text-sm">🔍</span>
          <input type="text" placeholder="Search by product name or shop..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-[#444444] focus:outline-none focus:border-[#f05a1a]" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#888888] focus:outline-none">
          <option>All status</option><option>Active</option><option>Flagged</option><option>Deal</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#888888] focus:outline-none">
          <option>All categories</option><option>Rice & Grains</option><option>Vegetables</option>
          <option>Spices</option><option>Dairy</option><option>Cooking Oils</option>
        </select>
      </div>

      {//Products Data Table
          //Displays filtered products in a styled table with columns:
                //Product (avatar + name + shop), Category, Price, Status (badge), and Actions (Flag/Unflag + Remove buttons).
                //Shows "No products found" when filters return empty results.
      }

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

                {/* Product avatar (initials) + name + shop name */}

                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0"
                      style={{ background: product.color, color: product.textColor }}>{product.initials}</div>
                    <div>
                      <div className="text-sm font-medium text-white">{product.name}</div>
                      <div className="text-xs text-[#666666]">{product.shop}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-[#888888]">{product.category}</td>
                <td className="px-4 py-3 text-sm text-white">{product.price}</td>

                {/* Status badge - color-coded by status type */}

                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusBadge[product.status]}`}>{product.status}</span>
                </td>

                {/* Action buttons - Flag/Unflag toggles status, Remove deletes the product */}

                <td className="px-4 py-3 flex items-center gap-2">
                  {product.status === "Flagged" ? (
                    <button onClick={() => handleUnflag(product.id)}
                      disabled={updatingId === product.id}
                      className="text-xs text-[#888888] border border-[#2a2a2a] rounded-md px-2 py-1 hover:bg-[#1a1a1a] transition-colors disabled:opacity-50">Unflag</button>
                  ) : (
                    <button onClick={() => handleFlag(product.id)}
                      disabled={updatingId === product.id}
                      className="text-xs text-[#1a8a8a] border border-[#0a2a2a] rounded-md px-2 py-1 hover:bg-[#0a2a2a] transition-colors disabled:opacity-50">Flag</button>
                  )}
                  <button onClick={() => handleRemove(product.id, product.name)}
                    disabled={updatingId === product.id}
                    className="text-xs text-[#e24b4a] border border-[#2a1a1a] rounded-md px-2 py-1 hover:bg-[#2a1a1a] transition-colors disabled:opacity-50">Remove</button>
                </td>
              </tr>
            ))}

            {/* Empty state - no products match the current filters */}

            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#666666]">No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      </>
      )}
    </div>
  );
}