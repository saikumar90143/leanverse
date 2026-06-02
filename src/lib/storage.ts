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
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
