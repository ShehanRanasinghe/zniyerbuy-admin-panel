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
    <aside className="w-60 min-h-screen bg-[#0a0a0a] text-white flex flex-col border-r border-[#2a2a2a]">
      <div className="px-6 py-5 border-b border-[#2a2a2a]">
        <h1 className="text-lg font-semibold">
          <span className="text-[#f05a1a]">ZNIYER</span>
          <span className="text-[#1a8a8a]">BUY</span>
        </h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === link.href
                ? "bg-[#f05a1a] text-white"
                : "text-[#888888] hover:bg-[#1a1a1a] hover:text-white"
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