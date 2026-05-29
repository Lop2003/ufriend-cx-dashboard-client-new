const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error(
    'VITE_API_URL is not defined. Copy .env.example to .env and set VITE_API_URL.',
  );
}

export async function request<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || json.error || `Request failed: ${res.status}`);
  }
  return json.data;
}

export default request;
