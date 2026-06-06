// LoginPage - Admin authentication page 

//PURPOSE: Provides a login form for administrators to authenticate before accessing the dashboard. Features email and password inputs with a show/hide password toggle.

//CURRENT STATUS: 
    // The form collects email and password values in local state but does NOT yet submit them to any backend API. 
    // The login button currently has no onClick handler — authentication integration is pending.

//TODO: Connect this form to the backend auth endpoint (e.g., Supabase Auth or a custom JWT API) to validate admin credentials. On success, redirect to /dashboard. On failure, show an error message below the form.

"use client";
import { useState } from "react";

export default function LoginPage() {

  //Form State
      // email        - tracks the email input field value
      // password     - tracks the password input field value
      // showPassword - toggles between password masking and plain text display
   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">

      {//Login Card Container
          // A centered card with the brand logo, form inputs, and action button.
          // Max width is capped at md (28rem) for readability on large screens.
      }

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-10 w-full max-w-md">

        {//Brand Header
          // Displays the ZNIYERBUY logo in brand colors and the tagline.
          // This reinforces the platform identity on the login screen.
        }

        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-semibold tracking-wide">
            <span className="text-[#f05a1a]">ZNIYER</span>
            <span className="text-[#1a8a8a]">BUY</span>
          </h1>
          <p className="text-[#f05a1a] text-xs tracking-widest uppercase mt-1">
            Bringing The Cart To Your Doorstep
          </p>
        </div>

        {//Form Title
            // "Admin Portal" heading with a subtitle prompting the user to sign in.
        }

        <h2 className="text-white text-lg font-medium text-center">Admin Portal</h2>
        <p className="text-[#888888] text-sm text-center mt-1 mb-7">Sign in to manage the platform</p>

        {//Email Input Field
            // Controlled input bound to the `email` state.
            // Uses an envelope icon as a visual prefix indicator.
            //
        }

        <div className="mb-5">
          <label className="text-[#aaaaaa] text-xs block mb-2">Email address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]">✉</span>
            <input type="email" placeholder="admin@zniyerbuy.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-2.5 pl-9 pr-4 text-sm text-white placeholder-[#444444] focus:outline-none focus:border-[#f05a1a]" />
          </div>
        </div>

        {//Password Input Field
            // Controlled input bound to the `password` state.
            // Includes a show/hide toggle button that switches the input type between "password" (masked) and "text" (visible).
        }

        <div className="mb-6">
          <label className="text-[#aaaaaa] text-xs block mb-2">Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]">🔒</span>
            <input type={showPassword ? "text" : "password"} placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-2.5 pl-9 pr-10 text-sm text-white placeholder-[#444444] focus:outline-none focus:border-[#f05a1a]" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] text-xs">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {//Submit Button
            // TODO: Add onClick handler to submit email + password to the authentication API. Should handle loading state and error display.
            // Currently this button is non-functional (no auth backend connected).
         }

        <button className="w-full bg-[#f05a1a] hover:bg-[#c04010] text-white font-medium py-3 rounded-lg text-sm transition-colors">
          Sign in to Admin Panel
        </button>

        {//Divider
            //Visual separator between the form and the security notice below.
            //The "restricted access" text signals this is an admin-only portal.
        }

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#2a2a2a]"></div>
          <span className="text-[#666666] text-xs">restricted access</span>
          <div className="flex-1 h-px bg-[#2a2a2a]"></div>
        </div>

        {//Security Notice
            //An info banner reminding users that only admin-role accounts can access the panel. This helps prevent confusion for non-admins.
        }
        
        <div className="flex items-center gap-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3">
          <span className="text-[#f05a1a]">🛡</span>
          <p className="text-[#888888] text-xs">Only accounts with admin role can access this panel</p>
        </div>
      </div>
    </div>
  );
}