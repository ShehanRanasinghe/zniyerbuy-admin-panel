// HomePage - Landing page for the ZniyerBuy Admin Panel

// PURPOSE: Professional landing page that introduces the admin panel to authorized administrators.
// Showcases key features and provides navigation to the login page.

// NOTE: This is a client component to use Font Awesome icons with proper rendering.

"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faStore,
  faChartLine,
  faShieldHalved,
  faGear,
  faBell,
  faArrowRight,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      {/* Top Navigation Bar - Responsive header with brand and login CTA */}
      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b border-[#2a2a2a]">
        <div className="text-lg sm:text-xl font-semibold tracking-wide">
          <span className="text-[#f05a1a]">ZNIYER</span>
          <span className="text-[#1a8a8a]">BUY</span>
        </div>
        <Link
          href="/login"
          className="bg-[#f05a1a] hover:bg-[#c04010] text-white text-xs sm:text-sm font-medium px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <FontAwesomeIcon icon={faLock} className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Admin Login</span>
        </Link>
      </nav>

      {/* Hero Section - Main headline and value proposition */}
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
        <div className="bg-[#2a1a0a] text-[#f05a1a] border border-[#f05a1a]/30 text-xs sm:text-sm px-4 py-2 rounded-full mb-6 tracking-wide inline-flex items-center gap-2 backdrop-blur-sm">
          <FontAwesomeIcon icon={faShieldHalved} className="w-3 h-3" />
          <span>Sri Lanka's Grocery Platform</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 sm:mb-6 max-w-4xl">
          Manage Your Platform with{" "}
          <span className="text-[#f05a1a] relative">
            Confidence
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#f05a1a]/20 rounded"></span>
          </span>
        </h1>
        
        <p className="text-[#888888] text-sm sm:text-base max-w-2xl leading-relaxed mb-8 sm:mb-10 px-4">
          ZniyerBuy Admin Panel gives you full control over users, shops, products, and deals. 
          Streamline operations, monitor performance, and make data-driven decisions all in one place.
        </p>
        
        <Link
          href="/login"
          className="bg-[#f05a1a] hover:bg-[#c04010] text-white text-sm sm:text-base font-semibold px-8 sm:px-10 py-3 sm:py-4 rounded-lg transition-all duration-200 flex items-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105 transform"
        >
          <span>Access Admin Panel</span>
          <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
        </Link>
      </div>

      {/* Features Section - Key capabilities showcase */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-white text-center mb-3">
            Everything You Need to Run the Platform
          </h2>
          <p className="text-[#888888] text-sm sm:text-base text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
            Powerful tools designed for efficient platform management
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: faUsers,
                title: "User Management",
                desc: "View, manage, and assign roles to all registered users on the platform with comprehensive access controls.",
                color: "text-[#f05a1a]",
                bgColor: "bg-[#f05a1a]/10",
              },
              {
                icon: faStore,
                title: "Shop Verification",
                desc: "Review and verify shop registrations, approve or reject applications, and maintain quality standards.",
                color: "text-[#1a8a8a]",
                bgColor: "bg-[#1a8a8a]/10",
              },
              {
                icon: faChartLine,
                title: "Analytics & Insights",
                desc: "Track platform performance with real-time analytics and make informed decisions based on data.",
                color: "text-[#f05a1a]",
                bgColor: "bg-[#f05a1a]/10",
              },
              {
                icon: faGear,
                title: "System Configuration",
                desc: "Configure platform settings, manage integrations, and customize the user experience.",
                color: "text-[#1a8a8a]",
                bgColor: "bg-[#1a8a8a]/10",
              },
              {
                icon: faShieldHalved,
                title: "Security & Compliance",
                desc: "Monitor security events, manage permissions, and ensure platform compliance with regulations.",
                color: "text-[#f05a1a]",
                bgColor: "bg-[#f05a1a]/10",
              },
              {
                icon: faBell,
                title: "Notifications",
                desc: "Stay updated with real-time alerts for critical events, user activities, and system updates.",
                color: "text-[#1a8a8a]",
                bgColor: "bg-[#1a8a8a]/10",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#3a3a3a] transition-all duration-200 hover:transform hover:scale-105 group"
              >
                <div
                  className={`${feature.bgColor} ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <FontAwesomeIcon icon={feature.icon} className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call-To-Action Banner - Final conversion prompt */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#1a1a1a] to-[#2a1a1a] border border-[#2a2a2a] rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              Ready to Manage the Platform?
            </h3>
            <p className="text-sm sm:text-base text-[#888888]">
              Sign in with your admin account to access the dashboard and start managing.
            </p>
          </div>
          <Link
            href="/login"
            className="bg-[#f05a1a] hover:bg-[#c04010] text-white text-sm sm:text-base font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl whitespace-nowrap hover:scale-105 transform"
          >
            <span>Get Started</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto text-center text-[#666666] text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} ZniyerBuy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}