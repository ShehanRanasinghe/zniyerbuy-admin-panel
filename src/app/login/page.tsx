
"use client";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d2128] flex items-center justify-center p-6">
      <div className="bg-[#112a33] border border-[#1a4a5a] rounded-2xl p-10 w-full max-w-md">

        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-semibold tracking-wide">
            <span className="text-white">ZNIYER</span>
            <span className="text-[#f0a500]">BUY</span>
          </h1>
          <p className="text-[#1d9e75] text-xs tracking-widest uppercase mt-1">
            Shop Smart, Delivered Fast
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-white text-lg font-medium text-center">Admin Portal</h2>
        <p className="text-[#6b9aaa] text-sm text-center mt-1 mb-7">
          Sign in to manage the platform
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="text-[#8ab4c4] text-xs block mb-2">Email address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7a8a]">
              ✉
            </span>
            <input
              type="email"
              placeholder="admin@zniyerbuy.com"
              className="w-full bg-[#0d2128] border border-[#1d4d5e] rounded-lg py-2.5 pl-9 pr-4 text-sm text-white placeholder-[#3a6070] focus:outline-none focus:border-[#1d9e75]"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-[#8ab4c4] text-xs block mb-2">Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7a8a]">
              🔒
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-[#0d2128] border border-[#1d4d5e] rounded-lg py-2.5 pl-9 pr-10 text-sm text-white placeholder-[#3a6070] focus:outline-none focus:border-[#1d9e75]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a7a8a] text-xs"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button className="w-full bg-[#1d9e75] hover:bg-[#0f6e56] text-white font-medium py-3 rounded-lg text-sm transition-colors">
          Sign in to Admin Panel
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#1a4a5a]"></div>
          <span className="text-[#4a7a8a] text-xs">restricted access</span>
          <div className="flex-1 h-px bg-[#1a4a5a]"></div>
        </div>

        {/* Admin notice */}
        <div className="flex items-center gap-3 bg-[#0d2128] border border-[#1a4a5a] rounded-lg px-4 py-3">
          <span className="text-[#f0a500]">🛡</span>
          <p className="text-[#6b9aaa] text-xs">
            Only accounts with admin role can access this panel
          </p>
        </div>

      </div>
    </div>
  );
}