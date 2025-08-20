'use client';

import { lazy } from 'react';

// Lazy load all Three.js related components
export const OrbitControls = lazy(() => 
  import('@react-three/drei').then(module => ({ default: module.OrbitControls }))
);

export const Environment = lazy(() => 
  import('@react-three/drei').then(module => ({ default: module.Environment }))
);

export const ContactShadows = lazy(() => 
  import('@react-three/drei').then(module => ({ default: module.ContactShadows }))
);

export const Box = lazy(() => 
  import('@react-three/drei').then(module => ({ default: module.Box }))
);

export const Cylinder = lazy(() => 
  import('@react-three/drei').then(module => ({ default: module.Cylinder }))
);

export const Sphere = lazy(() => 
  import('@react-three/drei').then(module => ({ default: module.Sphere }))
);

export const Plane = lazy(() => 
  import('@react-three/drei').then(module => ({ default: module.Plane }))
);

export const useTexture = lazy(() => 
  import('@react-three/drei').then(module => ({ default: module.useTexture }))
);

// Preload function to start loading Three.js modules when user shows intent
export const preloadThreeModules = () => {
  // Start loading the modules in the background
  import('@react-three/fiber');
  import('@react-three/drei');
  import('three');
};