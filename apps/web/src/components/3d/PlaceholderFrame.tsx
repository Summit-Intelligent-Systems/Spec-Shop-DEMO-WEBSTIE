'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';

/**
 * PLACEHOLDER — swap with real .glb
 *
 * Procedural eyewear frame geometry built from Three.js primitives.
 * Approximates different frame styles using torus, cylinder, and box shapes.
 * Designed to be a drop-in replacement: swap the mesh group for a useGLTF model later.
 */

type FrameStyle = 'round' | 'aviator' | 'square' | 'cat-eye';
type FrameMaterial = 'acetate' | 'titanium';

interface PlaceholderFrameProps {
  style?: FrameStyle;
  material?: FrameMaterial;
  color?: string;
  scale?: number;
}

/** Material presets matching the luxury design system palette */
const MATERIAL_PRESETS: Record<FrameMaterial, { color: string; roughness: number; metalness: number }> = {
  acetate: { color: '#633B18', roughness: 0.25, metalness: 0.05 },
  titanium: { color: '#94A3B8', roughness: 0.35, metalness: 0.85 },
};

/** Lens tint — subtle transparent glass */
const LENS_MATERIAL_PROPS = {
  color: '#1a1a2e',
  roughness: 0.05,
  metalness: 0.1,
  transparent: true,
  opacity: 0.15,
};

export const PlaceholderFrame = ({
  style = 'round',
  material = 'acetate',
  color,
  scale = 1,
}: PlaceholderFrameProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const matPreset = MATERIAL_PRESETS[material];
  const frameColor = color || matPreset.color;

  // Memoize material so color swaps update in real-time without full remount
  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(frameColor),
        roughness: matPreset.roughness,
        metalness: matPreset.metalness,
      }),
    [frameColor, matPreset.roughness, matPreset.metalness]
  );

  const lensMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        ...LENS_MATERIAL_PROPS,
        transmission: 0.9,
        thickness: 0.5,
        ior: 1.5,
      }),
    []
  );

  const getFrameGeometry = () => {
    switch (style) {
      case 'round':
        return <RoundFrame frameMaterial={frameMaterial} lensMaterial={lensMaterial} />;
      case 'aviator':
        return <AviatorFrame frameMaterial={frameMaterial} lensMaterial={lensMaterial} />;
      case 'square':
        return <SquareFrame frameMaterial={frameMaterial} lensMaterial={lensMaterial} />;
      case 'cat-eye':
        return <CatEyeFrame frameMaterial={frameMaterial} lensMaterial={lensMaterial} />;
      default:
        return <RoundFrame frameMaterial={frameMaterial} lensMaterial={lensMaterial} />;
    }
  };

  return (
    <group ref={groupRef} scale={scale}>
      {getFrameGeometry()}
    </group>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
   Frame Style Sub-Components
   ──────────────────────────────────────────────────────────────────────── */

interface FramePartProps {
  frameMaterial: THREE.MeshStandardMaterial;
  lensMaterial: THREE.MeshPhysicalMaterial;
}

/** Round acetate frame — classic circular lens rims */
const RoundFrame = ({ frameMaterial, lensMaterial }: FramePartProps) => (
  <group>
    {/* Left lens rim */}
    <mesh position={[-0.55, 0, 0]} material={frameMaterial}>
      <torusGeometry args={[0.42, 0.045, 16, 48]} />
    </mesh>
    {/* Left lens glass */}
    <mesh position={[-0.55, 0, 0]} material={lensMaterial}>
      <circleGeometry args={[0.38, 32]} />
    </mesh>

    {/* Right lens rim */}
    <mesh position={[0.55, 0, 0]} material={frameMaterial}>
      <torusGeometry args={[0.42, 0.045, 16, 48]} />
    </mesh>
    {/* Right lens glass */}
    <mesh position={[0.55, 0, 0]} material={lensMaterial}>
      <circleGeometry args={[0.38, 32]} />
    </mesh>

    {/* Bridge */}
    <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} material={frameMaterial}>
      <cylinderGeometry args={[0.03, 0.03, 0.26, 12]} />
    </mesh>

    {/* Left temple */}
    <mesh position={[-1.05, 0, -0.55]} rotation={[Math.PI / 2, 0, 0]} material={frameMaterial}>
      <cylinderGeometry args={[0.025, 0.02, 1.1, 8]} />
    </mesh>
    {/* Left temple hinge */}
    <mesh position={[-0.97, 0, 0]} material={frameMaterial}>
      <boxGeometry args={[0.08, 0.08, 0.06]} />
    </mesh>

    {/* Right temple */}
    <mesh position={[1.05, 0, -0.55]} rotation={[Math.PI / 2, 0, 0]} material={frameMaterial}>
      <cylinderGeometry args={[0.025, 0.02, 1.1, 8]} />
    </mesh>
    {/* Right temple hinge */}
    <mesh position={[0.97, 0, 0]} material={frameMaterial}>
      <boxGeometry args={[0.08, 0.08, 0.06]} />
    </mesh>

    {/* Nose pads */}
    <mesh position={[-0.2, -0.3, 0.08]} rotation={[0.3, 0, 0]} material={frameMaterial}>
      <boxGeometry args={[0.06, 0.1, 0.03]} />
    </mesh>
    <mesh position={[0.2, -0.3, 0.08]} rotation={[0.3, 0, 0]} material={frameMaterial}>
      <boxGeometry args={[0.06, 0.1, 0.03]} />
    </mesh>
  </group>
);

