/**
 * Utility: Formatters
 * Date formatting, contract ID, phone, plan duration helpers
 */

/**
 * Format ISO date string to Thai locale date
 * @param {string} isoDate
 * @param {'short'|'long'} style
 * @returns {string}
 */
export function formatDate(isoDate: string, style: 'short' | 'long' = 'short') {
  if (!isoDate) return '-';
  const opts: Intl.DateTimeFormatOptions =
    style === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(isoDate).toLocaleDateString('th-TH', opts);
}

/**
 * Format customer ID to contract reference code
 * @param {string} id
 * @returns {string}
 */
export function formatContractId(id: string | number) {
  return `uF-${String(id).padEnd(6, '0')}`;
}

/**
 * Format plan duration to Thai string
 * @param {number} months
 * @returns {string}
 */
export function formatPlanMonths(months: number) {
  return `${months} เดือน`;
}

/**
 * Format 10-digit Thai phone number to 'XXX-XXX-XXXX'
 * @param {string|number} phone
 * @returns {string}
 */
export function formatPhone(phone: string | number) {
  if (!phone) return '-';
  const cleanPhone = String(phone).replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  }
  return String(phone);
}

