'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Box, Cylinder, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { SuitConfiguration } from './SuitBuilder3D';

interface EnhancedSuitModelProps {
  configuration: SuitConfiguration;
}

// Fabric texture patterns
const fabricPatterns = {
  solid: null,
  pinstripe: '/textures/pinstripe.jpg',
  plaid: '/textures/plaid.jpg',
  herringbone: '/textures/herringbone.jpg',
};

// Material properties for different fabric types
const fabricMaterials = {
  wool: { roughness: 0.8, metalness: 0.1 },
  cotton: { roughness: 0.9, metalness: 0.05 },
  linen: { roughness: 0.95, metalness: 0.02 },
  cashmere: { roughness: 0.6, metalness: 0.15 },
};

export function EnhancedSuitModel({ configuration }: EnhancedSuitModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const jacketRef = useRef<THREE.Mesh>(null);
  
  // Create fabric material with texture
  const fabricMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(configuration.fabric.color),
      ...fabricMaterials[configuration.fabric.type],
    });

    // Add pattern texture if not solid
    if (configuration.fabric.pattern !== 'solid') {
      // In a real implementation, load actual textures
      // For now, we'll simulate with procedural patterns
      if (configuration.fabric.pattern === 'pinstripe') {
        material.map = new THREE.DataTexture(
          new Uint8Array(4 * 256 * 256).map((_, i) => {
            const x = (i % 256);
            return x % 16 < 2 ? 255 : 200;
          }),
          256,
          256,
          THREE.RGBAFormat
        );
      }
    }

    return material;
  }, [configuration.fabric]);

  const liningMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(configuration.jacket.lining),
      side: THREE.BackSide,
      roughness: 0.3,
      metalness: 0.1,
    });
  }, [configuration.jacket.lining]);

  const buttonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(configuration.details.buttonColor),
      roughness: 0.2,
      metalness: 0.8,
    });
  }, [configuration.details.buttonColor]);

  // Animate subtle breathing movement
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  // Helper function to create lapel based on style
  const createLapel = (side: 'left' | 'right') => {
    const xPos = side === 'left' ? -0.3 : 0.3;
    const rotation = side === 'left' ? -Math.PI / 12 : Math.PI / 12;
    
    switch (configuration.jacket.lapel) {
      case 'peak':
        return (
          <Box
            args={[0.35, 0.9, 0.05]}
            position={[xPos, 1.4, 0.21]}
            rotation={[0, 0, rotation]}
          >
            <primitive object={fabricMaterial} attach="material" />
          </Box>
        );
      case 'shawl':
        return (
          <Cylinder
            args={[0.15, 0.35, 0.9, 8, 1, false, 0, Math.PI]}
            position={[xPos, 1.4, 0.21]}
            rotation={[0, 0, rotation]}
          >
            <primitive object={fabricMaterial} attach="material" />
          </Cylinder>
        );
      default: // notch
        return (
          <Box
            args={[0.3, 0.8, 0.05]}
            position={[xPos, 1.4, 0.21]}
            rotation={[0, 0, rotation]}
          >
            <primitive object={fabricMaterial} attach="material" />
          </Box>
        );
    }
  };

  // Create vents based on configuration
  const createVents = () => {
    switch (configuration.jacket.vents) {
      case 'center':
        return (
          <Box
            args={[0.02, 0.4, 0.1]}
            position={[0, 0.2, -0.19]}
          >
            <meshStandardMaterial color="black" />
          </Box>
        );
      case 'side':
        return (
          <>
            <Box
              args={[0.02, 0.4, 0.1]}
              position={[-0.35, 0.2, -0.19]}
            >
              <meshStandardMaterial color="black" />
            </Box>
            <Box
              args={[0.02, 0.4, 0.1]}
              position={[0.35, 0.2, -0.19]}
            >
              <meshStandardMaterial color="black" />
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Enhanced Jacket Body */}
      <group>
        {/* Main body */}
        <Box
          ref={jacketRef}
          args={[1.2, 1.8, 0.4]}
          position={[0, 0.9, 0]}
        >
          <primitive object={fabricMaterial} attach="material" />
        </Box>

        {/* Inner lining visible at opening */}
        <Box
          args={[0.4, 1.6, 0.35]}
          position={[0, 0.9, 0.02]}
        >
          <primitive object={liningMaterial} attach="material" />
        </Box>

        {/* Jacket Shoulders - enhanced shape */}
        <Box
          args={[1.4, 0.2, 0.4]}
          position={[0, 1.85, 0]}
        >
          <primitive object={fabricMaterial} attach="material" />
        </Box>

        {/* Enhanced Sleeves with cuffs */}
        {/* Left sleeve */}
        <group position={[-0.7, 0.9, 0]}>
          <Cylinder
            args={[0.15, 0.12, 1.2]}
            rotation={[0, 0, Math.PI / 8]}
          >
            <primitive object={fabricMaterial} attach="material" />
          </Cylinder>
          {/* Sleeve buttons */}
          {[0, 1, 2].map((i) => (
            <Cylinder
              key={`left-sleeve-button-${i}`}
              args={[0.02, 0.02, 0.01]}
              position={[0.1, -0.5 + i * 0.05, 0.13]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <primitive object={buttonMaterial} attach="material" />
            </Cylinder>
          ))}
        </group>

        {/* Right sleeve */}
        <group position={[0.7, 0.9, 0]}>
          <Cylinder
            args={[0.15, 0.12, 1.2]}
            rotation={[0, 0, -Math.PI / 8]}
          >
            <primitive object={fabricMaterial} attach="material" />
          </Cylinder>
          {/* Sleeve buttons */}
          {[0, 1, 2].map((i) => (
            <Cylinder
              key={`right-sleeve-button-${i}`}
              args={[0.02, 0.02, 0.01]}
              position={[-0.1, -0.5 + i * 0.05, 0.13]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <primitive object={buttonMaterial} attach="material" />
            </Cylinder>
          ))}
        </group>

        {/* Dynamic Lapels */}
        {createLapel('left')}
        {createLapel('right')}

        {/* Pocket Flaps */}
        <Box
          args={[0.15, 0.02, 0.05]}
          position={[-0.35, 0.6, 0.21]}
        >
          <primitive object={fabricMaterial} attach="material" />
        </Box>
        <Box
          args={[0.15, 0.02, 0.05]}
          position={[0.35, 0.6, 0.21]}
        >
          <primitive object={fabricMaterial} attach="material" />
        </Box>

        {/* Breast Pocket */}
        <Box
          args={[0.12, 0.15, 0.02]}
          position={[-0.35, 1.3, 0.21]}
        >
          <primitive object={fabricMaterial} attach="material" />
        </Box>

        {/* Dynamic Buttons */}
        {Array.from({ length: configuration.jacket.buttons }).map((_, i) => (
          <group key={`button-${i}`}>
            <Cylinder
              args={[0.04, 0.04, 0.02]}
              position={[0, 1.2 - i * 0.3, 0.21]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <primitive object={buttonMaterial} attach="material" />
            </Cylinder>
            {/* Button holes */}
            <Box
              args={[0.01, 0.08, 0.01]}
              position={[-0.1, 1.2 - i * 0.3, 0.21]}
            >
              <meshStandardMaterial color="black" />
            </Box>
          </group>
        ))}

        {/* Vents */}
        {createVents()}

        {/* Monogram if provided */}
        {configuration.details.monogram && (
          <Box
            args={[0.08, 0.04, 0.01]}
            position={[-0.35, 1.25, 0.22]}
          >
            <meshStandardMaterial 
              color={configuration.details.threadColor} 
              emissive={configuration.details.threadColor}
              emissiveIntensity={0.2}
            />
          </Box>
        )}
      </group>

      {/* Enhanced Trousers */}
      <group>
        {/* Waistband */}
        <Box
          args={[1.0, 0.1, 0.35]}
          position={[0, -0.15, 0]}
        >
          <primitive object={fabricMaterial} attach="material" />
        </Box>

        {/* Main trouser body */}
        <Box
          args={[1.0, 0.3, 0.35]}
          position={[0, -0.35, 0]}
        >
          <primitive object={fabricMaterial} attach="material" />
        </Box>

        {/* Belt loops */}
        {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
          <Box
            key={`belt-loop-${i}`}
            args={[0.03, 0.08, 0.02]}
            position={[x, -0.15, 0.18]}
          >
            <primitive object={fabricMaterial} attach="material" />
          </Box>
        ))}

        {/* Trouser Legs with proper fit */}
        <group>
          {/* Left leg */}
          <Cylinder
            args={[
              configuration.trouser.fit === 'slim' ? 0.16 : 0.18, 
              configuration.trouser.fit === 'slim' ? 0.14 : 0.16, 
              1.6
            ]}
            position={[-0.25, -1.2, 0]}
          >
            <primitive object={fabricMaterial} attach="material" />
          </Cylinder>

          {/* Right leg */}
          <Cylinder
            args={[
              configuration.trouser.fit === 'slim' ? 0.16 : 0.18, 
              configuration.trouser.fit === 'slim' ? 0.14 : 0.16, 
              1.6
            ]}
            position={[0.25, -1.2, 0]}
          >
            <primitive object={fabricMaterial} attach="material" />
          </Cylinder>

          {/* Pleats if enabled */}
          {configuration.trouser.pleats !== 'flat' && (
            <>
              <Box
                args={[0.02, 0.3, 0.01]}
                position={[-0.15, -0.35, 0.18]}
              >
                <meshStandardMaterial color="black" opacity={0.3} transparent />
              </Box>
              <Box
                args={[0.02, 0.3, 0.01]}
                position={[0.15, -0.35, 0.18]}
              >
                <meshStandardMaterial color="black" opacity={0.3} transparent />
              </Box>
              {configuration.trouser.pleats === 'double' && (
                <>
                  <Box
                    args={[0.02, 0.3, 0.01]}
                    position={[-0.1, -0.35, 0.18]}
                  >
                    <meshStandardMaterial color="black" opacity={0.3} transparent />
                  </Box>
                  <Box
                    args={[0.02, 0.3, 0.01]}
                    position={[0.1, -0.35, 0.18]}
                  >
                    <meshStandardMaterial color="black" opacity={0.3} transparent />
                  </Box>
                </>
              )}
            </>
          )}

          {/* Cuffs if enabled */}
          {configuration.trouser.cuffs && (
            <>
              <Cylinder
                args={[0.17, 0.17, 0.1]}
                position={[-0.25, -2, 0]}
              >
                <primitive object={fabricMaterial} attach="material" />
              </Cylinder>
              <Cylinder
                args={[0.17, 0.17, 0.1]}
                position={[0.25, -2, 0]}
              >
                <primitive object={fabricMaterial} attach="material" />
              </Cylinder>
            </>
          )}
        </group>

        {/* Trouser crease lines */}
        <Box
          args={[0.01, 1.6, 0.01]}
          position={[-0.25, -1.2, 0.18]}
        >
          <meshStandardMaterial color="black" opacity={0.2} transparent />
        </Box>
        <Box
          args={[0.01, 1.6, 0.01]}
          position={[0.25, -1.2, 0.18]}
        >
          <meshStandardMaterial color="black" opacity={0.2} transparent />
        </Box>
      </group>
    </group>
  );
}