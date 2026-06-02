"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useEmployee } from "@/context/EmployeeContext";

import { submitSelfReview } from "@/services/reviewService";

export default function SelfReviewForm() {
  const [loading, setLoading] = useState(false);

  const { employeeId } =
  useEmployee();

const [formData, setFormData] = useState({
  employeeId,
  achievements: "",
  strengths: "",
  improvements: "",
  rating: 3,
});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "rating"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
  await submitSelfReview({
    ...formData,
    employeeId,
  });

      console.log(response);

      toast.success(
        "Review submitted successfully"
      );

      // Optional: Reset form after submission
      setFormData({
  employeeId,
  achievements: "",
  strengths: "",
  improvements: "",
  rating: 3,
});
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-white mb-6">
        Self Review
      </h2>
      <p className="text-zinc-400 mb-4">
        Current Employee: {employeeId}
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Achievements */}
        <div>
          <label className="text-zinc-300 block mb-2">
            Achievements
          </label>

          <textarea
            name="achievements"
            rows={4}
            value={formData.achievements}
            onChange={handleChange}
            placeholder="Describe your key achievements..."
            className="w-full bg-zinc-800 text-white rounded-xl p-4 outline-none border border-zinc-700 focus:border-purple-500 transition"
          />
        </div>

        {/* Strengths */}
        <div>
          <label className="text-zinc-300 block mb-2">
            Strengths
          </label>

          <textarea
            name="strengths"
            rows={4}
            value={formData.strengths}
            onChange={handleChange}
            placeholder="Describe your strengths..."
            className="w-full bg-zinc-800 text-white rounded-xl p-4 outline-none border border-zinc-700 focus:border-purple-500 transition"
          />
        </div>

        {/* Improvements */}
        <div>
          <label className="text-zinc-300 block mb-2">
            Areas of Improvement
          </label>

          <textarea
            name="improvements"
            rows={4}
            value={formData.improvements}
            onChange={handleChange}
            placeholder="Mention areas you want to improve..."
            className="w-full bg-zinc-800 text-white rounded-xl p-4 outline-none border border-zinc-700 focus:border-purple-500 transition"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="text-zinc-300 block mb-2">
            Rating (1–5)
          </label>

          <input
            type="number"
            min="1"
            max="5"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full bg-zinc-800 text-white rounded-xl p-4 outline-none border border-zinc-700 focus:border-purple-500 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Submitting..."
            : "Submit Review"}
        </button>
      </form>
    </div>
  );
}