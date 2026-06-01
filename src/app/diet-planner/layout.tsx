import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Diet Planner | LeanVerse',
  description: 'Generate customized, clinical AI diet plans based on your biometrics, fitness goals, and available home ingredients.',
  keywords: ['AI diet planner', 'macro calculator', 'meal planner', 'fitness nutrition', 'LeanVerse diet'],
};

export default function DietPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
