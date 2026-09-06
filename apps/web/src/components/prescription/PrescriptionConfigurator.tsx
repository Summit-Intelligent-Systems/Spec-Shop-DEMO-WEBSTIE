'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Glasses,
  Monitor,
  Eye,
  Sun,
  Sparkles,
  UploadCloud,
  MessageCircle,
  FileText,
} from 'lucide-react';
import type { ProductItem } from '@/lib/mockData';
import { useCartStore } from '@/lib/store/cartStore';

interface PrescriptionConfiguratorProps {
  product: ProductItem;
  selectedColorIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Step 1: Vision Types ──────────────────────────────────────────────────
const VISION_TYPES = [
  {
    id: 'zero-power',
    title: 'Zero Power / Digital Screen',
    description: 'No prescription. Complete blue-light & UV400 defense for digital screen users.',
    price: 0,
    icon: Monitor,
    badge: 'Popular',
  },
  {
    id: 'single-vision',
    title: 'Single Vision (Distance or Near)',
    description: 'For myopia (distance), hyperopia (near reading), or astigmatism correction.',
    price: 999,
    icon: Eye,
    badge: 'Most Common',
  },
  {
    id: 'progressive',
    title: 'Progressive / Multifocal',
    description: 'Seamless no-line transition between distance, computer, and reading zones.',
    price: 2499,
    icon: Glasses,
    badge: 'Advanced',
  },
  {
    id: 'sun-polarized',
    title: 'Polarized Sun Prescription',
    description: 'Prescription sun lenses with 100% glare elimination and rich color contrast.',
    price: 1999,
    icon: Sun,
    badge: 'Outdoor',
  },
];

// ─── Step 2: Lens Thickness & Index ─────────────────────────────────────────
const LENS_PACKAGES = [
  {
    id: 'standard-150',
    title: 'Standard Clarity 1.50',
    index: '1.50 Index',
    range: 'Ideal for powers up to ±2.00',
    price: 0,
    features: ['Impact resistant CR-39', '100% UV Protection'],
  },
  {
    id: 'thin-160',
    title: 'High-Index Thin 1.60',
    index: '1.60 Index',
    range: 'Ideal for powers up to ±4.00 (25% thinner)',
    price: 999,
    features: ['25% thinner & lighter', 'Aspheric flat profile', 'High tensile durability'],
    recommended: true,
  },
  {
    id: 'ultra-thin-167',
    title: 'Ultra-Thin Aspheric 1.67',
    index: '1.67 Index',
    range: 'Ideal for powers up to ±7.00 (40% thinner)',
    price: 1999,
    features: ['40% thinner than standard', 'Ultra-crisp peripheral vision', 'Featherweight comfort'],
  },
  {
    id: 'featherweight-174',
    title: 'Featherweight 1.74 High Index',
    index: '1.74 Index',
    range: 'For high prescriptions ±7.00+ (55% thinner)',
    price: 3499,
    features: ['Thinnest organic lens available', 'Zero edge distortion', 'Ultimate luxury aesthetic'],
  },
];

// ─── Step 3: Coatings ───────────────────────────────────────────────────────
const COATINGS = [
  {
    id: 'sapphire-ar',
    title: 'Sapphire Anti-Glare & Hydrophobic',
    description: 'Eliminates 99.8% of surface reflections and repels water, dust, and fingerprint smudges.',
    price: 0,
    included: true,
  },
  {
    id: 'blue-shield',
    title: 'Blue Defense 420nm Shield',
    description: 'Filters harmful high-energy blue-violet light emitted by OLED screens and LED office lighting.',
    price: 799,
  },
  {
    id: 'transitions',
    title: 'Photochromic Transitions Gen-8',
    description: 'Crystal clear indoors; rapidly turns dark sunglasses tint under outdoor sunlight.',
    price: 1999,
  },
  {
    id: 'drivesafe',
    title: 'DriveSafe Night Contrast Coating',
    description: 'Reduces blinding headlight glare and enhances road contrast during rainy or nighttime driving.',
    price: 1299,
  },
];

export const PrescriptionConfigurator = ({
  product,
  selectedColorIndex,
  isOpen,
  onClose,
}: PrescriptionConfiguratorProps) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Configuration state
  const [selectedVision, setSelectedVision] = useState(VISION_TYPES[0]);
  const [selectedPackage, setSelectedPackage] = useState(LENS_PACKAGES[1]);
  const [selectedCoatings, setSelectedCoatings] = useState<string[]>(['sapphire-ar']);
  const [prescriptionMethod, setPrescriptionMethod] = useState<'manual' | 'upload' | 'later'>('later');

