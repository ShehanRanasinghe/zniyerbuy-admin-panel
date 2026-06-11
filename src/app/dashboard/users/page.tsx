// UsersPage — Admin user management interface

// PURPOSE: Allows the admin to view, search, filter, change roles, and delete registered users on the ZniyerBuy platform.

// FEATURES:
//  - Fetches real user data from Supabase on page load
//  - Table listing all users with avatar initials, name, email, role, and status
//  - Real-time search filtering by name or email
//  - Dropdown filters for role (Admin / Seller / User) and status (Active / Inactive)
//  - Inline role change via a <select> dropdown per row with API integration
//  - Delete action per user row with confirmation
//  - Summary stat cards showing total, active, and seller counts
//  - Error handling and loading states

"use client";
import { useState, useEffect } from "react";
import { fetchUsers, updateUserRole, deleteUser } from "@/lib/api";

// ROLE BADGE STYLES - Tailwind class map for role badges
//  Each role gets a distinct background + text + border color combo so the admin can visually distinguish roles at a glance.

// NOTE: This is intentionally separate from the roleBadge in dashboard/page.tsx because the dashboard version only has User/Seller (no Admin role badge).

const roleBadge: Record<string, string> = {
  Admin: "bg-[#2a1a0a] text-[#f05a1a] border border-[#f05a1a]",
  Seller: "bg-[#0a2a2a] text-[#1a8a8a] border border-[#1a8a8a]",
  User: "bg-[#1a1a1a] text-[#888888] border border-[#666666]",
};

export default function UsersPage() {
  // State management
  // users         - the mutable user list fetched from Supabase
  // search        - the current search query string
  // roleFilter    - dropdown filter value for roles ("All roles" = no filter)
  // statusFilter  - dropdown filter value for status ("All status" = no filter)
  // loading       - tracks whether data is being fetched
  // error         - displays error messages from API calls
  // updatingId    - tracks which user is being updated for loading UI

  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch users from Supabase on component mount
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError("");
      const { error: fetchError, data } = await fetchUsers();
      
      if (fetchError) {
        setError(fetchError);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    loadUsers();
  }, []);

  // Filtering Logic
  // Combines search text, role, and status filters with AND logic.
  // Search checks both name and email (case-insensitive).

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All roles" || u.role === roleFilter;
    const matchStatus = statusFilter === "All status" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  // Action Handlers

  // handleRoleChange - updates a user's role via API and local state
  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    setError("");
    const { error: updateError } = await updateUserRole(userId, newRole);
    
    if (updateError) {
      setError(updateError);
    } else {
      // Update local state on success
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    }
    setUpdatingId(null);
  };

  // handleDelete - deletes a user after confirmation
  const handleDelete = async (userId: string, userName: string) => {
    // Confirm deletion with user
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    setUpdatingId(userId);
    setError("");
    const { error: deleteError } = await deleteUser(userId);
    
    if (deleteError) {
      setError(deleteError);
    } else {
      // Remove user from local state on success
      setUsers(users.filter((u) => u.id !== userId));
    }
    setUpdatingId(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">

      {/* Page Header
          * Title and description for the Users page.
          * The "Add User" button is a placeholder — no create-user modal exists yet.
      */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-white">User Management</h1>
          <p className="text-[#888888] text-sm mt-1">Manage all registered users</p>
        </div>
        <button className="bg-[#f05a1a] hover:bg-[#c04010] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          + Add User
        </button>
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
          * Shows loading message while fetching users from Supabase
      */}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#888888]">Loading users...</p>
        </div>
      ) : (
        <>

      {/* Summary Stat Cards
       * Three cards showing total users, active users, and sellers.
       * Values are computed dynamically from the current users array, so they update in real-time when a user is deleted or role-changed.
      */}
       
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-2xl font-medium text-white">{users.length}</div>
          <div className="text-[#888888] text-xs mt-1">Total users</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-2xl font-medium text-[#f05a1a]">{users.filter((u) => u.status === "Active").length}</div>
          <div className="text-[#888888] text-xs mt-1">Active</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <div className="text-2xl font-medium text-[#1a8a8a]">{users.filter((u) => u.role === "Seller").length}</div>
          <div className="text-[#888888] text-xs mt-1">Sellers</div>
        </div>
      </div>

      {/* Search & Filter Bar
          * A search input for name/email lookup, plus two dropdown selects
          * for filtering by role and status. All filters work simultaneously.
      */}
      
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] text-sm">🔍</span>
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-[#444444] focus:outline-none focus:border-[#f05a1a]" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#888888] focus:outline-none">
          <option>All roles</option><option>Admin</option><option>Seller</option><option>User</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#888888] focus:outline-none">
          <option>All status</option><option>Active</option><option>Inactive</option>
        </select>
      </div>

      {/* Users Data Table
            * Displays filtered users in a styled table with columns:
            * User (avatar + name + email), Role (badge), Status (dot indicator),
            * Joined date, and Actions (role dropdown + delete button).
            * Shows "No users found" message when filters return empty results.
      */}

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0a0a0a]">
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Joined</th>
              <th className="text-left px-4 py-3 text-xs text-[#666666] font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-t border-[#0a0a0a] hover:bg-[#222222] transition-colors">

                {/* User avatar (initials) + name + email */}

                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                      style={{ background: user.color, color: user.textColor }}>{user.initials}</div>
                    <div>
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-xs text-[#666666]">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Role badge - styled per role type */}

                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${roleBadge[user.role]}`}>{user.role}</span>
                </td>

                {/* Status indicator - green dot for Active, grey for Inactive */}

                <td className="px-4 py-3">
                  <span className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full ${user.status === "Active" ? "bg-[#f05a1a]" : "bg-[#666666]"}`}></span>
                    <span className={user.status === "Active" ? "text-[#f05a1a]" : "text-[#666666]"}>{user.status}</span>
                  </span>
                </td>

                {/* Join date */}

                <td className="px-4 py-3 text-xs text-[#888888]">{user.joined}</td>

                {/* Actions - role change dropdown + delete button */}

                <td className="px-4 py-3">
                  <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updatingId === user.id}
                    className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-2 py-1 text-xs text-[#888888] mr-2 focus:outline-none disabled:opacity-50">
                    <option>Admin</option><option>Seller</option><option>User</option>
                  </select>
                  <button onClick={() => handleDelete(user.id, user.name)}
                    disabled={updatingId === user.id}
                    className="text-xs text-[#e24b4a] border border-[#2a1a1a] rounded-md px-2 py-1 hover:bg-[#2a1a1a] transition-colors disabled:opacity-50">
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {/* Empty state - shown when no users match the current filters */}

            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#666666]">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      </>
      )}
    </div>
  );
}