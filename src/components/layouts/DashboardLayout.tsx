import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "employee" | "hr" | "manager";
}

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar role={role} />

      <div className="flex-1">
        <Navbar role={role} />

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
