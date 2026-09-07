'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

const ANNOUNCEMENTS = [
  {
    text: 'Complimentary In-Store Eye Exam with Every Designer Frame',
    linkText: 'Book Free Test',
    href: '/book-eye-test',
  },
  {
    text: 'Complimentary Express Shipping on Orders Above ₹1,999',
    linkText: 'Shop New Arrivals',
    href: '/shop/eyeglasses',
  },
  {
    text: 'Experience 3D Virtual Try-On on All Bestseller Styles',
    linkText: 'Try On Now',
    href: '/try-on',
  },
];

export const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div className="bg-obsidian-950 text-white text-[11px] sm:text-xs tracking-wider uppercase font-medium py-2 px-4 border-b border-white/5 relative z-40 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left perk */}
        <div className="hidden lg:flex items-center gap-1.5 text-obsidian-400">
          <span>Handcrafted Luxury Eyewear</span>
        </div>

        {/* Center Animated Message */}
        <div className="flex-1 flex items-center justify-center text-center h-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="flex items-center gap-2"
            >
              <span className="text-obsidian-200">{current.text}</span>
              <Link
                href={current.href}
                className="text-gold hover:text-gold-300 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5 ml-1 transition-colors"
              >
                {current.linkText}
                <ChevronRight className="w-3 h-3" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right quick links */}
        <div className="hidden lg:flex items-center gap-4 text-obsidian-400">
          <Link href="/stores" className="hover:text-white transition-colors">
            Find A Store
          </Link>
          <span>•</span>
          <Link href="/track-order" className="hover:text-white transition-colors">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
