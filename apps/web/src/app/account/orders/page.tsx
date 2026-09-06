'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Clock, 
  CheckCircle2, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OrderItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  image: string;
  lensConfig: {
    type: string;
    index: string;
    coating: string;
    prescriptionType: string;
    pd: number;
    engraving?: string;
  };
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'IN_PRODUCTION' | 'DELIVERED' | 'SHIPPED';
  estimatedDelivery: string;
  items: OrderItem[];
  labStages: {
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
  }[];
}

const SAMPLE_ORDERS: OrderRecord[] = [
  {
    id: 'ord-88219',
    orderNumber: 'XYZ-88219',
    date: 'Sept 04, 2026',
    total: 7998,
    status: 'IN_PRODUCTION',
    estimatedDelivery: 'Sept 10, 2026',
    items: [
      {
        id: 'item-1',
        name: 'The Sovereign Round',
        slug: 'the-sovereign-round',
        sku: 'XYZ-OPT-001',
        price: 7998,
        image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
        lensConfig: {
          type: 'Single Vision Distance',
          index: '1.74 Ultra High Index',
          coating: 'Zeiss DuraVision BlueProtect & Hydrophobic',
          prescriptionType: 'Digital Verified Rx',
          pd: 63,
          engraving: 'S. VANE',
        },
      },
    ],
    labStages: [
      {
        title: 'Order Confirmed & Payment Processed',
        description: 'Bespoke optical order received and entered into laboratory workflow.',
        timestamp: 'Sept 04, 10:15 AM',
        completed: true,
      },
      {
        title: 'Prescription Validated by Clinical Optometrist',
        description: 'Doctor Sarah Chen verified sphere, cylinder, axis, and pupillary alignment tolerances.',
        timestamp: 'Sept 04, 02:30 PM',
        completed: true,
      },
      {
        title: 'Titanium Chassis Prepared & Hand-Adjusted',
        description: 'Raw Japanese titanium chassis ultrasonic cleaned and bridge curvature calibrated.',
        timestamp: 'Sept 05, 09:15 AM',
        completed: true,
      },
      {
        title: 'Freeform Digital Lens Surfacing & Edging',
        description: 'Sub-micron CNC diamond surfacing of prescription curves to exact 0.01 diopter accuracy.',
        timestamp: 'Sept 06, In Progress',
        completed: false,
        current: true,
      },
      {
        title: 'Dual-Side Multi-Layer Anti-Reflective Coating',
        description: 'Ion-assisted vacuum chamber deposition of blue-light filtering & scratch-resistant layers.',
        timestamp: 'Scheduled for Sept 08',
        completed: false,
      },
      {
        title: 'Laser Alignment & ANSI Z80.1 Certified QA',
        description: 'Focimeter optical verification, ultrasonic cleaning, hand packaging into leather case.',
        timestamp: 'Scheduled for Sept 09',
        completed: false,
      },
    ],
  },
  {
    id: 'ord-74102',
    orderNumber: 'XYZ-74102',
    date: 'Aug 12, 2026',
    total: 12499,
    status: 'DELIVERED',
    estimatedDelivery: 'Aug 16, 2026',
    items: [
      {
        id: 'item-2',
        name: 'The Aurelius Aviator',
        slug: 'the-aurelius-aviator',
        sku: 'XYZ-SUN-004',
        price: 12499,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
        lensConfig: {
          type: 'Polarized Sunglasses (Non-Rx)',
          index: '1.60 Impact Resistant Polycarbonate',
          coating: 'Amber Gradient + Gold Flash Mirror',
          prescriptionType: 'Non-Prescription Plano',
          pd: 64,
        },
      },
    ],
    labStages: [
      {
        title: 'Bespoke Packaging & Dispatched',
        description: 'Delivered via DHL Express Secure Vault Courier.',
        timestamp: 'Aug 16, 03:45 PM',
        completed: true,
      },
    ],
  },
];

