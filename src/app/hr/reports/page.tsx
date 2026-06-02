"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";

const employees = [
  "EMP101",
  "EMP102",
  "EMP103",
];

export default function ReportsPage() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL;

  const openJsonReport = (
    employeeId: string
  ) => {
    window.open(
      `${apiUrl}/reports/${employeeId}`,
      "_blank"
    );
  };

  const openHtmlReport = (
    employeeId: string
  ) => {
    window.open(
      `${apiUrl}/report-html/${employeeId}`,
      "_blank"
    );
  };

  return (
    <DashboardLayout role="hr">
      <div className="p-6">
        <h1 className="text-4xl font-bold text-white mb-8">
          Employee Reports
        </h1>

        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-4 text-white">
                  Employee ID
                </th>

                <th className="text-left p-4 text-white">
                  Analytics Report
                </th>

                <th className="text-left p-4 text-white">
                  HTML Report
                </th>
              </tr>
            </thead>

            <tbody>
              {employees.map(
                (employeeId) => (
                  <tr
                    key={employeeId}
                    className="border-b border-zinc-800"
                  >
                    <td className="p-4 text-zinc-300">
                      {employeeId}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
                          openJsonReport(
                            employeeId
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        View Analytics
                      </button>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
                          openHtmlReport(
                            employeeId
                          )
                        }
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                      >
                        View HTML Report
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
