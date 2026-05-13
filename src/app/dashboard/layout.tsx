import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