/** Aviator frame — teardrop shaped, titanium style */
const AviatorFrame = ({ frameMaterial, lensMaterial }: FramePartProps) => (
  <group>
    {/* Left lens rim — slightly squished torus for teardrop */}
    <mesh position={[-0.6, 0, 0]} scale={[1, 1.15, 1]} material={frameMaterial}>
      <torusGeometry args={[0.45, 0.03, 16, 48]} />
    </mesh>
    <mesh position={[-0.6, 0, 0]} scale={[1, 1.15, 1]} material={lensMaterial}>
      <circleGeometry args={[0.42, 32]} />
    </mesh>

    {/* Right lens rim */}
    <mesh position={[0.6, 0, 0]} scale={[1, 1.15, 1]} material={frameMaterial}>
      <torusGeometry args={[0.45, 0.03, 16, 48]} />
    </mesh>
    <mesh position={[0.6, 0, 0]} scale={[1, 1.15, 1]} material={lensMaterial}>
      <circleGeometry args={[0.42, 32]} />
    </mesh>

    {/* Double bridge bar (top) */}
    <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]} material={frameMaterial}>
      <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
    </mesh>
    <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]} material={frameMaterial}>
      <cylinderGeometry args={[0.018, 0.018, 0.28, 8]} />
    </mesh>

    {/* Temples */}
    <mesh position={[-1.12, 0.05, -0.55]} rotation={[Math.PI / 2, 0, 0]} material={frameMaterial}>
      <cylinderGeometry args={[0.02, 0.015, 1.1, 8]} />
    </mesh>
    <mesh position={[1.12, 0.05, -0.55]} rotation={[Math.PI / 2, 0, 0]} material={frameMaterial}>
      <cylinderGeometry args={[0.02, 0.015, 1.1, 8]} />
    </mesh>

    {/* Nose pads */}
    <mesh position={[-0.18, -0.35, 0.1]} rotation={[0.3, 0.1, 0]} material={frameMaterial}>
      <boxGeometry args={[0.06, 0.12, 0.02]} />
    </mesh>
    <mesh position={[0.18, -0.35, 0.1]} rotation={[0.3, -0.1, 0]} material={frameMaterial}>
      <boxGeometry args={[0.06, 0.12, 0.02]} />
    </mesh>
  </group>
);

