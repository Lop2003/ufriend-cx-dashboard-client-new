import { request } from "./apiClient";
import type { Feedback, FetchFeedbacksParams, FeedbackStats } from "../types";

/**
 * READ — ดึงรายการ feedbacks พร้อม filter (branch, category, rating)
 */
export async function fetchFeedbacks(params: FetchFeedbacksParams = {}): Promise<Feedback[]> {
  const query = new URLSearchParams();
  if (params.branch) query.append("branch", params.branch);
  if (params.category) query.append("category", params.category);
  if (params.rating) query.append("rating", params.rating);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  const qs = query.toString();
  return request<Feedback[]>(`/api/feedbacks${qs ? `?${qs}` : ""}`);
}

/**
 * READ — ดึงข้อมูลสถิติ feedbacks สำหรับวาดกราฟ (avg_rating, sentiments, weekly_csat)
 */
export async function fetchFeedbackStats(branch: string, period?: string): Promise<FeedbackStats> {
  const params = new URLSearchParams();
  if (branch) params.append('branch', branch);
  if (period) params.append('period', period);
  const qs = params.toString();
  return request<FeedbackStats>(`/api/feedbacks/stats${qs ? `?${qs}` : ''}`);
}

