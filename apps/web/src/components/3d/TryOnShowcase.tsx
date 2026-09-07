'use client';

import { useRef, useState, lazy, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import { PlaceholderHead } from './PlaceholderHead';
import { PlaceholderFrame } from './PlaceholderFrame';
import { StudioLighting } from './StudioLighting';

/**
 * Virtual Try-On Showcase — Scene 5
 *
 * This is a "Try-On Preview" experience (NOT a live camera feature).
 * Shows a head model with glasses attached, idle rotation, frame swapping.
 *
 * - Head model (neutral face shape) with frame model attached at eye level
 * - Buttons swap between frame styles with scale-down/scale-up transition
 * - Slow idle rotation ±15° yaw (ping-pong)
 */

interface TryOnSceneProps {
  frameStyle: 'round' | 'aviator' | 'square' | 'cat-eye';
  frameMaterial: 'acetate' | 'titanium';
  frameColor: string;
}

export const TryOnScene = ({
  frameStyle,
  frameMaterial,
  frameColor,
}: TryOnSceneProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const frameGroupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Slow idle rotation: ±15° yaw, ping-pong
    timeRef.current += delta * 0.5;
    const yawAngle = Math.sin(timeRef.current) * (Math.PI / 12); // ±15°
    groupRef.current.rotation.y = yawAngle;
  });

  return (
    <>
      <StudioLighting showContactShadow={true} />

      <group ref={groupRef} position={[0, -0.3, 0]}>
        {/* Head model at neutral shape */}
        <PlaceholderHead shape="Oval" scale={1.2} />

        {/* Glasses attached at eye level */}
        {/* PLACEHOLDER — position will need tuning when real .glb models are used */}
        <group
          ref={frameGroupRef}
          position={[0, 0.05, 0.62]}
          scale={0.85}
        >
          <PlaceholderFrame
            style={frameStyle}
            material={frameMaterial}
            color={frameColor}
            scale={1.0}
          />
        </group>
      </group>
    </>
  );
};

/* ─── Wrapper Component with Frame Selection UI ─── */

const LazyCanvas = lazy(() => import('@/components/3d/LazyCanvas'));

const FRAME_OPTIONS = [
  { id: 'round', label: 'The Sovereign Round', style: 'round' as const, material: 'acetate' as const, color: '#633B18' },
  { id: 'aviator', label: 'The Aviator Prime', style: 'aviator' as const, material: 'titanium' as const, color: '#C9A84C' },
  { id: 'square', label: 'The Kensington Square', style: 'square' as const, material: 'acetate' as const, color: '#27272A' },
  { id: 'cat-eye', label: 'The Marais Cat-Eye', style: 'cat-eye' as const, material: 'acetate' as const, color: '#09090B' },
];

export const TryOnShowcase = () => {
  const [selectedFrame, setSelectedFrame] = useState(FRAME_OPTIONS[0]);

  return (
    <section className="py-24 bg-obsidian-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: 3D Canvas */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden bg-obsidian-900 aspect-[4/3] shadow-2xl border border-obsidian-800">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-obsidian-500 text-xs">
                    Loading Try-On Preview...
                  </div>
                }
              >
                <LazyCanvas
                  bgColor="#1A1A1A"
                  fov={30}
                  cameraPosition={[0.8, 0.5, 4]}
                  fallbackSrc="/images/hero-banner.jpg"
                  fallbackAlt="Virtual try-on preview"
                >
                  <TryOnScene
                    frameStyle={selectedFrame.style}
                    frameMaterial={selectedFrame.material}
                    frameColor={selectedFrame.color}
                  />
                </LazyCanvas>
              </Suspense>

              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-obsidian-950/70 text-white backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  Try-On Preview
                </span>
              </div>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold">
                3D Try-On Studio
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-light leading-tight">
                See how every frame{' '}
                <span className="italic text-gold-300">sits on you.</span>
              </h2>
              <p className="text-sm text-obsidian-400 font-light leading-relaxed">
                Explore different frame styles on our 3D model. Tap a style below to see an instant preview — no camera needed.
              </p>
            </div>

            {/* Frame Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-obsidian-500">
                Select Frame Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {FRAME_OPTIONS.map((frame) => {
                  const isSelected = selectedFrame.id === frame.id;
                  return (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => setSelectedFrame(frame)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-gold bg-gold/10 shadow-gold ring-1 ring-gold/40'
                          : 'border-obsidian-700 hover:border-obsidian-500 bg-obsidian-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Color swatch */}
                        <div
                          className="w-5 h-5 rounded-full border-2 border-obsidian-600 shrink-0"
                          style={{ backgroundColor: frame.color }}
                        />
                        <div>
                          <div className={`text-xs font-semibold ${isSelected ? 'text-gold' : 'text-white'}`}>
                            {frame.label}
                          </div>
                          <div className="text-[10px] text-obsidian-500 capitalize">
                            {frame.material} • {frame.style}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-obsidian-600 leading-relaxed">
              This is a showcase preview using our 3D head model. For a live camera try-on experience with face tracking, visit our{' '}
              <a href="/try-on" className="text-gold hover:text-gold-300 underline">
                Virtual Try-On Studio
              </a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryOnShowcase;
