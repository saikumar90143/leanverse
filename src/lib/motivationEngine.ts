/**
 * motivationEngine.ts
 * Daily rotating motivational messages deterministically picked by date.
 */

const MOTIVATIONS = [
  { message: "Don't break your streak. Every rep counts.", emoji: '🔥' },
  { message: "Consistency beats perfection. Show up today.", emoji: '💪' },
  { message: "Every workout counts — even the hard ones.", emoji: '🏆' },
  { message: "Small actions create big transformations.", emoji: '🚀' },
  { message: "One workout closer to your goal.", emoji: '⚡' },
  { message: "Champions train when they don't feel like it.", emoji: '👑' },
  { message: "Your future self will thank you for today.", emoji: '🌟' },
  { message: "Pain is temporary. Progress is permanent.", emoji: '💎' },
  { message: "You didn't come this far to only come this far.", emoji: '🎯' },
  { message: "Progress over perfection. Always.", emoji: '📈' },
  { message: "The only bad workout is the one that didn't happen.", emoji: '🏋️' },
  { message: "Make your body your masterpiece.", emoji: '🎨' },
  { message: "Hard work is the silent language of champions.", emoji: '🤫' },
  { message: "Success is built one rep at a time.", emoji: '🧱' },
  { message: "Your streak is your identity. Protect it.", emoji: '🛡️' },
  { message: "Be the person who shows up — every single day.", emoji: '📅' },
  { message: "Discipline is choosing between what you want now and what you want most.", emoji: '⏳' },
  { message: "Sweat today. Flex tomorrow.", emoji: '💦' },
  { message: "Motivation gets you started. Habits keep you going.", emoji: '🔄' },
  { message: "You are one workout away from a good mood.", emoji: '😤' },
  { message: "Earn your rest. Work for it.", emoji: '🏅' },
  { message: "The body achieves what the mind believes.", emoji: '🧠' },
  { message: "No shortcuts. Just hard work and consistency.", emoji: '🛤️' },
  { message: "Today's struggle is tomorrow's strength.", emoji: '⚔️' },
  { message: "Great things never come from comfort zones.", emoji: '🌊' },
];

export interface DailyMotivation {
  message: string;
  emoji: string;
}

/**
 * Returns a deterministic daily motivation based on today's date.
 */
export function getDailyMotivation(): DailyMotivation {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % MOTIVATIONS.length;
  return MOTIVATIONS[index];
}

/**
 * Returns a motivation quote for a specific streak milestone.
 */
export function getMilestoneMessage(streak: number): string {
  if (streak >= 365) return '🌟 A full year of discipline. You are truly legendary!';
  if (streak >= 180) return '🏆 6 months straight! You are an elite athlete now.';
  if (streak >= 90) return '⚡ 90 days in! You\'ve officially built a habit for life.';
  if (streak >= 60) return '🔥 2 months strong! Your consistency is extraordinary.';
  if (streak >= 30) return '🥇 30-day streak! Iron discipline unlocked.';
  if (streak >= 14) return '💪 Fortnight fighter! You\'re on a serious roll.';
  if (streak >= 7) return '🥈 One full week down! Keep the momentum going.';
  if (streak >= 3) return '🥉 3-day streak! The habit is starting to form.';
  return '🏁 Great start! Every journey begins with a single step.';
}