/** Square frame — angular box-like rims */
const SquareFrame = ({ frameMaterial, lensMaterial }: FramePartProps) => (
  <group>
    {/* Left lens rim — rounded box outline using 4 cylinders */}
    <group position={[-0.55, 0, 0]}>
      {/* Top */}
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} material={frameMaterial}>
        <cylinderGeometry args={[0.04, 0.04, 0.78, 8]} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -0.35, 0]} rotation={[0, 0, Math.PI / 2]} material={frameMaterial}>
        <cylinderGeometry args={[0.04, 0.04, 0.78, 8]} />
      </mesh>
      {/* Left side */}
      <mesh position={[-0.39, 0, 0]} material={frameMaterial}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
      </mesh>
      {/* Right side */}
      <mesh position={[0.39, 0, 0]} material={frameMaterial}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
      </mesh>
      {/* Lens glass */}
      <mesh material={lensMaterial}>
        <planeGeometry args={[0.72, 0.64]} />
      </mesh>
    </group>

    {/* Right lens rim */}
    <group position={[0.55, 0, 0]}>
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]} material={frameMaterial}>
        <cylinderGeometry args={[0.04, 0.04, 0.78, 8]} />
      </mesh>
      <mesh position={[0, -0.35, 0]} rotation={[0, 0, Math.PI / 2]} material={frameMaterial}>
        <cylinderGeometry args={[0.04, 0.04, 0.78, 8]} />
      </mesh>
      <mesh position={[-0.39, 0, 0]} material={frameMaterial}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
      </mesh>
      <mesh position={[0.39, 0, 0]} material={frameMaterial}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
      </mesh>
      <mesh material={lensMaterial}>
        <planeGeometry args={[0.72, 0.64]} />
      </mesh>
    </group>

    {/* Bridge */}
    <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]} material={frameMaterial}>
      <cylinderGeometry args={[0.035, 0.035, 0.22, 8]} />
    </mesh>

    {/* Temples */}
    <mesh position={[-1.0, 0.1, -0.55]} rotation={[Math.PI / 2, 0, 0]} material={frameMaterial}>
      <cylinderGeometry args={[0.025, 0.02, 1.1, 8]} />
    </mesh>
    <mesh position={[1.0, 0.1, -0.55]} rotation={[Math.PI / 2, 0, 0]} material={frameMaterial}>
      <cylinderGeometry args={[0.025, 0.02, 1.1, 8]} />
    </mesh>

    {/* Nose pads */}
    <mesh position={[-0.2, -0.28, 0.08]} rotation={[0.3, 0, 0]} material={frameMaterial}>
      <boxGeometry args={[0.06, 0.1, 0.03]} />
    </mesh>
    <mesh position={[0.2, -0.28, 0.08]} rotation={[0.3, 0, 0]} material={frameMaterial}>
      <boxGeometry args={[0.06, 0.1, 0.03]} />
    </mesh>
  </group>
);

/** Cat-eye frame — upswept outer corners */
const CatEyeFrame = ({ frameMaterial, lensMaterial }: FramePartProps) => (
  <group>
    {/* Left lens — round with upswept accent */}
    <mesh position={[-0.55, 0, 0]} scale={[1.1, 0.95, 1]} material={frameMaterial}>
      <torusGeometry args={[0.42, 0.04, 16, 48]} />
    </mesh>
    <mesh position={[-0.55, 0, 0]} scale={[1.1, 0.95, 1]} material={lensMaterial}>
      <circleGeometry args={[0.38, 32]} />
    </mesh>
    {/* Left cat-eye upsweep accent */}
    <mesh position={[-1.02, 0.25, 0]} rotation={[0, 0, 0.6]} material={frameMaterial}>
      <boxGeometry args={[0.2, 0.06, 0.04]} />
    </mesh>

    {/* Right lens */}
    <mesh position={[0.55, 0, 0]} scale={[1.1, 0.95, 1]} material={frameMaterial}>
      <torusGeometry args={[0.42, 0.04, 16, 48]} />
    </mesh>
    <mesh position={[0.55, 0, 0]} scale={[1.1, 0.95, 1]} material={lensMaterial}>
      <circleGeometry args={[0.38, 32]} />
    </mesh>
    {/* Right cat-eye upsweep accent */}
    <mesh position={[1.02, 0.25, 0]} rotation={[0, 0, -0.6]} material={frameMaterial}>
      <boxGeometry args={[0.2, 0.06, 0.04]} />
    </mesh>

    {/* Bridge */}
    <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} material={frameMaterial}>
      <cylinderGeometry args={[0.03, 0.03, 0.22, 12]} />
    </mesh>

    {/* Temples */}
    <mesh position={[-1.08, 0.15, -0.55]} rotation={[Math.PI / 2, 0, 0]} material={frameMaterial}>
      <cylinderGeometry args={[0.022, 0.018, 1.1, 8]} />
    </mesh>
    <mesh position={[1.08, 0.15, -0.55]} rotation={[Math.PI / 2, 0, 0]} material={frameMaterial}>
      <cylinderGeometry args={[0.022, 0.018, 1.1, 8]} />
    </mesh>

    {/* Nose pads */}
    <mesh position={[-0.18, -0.28, 0.08]} rotation={[0.3, 0, 0]} material={frameMaterial}>
      <boxGeometry args={[0.05, 0.09, 0.03]} />
    </mesh>
    <mesh position={[0.18, -0.28, 0.08]} rotation={[0.3, 0, 0]} material={frameMaterial}>
      <boxGeometry args={[0.05, 0.09, 0.03]} />
    </mesh>
  </group>
);

export default PlaceholderFrame;
