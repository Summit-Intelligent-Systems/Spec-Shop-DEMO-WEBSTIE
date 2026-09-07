'use client';

import { Environment, ContactShadows } from '@react-three/drei';

/**
 * Reusable 3-point studio lighting rig.
 * Provides consistent product-shot quality across all 3D scenes.
 * 
 * - HDRI studio environment for realistic reflections on lenses/metal
 * - Key light: warm directional from upper-right
 * - Fill light: cool ambient for shadow detail
 * - Rim light: subtle backlight for edge definition
 */
export const StudioLighting = ({
  showContactShadow = true,
}: {
  showContactShadow?: boolean;
}) => {
  return (
    <>
      {/* HDRI environment for realistic PBR reflections */}
      <Environment preset="studio" />

      {/* Key Light — warm, upper-right */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.8}
        color="#FFF5E6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill Light — cool ambient, softer */}
      <ambientLight intensity={0.4} color="#E0E8F0" />

      {/* Rim Light — subtle back-edge highlight */}
      <spotLight
        position={[-3, 4, -4]}
        intensity={0.8}
        color="#FFFFFF"
        angle={0.5}
        penumbra={0.8}
        castShadow={false}
      />

      {/* Ground contact shadow for grounded premium feel */}
      {showContactShadow && (
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.35}
          scale={8}
          blur={2.5}
          far={3}
          color="#0A0A0A"
        />
      )}
    </>
  );
};

export default StudioLighting;
