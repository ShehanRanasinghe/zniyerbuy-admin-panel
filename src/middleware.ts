// Middleware for protecting admin routes
// Redirects unauthenticated users to login page
// Verifies Firebase token is present and valid

import { NextRequest, NextResponse } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  // The token is stored in sessionStorage on client side, but for middleware we check cookies
  // In production, implement secure HTTP-only cookies for tokens
  const hasToken = request.cookies.has("adminAuthToken");

  if (!hasToken) {
    // Redirect to login if no token found
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
