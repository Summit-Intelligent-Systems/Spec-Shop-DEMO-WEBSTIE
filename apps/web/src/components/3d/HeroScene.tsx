'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { PlaceholderFrame } from './PlaceholderFrame';
import { StudioLighting } from './StudioLighting';
import { useIsMobile } from './WebGLDetect';

/**
 * Hero Product Viewer — Scene 1
 *
 * Features:
 * - Auto-rotation on Y-axis (0.15 rad/sec) when idle
 * - OrbitControls with restricted polar angle, no zoom
 * - Pointer-move tilt toward cursor (desktop only, lerp ~0.05/frame)
 * - GSAP ScrollTrigger integration for scroll-linked camera dolly (handled externally)
 * - ContactShadows via StudioLighting
 */

interface HeroSceneProps {
  /** Scroll progress 0-1 from parent, used for camera dolly + rotation */
  scrollProgress?: number;
}

export const HeroScene = ({ scrollProgress = 0 }: HeroSceneProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const { camera } = useThree();

  // Store initial camera position for scroll-based dolly
  const initialCamZ = useRef(camera.position.z);

  // Pointer move handler — only on desktop
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (isMobile) return;
      // Normalize cursor position to [-1, 1]
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      // Cap tilt to subtle ±0.15 radians
      targetRotation.current.x = y * 0.15;
      targetRotation.current.y = x * 0.2;
    },
    [isMobile]
  );

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [handlePointerMove, isMobile]);

  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Auto-rotation (0.15 rad/sec on Y)
    groupRef.current.rotation.y += delta * 0.15;

    // Pointer-tilt lerp (desktop only)
    if (!isMobile) {
      currentRotation.current.x = THREE.MathUtils.lerp(
        currentRotation.current.x,
        targetRotation.current.x,
        0.05
      );
      currentRotation.current.y = THREE.MathUtils.lerp(
        currentRotation.current.y,
        targetRotation.current.y,
        0.05
      );
      groupRef.current.rotation.x = currentRotation.current.x;
      // Add pointer tilt to auto-rotation Y
      groupRef.current.rotation.y += currentRotation.current.y * 0.3;
    }

    // Scroll-linked camera dolly: zoom out as user scrolls
    const targetZ = initialCamZ.current + scrollProgress * 3;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);

    // Scroll-linked model rotation boost
    groupRef.current.rotation.y += scrollProgress * 0.5 * delta;
  });

  return (
    <>
      <StudioLighting showContactShadow={true} />

      {/* Restricted orbit controls — no zoom, limited vertical rotation */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}    /* 60° */
        maxPolarAngle={Math.PI * 2 / 3} /* 120° */
        enableDamping
        dampingFactor={0.05}
        autoRotate={false} /* We handle rotation manually for more control */
      />

      {/* PLACEHOLDER — swap with real .glb hero frame model */}
      <group ref={groupRef} position={[0, -0.2, 0]}>
        <PlaceholderFrame
          style="round"
          material="acetate"
          scale={1.6}
        />
      </group>
    </>
  );
};

export default HeroScene;
