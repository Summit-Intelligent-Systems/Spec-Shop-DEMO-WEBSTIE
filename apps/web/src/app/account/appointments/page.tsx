'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Plus, 
  CalendarPlus, 
  RotateCcw,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/lib/store/uiStore';

interface Appointment {
  id: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  optometrist: string;
  location: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  isHomeService?: boolean;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-01',
    serviceType: 'VIP Comprehensive Refraction & Bespoke Styling',
    date: 'Saturday, Sept 12, 2026',
    timeSlot: '11:30 AM – 12:30 PM',
    optometrist: 'Dr. Rajesh Nair (Senior Clinical Optometrist)',
    location: 'Indiranagar Flagship Boutique (Optical Suite IV), Bengaluru',
    status: 'CONFIRMED',
    notes: 'Private fitting room reserved with Japanese titanium collection on display.',
  },
  {
    id: 'apt-02',
    serviceType: 'Atelier Privé Mobile Home Eye Exam & Frame Suite',
    date: 'July 18, 2026',
    timeSlot: '03:00 PM – 04:30 PM',
    optometrist: 'Dr. Sarah Chen, OD',
    location: 'Client Residence, Bengaluru',
    status: 'COMPLETED',
    isHomeService: true,
    notes: 'Comprehensive retinal imaging conducted; 120 titanium test frames presented.',
  },
];

export default function AccountAppointmentsPage() {
  const { openEyeExamModal } = useUIStore();
  const [appointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-obsidian-100">
        <div>
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Concierge Care</span>
          <h1 className="font-serif text-3xl font-medium text-obsidian-950 mt-1">
            Eye Exam Appointments
          </h1>
          <p className="text-sm text-obsidian-500 mt-1">
            Bespoke optometric refraction exams, custom frame fittings, and home optical consultations.
          </p>
        </div>

        <Button
          onClick={() => openEyeExamModal()}
          variant="primary"
          className="text-xs tracking-wider uppercase font-semibold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Book New Exam
        </Button>
      </div>

      {/* Appointments List */}
      <div className="space-y-6">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className={`rounded-2xl border p-6 bg-white transition-all ${
              apt.status === 'CONFIRMED'
                ? 'border-gold/50 shadow-md shadow-gold/5'
                : 'border-obsidian-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-obsidian-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-medium text-obsidian-950">
                    {apt.serviceType}
                  </h3>
                  {apt.isHomeService && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gold/15 text-gold-800 border border-gold/30">
                      In-Home VIP
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-obsidian-500 mt-1">
                  <Clock className="w-3.5 h-3.5 text-obsidian-400" />
                  <span>{apt.date} • {apt.timeSlot}</span>
                </div>
              </div>

              <div>
                {apt.status === 'CONFIRMED' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Confirmed & Scheduled
                  </span>
                )}
                {apt.status === 'COMPLETED' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-obsidian-100 text-obsidian-700">
                    Exam Completed
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-obsidian-700">
                  <User className="w-4 h-4 text-gold" />
                  <span>Clinical Lead: <strong>{apt.optometrist}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-obsidian-700">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span>Location: <strong>{apt.location}</strong></span>
                </div>
              </div>

              {apt.notes && (
                <div className="bg-obsidian-50 rounded-xl p-3 text-obsidian-600">
                  <span className="font-semibold text-obsidian-900 block mb-0.5">Clinical Notes:</span>
                  {apt.notes}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-obsidian-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {apt.status === 'CONFIRMED' ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert('Adding appointment to calendar (.ics)...')}
                      className="text-xs text-obsidian-700"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 mr-1.5" />
                      Add to Calendar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEyeExamModal()}
                      className="text-xs text-obsidian-600"
                    >
                      Reschedule
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEyeExamModal()}
                    className="text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Book Annual Checkup
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-obsidian-500">
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span>Concierge Desk: <strong>+91 80 4123 4567</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
