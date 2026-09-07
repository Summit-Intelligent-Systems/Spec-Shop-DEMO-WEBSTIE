'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping } from 'three';
import Image from 'next/image';
import { useWebGLSupport } from './WebGLDetect';

interface LazyCanvasProps {
  children: ReactNode;
  /** Static fallback image shown when WebGL is unavailable or reduced-motion is preferred */
  fallbackSrc?: string;
  fallbackAlt?: string;
  /** Additional CSS class for the container */
  className?: string;
  /** Background color for the canvas (CSS color string) */
  bgColor?: string;
  /** Camera field of view */
  fov?: number;
  /** Camera position [x, y, z] */
  cameraPosition?: [number, number, number];
  /** If true, the canvas is always mounted (used for hero/above-fold canvases) */
  eager?: boolean;
}

/**
 * Wrapper around R3F <Canvas> providing:
 * - IntersectionObserver lazy-mounting (only renders when visible in viewport)
 * - WebGL fallback to static image
 * - prefers-reduced-motion fallback
 * - Capped devicePixelRatio at 2
 * - Proper tone mapping and physically correct lighting
 * - Cleanup on unmount
 */
export const LazyCanvas = ({
  children,
  fallbackSrc,
  fallbackAlt = 'Product image',
  className = '',
  bgColor = 'transparent',
  fov = 45,
  cameraPosition = [0, 0, 5],
  eager = false,
}: LazyCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(eager);
  const { supported, prefersReducedMotion } = useWebGLSupport();

  // IntersectionObserver for lazy-loading (skip if eager)
  useEffect(() => {
    if (eager || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px', threshold: 0 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [eager]);

  // Show fallback when WebGL unsupported or reduced-motion preferred
  const showFallback = !supported || prefersReducedMotion;

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {showFallback ? (
        fallbackSrc ? (
          <Image
            src={fallbackSrc}
            alt={fallbackAlt}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-obsidian-950" />
        )
      ) : isVisible ? (
        <Canvas
          camera={{
            fov,
            position: cameraPosition,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, Math.min(window.devicePixelRatio, 2)]}
          gl={{
            antialias: true,
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          style={{ background: bgColor }}
        >
          {children}
        </Canvas>
      ) : (
        /* Placeholder space before IntersectionObserver fires */
        <div className="w-full h-full" style={{ background: bgColor }} />
      )}
    </div>
  );
};

export default LazyCanvas;
