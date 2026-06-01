"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import HRLayout from "@/components/layouts/HRLayout";
import {
  createReviewCycle,
  getReviewCycles,
} from "@/services/reviewService";

interface ReviewCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  employees: string[];
}

interface CycleFormData {
  name: string;
  startDate: string;
  endDate: string;
  employees: string;
}

const emptyForm: CycleFormData = {
  name: "",
  startDate: "",
  endDate: "",
  employees: "",
};

export default function HRCyclesPage() {
  const [cycles, setCycles] = useState<ReviewCycle[]>([]);
  const [formData, setFormData] =
    useState<CycleFormData>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadCycles(
    showLoading = false
  ) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const data = await getReviewCycles();

      setCycles(normalizeCycles(data));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load review cycles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function fetchCycles() {
      try {
        const data = await getReviewCycles();

        if (!ignore) {
          setCycles(normalizeCycles(data));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load review cycles");
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchCycles();

    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const employees = parseEmployees(
      formData.employees
    );

    try {
      setSubmitting(true);

      await createReviewCycle({
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        employees,
        status: "ACTIVE",
      });

      toast.success("Review cycle created");
      setFormData(emptyForm);
      await loadCycles();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create review cycle");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <HRLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Review Cycles
          </h1>

          <p className="mt-1 text-zinc-400">
            Create and manage review cycles
          </p>
        </div>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-xl font-semibold text-white">
            Create Review Cycle
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Cycle Name"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-800 p-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500"
            />

            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-800 p-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500"
            />

            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-800 p-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500"
            />

            <input
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              placeholder="EMP101, EMP102, EMP103"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-800 p-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500"
            />

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Creating..."
                : "Create Cycle"}
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white">
              Existing Cycles
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="text-sm text-zinc-400">
                <tr className="border-b border-zinc-800">
                  <th className="px-6 py-4 font-medium">
                    Name
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Start
                  </th>
                  <th className="px-6 py-4 font-medium">
                    End
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Employees
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                {loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-5 text-zinc-400"
                    >
                      Loading cycles...
                    </td>
                  </tr>
                )}

                {!loading && cycles.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-5 text-zinc-400"
                    >
                      No review cycles found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  cycles.map((cycle) => (
                    <tr key={cycle.id}>
                      <td className="px-6 py-4 text-white">
                        {cycle.name}
                      </td>
                      <td className="px-6 py-4">
                        {cycle.startDate}
                      </td>
                      <td className="px-6 py-4">
                        {cycle.endDate}
                      </td>
                      <td className="px-6 py-4">
                        {cycle.status}
                      </td>
                      <td className="px-6 py-4">
                        {cycle.employees.length}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </HRLayout>
  );
}

function normalizeCycles(data: unknown) {
  const rawCycles = getCycleArray(data);

  return rawCycles.map((cycle, index) => {
    const employees = getEmployees(cycle);
    const name =
      getString(cycle, ["name", "cycleName"]) ||
      `Review Cycle ${index + 1}`;

    return {
      id:
        getString(cycle, ["id", "cycleId"]) ||
        `${name}-${index}`,
      name,
      startDate:
        getString(cycle, ["startDate", "start"]) ||
        "-",
      endDate:
        getString(cycle, ["endDate", "end"]) ||
        "-",
      status:
        getString(cycle, ["status"]) ||
        "ACTIVE",
      employees,
    };
  });
}

function getCycleArray(data: unknown) {
  if (Array.isArray(data)) {
    return data.filter(isRecord);
  }

  if (!isRecord(data)) {
    return [];
  }

  const cycles = data.cycles ?? data.Items;

  return Array.isArray(cycles)
    ? cycles.filter(isRecord)
    : [];
}

function getEmployees(
  cycle: Record<string, unknown>
) {
  const value =
    cycle.employees ??
    cycle.employeeIds ??
    cycle.assignedEmployees;

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "string"
          ? item
          : getDynamoString(item)
      )
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return parseEmployees(value);
  }

  if (
    isRecord(value) &&
    Array.isArray(value.L)
  ) {
    return value.L
      .map(getDynamoString)
      .filter(Boolean);
  }

  return [];
}

function parseEmployees(value: string) {
  return value
    .split(",")
    .map((employee) => employee.trim())
    .filter(Boolean);
}

function getString(
  source: Record<string, unknown>,
  keys: string[]
) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "string") {
      return value;
    }

    const dynamoValue = getDynamoString(value);

    if (dynamoValue) {
      return dynamoValue;
    }
  }

  return "";
}

function getDynamoString(value: unknown) {
  if (!isRecord(value)) {
    return "";
  }

  if (typeof value.S === "string") {
    return value.S;
  }

  if (typeof value.N === "string") {
    return value.N;
  }

  return "";
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}
