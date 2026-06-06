import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-[#2a2a2a]">
        <div className="text-xl font-semibold tracking-wide">
          <span className="text-[#f05a1a]">ZNIYER</span>
          <span className="text-[#1a8a8a]">BUY</span>
        </div>
        <Link href="/login" className="bg-[#f05a1a] hover:bg-[#c04010] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
          Admin Login →
        </Link>
      </nav>
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