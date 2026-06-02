"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layouts/DashboardLayout";

import {
  createReviewCycle,
  getReviewCycles,
} from "@/services/reviewService";
import type { ReviewCycle } from "@/types/review";

import { toast } from "sonner";

export default function ReviewCyclesPage() {
  const [cycles, setCycles] =
    useState<ReviewCycle[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      startDate: "",
      endDate: "",
      employees: "",
    });

  async function loadCycles() {
    try {
      const data =
        await getReviewCycles();

      setCycles(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function loadInitialCycles() {
      const data =
        await getReviewCycles();

      setCycles(data);
    }

    void loadInitialCycles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createReviewCycle({
        name: formData.name,

        startDate:
          formData.startDate,

        endDate:
          formData.endDate,

        employees:
          formData.employees
            .split(",")
            .map((emp) =>
              emp.trim()
            ),
      });

      toast.success(
        "Review cycle created"
      );

      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        employees: "",
      });

      await loadCycles();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create cycle"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="hr">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Review Cycles
          </h1>

          <p className="text-zinc-400">
            Create and manage
            review cycles
          </p>
        </div>

        {/* Create Cycle Form */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Create Review Cycle
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Cycle Name"
              value={formData.name}
              onChange={
                handleChange
              }
              className="w-full p-3 rounded-xl bg-zinc-800 text-white"
              required
            />

            <input
              type="date"
              name="startDate"
              value={
                formData.startDate
              }
              onChange={
                handleChange
              }
              className="w-full p-3 rounded-xl bg-zinc-800 text-white"
              required
            />

            <input
              type="date"
              name="endDate"
              value={
                formData.endDate
              }
              onChange={
                handleChange
              }
              className="w-full p-3 rounded-xl bg-zinc-800 text-white"
              required
            />

            <input
              type="text"
              name="employees"
              placeholder="EMP101, EMP102, EMP103"
              value={
                formData.employees
              }
              onChange={
                handleChange
              }
              className="w-full p-3 rounded-xl bg-zinc-800 text-white"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-white"
            >
              {loading
                ? "Creating..."
                : "Create Cycle"}
            </button>
          </form>
        </div>

        {/* Existing Cycles */}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Existing Cycles
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-zinc-300">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="p-3">
                    Name
                  </th>

                  <th className="p-3">
                    Start
                  </th>

                  <th className="p-3">
                    End
                  </th>

                  <th className="p-3">
                    Status
                  </th>

                  <th className="p-3">
                    Employees
                  </th>
                </tr>
              </thead>

              <tbody>
                {cycles.map(
                  (cycle) => (
                    <tr
                      key={
                        cycle.cycleId
                      }
                      className="border-b border-zinc-800"
                    >
                      <td className="p-3">
                        {
                          cycle.name ??
                            cycle.cycleName
                        }
                      </td>

                      <td className="p-3">
                        {
                          cycle.startDate
                        }
                      </td>

                      <td className="p-3">
                        {
                          cycle.endDate
                        }
                      </td>

                      <td className="p-3">
                        {
                          cycle.status
                        }
                      </td>

                      <td className="p-3">
                        {
                          cycle
                            .employees
                            ?.length
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
