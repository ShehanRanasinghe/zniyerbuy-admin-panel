"use client";
import { useState, useEffect } from "react";
import { fetchUsers, updateUserRole, toggleUserStatus, deleteUser } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faUserShield, faStore, faSearch,
  faTrash, faSpinner, faToggleOn, faToggleOff,
} from "@fortawesome/free-solid-svg-icons";

const roleBadge: Record<string, string> = {
  Admin: "bg-[#2a1a0a] text-[#f05a1a] border border-[#f05a1a]",
  Seller: "bg-[#0a2a2a] text-[#1a8a8a] border border-[#1a8a8a]",
  User: "bg-[#1a1a1a] text-[#888] border border-[#333]",
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      const { error: e, data } = await fetchUsers();
      if (e) setError(e);
      else setUsers(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === "All roles" || u.role === roleFilter;
    const matchStatus = statusFilter === "All status" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    setError("");
    const { error: e } = await updateUserRole(userId, newRole);
    if (e) setError(e);
    else setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    setUpdatingId(null);
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean, userName: string) => {
    const action = currentStatus ? "deactivate" : "activate";
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${userName}'s account?`)) return;
    setUpdatingId(userId);
    setError("");
    const { error: e } = await toggleUserStatus(userId, !currentStatus);
    if (e) setError(e);
    else setUsers(users.map((u) => (u.id === userId ? { ...u, status: !currentStatus ? 'Active' : 'Inactive', isActive: !currentStatus } : u)));
    setUpdatingId(null);
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Permanently delete ${userName}? This cannot be undone.`)) return;
    setUpdatingId(userId);
    setError("");
    const { error: e } = await deleteUser(userId);
    if (e) setError(e);
    else setUsers(users.filter((u) => u.id !== userId));
    setUpdatingId(null);
  };

  const totalActive = users.filter((u) => u.status === "Active").length;
  const totalSellers = users.filter((u) => u.role === "Seller").length;
  const totalAdmins = users.filter((u) => u.role === "Admin").length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">User Management</h1>
          <p className="text-[#666] text-sm mt-1">Manage user accounts and their status on the platform</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-[#2a1a1a] border border-[#e24b4a] rounded-lg">
          <p className="text-[#e24b4a] text-sm">{error}</p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: faUsers, value: users.length, label: "Total Users", color: "#f05a1a" },
          { icon: faUserShield, value: totalActive, label: "Active", color: "#1a8a8a" },
          { icon: faStore, value: totalSellers, label: "Sellers", color: "#f05a1a" },
          { icon: faUserShield, value: totalAdmins, label: "Admins", color: "#e24b4a" },
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
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-[#222] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#f05a1a] transition-colors"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-sm text-[#888] focus:outline-none focus:border-[#f05a1a] transition-colors"
        >
          <option>All roles</option>
          <option>Admin</option>
          <option>Seller</option>
          <option>User</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-sm text-[#888] focus:outline-none focus:border-[#f05a1a] transition-colors"
        >
          <option>All status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-[#555]">
          <FontAwesomeIcon icon={faSpinner} className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading users...</span>
        </div>
      ) : (
        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0d0d0d]">
                  {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-[#555] font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-t border-[#0d0d0d] hover:bg-[#161616] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                          style={{ background: user.color || "#1a1a1a", color: user.textColor || "#888" }}
                        >
                          {user.initials}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-xs text-[#555]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge[user.role] || roleBadge.User}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-[#1a8a1a]" : "bg-[#555]"}`} />
                        <span className={user.status === "Active" ? "text-[#1a8a8a]" : "text-[#555]"}>{user.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#666] whitespace-nowrap">{user.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={updatingId === user.id}
                          className="bg-[#0a0a0a] border border-[#222] rounded px-2 py-1 text-xs text-[#888] focus:outline-none disabled:opacity-50 focus:border-[#f05a1a] transition-colors"
                        >
                          <option>Admin</option>
                          <option>Seller</option>
                          <option>User</option>
                        </select>
                        <button
                          onClick={() => handleStatusToggle(user.id, user.isActive, user.name)}
                          disabled={updatingId === user.id}
                          className={`text-sm border rounded px-2.5 py-1.5 transition-colors disabled:opacity-50 flex items-center gap-1.5 ${
                            user.isActive 
                              ? 'text-[#1a8a8a] border-[#1a2a2a] hover:bg-[#0a2a2a]' 
                              : 'text-[#888] border-[#222] hover:bg-[#1a1a1a]'
                          }`}
                          title={user.isActive ? 'Deactivate account' : 'Activate account'}
                        >
                          {updatingId === user.id
                            ? <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                            : <FontAwesomeIcon icon={user.isActive ? faToggleOn : faToggleOff} className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={updatingId === user.id}
                          className="text-sm text-[#e24b4a] border border-[#2a1a1a] rounded px-2.5 py-1.5 hover:bg-[#2a1a1a] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                          title="Delete user permanently"
                        >
                          {updatingId === user.id
                            ? <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                            : <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-[#555]">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 bg-[#0d0d0d] border-t border-[#1a1a1a] text-xs text-[#555]">
            Showing {filtered.length} of {users.length} users
          </div>
        </div>
      )}
    </div>
  );
}
