/**
 * Utility: Status Helpers
 * Maps customer/followup status values to labels and MUI color props
 */

// ─── Customer Status ────────────────────────────────────────────────────────

export const CUSTOMER_STATUS = {
  active: {
    label: 'ปกติ (Active)',
    shortLabel: 'ผ่อนชำระปกติ (Active)',
    color: 'success',         // MUI Chip color
    chipSx: { bgcolor: '#dcfce7', color: '#057A55', borderColor: '#bbf7d0' },
  },
  overdue: {
    label: 'ค้างชำระ (Overdue)',
    shortLabel: 'ค้างชำระค่างวดสัญญา (Overdue)',
    color: 'error',
    chipSx: { bgcolor: '#fee2e2', color: '#C81E1E', borderColor: '#fecaca' },
  },
  completed: {
    label: 'จบสัญญา (Completed)',
    shortLabel: 'ปิดสัญญาผ่อนชำระแล้ว (Completed)',
    color: 'default',
    chipSx: { bgcolor: '#f1f5f9', color: '#64748b', borderColor: '#e2e8f0' },
  },
};

export function getCustomerStatus(status: string) {
  return CUSTOMER_STATUS[status as keyof typeof CUSTOMER_STATUS] ?? CUSTOMER_STATUS.completed;
}

// ─── Feedback Sentiment ─────────────────────────────────────────────────────

export const SENTIMENT = {
  positive: { label: 'พึงพอใจ', color: '#057A55', borderColor: '#bbf7d0', sx: { bgcolor: '#dcfce7', color: '#057A55' } },
  neutral:  { label: 'ทั่วไป',   color: '#92400E', borderColor: '#fde68a', sx: { bgcolor: '#fef3c7', color: '#92400E' } },
  negative: { label: 'ไม่พอใจ', color: '#C81E1E', borderColor: '#fecaca', sx: { bgcolor: '#fee2e2', color: '#C81E1E' } },
};

export function getSentiment(sentiment: string) {
  return SENTIMENT[sentiment as keyof typeof SENTIMENT] ?? SENTIMENT.neutral;
}

// ─── Follow-Up Type ─────────────────────────────────────────────────────────

export const FOLLOW_UP_TYPE = {
  payment_remind: { label: 'โทรแจ้งเตือนยอดชำระ', color: '#C81E1E' },
  feedback_reply: { label: 'ตอบกลับความพึงพอใจ', color: '#0051BA' },
  promotion:      { label: 'โทรเสนอโปรโมชั่นพิเศษ', color: '#6366f1' },
};

export function getFollowUpType(type: string) {
  return FOLLOW_UP_TYPE[type as keyof typeof FOLLOW_UP_TYPE] ?? FOLLOW_UP_TYPE.promotion;
}

// ─── Feedback Category ──────────────────────────────────────────────────────

export const FEEDBACK_CATEGORY = {
  service:  'บริการ',
  payment:  'ค่างวด/การชำระ',
  product:  'สินค้า',
  branch:   'สาขา',
};

export function getFeedbackCategory(category: string) {
  return FEEDBACK_CATEGORY[category as keyof typeof FEEDBACK_CATEGORY] ?? category;
}
