'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';

const navItems = [
  { href: '/admin', label: 'Executive Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
  { href: '/admin/prescriptions', label: 'Rx Review Desk', icon: FileText },
  { href: '/admin/products', label: 'Product Catalog', icon: Package },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const displayName = user?.profile?.firstName
    ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim()
    : 'Aditya Pathak';

  return (
    <div className="min-h-screen bg-obsidian-950 text-white flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-obsidian-900/70 border-r border-obsidian-800/60 backdrop-blur-sm">
        {/* Logo / Brand */}
        <div className="p-6 border-b border-obsidian-800/60">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-md shadow-gold/20">
              <Shield className="w-5 h-5 text-obsidian-950" />
            </div>
            <div>
              <span className="font-serif text-base font-semibold text-white block leading-tight">
                XYZ Atelier
              </span>
              <span className="text-[10px] font-bold tracking-[0.15em] text-gold-400 uppercase">
                Back Office
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
                    ? 'bg-gold/15 text-gold border border-gold/30 shadow-sm shadow-gold/10'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-800/60'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-gold' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile Footer */}
        <div className="p-4 border-t border-obsidian-800/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-obsidian-700 flex items-center justify-center text-sm font-bold text-gold">
              {displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-[11px] text-obsidian-500 truncate">{user?.email || 'admin@xyz.com'}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-obsidian-500 hover:text-rose-400 hover:bg-rose-500/10 border border-obsidian-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar (mobile breadcrumb + mobile menu trigger) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-obsidian-900/80 border-b border-obsidian-800/50">
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" />
            <span className="font-serif text-sm font-semibold text-white">XYZ Admin</span>
          </Link>
          <div className="flex-1" />
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`p-2 rounded-lg ${isActive ? 'text-gold bg-gold/15' : 'text-obsidian-500 hover:text-white'}`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              );
            })}
          </nav>
        </header>

        {/* Desktop breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-widest text-obsidian-600 px-8 pt-6 font-medium">
          <Link href="/" className="hover:text-gold transition-colors">Storefront</Link>
          <ChevronRight className="w-3 h-3 text-obsidian-700" />
          <span className="text-obsidian-400">Administration</span>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
