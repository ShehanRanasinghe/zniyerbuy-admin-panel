// LoginPage - Admin authentication page

// PURPOSE: Authenticates admins using Firebase. Credentials are verified by Firebase auth,
// then the backend validates the user role and returns admin profile data.

// AUTHENTICATION FLOW:
//   1. User enters email and password
//   2. Firebase authenticates the credentials
//   3. Firebase returns an ID token
//   4. Backend validates the token and checks admin role
//   5. If authorized, redirect to dashboard

// FEATURES:
//   - Email and password inputs with show/hide toggle
//   - Form validation and error handling
//   - Loading state during authentication
//   - Role-based access control (admin-only)
//   - Automatic redirect to dashboard on success
//   - Error message display on failed login

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/auth";

export default function LoginPage() {

  // Form state management
  // email        - tracks the email input field value
  // password     - tracks the password input field value
  // showPassword - toggles between password masking and plain text display
  // error        - displays authentication error messages
  // loading      - tracks Firebase auth status to disable button during submission
   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle form submission and authentication
  // Validates input, calls Firebase + backend auth, and redirects on success
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous errors
    setError("");
    
    // Validate input fields
    if (!email.trim()) {
      setError("Email address is required");
      return;
    }
    
    if (!password) {
      setError("Password is required");
      return;
    }

    // Set loading state and call authentication
    setLoading(true);
    const { error: authError, data } = await loginAdmin(email, password);
    setLoading(false);

    if (authError) {
      // Display error message on failed authentication
      setError(authError);
      return;
    }

    // Successfully authenticated - redirect to dashboard
    if (data) {
      router.push("/dashboard");
    }
  };

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
            // Disabled during API call (loading state)
            // Handles form submission and authentication
         }

        <button 
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#f05a1a] hover:bg-[#c04010] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg text-sm transition-colors">
          {loading ? "Signing in..." : "Sign in to Admin Panel"}
        </button>

        {//Error Message Display
            // Shows authentication errors in red banner below the submit button
            // Only rendered if error state is not empty
        }

        {error && (
          <div className="mt-4 p-3 bg-[#2a1a1a] border border-[#e24b4a] rounded-lg">
            <p className="text-[#e24b4a] text-xs text-center">{error}</p>
          </div>
        )}

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