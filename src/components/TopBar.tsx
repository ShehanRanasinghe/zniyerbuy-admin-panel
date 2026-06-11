//TopBar - Header bar for the dashboard pages
    // PURPOSE: Displays a simple header at the top of the dashboard content area.
    // Shows the section title ("Platform Management") on the left and an admin avatar indicator on the right.

//NOTE: This is a server component (no "use client" needed) since it has no client-side interactivity - it's purely presentational.

//TODO: In a future iteration, this could be enhanced with:
    // The logged-in admin's actual name/initials (from auth context)
    // A notification bell icon with unread count
    // A dropdown menu for profile/settings/logout

export default function TopBar() {
  return (
    <header className="h-14 border-b border-[#2a2a2a] flex items-center justify-between px-6 bg-[#0a0a0a]">

      {
        //Section Title - identifies the current area of the panel
      }
      <span className="text-sm text-[#888888]">Platform Management</span>

      {//Admin Avatar - shows a static "A" for Admin
          //In production, this should display the actual admin's initials and link to a profile/logout dropdown menu.
      }
      
      <div className="w-8 h-8 rounded-full bg-[#f05a1a] flex items-center justify-center text-xs font-medium text-white">
        A
      </div>
    </header>
  );
}