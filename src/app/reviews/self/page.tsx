import SelfReviewForm from "@/components/forms/SelfReviewForm";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function SelfReviewPage() {
  return (
    <DashboardLayout>
    <div className="flex bg-black min-h-screen">
      

      <div className="flex-1">
        

        <div className="p-6">
          <SelfReviewForm />
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
