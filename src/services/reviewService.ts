import { SelfReviewPayload } from "@/types/review";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function submitSelfReview(
  data: SelfReviewPayload
) {
  const response = await fetch(
    `${API_URL}/reviews/self`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function submitPeerReview(
  data: Record<string, any>
) {
  const response = await fetch(
    `${API_URL}/reviews/peer`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function getHRAnalytics() {
  const response = await fetch(
    `${API_URL}/analytics`
  );

  return response.json();
}




export async function submitManagerReview(
  data: Record<string, any>
) {
  const response = await fetch(
    `${API_URL}/reviews/manager`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function getPerformanceReport(
  employeeId: string
) {
  const response = await fetch(
    `${API_URL}/reports/${employeeId}`
  );

  return response.json();
}
export async function createOKR(
  data: Record<string, unknown>
) {
  const response = await fetch(
    `${API_URL}/okrs`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function getEmployeeOKRs(
  employeeId: string
) {
  const response = await fetch(
    `${API_URL}/okrs/${employeeId}`
  );

  return response.json();
}

export async function createReviewCycle(
  data: {
    name: string;
    startDate: string;
    endDate: string;
    employees: string[];
  }
) {
  const response = await fetch(
    `${API_URL}/cycles`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function getReviewCycles() {
  const response = await fetch(
    `${API_URL}/cycles`
  );

  return response.json();
}