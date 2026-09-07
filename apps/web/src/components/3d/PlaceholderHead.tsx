'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * PLACEHOLDER — swap with real .glb head model with morph targets
 *
 * Low-poly stylized head mesh built from primitives.
 * Simulates 5 face-shape morph targets by scaling/positioning sub-parts.
 * When replaced with a real model, use actual morphTargetInfluences.
 */

type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond';

interface PlaceholderHeadProps {
  /** Current face shape to morph toward */
  shape?: FaceShape;
  /** Scale factor */
  scale?: number;
}

/**
 * Shape parameters: [headScaleX, headScaleY, headScaleZ, jawScaleX, jawOffsetY, cheekScale]
 * These create visually distinct silhouettes for each face shape.
 */
const SHAPE_PARAMS: Record<FaceShape, {
  headScaleX: number;
  headScaleY: number;
  headScaleZ: number;
  jawWidth: number;
  jawOffsetY: number;
  cheekScale: number;
  foreheadScale: number;
  chinScale: number;
}> = {
  Oval: {
    headScaleX: 0.78,
    headScaleY: 1.0,
    headScaleZ: 0.82,
    jawWidth: 0.58,
    jawOffsetY: -0.52,
    cheekScale: 0.75,
    foreheadScale: 0.72,
    chinScale: 0.3,
  },
  Round: {
    headScaleX: 0.88,
    headScaleY: 0.88,
    headScaleZ: 0.85,
    jawWidth: 0.72,
    jawOffsetY: -0.42,
    cheekScale: 0.88,
    foreheadScale: 0.78,
    chinScale: 0.38,
  },
  Square: {
    headScaleX: 0.85,
    headScaleY: 0.95,
    headScaleZ: 0.82,
    jawWidth: 0.82,
    jawOffsetY: -0.5,
    cheekScale: 0.72,
    foreheadScale: 0.82,
    chinScale: 0.42,
  },
  Heart: {
    headScaleX: 0.82,
    headScaleY: 1.0,
    headScaleZ: 0.8,
    jawWidth: 0.48,
    jawOffsetY: -0.55,
    cheekScale: 0.65,
    foreheadScale: 0.85,
    chinScale: 0.22,
  },
  Diamond: {
    headScaleX: 0.72,
    headScaleY: 1.05,
    headScaleZ: 0.78,
    jawWidth: 0.5,
    jawOffsetY: -0.52,
    cheekScale: 0.9,
    foreheadScale: 0.62,
    chinScale: 0.25,
  },
};

