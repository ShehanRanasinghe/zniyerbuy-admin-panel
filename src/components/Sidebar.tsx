//Sidebar - Left navigation panel for the dashboard

//PURPOSE: Provides persistent navigation links for all dashboard pages.
    // Highlights the currently active page based on the URL pathname.
    // This component is rendered inside the DashboardLayout and appears on every page under /dashboard.

//FEATURES:
    // Brand logo (ZNIYERBUY) at the top
    // Navigation links: Dashboard, Users, Shops, Products
    // Active link highlighting (orange background) using pathname matching
    // Hover effects on inactive links for better UX

//NOTE: Uses "use client" because it relies on usePathname() hook from next/navigation, which only works in client components.

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

//NAVIGATION LINKS - Define all sidebar navigation items
    // Each link has a route (href), display label, and emoji icon.
    // To add a new dashboard page, simply add a new entry here.

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/users", label: "Users", icon: "👥" },
  { href: "/dashboard/shops", label: "Shops", icon: "🏪" },
  { href: "/dashboard/products", label: "Products", icon: "📦" },
];

export default function Sidebar() {

  //Get the current URL pathname to determine which link is active

  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-[#0a0a0a] text-white flex flex-col border-r border-[#2a2a2a]">

      {//Brand Logo
          // Displays the ZNIYERBUY logo in the sidebar header.
          // Uses the same brand colors as the main landing page.
      }

      <div className="px-6 py-5 border-b border-[#2a2a2a]">
        <h1 className="text-lg font-semibold">
          <span className="text-[#f05a1a]">ZNIYER</span>
          <span className="text-[#1a8a8a]">BUY</span>
        </h1>
      </div>

      {//Navigation Links
          // Renders each link with an icon and label.
          // Active link detection: compares pathname === link.href for exact match.
          // Active state: orange background with white text.
          // Inactive state: grey text with hover effects (dark background + white text).
       }

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