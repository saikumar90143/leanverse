import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | LeanVerse',
  description: 'LeanVerse Super Admin Panel',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Override root layout — no navbar, no footer, no cookie banner for admin
  return <>{children}</>;
}