export const PlaceholderHead = ({ shape = 'Oval', scale = 1 }: PlaceholderHeadProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentParams = useRef(SHAPE_PARAMS[shape]);

  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E8C4A0',
        roughness: 0.7,
        metalness: 0.02,
      }),
    []
  );

  const hairMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2A1810',
        roughness: 0.8,
        metalness: 0.0,
      }),
    []
  );

  // Refs for animatable sub-parts
  const headRef = useRef<THREE.Mesh>(null);
  const jawRef = useRef<THREE.Mesh>(null);
  const leftCheekRef = useRef<THREE.Mesh>(null);
  const rightCheekRef = useRef<THREE.Mesh>(null);
  const foreheadRef = useRef<THREE.Mesh>(null);
  const chinRef = useRef<THREE.Mesh>(null);

  // Smoothly lerp toward target shape params each frame
  useFrame(() => {
    const target = SHAPE_PARAMS[shape];
    const current = currentParams.current;
    const lerpFactor = 0.04; // ~0.8s transition feel at 60fps

    current.headScaleX = THREE.MathUtils.lerp(current.headScaleX, target.headScaleX, lerpFactor);
    current.headScaleY = THREE.MathUtils.lerp(current.headScaleY, target.headScaleY, lerpFactor);
    current.headScaleZ = THREE.MathUtils.lerp(current.headScaleZ, target.headScaleZ, lerpFactor);
    current.jawWidth = THREE.MathUtils.lerp(current.jawWidth, target.jawWidth, lerpFactor);
    current.jawOffsetY = THREE.MathUtils.lerp(current.jawOffsetY, target.jawOffsetY, lerpFactor);
    current.cheekScale = THREE.MathUtils.lerp(current.cheekScale, target.cheekScale, lerpFactor);
    current.foreheadScale = THREE.MathUtils.lerp(current.foreheadScale, target.foreheadScale, lerpFactor);
    current.chinScale = THREE.MathUtils.lerp(current.chinScale, target.chinScale, lerpFactor);

    // Apply to meshes
    if (headRef.current) {
      headRef.current.scale.set(current.headScaleX, current.headScaleY, current.headScaleZ);
    }
    if (jawRef.current) {
      jawRef.current.scale.x = current.jawWidth;
      jawRef.current.position.y = current.jawOffsetY;
    }
    if (leftCheekRef.current) {
      leftCheekRef.current.scale.setScalar(current.cheekScale);
    }
    if (rightCheekRef.current) {
      rightCheekRef.current.scale.setScalar(current.cheekScale);
    }
    if (foreheadRef.current) {
      foreheadRef.current.scale.x = current.foreheadScale;
    }
    if (chinRef.current) {
      chinRef.current.scale.setScalar(current.chinScale);
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main head sphere */}
      <mesh ref={headRef} material={skinMaterial}>
        <sphereGeometry args={[0.65, 32, 24]} />
      </mesh>

      {/* Jawline — flattened sphere */}
      <mesh
        ref={jawRef}
        position={[0, -0.52, 0.08]}
        material={skinMaterial}
      >
        <sphereGeometry args={[0.38, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Left cheekbone */}
      <mesh
        ref={leftCheekRef}
        position={[-0.42, -0.05, 0.3]}
        material={skinMaterial}
      >
        <sphereGeometry args={[0.18, 12, 8]} />
      </mesh>

      {/* Right cheekbone */}
      <mesh
        ref={rightCheekRef}
        position={[0.42, -0.05, 0.3]}
        material={skinMaterial}
      >
        <sphereGeometry args={[0.18, 12, 8]} />
      </mesh>

      {/* Forehead — slightly flattened sphere on top */}
      <mesh
        ref={foreheadRef}
        position={[0, 0.32, 0.12]}
        material={skinMaterial}
      >
        <sphereGeometry args={[0.42, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Chin */}
      <mesh
        ref={chinRef}
        position={[0, -0.7, 0.18]}
        material={skinMaterial}
      >
        <sphereGeometry args={[0.2, 12, 8]} />
      </mesh>

      {/* Nose protrusion */}
      <mesh position={[0, -0.12, 0.58]} rotation={[-0.15, 0, 0]} material={skinMaterial}>
        <boxGeometry args={[0.1, 0.22, 0.12]} />
      </mesh>
      <mesh position={[0, -0.22, 0.62]} material={skinMaterial}>
        <sphereGeometry args={[0.07, 8, 6]} />
      </mesh>

      {/* Left ear */}
      <mesh position={[-0.62, -0.05, -0.05]} rotation={[0, -0.3, 0]} material={skinMaterial}>
        <sphereGeometry args={[0.1, 8, 8]} />
      </mesh>

      {/* Right ear */}
      <mesh position={[0.62, -0.05, -0.05]} rotation={[0, 0.3, 0]} material={skinMaterial}>
        <sphereGeometry args={[0.1, 8, 8]} />
      </mesh>

      {/* Hair cap */}
      <mesh position={[0, 0.2, -0.05]} material={hairMaterial}>
        <sphereGeometry args={[0.68, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Eye sockets (subtle dark indents for visual reference) */}
      <mesh position={[-0.2, 0.05, 0.52]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      <mesh position={[0.2, 0.05, 0.52]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.2, 0.05, 0.6]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#2A1810" roughness={0.5} />
      </mesh>
      <mesh position={[0.2, 0.05, 0.6]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#2A1810" roughness={0.5} />
      </mesh>

      {/* Lips */}
      <mesh position={[0, -0.38, 0.48]} rotation={[0.1, 0, 0]} material={skinMaterial}>
        <boxGeometry args={[0.22, 0.06, 0.06]} />
      </mesh>
    </group>
  );
};

export default PlaceholderHead;
