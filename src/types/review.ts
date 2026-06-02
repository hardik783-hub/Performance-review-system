export interface Review {
  id: string;
  employee: string;
  selfScore: number;
  peerScore: number;
  managerScore: number;
}

export interface SelfReviewPayload {
  employeeId: string;
  achievements: string;
  strengths: string;
  improvements: string;
  rating: number;
}

export interface PerformanceReport {
  employeeId: string;
  selfScore?: number;
  peerAverage?: number;
  managerScore?: number;
  okrScore?: number;
  finalRating?: number;
  totalReviews?: number;
  totalOKRs?: number;
  performanceStatus?: string;
}

export interface ReviewCycle {
  cycleId: string;
  name?: string;
  cycleName?: string;
  startDate: string;
  endDate: string;
  employees?: string[];
  status: string;
}

export interface ReviewCyclePayload {
  name: string;
  startDate: string;
  endDate: string;
  employees: string[];
  status?: string;
}

export interface CognitoUserSummary {
  id: string;
  username: string;
  employeeId: string;
  displayName: string;
  email?: string;
  role: "employee" | "manager" | "hr";
  groups: string[];
}
