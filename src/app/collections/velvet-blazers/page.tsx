import { Suspense } from 'react';
import SmartCollectionPage from '@/components/collections/SmartCollectionPage';

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy"></div>
    </div>
  );
}

export default function VelvetBlazersPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SmartCollectionPage collectionId="velvet-blazers" />
    </Suspense>
  );
}