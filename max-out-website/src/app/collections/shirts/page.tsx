import { Suspense } from 'react';
import SmartCollectionPage from '@/components/collections/SmartCollectionPage';

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function ShirtsCollectionPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SmartCollectionPage collectionId="shirts" />
    </Suspense>
  );
}
