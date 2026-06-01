import HRLayout from "@/components/layouts/HRLayout";
import ReportCard from "@/components/dashboard/ReportCard";
import { reportData } from "@/data/report";

const departmentReports = [
  {
    department: "Engineering",
    employeesReviewed: 42,
    averageRating: 4.3,
    completion: "90%",
    status: "On Track",
  },
  {
    department: "HR",
    employeesReviewed: 12,
    averageRating: 4.1,
    completion: "75%",
    status: "In Progress",
  },
  {
    department: "Sales",
    employeesReviewed: 28,
    averageRating: 3.9,
    completion: "60%",
    status: "Needs Follow-up",
  },
];

export default function HRReportsPage() {
  return (
    <HRLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            HR Reports
          </h1>

          <p className="mt-2 text-zinc-400">
            Organization-level review outcomes and department summaries
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <ReportCard
            title="Average Rating"
            value={reportData.finalRating.toString()}
          />

          <ReportCard
            title="Self Score"
            value={reportData.selfScore.toString()}
          />

          <ReportCard
            title="Peer Score"
            value={reportData.peerScore.toString()}
          />

          <ReportCard
            title="Manager Score"
            value={reportData.managerScore.toString()}
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white">
              Department Reports
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-zinc-950 text-sm text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">
                    Department
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Employees Reviewed
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Average Rating
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Completion
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {departmentReports.map((report) => (
                  <tr key={report.department}>
                    <td className="px-6 py-4 text-white">
                      {report.department}
                    </td>
                    <td className="px-6 py-4">
                      {report.employeesReviewed}
                    </td>
                    <td className="px-6 py-4">
                      {report.averageRating}
                    </td>
                    <td className="px-6 py-4">
                      {report.completion}
                    </td>
                    <td className="px-6 py-4">
                      {report.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HRLayout>
  );
}
