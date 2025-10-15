'use client';

import { ChecklistProvider } from '@/contexts/ChecklistContext';
import dynamic from 'next/dynamic';

const TrackerContent = dynamic(
  () => import('@/components/TrackerContent').then(mod => ({ default: mod.TrackerContent })),
  { ssr: false }
);

export default function Home() {
  return (
    <ChecklistProvider>
      <TrackerContent />
    </ChecklistProvider>
  );
}
