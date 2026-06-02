import StatsCard from "@/components/dashboard/StatsCard";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function EmployeeDashboard() {
  return (
    <DashboardLayout>
    <div className="flex bg-black min-h-screen">
      

      <div className="flex-1">
        

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Completed Reviews"
            value="12"
          />

          <StatsCard
            title="Pending Reviews"
            value="3"
          />

          <StatsCard
            title="Current Rating"
            value="4.5"
          />
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
