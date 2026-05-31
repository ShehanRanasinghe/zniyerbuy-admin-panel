"use client";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-semibold tracking-wide">
            <span className="text-[#f05a1a]">ZNIYER</span>
            <span className="text-[#1a8a8a]">BUY</span>
          </h1>
          <p className="text-[#f05a1a] text-xs tracking-widest uppercase mt-1">
            Bringing The Cart To Your Doorstep
          </p>
        </div>
        <h2 className="text-white text-lg font-medium text-center">Admin Portal</h2>
        <p className="text-[#888888] text-sm text-center mt-1 mb-7">Sign in to manage the platform</p>
        <div className="mb-5">
          <label className="text-[#aaaaaa] text-xs block mb-2">Email address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]">✉</span>
            <input type="email" placeholder="admin@zniyerbuy.com"
              className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-2.5 pl-9 pr-4 text-sm text-white placeholder-[#444444] focus:outline-none focus:border-[#f05a1a]" />
          </div>
        </div>
        <div className="mb-6">
          <label className="text-[#aaaaaa] text-xs block mb-2">Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]">🔒</span>
            <input type={showPassword ? "text" : "password"} placeholder="••••••••"
              className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-2.5 pl-9 pr-10 text-sm text-white placeholder-[#444444] focus:outline-none focus:border-[#f05a1a]" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] text-xs">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button className="w-full bg-[#f05a1a] hover:bg-[#c04010] text-white font-medium py-3 rounded-lg text-sm transition-colors">
          Sign in to Admin Panel
        </button>
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#2a2a2a]"></div>
          <span className="text-[#666666] text-xs">restricted access</span>
          <div className="flex-1 h-px bg-[#2a2a2a]"></div>
        </div>
        <div className="flex items-center gap-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3">
          <span className="text-[#f05a1a]">🛡</span>
          <p className="text-[#888888] text-xs">Only accounts with admin role can access this panel</p>
        </div>
      </div>
    </div>
  );
}