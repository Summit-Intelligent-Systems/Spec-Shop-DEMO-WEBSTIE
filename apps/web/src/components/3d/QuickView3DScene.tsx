'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { PlaceholderFrame } from './PlaceholderFrame';
import { StudioLighting } from './StudioLighting';

/**
 * Quick-View 3D Scene — Scene 3
 *
 * Dedicated R3F scene for the product quick-view modal.
 * - Full OrbitControls (rotate + limited zoom)
 * - HTML hotspots anchored to 3D coordinates for material callouts
 * - Real-time color/material swap via props
 */

interface QuickView3DSceneProps {
  frameStyle: 'round' | 'aviator' | 'square' | 'cat-eye';
  frameMaterial: 'acetate' | 'titanium';
  frameColor: string;
  productName: string;
  features: string[];
}

/** Material detail hotspots positioned at key frame locations */
const HOTSPOTS = [
  {
    position: [-0.97, 0, 0] as [number, number, number],
    label: 'Precision Hinge',
    detail: '5-barrel custom hinge mechanism',
  },
  {
    position: [0, 0.1, 0] as [number, number, number],
    label: 'Bridge Design',
    detail: 'Ergonomic keyhole bridge',
  },
  {
    position: [0.55, 0, 0.02] as [number, number, number],
    label: 'Lens Coating',
    detail: 'Anti-scratch sapphire coating',
  },
  {
    position: [-0.55, 0, 0.02] as [number, number, number],
    label: 'Frame Material',
    detail: 'Premium Italian Mazzucchelli',
  },
];

export const QuickView3DScene = ({
  frameStyle,
  frameMaterial,
  frameColor,
  productName,
  features,
}: QuickView3DSceneProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Gentle auto-rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <>
      <StudioLighting showContactShadow={true} />

      {/* Full orbit controls for inspection */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={2.5}
        maxDistance={7}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI * 3 / 4}
        enableDamping
        dampingFactor={0.05}
      />

      {/* PLACEHOLDER — swap with real .glb product model */}
      <group ref={groupRef} position={[0, -0.1, 0]}>
        <PlaceholderFrame
          style={frameStyle}
          material={frameMaterial}
          color={frameColor}
          scale={1.8}
        />

        {/* HTML Hotspot overlays — material detail callouts */}
        {HOTSPOTS.map((hotspot, idx) => (
          <Html
            key={idx}
            position={[
              hotspot.position[0] * 1.8,
              hotspot.position[1] * 1.8,
              hotspot.position[2] * 1.8,
            ]}
            distanceFactor={5}
            style={{ pointerEvents: 'auto' }}
          >
            <div className="group/hotspot relative">
              {/* Pulsing dot */}
              <div className="w-3 h-3 rounded-full bg-gold/80 border-2 border-white shadow-gold cursor-pointer animate-pulse" />

              {/* Tooltip — visible on hover */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover/hotspot:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-obsidian-950/90 backdrop-blur-md text-white px-3 py-2 rounded-lg shadow-xl whitespace-nowrap border border-white/10">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gold">
                    {hotspot.label}
                  </div>
                  <div className="text-[10px] text-obsidian-300 mt-0.5">
                    {hotspot.detail}
                  </div>
                </div>
                {/* Arrow */}
                <div className="w-2 h-2 bg-obsidian-950/90 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </Html>
        ))}
      </group>
    </>
  );
};

export default QuickView3DScene;
