import { request } from './apiClient';

export async function fetchSummary(period?: string) {
  const params = new URLSearchParams();
  if (period) params.append('period', period);
  const qs = params.toString();
  return request(`/api/stats/summary${qs ? `?${qs}` : ''}`);
}

export async function fetchBranchStats(branch?: string, period?: string) {
  const params = new URLSearchParams();
  if (branch) params.append('branch', branch);
  if (period) params.append('period', period);
  const qs = params.toString();
  return request(`/api/stats/branches${qs ? `?${qs}` : ''}`);
}

export async function fetchDailyStats(period?: string) {
  const params = new URLSearchParams();
  if (period) params.append('period', period);
  const qs = params.toString();
  return request(`/api/stats/daily${qs ? `?${qs}` : ''}`);
}
