// ============================
// Shared Type Definitions
// ============================
// ออกแบบจาก backend models (customer.go, feedback.go, follow_up.go)
// ใช้แทน `any` ทุกตำแหน่งใน hooks, services, และ components

// ── Customer ──────────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  phone: string;
  product: string;
  branch: string;
  plan_months: number;
  status: string;
  created_at: string;
  /** Populated by detail endpoint */
  feedbacks?: Feedback[];
  follow_ups?: FollowUp[];
}

export interface FetchCustomersParams {
  search?: string;
  branch?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCustomers {
  items: Customer[];
  total: number;
  total_pages: number;
  page: number;
  limit: number;
}

// ── Feedback ──────────────────────────────────────────────────

export interface Feedback {
  id: string;
  customer_id: string;
  branch: string;
  rating: number;
  comment: string;
  category: string;
  sentiment: string;
  created_at: string;
  /** Populated by join in some endpoints */
  customer_name?: string;
}

export interface FetchFeedbacksParams {
  branch?: string;
  category?: string;
  rating?: string;
  page?: string;
  limit?: string;
}

export interface CreateFeedbackPayload {
  customer_id: string;
  rating: number;
  comment: string;
  category: string;
}

export interface FeedbackStats {
  avg_rating: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  weekly_csat: number[];
}

// ── Follow-up ─────────────────────────────────────────────────

export interface FollowUp {
  id: string;
  customer_id: string;
  type: string;
  note: string;
  status: string;
  created_at: string;
}

export interface CreateFollowUpPayload {
  customer_id: string;
  type: string;
  note: string;
}

// ── Stats ─────────────────────────────────────────────────────

export interface SummaryStats {
  total_customers: number;
  avg_rating: number;
  overdue_count: number;
}

export interface BranchStat {
  branch: string;
  customer_count: number;
  avg_rating: number;
  overdue_count: number;
}

// ── Hook Options ──────────────────────────────────────────────

export interface UseCustomersOptions {
  search?: string;
  branch?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface UseAddFormOptions {
  customers?: Customer[];
}
