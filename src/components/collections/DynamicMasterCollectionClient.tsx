'use client';

import { DynamicMasterCollection } from './DynamicMasterCollection';

interface DynamicMasterCollectionClientProps {
  title?: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
  showHero?: boolean;
  enablePresets?: boolean;
  defaultViewMode?: 'grid-3' | 'grid-4' | 'list';
}

export function DynamicMasterCollectionClient(props: DynamicMasterCollectionClientProps) {
  return <DynamicMasterCollection {...props} />;
}