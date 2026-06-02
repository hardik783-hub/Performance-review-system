import OKRCard from "@/components/dashboard/OKRCard";

import { okrs } from "@/data/okrs";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function OKRPage() {
  return (
    <DashboardLayout>
    <div className="flex bg-black min-h-screen">
      

      <div className="flex-1">
        

        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-white">
            OKR Tracker
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {okrs.map((okr) => (
              <OKRCard
                key={okr.id}
                objective={okr.objective}
                progress={okr.progress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
