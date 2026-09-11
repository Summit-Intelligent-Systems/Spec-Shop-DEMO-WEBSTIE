'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, 
  Package, 
  FileText, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useUIStore } from '@/lib/store/uiStore';

const navItems = [
  { href: '/account', label: 'Salon Overview', icon: User, exact: true },
  { href: '/account/orders', label: 'Orders & Optical Lab', icon: Package },
  { href: '/account/prescriptions', label: 'Prescriptions Vault', icon: FileText },
  { href: '/account/appointments', label: 'Eye Exam Appointments', icon: Calendar },
  { href: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { openAuthModal } = useUIStore();

  const displayName = user?.profile?.firstName 
    ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim()
    : 'Sophia Vane';
  const email = user?.email || 'vip.client@nayansukheyewear.com';

  return (
    <div className="min-h-screen bg-obsidian-50/50 py-8 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-obsidian-500 mb-6 font-medium">
          <Link href="/" className="hover:text-gold transition-colors">Atelier</Link>
          <ChevronRight className="w-3 h-3 text-obsidian-300" />
          <span className="text-obsidian-900 font-semibold">Client Salon</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {/* VIP Member Card */}
            <div className="bg-obsidian-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-gold/30">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold to-gold-300 flex items-center justify-center font-serif text-lg font-bold text-obsidian-950 shadow-md">
                    {displayName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium text-white line-clamp-1">
                      {displayName}
                    </h3>
                    <p className="text-xs text-obsidian-400 truncate">{email}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-obsidian-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gold-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Atelier Privé VIP</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-gold/15 text-gold text-[10px] font-semibold tracking-wider uppercase border border-gold/30">
                    Tier III
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-2xl shadow-sm border border-obsidian-100 p-2 space-y-1">
              {navItems.map((item) => {
                const isActive = item.exact 
                  ? pathname === item.href 
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-obsidian-950 text-white shadow-sm'
                        : 'text-obsidian-600 hover:text-obsidian-950 hover:bg-obsidian-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-obsidian-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-2 mt-2 border-t border-obsidian-100">
                {isAuthenticated ? (
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gold-600 hover:bg-gold/10 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Sync</span>
                  </button>
                )}
              </div>
            </nav>
          </aside>

          {/* Main Account Content */}
          <main className="lg:col-span-9 bg-white rounded-2xl shadow-sm border border-obsidian-100 p-6 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
