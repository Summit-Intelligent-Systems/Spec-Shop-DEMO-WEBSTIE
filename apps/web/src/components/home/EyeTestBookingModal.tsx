'use client';

import { useState } from 'react';
import {
  X,
  CalendarCheck,
  MapPin,
  Home,
  CheckCircle2,
} from 'lucide-react';

interface EyeTestBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BOUTIQUES = [
  { id: 'bengaluru', name: 'Indiranagar Flagship Boutique', city: 'Bengaluru', slots: ['11:00 AM', '02:00 PM', '04:30 PM', '06:00 PM'] },
  { id: 'mumbai', name: 'Bandra West Luxury Salon', city: 'Mumbai', slots: ['10:30 AM', '01:00 PM', '03:30 PM', '07:00 PM'] },
  { id: 'delhi', name: 'Khan Market Optical Emporium', city: 'New Delhi', slots: ['11:30 AM', '02:30 PM', '05:00 PM', '06:30 PM'] },
];

export const EyeTestBookingModal = ({ isOpen, onClose }: EyeTestBookingModalProps) => {
  const [serviceType, setServiceType] = useState<'store' | 'home'>('home');
  const [selectedBoutique, setSelectedBoutique] = useState(BOUTIQUES[0]);
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-obsidian-200 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-obsidian-400 hover:text-obsidian-950 rounded-full"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Confirmation Screen */
          <div className="p-8 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-gold/15 text-gold-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-gold-700" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-700">
                Appointment Scheduled
              </span>
              <h3 className="font-serif text-2xl font-medium text-obsidian-950">
                {serviceType === 'home' ? 'Home Eye Exam Booked!' : 'Flagship Boutique Slot Reserved!'}
              </h3>
              <p className="text-xs text-obsidian-500 max-w-sm mx-auto">
                We have sent an SMS confirmation to <strong>{phone}</strong>. Our certified optometrist will visit with 100+ designer trial frames.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-50 border border-obsidian-200 text-xs text-left space-y-1">
              <div><strong>Client:</strong> {fullName}</div>
              <div><strong>Timing:</strong> {selectedDate} at {selectedSlot}</div>
              <div><strong>Location:</strong> {serviceType === 'home' ? address : selectedBoutique.name}</div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-obsidian-950 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-obsidian-800"
            >
              Done
            </button>
          </div>
        ) : (
          /* Booking Form */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-700">
                <CalendarCheck className="w-4 h-4" />
                <span>Complimentary 20-Step Eye Exam</span>
              </div>
              <h3 className="font-serif text-2xl font-medium text-obsidian-950">
                Schedule Your Vision Assessment
              </h3>
              <p className="text-xs text-obsidian-500">
                Zero fees. Includes precision digital refraction and optical frame styling.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Type Switch */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setServiceType('home')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    serviceType === 'home'
                      ? 'border-obsidian-950 bg-obsidian-50 font-semibold ring-1 ring-obsidian-950'
                      : 'border-obsidian-200 text-obsidian-600'
                  }`}
                >
                  <Home className="w-4 h-4 text-gold-700 mt-0.5" />
                  <div>
                    <div className="text-xs text-obsidian-950">At-Home Eye Exam</div>
                    <div className="text-[10px] text-obsidian-500">With 100+ trial frames</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType('store')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    serviceType === 'store'
                      ? 'border-obsidian-950 bg-obsidian-50 font-semibold ring-1 ring-obsidian-950'
                      : 'border-obsidian-200 text-obsidian-600'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-gold-700 mt-0.5" />
                  <div>
                    <div className="text-xs text-obsidian-950">Flagship Boutique</div>
                    <div className="text-[10px] text-obsidian-500">In-store exam & coffee</div>
                  </div>
                </button>
              </div>

              {/* In-store boutique picker */}
              {serviceType === 'store' && (
                <div>
                  <label className="text-xs font-semibold text-obsidian-700 block mb-1">
                    Select Flagship Optical Boutique
                  </label>
                  <select
                    value={selectedBoutique.id}
                    onChange={(e) => {
                      const b = BOUTIQUES.find((x) => x.id === e.target.value);
                      if (b) setSelectedBoutique(b);
                    }}
                    className="w-full text-xs p-3 rounded-xl border border-obsidian-200 bg-white"
                  >
                    {BOUTIQUES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-obsidian-700 block mb-1">Date</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-obsidian-200 bg-white"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Day after Tomorrow">In 2 Days</option>
                    <option value="This Weekend">This Saturday</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-obsidian-700 block mb-1">Time Slot</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-obsidian-200 bg-white"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-obsidian-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Iyer"
                    className="w-full text-xs p-3 rounded-xl border border-obsidian-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-obsidian-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full text-xs p-3 rounded-xl border border-obsidian-200"
                  />
                </div>

                {serviceType === 'home' && (
                  <div>
                    <label className="text-xs font-semibold text-obsidian-700 block mb-1">
                      Doorstep Address
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Apartment, Street, Locality & City"
                      className="w-full text-xs p-3 rounded-xl border border-obsidian-200"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-obsidian-950 hover:bg-obsidian-800 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
              >
                Confirm Complimentary Appointment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
