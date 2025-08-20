'use client';

import { lazy, Suspense } from 'react';
import { CanvasProps } from '@react-three/fiber';

// Lazy load the Canvas component from @react-three/fiber
const Canvas = lazy(() => 
  import('@react-three/fiber').then(module => ({ default: module.Canvas }))
);

// Loading component
function CanvasLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
        <p className="text-gray-600">Loading 3D viewer...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a moment on first load</p>
      </div>
    </div>
  );
}

interface LazyCanvasProps extends CanvasProps {
  fallback?: React.ReactNode;
}

// Wrapper component that handles the lazy loading
export function LazyCanvas({ children, fallback, ...props }: LazyCanvasProps) {
  return (
    <Suspense fallback={fallback || <CanvasLoader />}>
      <Canvas {...props}>
        {children}
      </Canvas>
    </Suspense>
  );
}