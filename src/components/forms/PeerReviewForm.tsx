"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEmployee } from "@/context/EmployeeContext";
import {
  getCognitoUsers,
  submitPeerReview,
} from "@/services/reviewService";
import type { CognitoUserSummary } from "@/types/review";

interface CurrentUser {
  employeeId?: string;
  username?: string;
}

export default function PeerReviewForm() {
  const { employeeId } =
  useEmployee();
  const [users, setUsers] = useState<CognitoUserSummary[]>(
    []
  );
  const [loadingUsers, setLoadingUsers] =
    useState(true);
  const [formData, setFormData] = useState({
  reviewerId: employeeId,
  employeeId: "",
  feedback: "",
  rating: 3,
  anonymous: true,
});

  useEffect(() => {
    async function loadReviewContext() {
      try {
        const [loadedUsers, meResponse] =
          await Promise.all([
            getCognitoUsers(),
            fetch("/api/auth/me", {
              cache: "no-store",
            }),
          ]);
        const meData = meResponse.ok
          ? ((await meResponse.json()) as {
              user?: CurrentUser;
            })
          : {};

        setUsers(loadedUsers);
        setFormData((current) => ({
          ...current,
          reviewerId:
            meData.user?.employeeId ??
            meData.user?.username ??
            current.reviewerId,
        }));
      } catch (error) {
        console.error(error);
        toast.error("Failed to load Cognito users");
      } finally {
        setLoadingUsers(false);
      }
    }

    loadReviewContext();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.name === "rating"
            ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
const response =
  await submitPeerReview({
    ...formData,
    reviewerId: formData.reviewerId || employeeId,
  });

    console.log(response);

    toast.success(
      "Peer review submitted successfully"
    );
  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to submit peer review"
    );
  }
};

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        Peer Review
      </h2>
      <p className="text-zinc-400 mb-4">
        Current Reviewer: {employeeId}
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="text-zinc-300 block mb-2">
            Select Employee
          </label>

          <select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            disabled={loadingUsers}
            className="w-full bg-zinc-800 text-white rounded-xl p-4 outline-none"
          >
            <option value="">
              {loadingUsers
                ? "Loading Cognito users..."
                : "Choose Employee"}
            </option>
            {users.map((user) => (
              <option
                key={user.id}
                value={user.employeeId}
              >
                {user.displayName} ({user.employeeId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-zinc-300 block mb-2">
            Feedback
          </label>

          <textarea
            name="feedback"
            rows={5}
            onChange={handleChange}
            className="w-full bg-zinc-800 text-white rounded-xl p-4 outline-none"
          />
        </div>

        <div>
          <label className="text-zinc-300 block mb-2">
            Rating
          </label>

          <input
            type="number"
            min="1"
            max="5"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full bg-zinc-800 text-white rounded-xl p-4 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.anonymous}
            name="anonymous"
            onChange={handleChange}
          />

          <label className="text-zinc-300">
            Anonymous Review
          </label>
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl text-white font-semibold"
        >
          Submit Peer Review
        </button>
      </form>
    </div>
  );
}
