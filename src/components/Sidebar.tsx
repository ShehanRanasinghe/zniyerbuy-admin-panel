"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/users", label: "Users", icon: "👥" },
  { href: "/dashboard/shops", label: "Shops", icon: "🏪" },
  { href: "/dashboard/products", label: "Products", icon: "📦" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === link.href
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}