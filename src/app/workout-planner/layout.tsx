import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Workout Planner | LeanVerse',
  description: 'Design the perfect gym or home workout split based on your goals, equipment, and schedule.',
  keywords: ['AI workout planner', 'gym split generator', 'fitness plan', 'custom workout', 'hypertrophy plan'],
};

export default function WorkoutPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
