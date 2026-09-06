'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Camera,
  RotateCcw,
  Sparkles,
  SplitSquareVertical,
  ShoppingBag,
  VideoOff,
} from 'lucide-react';
import { MOCK_PRODUCTS, type ProductItem } from '@/lib/mockData';
import { useCartStore } from '@/lib/store/cartStore';

interface VirtualTryOnModalProps {
  product?: ProductItem;
  isOpen: boolean;
  onClose: () => void;
}

const MODEL_FACES = [
  { id: 'model-1', name: 'Devan (Square Face)', image: '/images/category-men.jpg', faceShape: 'Square' },
  { id: 'model-2', name: 'Tara (Oval Face)', image: '/images/category-sunglasses.jpg', faceShape: 'Oval' },
  { id: 'model-3', name: 'Aarav (Round Face)', image: '/images/hero-banner.jpg', faceShape: 'Round' },
  { id: 'model-4', name: 'Elena (Heart Face)', image: '/images/product-craft.jpg', faceShape: 'Heart' },
];

export const VirtualTryOnModal = ({
  product = MOCK_PRODUCTS[0],
  isOpen,
  onClose,
}: VirtualTryOnModalProps) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(product);
  const [comparisonProduct, setComparisonProduct] = useState<ProductItem | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);

  // Mode: 'camera' | 'model'
  const [streamMode, setStreamMode] = useState<'camera' | 'model'>('model');
  const [selectedModel, setSelectedModel] = useState(MODEL_FACES[0]);

  // Adjustments
  const [frameScale, setFrameScale] = useState(100); // 80 to 130%
  const [verticalOffset, setVerticalOffset] = useState(0); // -40 to 40 px
  const [horizontalOffset, setHorizontalOffset] = useState(0); // -30 to 30 px
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
    }
  }, [product]);

  // Webcam init
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam not supported in this browser environment');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStreamMode('camera');
    } catch (err: any) {
      setCameraError(err.message || 'Unable to access camera. Please allow camera permissions or use our studio models.');
      setStreamMode('model');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  const handleAddToCart = (prod: ProductItem) => {
    addItem(
      {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        basePrice: prod.price,
        baseComparePrice: prod.comparePrice,
        images: [{ url: prod.colors[0].image, isPrimary: true }],
      } as any,
      {
        id: `${prod.id}-var-0`,
        color: prod.colors[0].name,
        colorHex: prod.colors[0].hex,
        size: 'Medium',
        price: prod.price,
        images: [{ url: prod.colors[0].image, isPrimary: true }],
      } as any,
      1,
    );
    onClose();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-obsidian-200/80 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-obsidian-100 flex items-center justify-between bg-obsidian-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold/15 text-gold-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-gold">
                Augmented Reality Fitting
              </div>
              <h3 className="font-serif text-xl font-medium text-obsidian-950">
                Virtual Optical Mirror & Fit Studio
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Compare Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsCompareMode(!isCompareMode);
                if (!comparisonProduct) {
                  setComparisonProduct(
                    MOCK_PRODUCTS.find((p) => p.id !== selectedProduct.id) || MOCK_PRODUCTS[1],
                  );
                }
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isCompareMode
                  ? 'border-obsidian-950 bg-obsidian-950 text-white'
                  : 'border-obsidian-300 text-obsidian-700 hover:border-obsidian-400'
              }`}
            >
              <SplitSquareVertical className="w-4 h-4" />
              <span>Side-by-Side Compare</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-2 rounded-full text-obsidian-400 hover:text-obsidian-950 hover:bg-obsidian-100 transition-colors"
              aria-label="Close try-on modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Stage Canvas (Col 8) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Camera / Model Canvas Stage */}
            <div className="relative aspect-[4/3] bg-obsidian-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-obsidian-800">
              {/* Webcam Video Stream */}
              {streamMode === 'camera' ? (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                /* Studio Model Face Image */
                <Image
                  src={selectedModel.image}
                  alt={selectedModel.name}
                  fill
                  className="object-cover object-top"
                />
              )}

              {/* Single Frame Overlay OR Dual Frame Split View */}
              {!isCompareMode ? (
                <div
                  className="absolute pointer-events-none transition-all duration-75 drop-shadow-2xl"
                  style={{
                    width: `${54 * (frameScale / 100)}%`,
                    top: `calc(38% + ${verticalOffset}px)`,
                    left: `calc(50% + ${horizontalOffset}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <Image
                    src={selectedProduct.colors[0].image}
                    alt={selectedProduct.name}
                    width={400}
                    height={200}
                    className="w-full object-contain filter drop-shadow-xl"
                  />
                </div>
              ) : (
                /* Split Comparison Overlay */
                <div className="absolute inset-0 grid grid-cols-2 divide-x-2 divide-white/60 pointer-events-none">
                  {/* Left Side: Frame A */}
                  <div className="relative h-full">
                    <div
                      className="absolute transition-all drop-shadow-2xl"
                      style={{
                        width: `${75 * (frameScale / 100)}%`,
                        top: `calc(38% + ${verticalOffset}px)`,
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <Image
                        src={selectedProduct.colors[0].image}
                        alt={selectedProduct.name}
                        width={300}
                        height={150}
                        className="w-full object-contain"
                      />
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white font-semibold">
                      A: {selectedProduct.name}
                    </div>
                  </div>

                  {/* Right Side: Frame B */}
                  <div className="relative h-full">
                    <div
                      className="absolute transition-all drop-shadow-2xl"
                      style={{
                        width: `${75 * (frameScale / 100)}%`,
                        top: `calc(38% + ${verticalOffset}px)`,
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <Image
                        src={comparisonProduct?.colors[0].image || selectedProduct.colors[0].image}
                        alt={comparisonProduct?.name || ''}
                        width={300}
                        height={150}
                        className="w-full object-contain"
                      />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white font-semibold">
                      B: {comparisonProduct?.name}
                    </div>
                  </div>
                </div>
              )}

              {/* Live Overlay Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-black/60 text-white backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>Real-Time Fit</span>
                </span>
                {streamMode === 'camera' && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold bg-red-600 text-white px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    LIVE
                  </span>
                )}
              </div>
            </div>

            {/* Mirror Controls Bar */}
            <div className="bg-obsidian-50 p-4 rounded-2xl border border-obsidian-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                {streamMode === 'model' ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-obsidian-950 text-white font-semibold hover:bg-obsidian-800 transition-colors shadow-xs"
                  >
                    <Camera className="w-4 h-4 text-gold" />
                    <span>Switch to Live Camera</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setStreamMode('model');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-obsidian-200 text-obsidian-900 font-semibold hover:bg-obsidian-300 transition-colors"
                  >
                    <VideoOff className="w-4 h-4" />
                    <span>Use Studio Models</span>
                  </button>
                )}
              </div>

              {/* Scale Slider */}
              <div className="flex items-center gap-3">
                <span className="text-obsidian-500 font-medium">Scale:</span>
                <input
                  type="range"
                  min={80}
                  max={125}
                  value={frameScale}
                  onChange={(e) => setFrameScale(Number(e.target.value))}
                  className="w-24 h-1.5 bg-obsidian-300 rounded-lg appearance-none cursor-pointer accent-obsidian-950"
                />
                <span className="font-mono text-obsidian-700 w-8">{frameScale}%</span>
              </div>

              {/* Vertical Position */}
              <div className="flex items-center gap-3">
                <span className="text-obsidian-500 font-medium">Vertical:</span>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  value={verticalOffset}
                  onChange={(e) => setVerticalOffset(Number(e.target.value))}
                  className="w-24 h-1.5 bg-obsidian-300 rounded-lg appearance-none cursor-pointer accent-obsidian-950"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFrameScale(100);
                    setVerticalOffset(0);
                    setHorizontalOffset(0);
                  }}
                  className="text-obsidian-500 hover:text-obsidian-950"
                  title="Reset alignment"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {cameraError && (
              <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs border border-amber-200">
                {cameraError}
              </div>
            )}
          </div>

          {/* Controls & Catalog Carousel (Col 4) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Model Selector (when in model mode) */}
            {streamMode === 'model' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-obsidian-500">
                  Select Studio Face Shape
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MODEL_FACES.map((mod) => (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setSelectedModel(mod)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        selectedModel.id === mod.id
                          ? 'border-obsidian-950 bg-obsidian-50 font-semibold ring-1 ring-obsidian-950'
                          : 'border-obsidian-200 hover:border-obsidian-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-obsidian-200 overflow-hidden relative shrink-0">
                        <Image src={mod.image} alt={mod.name} fill className="object-cover" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs text-obsidian-900 truncate">{mod.name}</div>
                        <div className="text-[10px] text-gold-700">{mod.faceShape}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Frame Carousel */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-obsidian-500">
                Try Different Frames
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {MOCK_PRODUCTS.map((prod) => {
                  const isSelected = selectedProduct.id === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                        isSelected
                          ? 'border-obsidian-950 bg-obsidian-50 shadow-xs ring-1 ring-obsidian-950'
                          : 'border-obsidian-200 hover:border-obsidian-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-lg bg-obsidian-100 relative shrink-0 overflow-hidden">
                          <Image
                            src={prod.colors[0].image}
                            alt={prod.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-obsidian-900 truncate">
                            {prod.name}
                          </div>
                          <div className="text-[10px] text-obsidian-500">
                            {prod.frameShape} • ₹{prod.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-obsidian-50 rounded-2xl border border-obsidian-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-obsidian-500">Selected Frame:</span>
                <span className="text-sm font-bold text-obsidian-950">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleAddToCart(selectedProduct)}
                className="w-full py-3 rounded-xl bg-obsidian-950 hover:bg-obsidian-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add {selectedProduct.name} to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
