'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { SearchModal } from '@/components/layout/SearchModal';
import { MobileNav } from '@/components/layout/MobileNav';
import { AuthModal } from '@/components/auth/AuthModal';
import { ChatWidget } from '@/components/chat/ChatWidget';

interface StorefrontShellProps {
  children: React.ReactNode;
}

/**
 * Isolates the public Storefront shell from dedicated portal pages like /admin.
 * When a user visits /admin or any admin sub-route, storefront-specific elements
 * (Announcement bar, Storefront Header, Footer, Cart Drawer, Search, Chat)
 * are excluded, providing an independent, full-screen Admin & CMS workspace.
 */
export function StorefrontShell({ children }: StorefrontShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <SearchModal />
      <CartDrawer />
      <MobileNav />
      <AuthModal />
      <div className="flex-1">{children}</div>
      <Footer />
      <ChatWidget />
    </>
  );
}
