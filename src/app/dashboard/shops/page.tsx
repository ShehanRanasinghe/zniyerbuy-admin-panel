//ShopsPage - Shop management and verification interface

// PURPOSE: Allows the admin to view, search, filter, verify, reject, and delete shops registered on the ZniyerBuy platform.

//FEATURES:
//  Summary stat cards (total, verified, pending, rejected counts)
//  Search by shop name or owner name
//  Status dropdown filter (All / Verified / Pending / Rejected)
//  Action buttons: Verify, Reject, Re-verify, and Delete per shop row
//  Empty state message when no shops match filters

//WORKFLOW:
//  New shops start as "Pending" and await admin review
//  Admin can "Verify" to approve or "Reject" to deny a pending shop
//  Rejected shops can be "Re-verified" if the owner resubmits
//  Any shop can be permanently deleted

//NOTE: Currently uses hardcoded mock data (initialShops). In production, this should be replaced with a Supabase or API fetch.

"use client";
import { useState } from "react";

//  MOCK DATA - Sample shops for demo/development
    //  Each shop has display metadata (initials, avatar colors) plus business fields (name, owner, category, status, registration date).
    //  Statuses: "Verified" (approved), "Pending" (awaiting review), "Rejected" (denied)

const initialShops = [
  { id: 1, name: "TechFix Store", owner: "Amal M.", category: "Electronics", status: "Verified", registered: "Mar 4, 2025", initials: "TF", color: "#2a1a0a", textColor: "#f05a1a" },
  { id: 2, name: "Style & Fashion", owner: "Kavya S.", category: "Clothing", status: "Pending", registered: "Apr 10, 2025", initials: "SF", color: "#0a2a2a", textColor: "#1a8a8a" },
  { id: 3, name: "Fresh Greens", owner: "Nimal P.", category: "Groceries", status: "Pending", registered: "Apr 15, 2025", initials: "FG", color: "#1a1a1a", textColor: "#888888" },
  { id: 4, name: "Bargain Hub", owner: "Ruwan K.", category: "General", status: "Rejected", registered: "Feb 22, 2025", initials: "BH", color: "#2a1a1a", textColor: "#e24b4a" },
];

//STATUS BADGE STYLES - Tailwind class map for shop status badges
    //  Each status gets a unique background + text + border color:
        //  Verified: orange theme (approved shops)
        //  Pending: teal theme (awaiting admin review)
        //  Rejected: red theme (denied shops)

//NOTE: This is intentionally different from the statusBadge in products/page.tsx, which uses Active/Flagged/Deal statuses for product-specific context.

const statusBadge: Record<string, string> = {
  Verified: "bg-[#2a1a0a] text-[#f05a1a] border border-[#f05a1a]",
  Pending: "bg-[#0a2a2a] text-[#1a8a8a] border border-[#1a8a8a]",
  Rejected: "bg-[#2a1a1a] text-[#e24b4a] border border-[#e24b4a]",
};

export default function ShopsPage() {

//State Management
    // shops        - mutable shop list (supports verify/reject/delete)
    // search       - current search query string
    // statusFilter - dropdown filter for status ("All status" = no filter)

  const [shops, setShops] = useState(initialShops);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All status");

  //Filtering Logic
      //  Combines search text and status filter with AND logic.
      //  Search checks both shop name and owner name (case-insensitive).

  const filtered = shops.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All status" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  //Action Handlers
      // handleVerify — sets a shop's status to "Verified" (admin approval)
      // handleReject — sets a shop's status to "Rejected" (admin denial)
      // handleDelete — permanently removes a shop from the list
      // In production, these should also trigger API calls to persist changes.

  const handleVerify = (id: number) => setShops(shops.map((s) => (s.id === id ? { ...s, status: "Verified" } : s)));
  const handleReject = (id: number) => setShops(shops.map((s) => (s.id === id ? { ...s, status: "Rejected" } : s)));
  const handleDelete = (id: number) => setShops(shops.filter((s) => s.id !== id));

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">

      {/*Page Header*/}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-white">Shop Management</h1>
          <p className="text-[#888888] text-sm mt-1">Verify, manage and monitor all shops</p>
        </div>
      </div>

      {/*Summary Stat Cards
          * Four cards showing total, verified, pending, and rejected counts.
          * Values are computed dynamically from the shops array,
          * so they update in real-time when shops are verified/rejected/deleted.
      */}

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

      {/*Search & Filter Bar
          * Search input (by shop name or owner) and a status dropdown.
          * Both filters work together via AND logic.
      */}

      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] text-sm">🔍</span>
          <input type="text" placeholder="Search by shop name or owner..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-[#444444] focus:outline-none focus:border-[#f05a1a]" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#888888] focus:outline-none">
          <option>All status</option><option>Verified</option><option>Pending</option><option>Rejected</option>
        </select>
      </div>

      {/*Shops Data Table
       * Displays filtered shops in a styled table with columns:
          * Shop (avatar + name + owner), Category, Status (badge),
          * Registered date, and Actions (Verify/Reject/Delete buttons).

       * Action button logic:
           - Verified shops: only "Delete" available (already approved)
           - Pending shops: "Verify" + "Reject" + "Delete" available
           - Rejected shops: "Re-verify" + "Delete" available
       * Shows "No shops found" when filters return empty results.
       */}

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

                {/* Shop avatar (initials) + name + owner */}

                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0"
                      style={{ background: shop.color, color: shop.textColor }}>{shop.initials}</div>
                    <div>
                      <div className="text-sm font-medium text-white">{shop.name}</div>
                      <div className="text-xs text-[#666666]">{shop.owner}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-[#888888]">{shop.category}</td>

                {/* Status badge — color-coded by verification status */}

                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusBadge[shop.status]}`}>{shop.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-[#888888]">{shop.registered}</td>

                {/* Action buttons — conditionally rendered based on current status */}

                <td className="px-4 py-3 flex items-center gap-2">

                  {/* Show Verify/Re-verify button for non-verified shops */}

                  {shop.status !== "Verified" && (
                    <button onClick={() => handleVerify(shop.id)}
                      className="text-xs text-[#f05a1a] border border-[#f05a1a] rounded-md px-2 py-1 hover:bg-[#2a1a0a] transition-colors">
                      {shop.status === "Rejected" ? "Re-verify" : "Verify"}
                    </button>
                  )}

                  {/* Show Reject button only for pending shops */}

                  {shop.status === "Pending" && (
                    <button onClick={() => handleReject(shop.id)}
                      className="text-xs text-[#1a8a8a] border border-[#0a2a2a] rounded-md px-2 py-1 hover:bg-[#0a2a2a] transition-colors">
                      Reject
                    </button>
                  )}

                  {/* Delete button — always available for all shops */}

                  <button onClick={() => handleDelete(shop.id)}
                    className="text-xs text-[#e24b4a] border border-[#2a1a1a] rounded-md px-2 py-1 hover:bg-[#2a1a1a] transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* Empty state — no shops match the current filters */}
            
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#666666]">No shops found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}