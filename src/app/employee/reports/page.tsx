"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layouts/DashboardLayout";

import ReportCard from "@/components/dashboard/ReportCard";

import {
  getPerformanceReport,
} from "@/services/reviewService";
import type { PerformanceReport } from "@/types/review";

export default function ReportPage() {
  const [report, setReport] =
    useState<PerformanceReport | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const data =
          await getPerformanceReport(
            "EMP101"
          );

        console.log(data);

        setReport(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-white">
          Loading report...
        </p>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        <p className="text-red-500">
          Failed to load report
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Performance Report
          </h1>

          <p className="text-zinc-400 mt-2">
            Real-time AWS-generated
            analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
  <ReportCard
    title="Self Review"
    value={report.selfScore?.toString() ?? "N/A"}
  />

  <ReportCard
    title="Peer Average"
    value={report.peerAverage?.toString() ?? "N/A"}
  />

  <ReportCard
    title="Manager Score"
    value={report.managerScore?.toString() ?? "N/A"}
  />

  <ReportCard
    title="OKR Score"
    value={report.okrScore?.toString() ?? "N/A"}
  />

  <ReportCard
    title="Final Rating"
    value={report.finalRating?.toString() ?? "N/A"}
  />
</div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-white text-xl font-semibold mb-4">
            Report Summary
          </h2>

          <div className="space-y-3 text-zinc-300">
  <p>
    Employee ID: {report.employeeId}
  </p>

  <p>
    Total Reviews: {report.totalReviews}
  </p>

  <p>
    Total OKRs: {report.totalOKRs}
  </p>

  <p>
    Performance Status:
    {" "}
    {report.performanceStatus}
  </p>

  <p>
    Final Performance Rating:
    {" "}
    {report.finalRating}/5
  </p>
</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
