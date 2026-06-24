'use client';

import dynamic from 'next/dynamic';
import QuickStartWizardSkeleton from './QuickStartWizardSkeleton';

const QuickStartWizard = dynamic(() => import('./QuickStartWizard'), {
  ssr: false,
  loading: () => <QuickStartWizardSkeleton />
});

export default function QuickStartWizardWrapper() {
  return <QuickStartWizard />;
}
