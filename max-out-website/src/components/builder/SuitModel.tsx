'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { SuitConfiguration } from './SuitBuilder3D';

interface SuitModelProps {
  configuration: SuitConfiguration;
}

export function SuitModel({ configuration }: SuitModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Simple placeholder 3D model using basic shapes
  // In a real implementation, this would load a detailed 3D suit model
  
  const jacketColor = new THREE.Color(configuration.fabric.color);
  const liningColor = new THREE.Color(configuration.jacket.lining);

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Jacket Body */}
      <Box
        args={[1.2, 1.8, 0.4]}
        position={[0, 0.9, 0]}
      >
        <meshStandardMaterial color={jacketColor} />
      </Box>

      {/* Jacket Sleeves */}
      <Cylinder
        args={[0.15, 0.12, 1.4]}
        position={[-0.7, 0.9, 0]}
        rotation={[0, 0, Math.PI / 8]}
      >
        <meshStandardMaterial color={jacketColor} />
      </Cylinder>
      <Cylinder
        args={[0.15, 0.12, 1.4]}
        position={[0.7, 0.9, 0]}
        rotation={[0, 0, -Math.PI / 8]}
      >
        <meshStandardMaterial color={jacketColor} />
      </Cylinder>

      {/* Lapels */}
      <Box
        args={[0.3, 0.8, 0.05]}
        position={[-0.3, 1.4, 0.21]}
        rotation={[0, 0, -Math.PI / 12]}
      >
        <meshStandardMaterial color={jacketColor} />
      </Box>
      <Box
        args={[0.3, 0.8, 0.05]}
        position={[0.3, 1.4, 0.21]}
        rotation={[0, 0, Math.PI / 12]}
      >
        <meshStandardMaterial color={jacketColor} />
      </Box>

      {/* Buttons */}
      {Array.from({ length: configuration.jacket.buttons }).map((_, i) => (
        <Cylinder
          key={i}
          args={[0.04, 0.04, 0.02]}
          position={[0, 1.2 - i * 0.3, 0.21]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color={configuration.details.buttonColor} />
        </Cylinder>
      ))}

      {/* Trousers */}
      <Box
        args={[1.0, 0.4, 0.35]}
        position={[0, -0.2, 0]}
      >
        <meshStandardMaterial color={jacketColor} />
      </Box>

      {/* Trouser Legs */}
      <Cylinder
        args={[0.18, 0.16, 1.6]}
        position={[-0.25, -1.2, 0]}
      >
        <meshStandardMaterial color={jacketColor} />
      </Cylinder>
      <Cylinder
        args={[0.18, 0.16, 1.6]}
        position={[0.25, -1.2, 0]}
      >
        <meshStandardMaterial color={jacketColor} />
      </Cylinder>

      {/* Cuffs if enabled */}
      {configuration.trouser.cuffs && (
        <>
          <Box
            args={[0.36, 0.1, 0.36]}
            position={[-0.25, -2, 0]}
          >
            <meshStandardMaterial color={jacketColor} />
          </Box>
          <Box
            args={[0.36, 0.1, 0.36]}
            position={[0.25, -2, 0]}
          >
            <meshStandardMaterial color={jacketColor} />
          </Box>
        </>
      )}

      {/* Pattern overlay */}
      {configuration.fabric.pattern !== 'solid' && (
        <Plane
          args={[2, 4]}
          position={[0, 0, 0.22]}
        >
          <meshBasicMaterial
            transparent
            opacity={0.1}
            color={jacketColor}
          />
        </Plane>
      )}
    </group>
  );
}