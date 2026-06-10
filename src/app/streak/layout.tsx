import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workout Streak Dashboard | LeanVerse',
  description: 'Track your workout streak, weekly goals, monthly consistency heatmap, and achievements. Stay consistent and build lasting fitness habits with LeanVerse.',
};

export default function StreakLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
