import { request } from "./apiClient";
import type { FetchCustomersParams, PaginatedCustomers, Customer } from "../types";

/**
 * READ — ดึงรายการลูกค้า พร้อม params ครบทุกตัว (ส่งไป API ทั้งหมด)
 * Backend Go/Fiber รองรับ: search, branch, status, sort_by, sort_order
 */
export async function fetchCustomers(params: FetchCustomersParams = {}): Promise<PaginatedCustomers> {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.branch) query.append("branch", params.branch);
  if (params.status) query.append("status", params.status);
  if (params.sortBy) query.append("sort_by", params.sortBy);
  if (params.sortOrder) query.append("sort_order", params.sortOrder);
  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  const qs = query.toString();
  return request<PaginatedCustomers>(`/api/customers${qs ? `?${qs}` : ""}`);
}

// Request deduplication สำหรับ detail fetch
const pendingDetailRequests = new Map<string, Promise<Customer>>();

export async function fetchCustomerDetail(id: string): Promise<Customer> {
  const existing = pendingDetailRequests.get(id);
  if (existing) return existing;

  const promise = request<Customer>(`/api/customers/${id}`).finally(() =>
    pendingDetailRequests.delete(id),
  );
  pendingDetailRequests.set(id, promise);
  return promise;
}
