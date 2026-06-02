import PeerReviewForm from "@/components/forms/PeerReviewForm";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function PeerReviewPage() {
  return (
    <DashboardLayout>
    <div className="flex bg-black min-h-screen">
      

      <div className="flex-1">
        

        <div className="p-6">
          <PeerReviewForm />
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
