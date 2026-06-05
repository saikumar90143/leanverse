export function getUserId(): string {
  if (typeof window === 'undefined') return 'guest';
  try {
    const stored = localStorage.getItem('leanverse-session');
    if (stored) {
      const user = JSON.parse(stored);
      if (user && user.id) return user.id;
    }
  } catch {}
  return 'guest';
}

export function getUserStorageKey(baseKey: string): string {
  const userId = getUserId();
  return `${baseKey}_${userId}`;
}

export function formatLocalDate(d: Date = new Date()): string {
  // Offset by 5 hours so that "next day" starts at 5 AM instead of Midnight
  const offsetDate = new Date(d.getTime() - 5 * 60 * 60 * 1000);
  const year = offsetDate.getFullYear();
  const month = String(offsetDate.getMonth() + 1).padStart(2, '0');
  const day = String(offsetDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

