"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash, faShield } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email address is required"); return; }
    if (!password) { setError("Password is required"); return; }
    setLoading(true);
    const { error: authError, data } = await loginAdmin(email, password);
    setLoading(false);
    if (authError) { setError(authError); return; }
    if (data) router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="bg-[#111] border border-[#222] rounded-2xl p-10 w-full max-w-md shadow-2xl">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold tracking-wide">
            <span className="text-[#f05a1a]">ZNIYER</span>
            <span className="text-[#1a8a8a]">BUY</span>
          </h1>
          <p className="text-[#f05a1a] text-xs tracking-widest uppercase mt-1 font-medium">
            Bringing The Cart To Your Doorstep
          </p>
        </div>

        <h2 className="text-white text-lg font-semibold text-center">Admin Portal</h2>
        <p className="text-[#666] text-sm text-center mt-1 mb-7">Sign in to manage the platform</p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-5">
            <label className="text-[#888] text-xs block mb-2 font-medium">Email address</label>
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
              <input
                type="email"
                placeholder="admin@zniyerbuy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg py-2.5 pl-9 pr-4 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#f05a1a] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-[#888] text-xs block mb-2 font-medium">Password</label>
            <div className="relative">
              <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#555]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg py-2.5 pl-9 pr-10 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#f05a1a] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f05a1a] hover:bg-[#c04010] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm transition-colors"
          >
            {loading ? "Signing in..." : "Sign in to Admin Panel"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-[#2a1a1a] border border-[#e24b4a] rounded-lg">
            <p className="text-[#e24b4a] text-xs text-center">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#1a1a1a]" />
          <span className="text-[#444] text-xs">restricted access</span>
          <div className="flex-1 h-px bg-[#1a1a1a]" />
        </div>

        <div className="flex items-center gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3">
          <FontAwesomeIcon icon={faShield} className="w-4 h-4 text-[#f05a1a] flex-shrink-0" />
          <p className="text-[#555] text-xs">Only accounts with admin role can access this panel</p>
        </div>
      </div>
    </div>
  );
}
