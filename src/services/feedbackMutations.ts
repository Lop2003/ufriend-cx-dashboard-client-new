import { request } from "./apiClient";
import type { CreateFeedbackPayload, Feedback } from "../types";

/**
 * WRITE — บันทึก feedback ใหม่
 */
export async function createFeedback(payload: CreateFeedbackPayload): Promise<Feedback> {
  return request<Feedback>("/api/feedbacks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

