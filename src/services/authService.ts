import { request } from './apiClient';

export interface AuthUser {
  name: string;
  enName: string;
  avatarUrl: string;
  openId: string;
  email: string;
  userId: string;
}

/** แปลง snake_case จาก API เป็น camelCase */
function mapUser(raw: Record<string, string>): AuthUser {
  return {
    name: raw.name ?? '',
    enName: raw.en_name ?? '',
    avatarUrl: raw.avatar_url ?? '',
    openId: raw.open_id ?? '',
    email: raw.email ?? '',
    userId: raw.user_id ?? '',
  };
}

/**
 * READ — ดึงข้อมูลผู้ใช้ที่ login อยู่
 * ถ้าไม่มี session หรือหมดอายุ server จะตอบ 401
 */
export async function getMe(): Promise<AuthUser> {
  const data = await request<Record<string, string>>('/api/auth/me');
  return mapUser(data);
}