export default function AccountOrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string>('ord-88219');

  const toggleExpand = (orderId: string) => {
    setExpandedOrder((prev) => (prev === orderId ? '' : orderId));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-obsidian-100">
        <span className="text-xs font-semibold tracking-widest text-gold uppercase">Optical Order Tracking</span>
        <h1 className="font-serif text-3xl font-medium text-obsidian-950 mt-1">
          Orders & Production Lab
        </h1>
        <p className="text-sm text-obsidian-500 mt-1">
          Follow your bespoke optical pieces in real time through our precision laboratory stages.
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {SAMPLE_ORDERS.map((order) => {
          const isExpanded = expandedOrder === order.id;

          return (
            <div
              key={order.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                order.status === 'IN_PRODUCTION'
                  ? 'border-gold/50 bg-white shadow-md shadow-gold/5'
                  : 'border-obsidian-100 bg-white'
              }`}
            >
              {/* Card Header */}
              <div className="p-6 bg-obsidian-50/60 border-b border-obsidian-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-[11px] text-obsidian-500 uppercase tracking-wider block">Order ID</span>
                    <span className="font-mono text-base font-semibold text-obsidian-950">{order.orderNumber}</span>
                  </div>
                  <div className="h-8 w-[1px] bg-obsidian-200 hidden sm:block" />
                  <div>
                    <span className="text-[11px] text-obsidian-500 uppercase tracking-wider block">Placed On</span>
                    <span className="text-sm font-medium text-obsidian-900">{order.date}</span>
                  </div>
                  <div className="h-8 w-[1px] bg-obsidian-200 hidden sm:block" />
                  <div>
                    <span className="text-[11px] text-obsidian-500 uppercase tracking-wider block">Total Amount</span>
                    <span className="text-sm font-semibold text-obsidian-950">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {order.status === 'IN_PRODUCTION' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                      In Optical Lab
                    </span>
                  )}
                  {order.status === 'DELIVERED' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Delivered
                    </span>
                  )}

                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="p-1.5 rounded-lg border border-obsidian-200 hover:bg-obsidian-100 text-obsidian-600"
                    title="Toggle details"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 divide-y divide-obsidian-100">
                {order.items.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-5 items-start">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-obsidian-100 border border-obsidian-200/80 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/product/${item.slug}`} className="font-serif text-lg font-medium text-obsidian-950 hover:text-gold transition-colors">
                            {item.name}
                          </Link>
                          <p className="text-xs text-obsidian-500 font-mono mt-0.5">SKU: {item.sku}</p>
                        </div>
                        <span className="font-semibold text-obsidian-950">₹{item.price.toLocaleString()}</span>
                      </div>

                      {/* Optical Specs Grid */}
                      <div className="bg-obsidian-50 rounded-xl p-3 text-xs space-y-1 text-obsidian-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <span className="text-obsidian-500">Lens Specification: </span>
                            <span className="font-medium text-obsidian-950">{item.lensConfig.type}</span>
                          </div>
                          <div>
                            <span className="text-obsidian-500">Refractive Index: </span>
                            <span className="font-medium text-obsidian-950">{item.lensConfig.index}</span>
                          </div>
                          <div>
                            <span className="text-obsidian-500">Optical Coating: </span>
                            <span className="font-medium text-obsidian-950">{item.lensConfig.coating}</span>
                          </div>
                          <div>
                            <span className="text-obsidian-500">Pupillary Distance: </span>
                            <span className="font-medium text-obsidian-950">{item.lensConfig.pd} mm</span>
                          </div>
                        </div>
                        {item.lensConfig.engraving && (
                          <div className="pt-1.5 border-t border-obsidian-200/60 flex items-center gap-1.5 text-gold-700">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Custom Laser Monogram: <strong>&quot;{item.lensConfig.engraving}&quot;</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Expandable Lab Timeline Tracker */}
              {isExpanded && order.labStages && (
                <div className="p-6 bg-obsidian-50/40 border-t border-obsidian-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-gold" />
                      <h4 className="font-serif text-base font-medium text-obsidian-950">
                        Atelier Optical Lab Lifecycle
                      </h4>
                    </div>
                    <span className="text-xs text-obsidian-500">
                      Estimated Completion: <strong>{order.estimatedDelivery}</strong>
                    </span>
                  </div>

                  {/* Vertical Stepper */}
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-obsidian-200">
                    {order.labStages.map((stage, idx) => (
                      <div key={idx} className="relative">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                            stage.completed
                              ? 'bg-emerald-600 text-white'
                              : stage.current
                              ? 'bg-gold text-obsidian-950 ring-4 ring-gold/20 font-bold'
                              : 'bg-obsidian-200 text-obsidian-500'
                          }`}
                        >
                          {stage.completed ? '✓' : idx + 1}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h5
                              className={`text-sm font-semibold ${
                                stage.current
                                  ? 'text-gold-800'
                                  : stage.completed
                                  ? 'text-obsidian-900'
                                  : 'text-obsidian-500'
                              }`}
                            >
                              {stage.title}
                            </h5>
                            <span className="text-xs font-mono text-obsidian-400">{stage.timestamp}</span>
                          </div>
                          <p className="text-xs text-obsidian-600 leading-relaxed">{stage.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="mt-6 pt-4 border-t border-obsidian-200/80 flex flex-wrap items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Generating Tax Invoice for ${order.orderNumber}...`)}
                      className="text-xs text-obsidian-700"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download Invoice (PDF)
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => alert('Contacting Atelier Optical Concierge...')}
                        className="text-xs text-obsidian-600"
                      >
                        Contact Optical Concierge
                      </Button>
                      <Link href={`/product/${order.items[0]?.slug}`}>
                        <Button variant="primary" size="sm" className="text-xs">
                          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                          Reorder Frame
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
