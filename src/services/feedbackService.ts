import { request } from "./apiClient";

/**
 * READ — ดึงรายการ feedbacks พร้อม filter (branch, category, rating)
 */
export async function fetchFeedbacks(params: any = {}) {
  const query = new URLSearchParams();
  if (params.branch) query.append("branch", params.branch);
  if (params.category) query.append("category", params.category);
  if (params.rating) query.append("rating", params.rating);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  const qs = query.toString();
  return request(`/api/feedbacks${qs ? `?${qs}` : ""}`);
}

/**
 * READ — ดึงข้อมูลสถิติ feedbacks สำหรับวาดกราฟ (avg_rating, sentiments, weekly_csat)
 */
export async function fetchFeedbackStats(branch: string) {
  const url = branch
    ? `/api/feedbacks/stats?branch=${encodeURIComponent(branch)}`
    : '/api/feedbacks/stats';
  return request(url);
}
