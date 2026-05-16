"use client";
import { useState } from "react";

const initialUsers = [
  { id: 1, name: "Shehan R.", email: "shehan@zniyerbuy.com", role: "Admin", status: "Active", joined: "Jan 12, 2025", initials: "SR", color: "#1a3a2a", textColor: "#1d9e75" },
  { id: 2, name: "Amal M.", email: "amal@gmail.com", role: "Seller", status: "Active", joined: "Mar 4, 2025", initials: "AM", color: "#2a2a10", textColor: "#f0a500" },
  { id: 3, name: "Nimal P.", email: "nimal@gmail.com", role: "User", status: "Inactive", joined: "Feb 18, 2025", initials: "NP", color: "#1a2a3a", textColor: "#6b9aaa" },
  { id: 4, name: "Kavya S.", email: "kavya@gmail.com", role: "User", status: "Active", joined: "Apr 2, 2025", initials: "KS", color: "#2a1a2a", textColor: "#c084fc" },
];

const roleBadge: Record<string, string> = {
  Admin: "bg-[#1a3a2a] text-[#1d9e75] border border-[#1d9e75]",
  Seller: "bg-[#2a2a10] text-[#f0a500] border border-[#f0a500]",
  User: "bg-[#1a2a3a] text-[#6b9aaa] border border-[#4a7a8a]",
};

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All status");

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All roles" || u.role === roleFilter;
    const matchStatus = statusFilter === "All status" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleRoleChange = (id: number, newRole: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0d2128] p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-white">User Management</h1>
          <p className="text-[#6b9aaa] text-sm mt-1">Manage all registered users</p>
        </div>
        <button className="bg-[#1d9e75] hover:bg-[#0f6e56] text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          + Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-4">
          <div className="text-2xl font-medium text-white">{users.length}</div>
          <div className="text-[#6b9aaa] text-xs mt-1">Total users</div>
        </div>
        <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-4">
          <div className="text-2xl font-medium text-[#1d9e75]">{users.filter((u) => u.status === "Active").length}</div>
          <div className="text-[#6b9aaa] text-xs mt-1">Active</div>
        </div>
        <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl p-4">
          <div className="text-2xl font-medium text-[#f0a500]">{users.filter((u) => u.role === "Seller").length}</div>
          <div className="text-[#6b9aaa] text-xs mt-1">Sellers</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7a8a] text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#112a33] border border-[#1a4a5a] rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-[#3a6070] focus:outline-none focus:border-[#1d9e75]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[#112a33] border border-[#1a4a5a] rounded-lg px-3 py-2 text-sm text-[#6b9aaa] focus:outline-none"
        >
          <option>All roles</option>
          <option>Admin</option>
          <option>Seller</option>
          <option>User</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#112a33] border border-[#1a4a5a] rounded-lg px-3 py-2 text-sm text-[#6b9aaa] focus:outline-none"
        >
          <option>All status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#112a33] border border-[#1a4a5a] rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0d2128]">
              <th className="text-left px-4 py-3 text-xs text-[#4a7a8a] font-medium uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 text-xs text-[#4a7a8a] font-medium uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3 text-xs text-[#4a7a8a] font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs text-[#4a7a8a] font-medium uppercase tracking-wider">Joined</th>
              <th className="text-left px-4 py-3 text-xs text-[#4a7a8a] font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-t border-[#0d2128] hover:bg-[#0f2530] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                      style={{ background: user.color, color: user.textColor }}>
                      {user.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-xs text-[#4a7a8a]">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${roleBadge[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full ${user.status === "Active" ? "bg-[#1d9e75]" : "bg-[#4a7a8a]"}`}></span>
                    <span className={user.status === "Active" ? "text-[#1d9e75]" : "text-[#4a7a8a]"}>{user.status}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#6b9aaa]">{user.joined}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-[#0d2128] border border-[#1a4a5a] rounded-md px-2 py-1 text-xs text-[#6b9aaa] mr-2 focus:outline-none"
                  >
                    <option>Admin</option>
                    <option>Seller</option>
                    <option>User</option>
                  </select>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-xs text-[#e24b4a] border border-[#3a1a1a] rounded-md px-2 py-1 hover:bg-[#3a1a1a] transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#4a7a8a]">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}