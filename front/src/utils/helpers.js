export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const cleanDate = String(dateStr).split('T')[0];
  const parts = cleanDate.split('-');
  if (parts.length !== 3) return '-';
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const trimmed = phone.trim();
  return /^\d+$/.test(trimmed) && trimmed.length >= 6 && trimmed.length <= 20;
}

export function isDateTodayOrFuture(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const today = new Date().toISOString().split('T')[0];
  return dateStr >= today;
}
