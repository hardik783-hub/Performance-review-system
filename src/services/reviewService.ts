import {
  CognitoUserSummary,
  SelfReviewPayload,
} from "@/types/review";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

function getApiUrl(path: string) {
  return API_URL
    ? `${API_URL}${path}`
    : path;
}

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
  data: Record<string, unknown>
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
    getApiUrl("/analytics")
  );

  return response.json();
}

export interface ReviewCyclePayload {
  name: string;
  startDate: string;
  endDate: string;
  employees: string[];
  status: string;
}

export async function getReviewCycles() {
  const response = await fetch(
    getApiUrl("/cycles")
  );

  if (!response.ok) {
    throw new Error("Failed to load review cycles");
  }

  return response.json() as Promise<unknown>;
}

export async function createReviewCycle(
  data: ReviewCyclePayload
) {
  const response = await fetch(
    getApiUrl("/cycles"),
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        ...data,
        cycleName: data.name,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create review cycle");
  }

  return response.json() as Promise<unknown>;
}




export async function submitManagerReview(
  data: Record<string, unknown>
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

export async function getCognitoUsers() {
  const response = await fetch("/api/users", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load Cognito users");
  }

  const data = (await response.json()) as {
    users: CognitoUserSummary[];
  };

  return data.users;
}
