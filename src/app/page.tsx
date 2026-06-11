//HomePage - Landing page for the ZniyerBuy Admin Panel

// PURPOSE: Public-facing landing page that introduces the admin panel to authorized administrators. 
// Showcases platform stats, key features, and provides navigation to the login page and dashboard.

// NOTE: This is a server component (no "use client" directive). It renders static content with no client-side interactivity - just links.

// IMPORTANT: The stat numbers here (1,284 users, 86 shops, etc.) are hardcoded demo values for the landing page marketing display. 
// They are NOT live data. The actual dashboard page fetches real-time stats from Supabase separately. These values are intentionally static.

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">

      {//Top Navigation Bar
          //Contains the ZNIYERBUY brand logo (split into two colored spans) and a CTA button linking to the admin login page.
      }

      <nav className="flex items-center justify-between px-8 py-4 border-b border-[#2a2a2a]">
        <div className="text-xl font-semibold tracking-wide">
          <span className="text-[#f05a1a]">ZNIYER</span>
          <span className="text-[#1a8a8a]">BUY</span>
        </div>
        <Link href="/login" className="bg-[#f05a1a] hover:bg-[#c04010] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
          Admin Login →
        </Link>
      </nav>

      {//Hero Section
          //Main headline area with:
              //A pill badge identifying the platform as Sri Lankan
              //A large headline with an accent-colored keyword
              //A descriptive subtitle about what the admin panel does
              //Two CTA buttons: primary (go to dashboard) and secondary (login)
      }

      <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
        <div className="bg-[#2a1a0a] text-[#f05a1a] border border-[#f05a1a] text-xs px-3 py-1 rounded-full mb-5 tracking-wide">
          🇱🇰 Sri Lanka's Grocery Platform
        </div>
        <h1 className="text-4xl font-semibold text-white leading-tight mb-4">
          Manage Your Platform<br />with <span className="text-[#f05a1a]">Confidence</span>
        </h1>
        <p className="text-[#888888] text-sm max-w-md leading-relaxed mb-8">
          ZniyerBuy Admin Panel gives you full control over users, shops, products and deals — all in one place.
        </p>
        <div className="flex gap-3">
          <Link href="/dashboard" className="bg-[#f05a1a] hover:bg-[#c04010] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
            Go to Dashboard →
          </Link>
          <Link href="/login" className="bg-transparent border border-[#2a2a2a] text-[#888888] hover:text-white text-sm px-6 py-2.5 rounded-lg transition-colors">
            Admin Login
          </Link>
        </div>
      </div>

      {//Platform Stats Grid
          //Four stat cards showing demo numbers for users, shops, products, and deals. These are static marketing figures for the landing page.
          //Each card uses a different accent color for visual distinction.

      //NOTE: Not connected to live data - purely presentational.
      }

      <div className="grid grid-cols-4 gap-3 px-8 pb-8">
        {[
          { num: "1,284", label: "Registered users", color: "text-white" },
          { num: "86", label: "Active shops", color: "text-[#f05a1a]" },
          { num: "342", label: "Listed products", color: "text-[#1a8a8a]" },
          { num: "54", label: "Active deals", color: "text-white" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-center">
            <div className={`text-2xl font-medium ${s.color}`}>{s.num}</div>
            <div className="text-[#888888] text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {//Features Section
          //Three feature cards highlighting key admin panel capabilities:
              //User Management, Shop Verification, and AI Insights.
              //Each card has an icon, title, and brief description.
      }

      <div className="px-8 pb-8">
        <h2 className="text-base font-medium text-white text-center mb-5">Everything you need to run the platform</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: "👥", title: "User Management", desc: "View, manage and assign roles to all registered users on the platform." },
            { icon: "🏪", title: "Shop Verification", desc: "Review and verify shop registrations, reject or remove shops as needed." },
            { icon: "🤖", title: "AI Insights", desc: "Get Claude AI-powered recommendations based on your live platform data." },
          ].map((f) => (
            <div key={f.title} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="text-sm font-medium text-white mb-2">{f.title}</div>
              <div className="text-xs text-[#888888] leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {//Call-To-Action Banner
          // A full-width card at the bottom encouraging the admin to log in.
          // Contains a heading, subtitle, and a prominent login button.
      }

      <div className="mx-8 mb-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 flex items-center justify-between">
        <div>
          <div className="text-base font-medium text-white mb-1">Ready to manage the platform?</div>
          <div className="text-sm text-[#888888]">Sign in with your admin account to get started.</div>
        </div>
        <Link href="/login" className="bg-[#f05a1a] hover:bg-[#c04010] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
          Admin Login →
        </Link>
      </div>
    </div>
  );
}