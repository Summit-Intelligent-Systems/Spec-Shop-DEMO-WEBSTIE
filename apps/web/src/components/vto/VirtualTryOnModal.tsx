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
  Upload,
  User,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
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

  // Mode: 'camera' | 'upload' | 'model'
  const [streamMode, setStreamMode] = useState<'camera' | 'upload' | 'model'>('model');
  const [selectedModel, setSelectedModel] = useState(MODEL_FACES[0]);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  // Adjustments
  const [frameScale, setFrameScale] = useState(100); // 80 to 130%
  const [verticalOffset, setVerticalOffset] = useState(0); // -40 to 40 px
  const [horizontalOffset, setHorizontalOffset] = useState(0); // -30 to 30 px
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
    }
  }, [product]);

  // Webcam init
  const startCamera = async () => {
    setCameraError(null);
    setIsStartingCamera(true);
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser or environment. You can upload a photo instead.');
      }

      // Stop any existing stream first
      stopCamera();

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        });
      } catch (firstErr: any) {
        // If ideal constraints failed, fallback to simplest video request
        if (firstErr.name === 'OverconstrainedError' || firstErr.name === 'ConstraintNotSatisfiedError') {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } else {
          throw firstErr;
        }
      }

      cameraStreamRef.current = stream;
      setIsCameraActive(true);
      setStreamMode('camera');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera request error:', err);
      setIsCameraActive(false);
      const isDenied =
        err.name === 'NotAllowedError' ||
        err.name === 'PermissionDeniedError' ||
        err.message?.toLowerCase().includes('denied') ||
        err.message?.toLowerCase().includes('not allowed');

      if (isDenied) {
        setCameraError(
          'Your browser previously blocked camera access for this site. Click the lock 🔒 or sliders icon in your URL address bar, reset or allow Camera, then click "Try Again" below to see the browser prompt.',
        );
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera was detected on this device. You can upload a photo or use studio models.');
      } else {
        setCameraError(err.message || 'Unable to access camera. Please allow camera permissions or upload a photo.');
      }
    } finally {
      setIsStartingCamera(false);
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Attach stream whenever videoRef and cameraStreamRef exist and in camera mode
  useEffect(() => {
    if (streamMode === 'camera' && cameraStreamRef.current && videoRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [streamMode]);

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setUploadedPhoto(dataUrl);
        stopCamera();
        setStreamMode('upload');
        setCameraError(null);
      }
    };
    reader.readAsDataURL(file);
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
            {/* Camera / Model / Photo Canvas Stage */}
            <div className="relative aspect-[4/3] bg-obsidian-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-obsidian-800">
              {/* Webcam Video Stream - always mounted so ref is never null */}
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover -scale-x-100 ${
                  streamMode === 'camera' ? 'block' : 'hidden'
                }`}
              />

              {/* Uploaded User Photo */}
              {streamMode === 'upload' && uploadedPhoto && (
                <div className="relative w-full h-full flex items-center justify-center bg-obsidian-900">
                  <img
                    src={uploadedPhoto}
                    alt="Your portrait"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}

              {/* Upload Prompt if in upload mode but no photo selected yet */}
              {streamMode === 'upload' && !uploadedPhoto && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-obsidian-900/95 z-20">
                  <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold mb-4 shadow-gold">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl font-medium text-white mb-2">
                    Upload Your Photo
                  </h4>
                  <p className="text-xs text-obsidian-300 max-w-sm mb-6 leading-relaxed">
                    Upload a straight-facing selfie or portrait from your phone or computer to try frames directly on your own face.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold hover:bg-gold-400 text-obsidian-950 text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose Photo from Device</span>
                  </button>
                  <span className="text-[10px] text-obsidian-400 mt-4">
                    JPG, PNG, WEBP • Processed locally in your browser
                  </span>
                </div>
              )}

              {/* Camera Permission Invitation / Request Screen */}
              {streamMode === 'camera' && !isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-obsidian-950/95 z-20">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shadow-gold">
                      <Camera className="w-8 h-8" />
                    </div>
                    {isStartingCamera && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-obsidian-950 animate-ping" />
                    )}
                  </div>

                  <h4 className="font-serif text-xl font-medium text-white mb-2">
                    {cameraError ? 'Camera Access Needed' : 'Start Live Virtual Mirror'}
                  </h4>

                  <p className="text-xs text-obsidian-300 max-w-sm mb-6 leading-relaxed">
                    {isStartingCamera ? (
                      <span className="text-gold-300">
                        Check the top of your browser window — select <strong className="text-white">&quot;Allow while visiting site&quot;</strong> or <strong className="text-white">&quot;Allow this time&quot;</strong>.
                      </span>
                    ) : cameraError ? (
                      <span>
                        Your browser didn&apos;t grant camera access yet. Click below to request permission, then choose <strong className="text-gold">&quot;Allow while visiting site&quot;</strong> or <strong className="text-gold">&quot;Allow this time&quot;</strong> in your browser&apos;s popup.
                      </span>
                    ) : (
                      <span>
                        Click below to open your camera. When your browser prompts you, click <strong className="text-gold">&quot;Allow while visiting site&quot;</strong> or <strong className="text-gold">&quot;Allow this time&quot;</strong>.
                      </span>
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={isStartingCamera}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gold hover:bg-gold-400 text-obsidian-950 text-xs font-bold uppercase tracking-wider transition-all shadow-gold hover:shadow-gold-lg active:scale-95 disabled:opacity-60"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{isStartingCamera ? 'Prompting Browser...' : 'Allow Camera & Begin Fit'}</span>
                  </button>

                  <div className="flex items-center gap-4 mt-6 text-xs text-obsidian-400">
                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        setStreamMode('upload');
                        setCameraError(null);
                        fileInputRef.current?.click();
                      }}
                      className="hover:text-gold transition-colors underline underline-offset-4"
                    >
                      Upload a photo instead
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        setStreamMode('model');
                        setCameraError(null);
                      }}
                      className="hover:text-gold transition-colors underline underline-offset-4"
                    >
                      Use studio models
                    </button>
                  </div>
                </div>
              )}

              {/* Studio Model Face Image */}
              {streamMode === 'model' && (
                <Image
                  src={selectedModel.image}
                  alt={selectedModel.name}
                  fill
                  className="object-cover object-top"
                />
              )}

              {/* Single Frame Overlay OR Dual Frame Split View */}
              {!(
                (streamMode === 'upload' && !uploadedPhoto) ||
                (streamMode === 'camera' && !isCameraActive)
              ) && (
                !isCompareMode ? (
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
                )
              )}

              {/* Status Overlay Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-black/60 text-white backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>Real-Time Fit</span>
                </span>
                {streamMode === 'camera' && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold bg-red-600 text-white px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    LIVE CAMERA
                  </span>
                )}
                {streamMode === 'upload' && uploadedPhoto && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold bg-gold-600 text-obsidian-950 px-2 py-0.5 rounded-full">
                    YOUR PHOTO
                  </span>
                )}
              </div>
            </div>

            {/* Hidden File Input for Photo Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            {/* Mode Switcher Tabs */}
            <div className="bg-obsidian-50 p-2 rounded-2xl border border-obsidian-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-obsidian-200/80 shadow-2xs">
                {/* Mode 1: Camera */}
                <button
                  type="button"
                  onClick={() => {
                    startCamera();
                  }}
                  disabled={isStartingCamera}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    streamMode === 'camera'
                      ? 'bg-obsidian-950 text-white shadow-xs'
                      : 'text-obsidian-700 hover:text-obsidian-950 hover:bg-obsidian-50'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-gold" />
                  <span>{isStartingCamera ? 'Connecting...' : 'Live Camera'}</span>
                </button>

                {/* Mode 2: Photo Upload */}
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setStreamMode('upload');
                    setCameraError(null);
                    if (!uploadedPhoto) {
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    streamMode === 'upload'
                      ? 'bg-obsidian-950 text-white shadow-xs'
                      : 'text-obsidian-700 hover:text-obsidian-950 hover:bg-obsidian-50'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 text-gold" />
                  <span>{uploadedPhoto ? 'Your Photo' : 'Upload Photo'}</span>
                </button>

                {/* Mode 3: Studio Models */}
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setStreamMode('model');
                    setCameraError(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    streamMode === 'model'
                      ? 'bg-obsidian-950 text-white shadow-xs'
                      : 'text-obsidian-700 hover:text-obsidian-950 hover:bg-obsidian-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Studio Models</span>
                </button>
              </div>

              {/* Photo Change Button if in upload mode */}
              {streamMode === 'upload' && uploadedPhoto && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-obsidian-800 bg-obsidian-200/70 hover:bg-obsidian-300 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </button>
              )}

              {/* Frame Scale & Position Controls */}
              <div className="flex items-center gap-4 text-xs">
                {/* Scale Slider */}
                <div className="flex items-center gap-2">
                  <span className="text-obsidian-500 font-medium">Scale:</span>
                  <input
                    type="range"
                    min={80}
                    max={125}
                    value={frameScale}
                    onChange={(e) => setFrameScale(Number(e.target.value))}
                    className="w-20 h-1.5 bg-obsidian-300 rounded-lg appearance-none cursor-pointer accent-obsidian-950"
                  />
                  <span className="font-mono text-obsidian-700 w-7">{frameScale}%</span>
                </div>

                {/* Vertical Position */}
                <div className="flex items-center gap-2">
                  <span className="text-obsidian-500 font-medium">Bridge:</span>
                  <input
                    type="range"
                    min={-30}
                    max={30}
                    value={verticalOffset}
                    onChange={(e) => setVerticalOffset(Number(e.target.value))}
                    className="w-20 h-1.5 bg-obsidian-300 rounded-lg appearance-none cursor-pointer accent-obsidian-950"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFrameScale(100);
                      setVerticalOffset(0);
                      setHorizontalOffset(0);
                    }}
                    className="p-1 text-obsidian-400 hover:text-obsidian-950 transition-colors"
                    title="Reset position"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Camera Error / Permission Instructions */}
            {cameraError && (
              <div className="p-3.5 bg-amber-50/90 text-amber-950 rounded-2xl text-xs border border-amber-200 shadow-2xs space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{cameraError}</p>
                </div>
                <div className="flex items-center gap-2.5 pl-6 pt-1">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-semibold text-xs transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Camera Again</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setStreamMode('upload');
                      setCameraError(null);
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-950 hover:bg-obsidian-800 text-white font-semibold text-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-gold" />
                    <span>Upload a Photo Instead</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls & Catalog Carousel (Col 4) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Mode-Specific Context Panel */}
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

            {streamMode === 'upload' && (
              <div className="p-3.5 bg-obsidian-50 rounded-2xl border border-obsidian-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-obsidian-600">
                    Photo Try-On Mode
                  </span>
                  {uploadedPhoto && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Photo Loaded
                    </span>
                  )}
                </div>
                <p className="text-xs text-obsidian-500 leading-relaxed">
                  {uploadedPhoto
                    ? 'Adjust the scale and bridge sliders to fine-tune the glasses alignment on your face.'
                    : 'Select a front-facing selfie to preview all frames with accurate scale and styling.'}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl border border-obsidian-300 hover:border-obsidian-950 bg-white text-xs font-semibold text-obsidian-900 flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-gold" />
                  <span>{uploadedPhoto ? 'Upload Another Photo' : 'Upload Your Selfie'}</span>
                </button>
              </div>
            )}

            {streamMode === 'camera' && (
              <div className="p-3.5 bg-obsidian-50 rounded-2xl border border-obsidian-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-obsidian-700">
                    Live Mirror Stream
                  </span>
                </div>
                <p className="text-xs text-obsidian-500 leading-relaxed">
                  Look straight into your camera. Use the <strong>Scale</strong> and <strong>Bridge</strong> sliders to match your pupillary distance (PD) and nose height.
                </p>
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
