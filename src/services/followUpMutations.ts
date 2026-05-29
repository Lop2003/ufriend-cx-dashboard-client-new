import { request } from "./apiClient";
import type { CreateFollowUpPayload, FollowUp } from "../types";

/**
 * WRITE — บันทึก follow-up ใหม่
 */
export async function createFollowUp(payload: CreateFollowUpPayload): Promise<FollowUp> {
  return request<FollowUp>("/api/follow-ups", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * WRITE — อัปเดตสถานะ follow-up
 */
export async function updateFollowUpStatus(id: string, status: string): Promise<FollowUp> {
  return request<FollowUp>(`/api/follow-ups/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

