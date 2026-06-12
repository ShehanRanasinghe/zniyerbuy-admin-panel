"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAdmin, getCurrentUser } from "@/lib/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function TopBar() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState("A");

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserEmail(user.email);
      setUserInitials((user.email || "A").charAt(0).toUpperCase());
    }
  }, []);

  const handleLogout = async () => {
    setShowDropdown(false);
    const { error } = await logoutAdmin();
    if (error) { alert("Logout failed: " + error); return; }
    router.push("/login");
  };

  return (
    <header className="h-13 border-b border-[#1a1a1a] flex items-center justify-between px-6 bg-[#080808] flex-shrink-0">
      <span className="text-xs text-[#444] font-medium tracking-wider uppercase">Platform Management</span>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-full bg-[#f05a1a] flex items-center justify-center text-xs font-semibold text-white">
            {userInitials}
          </div>
          <FontAwesomeIcon icon={faChevronDown} className={`w-3 h-3 text-[#555] transition-transform ${showDropdown ? "rotate-180" : ""}`} />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-52 bg-[#111] border border-[#222] rounded-xl shadow-xl overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2 mb-0.5">
                <FontAwesomeIcon icon={faUser} className="w-3 h-3 text-[#555]" />
                <span className="text-xs text-[#555]">Logged in as</span>
              </div>
              <p className="text-sm text-white truncate font-medium">{userEmail || "Admin"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm text-[#e24b4a] hover:bg-[#1a0a0a] transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
      )}
    </header>
  );
}
