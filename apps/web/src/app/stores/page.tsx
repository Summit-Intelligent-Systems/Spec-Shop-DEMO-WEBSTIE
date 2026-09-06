'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  Star,
  Sparkles,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Store {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  hours: string;
  services: string[];
  image: string;
  isFlagship: boolean;
  rating: number;
}

const STORES: Store[] = [
  {
    id: 'store-blr',
    name: 'Indiranagar Flagship Boutique',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '42, 100ft Road, Indiranagar, Stage 2',
    pincode: '560038',
    phone: '+91 80 4123 4567',
    email: 'indiranagar@xyz-eyewear.com',
    hours: '10:00 AM – 9:00 PM (Mon–Sat) • 11:00 AM – 7:00 PM (Sun)',
    services: ['Comprehensive Eye Exam', 'Virtual Try-On Suite', 'Bespoke Engraving', 'Home Delivery', 'Frame Adjustment'],
    image: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&auto=format&fit=crop&q=80',
    isFlagship: true,
    rating: 4.9,
  },
  {
    id: 'store-mum',
    name: 'Linking Road Maison',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: '17, Linking Road, Bandra West',
    pincode: '400050',
    phone: '+91 22 2655 1234',
    email: 'bandra@xyz-eyewear.com',
    hours: '10:30 AM – 9:30 PM (All Days)',
    services: ['Eye Exam', 'Contact Lens Fitting', 'Lens Replacement', 'Insurance Claims'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    isFlagship: false,
    rating: 4.7,
  },
  {
    id: 'store-del',
    name: 'Khan Market Studio',
    city: 'New Delhi',
    state: 'Delhi',
    address: 'Shop 34, Middle Lane, Khan Market',
    pincode: '110003',
    phone: '+91 11 2461 7890',
    email: 'khanmarket@xyz-eyewear.com',
    hours: '11:00 AM – 8:30 PM (Mon–Sat) • Closed on Sundays',
    services: ['Comprehensive Eye Exam', 'Titanium Collection Showcase', 'Express Lens Lab'],
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80',
    isFlagship: true,
    rating: 4.8,
  },
  {
    id: 'store-hyd',
    name: 'Jubilee Hills Optical Lounge',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Road No. 36, Jubilee Hills',
    pincode: '500033',
    phone: '+91 40 2354 5678',
    email: 'jubileehills@xyz-eyewear.com',
    hours: '10:00 AM – 8:00 PM (All Days)',
    services: ['Eye Exam', 'Sunglasses Bar', 'Kids Eyewear Corner'],
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&auto=format&fit=crop&q=80',
    isFlagship: false,
    rating: 4.6,
  },
];

export default function StoresPage() {
  const [selectedCity, setSelectedCity] = useState<string>('ALL');

  const cities = ['ALL', ...new Set(STORES.map((s) => s.city))];
  const filtered = selectedCity === 'ALL' ? STORES : STORES.filter((s) => s.city === selectedCity);

  return (
    <div className="min-h-screen bg-obsidian-50/50">
      {/* Hero Banner */}
      <div className="relative bg-obsidian-950 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-obsidian-950 opacity-90" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase">
            The XYZ Eyewear Network
          </span>
          <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-medium mt-3 max-w-3xl mx-auto leading-tight">
            Flagship Optical Boutiques
          </h1>
          <p className="text-base text-obsidian-400 mt-4 max-w-lg mx-auto">
            Experience our curated collections, certified eye exams, and bespoke frame fittings at an XYZ atelier near you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* City Filter */}
        <div className="flex items-center gap-2 mb-10 flex-wrap">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedCity === city
                  ? 'bg-obsidian-950 text-white border-obsidian-950 shadow-sm'
                  : 'bg-white text-obsidian-600 border-obsidian-200 hover:border-obsidian-400'
              }`}
            >
              {city === 'ALL' ? 'All Cities' : city}
            </button>
          ))}
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-2xl border border-obsidian-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-gold/30 transition-all group"
            >
              {/* Store Image */}
              <div className="relative h-52 lg:h-56 overflow-hidden">
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/60 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    {store.isFlagship && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gold/90 text-obsidian-950 mb-2">
                        <Sparkles className="w-3 h-3" /> Flagship
                      </span>
                    )}
                    <h3 className="font-serif text-xl font-medium text-white">{store.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-obsidian-950/70 rounded-full px-2.5 py-1 text-xs text-gold">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-bold">{store.rating}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2.5 text-obsidian-700">
                    <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>{store.address}, {store.city}, {store.state} — {store.pincode}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-obsidian-700">
                    <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>{store.hours}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-obsidian-700">
                    <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-obsidian-700">
                    <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>{store.email}</span>
                  </div>
                </div>

                {/* Services Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-obsidian-100">
                  {store.services.map((service) => (
                    <span
                      key={service}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-obsidian-50 text-obsidian-600 border border-obsidian-100"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(store.address + ' ' + store.city)}`, '_blank')}
                    className="text-xs border-obsidian-300 text-obsidian-700"
                  >
                    <Navigation className="w-3.5 h-3.5 mr-1.5" />
                    Get Directions
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => alert(`Booking eye exam at ${store.name}...`)}
                    className="text-xs"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    Book Eye Exam
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