  // Manual prescription inputs
  const [rightEye, setRightEye] = useState({ sph: '-1.50', cyl: '-0.50', axis: '90', add: '' });
  const [leftEye, setLeftEye] = useState({ sph: '-1.75', cyl: '-0.25', axis: '85', add: '' });
  const [pd, setPd] = useState('63');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const { addItem, openCart } = useCartStore();

  if (!isOpen) return null;

  const activeColor = product.colors[selectedColorIndex] || product.colors[0];

  // Calculate total extra price for selected lens combination
  const lensPriceTotal =
    selectedVision.price +
    selectedPackage.price +
    selectedCoatings.reduce((sum, cId) => {
      const coat = COATINGS.find((c) => c.id === cId);
      return sum + (coat ? coat.price : 0);
    }, 0);

  const grandTotal = product.price + lensPriceTotal;

  const toggleCoating = (id: string) => {
    if (id === 'sapphire-ar') return; // base coating always included
    if (selectedCoatings.includes(id)) {
      setSelectedCoatings(selectedCoatings.filter((c) => c !== id));
    } else {
      setSelectedCoatings([...selectedCoatings, id]);
    }
  };

  const handleFinishAndAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        basePrice: product.price,
        baseComparePrice: product.comparePrice,
        images: [{ url: activeColor.image, isPrimary: true }],
      } as any,
      {
        id: `${product.id}-var-${selectedColorIndex}`,
        color: activeColor.name,
        colorHex: activeColor.hex,
        size: 'Medium',
        price: product.price,
        images: [{ url: activeColor.image, isPrimary: true }],
      } as any,
      1,
      {
        lensType: selectedVision.title,
        lensPackage: `${selectedPackage.title} (${selectedPackage.index})`,
        coatings: selectedCoatings,
        price: lensPriceTotal,
        prescriptionData: {
          type: prescriptionMethod,
          rightEye: prescriptionMethod === 'manual' ? rightEye : undefined,
          leftEye: prescriptionMethod === 'manual' ? leftEye : undefined,
          pd: prescriptionMethod === 'manual' ? pd : undefined,
          fileName: prescriptionMethod === 'upload' ? uploadedFileName : undefined,
        },
      },
    );

    onClose();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-obsidian-200/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-obsidian-100 flex items-center justify-between bg-obsidian-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-obsidian-100 relative overflow-hidden shrink-0 border border-obsidian-200">
              <Image
                src={activeColor.image}
                alt={product.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-wider uppercase text-gold-700">
                Precision Lens Configurator
              </div>
              <h3 className="font-serif text-lg font-medium text-obsidian-950">
                {product.name} — {activeColor.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-obsidian-400 hover:text-obsidian-950 hover:bg-obsidian-100 transition-colors"
            aria-label="Close configurator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        <div className="px-6 py-3 bg-obsidian-50 border-b border-obsidian-100">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { num: 1, label: 'Vision Type' },
              { num: 2, label: 'Lens Index' },
              { num: 3, label: 'Coatings' },
              { num: 4, label: 'Prescription' },
            ].map((step) => (
              <div
                key={step.num}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  currentStep === step.num
                    ? 'bg-obsidian-950 text-white shadow-xs'
                    : currentStep > step.num
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-obsidian-400 bg-white/50'
                }`}
              >
                <span className="hidden sm:inline">Step {step.num}: </span>
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Body Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* STEP 1: Vision Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif text-2xl font-medium text-obsidian-950">
                  Select Your Optical Purpose
                </h4>
                <p className="text-xs text-obsidian-500">
                  All lenses include German anti-reflective sapphire coating and 100% UV400 defense.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {VISION_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedVision.id === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setSelectedVision(type)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-obsidian-950 bg-obsidian-50/70 shadow-sm ring-1 ring-obsidian-950'
                          : 'border-obsidian-200/80 hover:border-obsidian-400 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-obsidian-950 text-white' : 'bg-obsidian-100 text-obsidian-700'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-obsidian-950">
                              {type.title}
                            </h5>
                            <span className="text-[10px] font-bold text-gold-700 uppercase tracking-wider">
                              {type.badge}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-obsidian-900">
                          {type.price === 0 ? 'Included' : `+₹${type.price.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                      <p className="text-xs text-obsidian-600 leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Lens Thickness */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif text-2xl font-medium text-obsidian-950">
                  Select Lens Index & Thinness Package
                </h4>
                <p className="text-xs text-obsidian-500">
                  Higher index lenses bend light more efficiently, creating significantly flatter, thinner, and lighter lenses.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {LENS_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-obsidian-950 bg-obsidian-50/70 shadow-sm ring-1 ring-obsidian-950'
                          : 'border-obsidian-200/80 hover:border-obsidian-400 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="text-sm font-semibold text-obsidian-950">
                            {pkg.title}
                          </h5>
                          <span className="text-xs text-gold-700 font-medium">
                            {pkg.range}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-obsidian-900">
                          {pkg.price === 0 ? 'Standard' : `+₹${pkg.price.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                      <ul className="space-y-1 text-xs text-obsidian-600">
                        {pkg.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Lens Coatings */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif text-2xl font-medium text-obsidian-950">
                  Select Lens Treatments & Defenses
                </h4>
                <p className="text-xs text-obsidian-500">
                  Equip your lenses with proprietary anti-glare, blue-light blockers, and photochromic light adaptation.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {COATINGS.map((coating) => {
                  const isChecked = selectedCoatings.includes(coating.id);
                  return (
                    <div
                      key={coating.id}
                      onClick={() => toggleCoating(coating.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isChecked
                          ? 'border-obsidian-950 bg-obsidian-50/70 shadow-xs'
                          : 'border-obsidian-200/80 hover:border-obsidian-400 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 rounded text-obsidian-950 focus:ring-gold"
                        />
                        <div>
                          <h5 className="text-sm font-semibold text-obsidian-950">
                            {coating.title}
                          </h5>
                          <p className="text-xs text-obsidian-600 leading-relaxed mt-0.5">
                            {coating.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-obsidian-900 whitespace-nowrap">
                        {coating.price === 0 ? 'Included' : `+₹${coating.price.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Prescription Submission */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h4 className="font-serif text-2xl font-medium text-obsidian-950">
                  Provide Your Prescription
                </h4>
                <p className="text-xs text-obsidian-500">
                  Choose how you would like to submit your optical prescription details.
                </p>
              </div>

              {/* Method Switcher */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'later', label: 'Submit Later (WhatsApp/Email)', icon: MessageCircle },
                  { id: 'manual', label: 'Enter Manually', icon: FileText },
                  { id: 'upload', label: 'Upload Slip Photo', icon: UploadCloud },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = prescriptionMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPrescriptionMethod(item.id as any)}
                      className={`p-4 rounded-2xl border-2 text-center flex flex-col items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-obsidian-950 bg-obsidian-50/70 shadow-xs font-semibold text-obsidian-950'
                          : 'border-obsidian-200 text-obsidian-600 hover:border-obsidian-400 bg-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-gold-700" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Later option note */}
              {prescriptionMethod === 'later' && (
                <div className="p-6 rounded-2xl bg-gold/5 border border-gold/20 space-y-2">
                  <h5 className="text-sm font-semibold text-obsidian-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-600" />
                    <span>White-Glove Concierge Verification</span>
                  </h5>
                  <p className="text-xs text-obsidian-600 leading-relaxed">
                    Place your order now. Our certified optometrist team will contact you via WhatsApp / Phone within 2 hours to confirm your doctor prescription or arrange a complimentary home eye-test before custom lens milling.
                  </p>
                </div>
              )}

              {/* Manual Entry Form */}
              {prescriptionMethod === 'manual' && (
                <div className="space-y-4 bg-obsidian-50/50 p-6 rounded-2xl border border-obsidian-200">
                  <div className="grid grid-cols-5 gap-3 text-center text-xs font-bold uppercase tracking-wider text-obsidian-500 border-b pb-2">
                    <span className="text-left">Eye</span>
                    <span>SPH (Sphere)</span>
                    <span>CYL (Cylinder)</span>
                    <span>Axis (0°-180°)</span>
                    <span>Add (Near)</span>
                  </div>

                  {/* Right Eye (OD) */}
                  <div className="grid grid-cols-5 gap-3 items-center">
                    <span className="text-xs font-bold text-obsidian-900">Right (OD)</span>
                    <input
                      type="text"
                      value={rightEye.sph}
                      onChange={(e) => setRightEye({ ...rightEye, sph: e.target.value })}
                      placeholder="-1.50"
                      className="text-xs p-2.5 rounded-lg border border-obsidian-300 text-center font-mono"
                    />
                    <input
                      type="text"
                      value={rightEye.cyl}
                      onChange={(e) => setRightEye({ ...rightEye, cyl: e.target.value })}
                      placeholder="-0.50"
                      className="text-xs p-2.5 rounded-lg border border-obsidian-300 text-center font-mono"
                    />
                    <input
                      type="text"
                      value={rightEye.axis}
                      onChange={(e) => setRightEye({ ...rightEye, axis: e.target.value })}
                      placeholder="90"
                      className="text-xs p-2.5 rounded-lg border border-obsidian-300 text-center font-mono"
                    />
                    <input
                      type="text"
                      value={rightEye.add}
                      onChange={(e) => setRightEye({ ...rightEye, add: e.target.value })}
                      placeholder="+1.50"
                      className="text-xs p-2.5 rounded-lg border border-obsidian-300 text-center font-mono"
                    />
                  </div>

                  {/* Left Eye (OS) */}
                  <div className="grid grid-cols-5 gap-3 items-center">
                    <span className="text-xs font-bold text-obsidian-900">Left (OS)</span>
                    <input
                      type="text"
                      value={leftEye.sph}
                      onChange={(e) => setLeftEye({ ...leftEye, sph: e.target.value })}
                      placeholder="-1.75"
                      className="text-xs p-2.5 rounded-lg border border-obsidian-300 text-center font-mono"
                    />
                    <input
                      type="text"
                      value={leftEye.cyl}
                      onChange={(e) => setLeftEye({ ...leftEye, cyl: e.target.value })}
                      placeholder="-0.25"
                      className="text-xs p-2.5 rounded-lg border border-obsidian-300 text-center font-mono"
                    />
                    <input
                      type="text"
                      value={leftEye.axis}
                      onChange={(e) => setLeftEye({ ...leftEye, axis: e.target.value })}
                      placeholder="85"
                      className="text-xs p-2.5 rounded-lg border border-obsidian-300 text-center font-mono"
                    />
                    <input
                      type="text"
                      value={leftEye.add}
                      onChange={(e) => setLeftEye({ ...leftEye, add: e.target.value })}
                      placeholder="+1.50"
                      className="text-xs p-2.5 rounded-lg border border-obsidian-300 text-center font-mono"
                    />
                  </div>

                  {/* Pupillary Distance (PD) */}
                  <div className="pt-3 border-t flex items-center justify-between">
                    <label className="text-xs font-semibold text-obsidian-800">
                      Pupillary Distance (PD in mm):
                    </label>
                    <input
                      type="text"
                      value={pd}
                      onChange={(e) => setPd(e.target.value)}
                      placeholder="63"
                      className="text-xs p-2 rounded-lg border border-obsidian-300 text-center font-mono w-24"
                    />
                  </div>
                </div>
              )}

              {/* Upload Prescription */}
              {prescriptionMethod === 'upload' && (
                <div className="p-8 border-2 border-dashed border-obsidian-300 rounded-2xl text-center space-y-3 bg-obsidian-50/50">
                  <UploadCloud className="w-10 h-10 text-gold mx-auto" />
                  <div>
                    <span className="text-sm font-semibold text-obsidian-900 block">
                      Drag & Drop Prescription Slip or Photo
                    </span>
                    <span className="text-xs text-obsidian-500">Supports JPG, PNG, PDF up to 10MB</span>
                  </div>
                  <input
                    type="file"
                    id="prescription-file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setUploadedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label
                    htmlFor="prescription-file"
                    className="inline-block px-5 py-2 rounded-xl bg-obsidian-900 text-white text-xs font-semibold cursor-pointer hover:bg-obsidian-800"
                  >
                    Select File from Device
                  </label>
                  {uploadedFileName && (
                    <div className="text-xs font-medium text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg inline-block">
                      Selected: {uploadedFileName}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation & Pricing Total */}
        <div className="p-5 sm:p-6 border-t border-obsidian-200/80 bg-obsidian-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-obsidian-500 uppercase tracking-wider block">
              Frame + Precision Optics:
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-obsidian-950">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
              {lensPriceTotal > 0 && (
                <span className="text-xs text-obsidian-500">
                  (₹{product.price.toLocaleString('en-IN')} frame + ₹{lensPriceTotal.toLocaleString('en-IN')} lenses)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="px-5 py-3 rounded-xl border border-obsidian-300 text-obsidian-700 hover:bg-obsidian-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                className="px-6 py-3 rounded-xl bg-obsidian-950 hover:bg-obsidian-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishAndAddToCart}
                className="px-8 py-3 rounded-xl bg-gold hover:bg-gold-600 text-obsidian-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Add Customized Frame to Bag</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
