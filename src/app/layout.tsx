//RootLayout - Top-level layout wrapper for the entire admin panel

// PURPOSE: Defines the HTML document structure, loads Google Fonts (Geist Sans and Geist Mono), sets up global CSS variables for font families, applies antialiasing, and imports the global stylesheet.
// NOTE: This layout wraps ALL pages (landing, login, and dashboard).
// The dashboard has its own nested layout with Sidebar + TopBar.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

//FONT CONFIGURATION — Google Fonts via next/font
    //  Geist Sans: Used for body/UI text (set as --font-geist-sans CSS variable)
    //  Geist Mono: Used for monospaced/code elements (set as --font-geist-mono)
    //  Both use the "latin" subset for optimal bundle size.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//SEO METADATA - Page title and description for search engines
    //This metadata applies to all pages unless overridden by a nested layout.

export const metadata: Metadata = {
  title: "ZniyerBuy Admin Panel - Platform Management",
  description: "Admin dashboard for managing users, shops, products, and deals on the ZniyerBuy.",
};

//ROOT LAYOUT COMPONENT
    // Sets the HTML lang attribute for accessibility
    // Applies font CSS variable classes to <html> for global access
    // Uses h-full + antialiased for consistent full-height rendering
    // The <body> uses min-h-full + flex-col so pages fill the viewport
    
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
