"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faUsers, faStore, faBox } from "@fortawesome/free-solid-svg-icons";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: faChartLine },
  { href: "/dashboard/users", label: "Users", icon: faUsers },
  { href: "/dashboard/shops", label: "Shops", icon: faStore },
  { href: "/dashboard/products", label: "Products", icon: faBox },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-[#080808] text-white flex flex-col border-r border-[#1a1a1a] flex-shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#1a1a1a]">
        <h1 className="text-base font-bold tracking-wide">
          <span className="text-[#f05a1a]">ZNIYER</span>
          <span className="text-[#1a8a8a]">BUY</span>
        </h1>
        <p className="text-[#444] text-xs mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-[#f05a1a] text-white font-medium shadow-sm"
                  : "text-[#666] hover:bg-[#111] hover:text-white"
              }`}
            >
              <FontAwesomeIcon icon={link.icon} className="w-4 h-4 flex-shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#1a1a1a]">
        <p className="text-[#333] text-xs">v1.0.0</p>
      </div>
    </aside>
  );
}
