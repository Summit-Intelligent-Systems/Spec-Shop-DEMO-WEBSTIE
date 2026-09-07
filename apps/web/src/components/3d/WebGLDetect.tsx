'use client';

import { useState, useEffect } from 'react';

/**
 * Detects WebGL support and user motion preferences.
 * Used by all 3D canvas wrappers to decide whether to render
 * the WebGL scene or fall back to a static image.
 */
export function useWebGLSupport() {
  const [supported, setSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }

    // Check prefers-reduced-motion
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mql.addEventListener('change', handler);

    return () => mql.removeEventListener('change', handler);
  }, []);

  return { supported, prefersReducedMotion };
}

/**
 * Checks if the current device is likely mobile/touch-only.
 * Used to disable pointer-tilt interactions on touch devices.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(
        window.matchMedia('(max-width: 768px)').matches ||
          'ontouchstart' in window
      );
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}
