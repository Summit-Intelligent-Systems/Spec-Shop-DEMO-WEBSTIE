'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Rotate3D, MoveHorizontal } from 'lucide-react';

interface ProductViewer360Props {
  productName: string;
  baseImage: string;
}

export const ProductViewer360 = ({ productName, baseImage }: ProductViewer360Props) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startAngleRef.current = rotationAngle;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const newAngle = (startAngleRef.current + deltaX * 0.75) % 360;
    setRotationAngle(newAngle < 0 ? newAngle + 360 : newAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    startAngleRef.current = rotationAngle;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const newAngle = (startAngleRef.current + deltaX * 0.75) % 360;
    setRotationAngle(newAngle < 0 ? newAngle + 360 : newAngle);
  };

  // Calculate 3D perspective transform parameters based on angle
  const skewY = Math.sin((rotationAngle * Math.PI) / 180) * 4;

  return (
    <div className="bg-obsidian-50 rounded-3xl p-6 sm:p-8 border border-obsidian-200/80 space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rotate3D className="w-5 h-5 text-gold" />
          <h3 className="font-serif text-lg font-medium text-obsidian-950">
            360° Optical Turntable
          </h3>
        </div>
        <span className="text-xs font-mono font-semibold text-obsidian-500 bg-white px-2.5 py-1 rounded-full border border-obsidian-200">
          {Math.round(rotationAngle)}° View
        </span>
      </div>

      {/* Interactive Turntable Canvas */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className={`relative aspect-[16/9] bg-radial from-white via-obsidian-50 to-obsidian-100 rounded-2xl flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing border border-obsidian-200 shadow-inner`}
      >
        {/* Frame Rendering with simulated 3D projection */}
        <div
          className="relative w-4/5 h-4/5 transition-transform duration-75 flex items-center justify-center"
          style={{
            transform: `perspective(800px) rotateY(${rotationAngle}deg) skewY(${skewY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <Image
            src={baseImage}
            alt={`${productName} 360 projection`}
            fill
            className="object-contain filter drop-shadow-2xl pointer-events-none"
          />
        </div>

        {/* Circular base platter overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 border-b-2 border-dashed border-obsidian-300 rounded-full opacity-40 pointer-events-none" />

        {/* Drag Hint Overlay */}
        <div className="absolute bottom-3 flex items-center gap-1.5 text-[11px] font-semibold text-obsidian-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-obsidian-200 pointer-events-none">
          <MoveHorizontal className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
          <span>Drag left or right to rotate</span>
        </div>
      </div>
    </div>
  );
};
