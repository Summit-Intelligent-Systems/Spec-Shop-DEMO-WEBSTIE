'use client';

import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { PlaceholderFrame } from './PlaceholderFrame';
import { StudioLighting } from './StudioLighting';

/**
 * Material/Craft Story — Scene 6 (Scroll-Pinned)
 *
 * Scroll-linked 3D storytelling section.
 * Canvas is pinned while text callouts change beside it.
 * Each scroll step triggers camera dolly + rotation + text fade.
 */

const CRAFT_STEPS = [
  {
    title: 'Italian Mazzucchelli Acetate',
    description:
      'Each frame begins as a raw block of organic cotton-based acetate, sourced exclusively from the Mazzucchelli workshop in Castiglione Olona, Italy. Hand-polished over 48 hours for a luminous depth of color.',
    camera: { x: 0, y: 0.2, z: 2.5 },
    rotation: 0,
    badge: '01 — Material',
  },
  {
    title: '5-Barrel Hinge Mechanism',
    description:
      'Our proprietary 5-barrel hinge is CNC-milled from surgical stainless steel, providing 60,000+ open-close cycles without loosening. Each hinge is hand-fitted with micro-tension screws.',
    camera: { x: -1.5, y: 0, z: 2 },
    rotation: Math.PI / 3,
    badge: '02 — Engineering',
  },
  {
    title: 'Sapphire Anti-Scratch Coating',
    description:
      'A 7-layer nano-coating stack applied under vacuum deposition: anti-reflective, oleophobic, hydrophobic, UV400, blue-light filter, anti-static, and sapphire hardness top coat.',
    camera: { x: 0.8, y: 0.5, z: 1.8 },
    rotation: -Math.PI / 4,
    badge: '03 — Optics',
  },
  {
    title: 'Hand-Finished Quality Control',
    description:
      'Every frame undergoes a 27-point inspection by certified master opticians. Temple alignment, lens seating, hinge tension, and cosmetic finish are each verified to ±0.1mm precision.',
    camera: { x: 0, y: -0.3, z: 3 },
    rotation: Math.PI / 6,
    badge: '04 — Precision',
  },
];

/** Inner 3D scene component */
const CraftScene = ({ stepIndex }: { stepIndex: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(0);
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const step = CRAFT_STEPS[stepIndex] || CRAFT_STEPS[0];
    targetRotation.current = step.rotation;

    // Lerp rotation toward target
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current,
      0.03
    );

    // Also add very slow continuous rotation for life
    groupRef.current.rotation.y += delta * 0.03;

    // Lerp camera position toward step target
    const cam = step.camera;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, cam.x, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, cam.y, 0.03);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, cam.z, 0.03);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <StudioLighting showContactShadow={true} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />

      {/* PLACEHOLDER — swap with real extreme close-up .glb frame detail model */}
      <group ref={groupRef}>
        <PlaceholderFrame
          style="round"
          material="acetate"
          scale={2.2}
        />
      </group>
    </>
  );
};

/** Main section wrapper with scroll-driven step progression */
const LazyCanvas = lazy(() => import('@/components/3d/LazyCanvas'));

export const CraftStorySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Scroll-driven step progression (simulates GSAP ScrollTrigger pin)
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate progress through the pinned section
      const scrolled = viewportHeight - rect.top;
      const totalScrollable = sectionHeight;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      // Map progress to step index
      const stepIndex = Math.min(
        CRAFT_STEPS.length - 1,
        Math.floor(progress * CRAFT_STEPS.length)
      );
      setActiveStep(stepIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white border-b border-obsidian-100"
      style={{ minHeight: `${CRAFT_STEPS.length * 100}vh` }}
    >
      {/* Sticky container that pins the content */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Pinned 3D Canvas */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden bg-obsidian-950 aspect-square shadow-2xl border border-obsidian-800">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center text-obsidian-500 text-xs">
                      Loading Craft Story...
                    </div>
                  }
                >
                  <LazyCanvas
                    bgColor="#0A0A0A"
                    fov={35}
                    cameraPosition={[0, 0.2, 2.5]}
                    fallbackSrc="/images/product-craft.jpg"
                    fallbackAlt="Craft and material detail"
                  >
                    <CraftScene stepIndex={activeStep} />
                  </LazyCanvas>
                </Suspense>

                {/* Step counter badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-obsidian-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold/20">
                    {CRAFT_STEPS[activeStep]?.badge}
                  </span>
                </div>

                {/* Step progress dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                  {CRAFT_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`rounded-full transition-all duration-500 ${
                        idx === activeStep
                          ? 'w-6 h-2 bg-gold'
                          : 'w-2 h-2 bg-obsidian-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Text callouts that change per step */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold">
                  The Art of Precision
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-obsidian-900 font-light leading-tight">
                  Crafted with{' '}
                  <span className="italic">obsessive</span> attention to detail.
                </h2>
              </div>

              {/* Animated step content */}
              <div className="relative min-h-[200px]">
                {CRAFT_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className={`transition-all duration-700 ease-out ${
                      idx === activeStep
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 absolute top-0 left-0 right-0 pointer-events-none'
                    }`}
                  >
                    <div className="p-6 rounded-2xl bg-obsidian-50 border border-obsidian-200 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded-lg">
                          {step.badge}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl text-obsidian-900 font-medium">
                        {step.title}
                      </h3>
                      <p className="text-sm text-obsidian-600 leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll hint */}
              <div className="flex items-center gap-2 text-obsidian-400 text-xs">
                <div className="w-5 h-8 rounded-full border-2 border-obsidian-300 flex items-start justify-center p-1">
                  <div className="w-1 h-2 bg-obsidian-400 rounded-full animate-bounce" />
                </div>
                <span>Scroll to explore each craft detail</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftStorySection;
