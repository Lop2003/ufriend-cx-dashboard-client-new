import { request } from './apiClient';

/**
 * WRITE — ออกจากระบบ ลบ session ฝั่ง server
 */
export async function logout(): Promise<void> {
  await request('/api/auth/logout', { method: 'POST' });
}
