"use client";

import { useEffect, useState } from "react";

import StatsCard from "@/components/dashboard/StatsCard";
import CompletionChart from "@/components/charts/CompletionChart";
import HRLayout from "@/components/layouts/HRLayout";

import {
  getHRAnalytics,
} from "@/services/reviewService";

interface HRAnalytics {
  totalReviews: number;
  employeesReviewed: number;
  averageRating: number;
  topPerformer: string;
  topPerformerScore: number;
}

export default function HRDashboard() {
  const [analytics, setAnalytics] =
    useState<HRAnalytics | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data =
          await getHRAnalytics();

        console.log(data);

        setAnalytics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <HRLayout>
        <p className="text-white">
          Loading analytics...
        </p>
      </HRLayout>
    );
  }

  if (!analytics) {
    return (
      <HRLayout>
        <p className="text-red-500">
          Failed to load analytics
        </p>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            HR Analytics Dashboard
          </h1>

          <p className="text-zinc-400 mt-2">
            Real-time workforce insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Reviews"
            value={analytics.totalReviews.toString()}
          />

          <StatsCard
            title="Employees Reviewed"
            value={analytics.employeesReviewed.toString()}
          />

          <StatsCard
            title="Average Rating"
            value={analytics.averageRating.toString()}
          />

          <StatsCard
            title="Top Performer"
            value={analytics.topPerformer}
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Top Performer Insights
          </h2>

          <div className="space-y-2 text-zinc-300">
            <p>
              Employee:
              {" "}
              {analytics.topPerformer}
            </p>

            <p>
              Average Score:
              {" "}
              {analytics.topPerformerScore}
            </p>
          </div>
        </div>

        <CompletionChart />
      </div>
    </HRLayout>
  );
}
