export const ADMIN_EMAILS = ['junelamelon92@gmail.com', 'admin@meybeauty.com'];

export function isAdminEmail(email) {
  const e = String(email || '').trim().toLowerCase();
  return ADMIN_EMAILS.some((a) => a.toLowerCase() === e);
}
