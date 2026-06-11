//DashboardLayout - Shared layout wrapper for all dashboard pages

//PURPOSE: Provides the consistent shell (sidebar + top bar) that wraps every page under the /dashboard route. 
// This layout is nested inside the root layout.tsx, so the global fonts and styles still apply.

//STRUCTURE:
  // The Sidebar is fixed-width (w-60) on the left, and the main content area (flex-1) takes the remaining width. The TopBar sits at the top of the content area.

import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">

      {/* Sidebar - Left navigation panel with page links */}

      <Sidebar />
      <div className="flex-1 flex flex-col">

        {/* TopBar - Header bar with title and admin avatar */}

        <TopBar />

        {/* Main Content - Renders the active dashboard page */}

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}