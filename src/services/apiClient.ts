import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error(
    'VITE_API_URL is not defined. Copy .env.example to .env and set VITE_API_URL.',
  );
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function request<T = any>(url: string, options: any = {}): Promise<T> {
  const { method = 'GET', body, headers, ...rest } = options;

  const config: AxiosRequestConfig = {
    url,
    method,
    headers,
    data: body ? (typeof body === 'string' ? JSON.parse(body) : body) : undefined,
    ...rest,
  };

  try {
    const res = await axiosInstance.request(config);
    const json = res.data;

    if (!json.success) {
      throw new Error(json.message || json.error || 'Request failed');
    }
    return json.data;
  } catch (err: any) {
    const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message;
    throw new Error(serverMessage);
  }
}

export default request;
