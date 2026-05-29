import { request } from './apiClient';

export async function fetchSummary() {
  return request('/api/stats/summary');
}

export async function fetchBranchStats(branch?: string) {
  const url = branch
    ? `/api/stats/branches?branch=${encodeURIComponent(branch)}`
    : '/api/stats/branches';
  return request(url);
}
