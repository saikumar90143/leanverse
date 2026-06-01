import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Progressive Overload Tracker | LeanVerse',
  description: 'Track your sets, reps, and weights to ensure consistent progressive overload. Monitor your volume and intensity over time.',
  keywords: ['workout tracker', 'progressive overload', 'gym log', 'exercise tracking', 'LeanVerse tracking'],
};

export default function WorkoutTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
