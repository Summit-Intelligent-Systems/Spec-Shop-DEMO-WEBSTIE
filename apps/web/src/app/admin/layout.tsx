'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  LogOut,
  ChevronRight,
  ChevronDown,
  Shield,
  Tags,
  Award,
  Layers,
  Home,
  BookOpen,
  ImageIcon,
  Navigation,
  Users,
  Ticket,
  Star,
  Search as SearchIcon,
  Settings,
  BarChart3,
  Globe,
  Menu,
  X,
  Warehouse,
  Megaphone,
  KeyRound,
  Lock,
  Mail,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';

// ─── Navigation Config ───────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { href: '/admin/products', label: 'Products', icon: Package },
      { href: '/admin/categories', label: 'Categories', icon: Tags },
      { href: '/admin/brands', label: 'Brands', icon: Award },
      { href: '/admin/inventory', label: 'Inventory', icon: Warehouse },
    ],
  },
  {
    title: 'Sales',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
      { href: '/admin/customers', label: 'Customers', icon: Users },
      { href: '/admin/reviews', label: 'Reviews', icon: Star },
      { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
      { href: '/admin/promotions', label: 'Promotions', icon: Megaphone },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/homepage', label: 'Homepage Builder', icon: Home },
      { href: '/admin/pages', label: 'Content Pages', icon: BookOpen },
      { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
      { href: '/admin/navigation', label: 'Navigation', icon: Navigation },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/admin/seo', label: 'SEO', icon: Globe },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
      { href: '/admin/prescriptions', label: 'Prescriptions', icon: FileText },
    ],
  },
];

// Flat list for mobile nav
const mobileNavItems = navGroups.flatMap((g) => g.items).slice(0, 8);

// ─── Layout Component ─────────────────────────────────────────────────────────

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, login, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [adminEmail, setAdminEmail] = useState('superadmin@xyzeyewear.com');
  const [adminPassword, setAdminPassword] = useState('Admin@123!');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:4000/api/v1';
      let authedUser: any = null;
      let token = 'xyz_admin_session_' + Date.now();

      try {
        const res = await fetch(`${apiBase}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: adminEmail, password: adminPassword }),
        });
        const data = await res.json();
        if (data?.data?.user) {
          authedUser = data.data.user;
          token = data.data.tokens?.accessToken || token;
        }
      } catch {
        // Fallback for direct Supabase / static mode
      }

      if (!authedUser) {
        const lower = adminEmail.trim().toLowerCase();
        if (lower === 'superadmin@xyzeyewear.com' && adminPassword === 'Admin@123!') {
          authedUser = {
            id: 'cmtv9n3q80000h8g58ixai7dn',
            email: 'superadmin@xyzeyewear.com',
            role: 'SUPER_ADMIN',
            isVerified: true,
            twoFactorEnabled: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            profile: {
              firstName: 'Chief',
              lastName: 'Executive',
            },
          };
        } else if (lower === 'admin@xyzeyewear.com' && adminPassword === 'Admin@123!') {
          authedUser = {
            id: 'cmtv9n3q80001h8g58ixai7do',
            email: 'admin@xyzeyewear.com',
            role: 'ADMIN',
            isVerified: true,
            twoFactorEnabled: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            profile: {
              firstName: 'Store',
              lastName: 'Administrator',
            },
          };
        }
      }

      if (authedUser && (authedUser.role === 'SUPER_ADMIN' || authedUser.role === 'ADMIN')) {
        login(authedUser, token);
      } else {
        setAuthError('Invalid administrator credentials. Please check your email and password.');
      }
    } catch {
      setAuthError('Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = user?.profile?.firstName
    ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim()
    : 'Admin';

  const roleLabel = user?.role === 'SUPER_ADMIN' ? 'Super Admin' : user?.role === 'ADMIN' ? 'Admin' : 'Staff';

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const getSectionTitle = (path: string) => {
    if (path === '/admin') return 'Overview';
    if (path.startsWith('/admin/products/new')) return 'New Product';
    if (path.startsWith('/admin/products')) return 'Products';
    if (path.startsWith('/admin/categories')) return 'Categories';
    if (path.startsWith('/admin/brands')) return 'Brands';
    if (path.startsWith('/admin/inventory')) return 'Inventory';
    if (path.startsWith('/admin/orders')) return 'Orders';
    if (path.startsWith('/admin/customers')) return 'Customers';
    if (path.startsWith('/admin/reviews')) return 'Reviews';
    if (path.startsWith('/admin/coupons')) return 'Coupons';
    if (path.startsWith('/admin/promotions')) return 'Promotions';
    if (path.startsWith('/admin/homepage')) return 'Homepage Builder';
    if (path.startsWith('/admin/pages')) return 'Content Pages';
    if (path.startsWith('/admin/media')) return 'Media Library';
    if (path.startsWith('/admin/navigation')) return 'Navigation';
    if (path.startsWith('/admin/seo')) return 'SEO';
    if (path.startsWith('/admin/settings')) return 'Settings';
    if (path.startsWith('/admin/analytics')) return 'Analytics';
    if (path.startsWith('/admin/prescriptions')) return 'Prescriptions';
    return 'Dashboard';
  };

  // If not authenticated as Admin, show Admin Login Portal
  if (mounted && !isAdmin) {
    return (
      <div className="min-h-screen bg-obsidian-950 text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-obsidian-900/90 border border-gold/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-gold/10 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-amber-600 items-center justify-center shadow-lg shadow-gold/20 mb-4">
              <Shield className="w-7 h-7 text-obsidian-950" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              XYZ Atelier
            </h1>
            <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase mt-1">
              Admin & CMS Portal
            </p>
            <p className="text-xs text-obsidian-400 mt-2">
              Enter your credentials to access store operations, products, and Supabase data.
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@xyzeyewear.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-obsidian-800/80 border border-obsidian-700/60 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-obsidian-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-obsidian-800/80 border border-obsidian-700/60 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                />
              </div>
            </div>

            {/* Quick Fill Demo Helper */}
            <div className="flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('superadmin@xyzeyewear.com');
                  setAdminPassword('Admin@123!');
                }}
                className="text-gold-400 hover:text-gold flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-fill Super Admin credentials
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-gold via-amber-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-obsidian-950 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              {isSubmitting ? 'Verifying...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          {/* Footer return link */}
          <div className="text-center mt-6 pt-4 border-t border-obsidian-800/60">
            <Link
              href="/"
              className="text-xs text-obsidian-400 hover:text-white transition-colors"
            >
              &larr; Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const renderNavItem = (item: NavItem) => {
    const active = isActive(item);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
          active
            ? 'bg-gold/15 text-gold border border-gold/25 shadow-sm shadow-gold/10'
            : 'text-obsidian-400 hover:text-white hover:bg-obsidian-800/60 border border-transparent'
        }`}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-gold' : ''}`} />
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  const sidebarContent = (
    <>
      {/* Logo / Brand */}
      <div className="p-5 border-b border-obsidian-800/60">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center shadow-md shadow-gold/20">
            <Shield className="w-5 h-5 text-obsidian-950" />
          </div>
          <div>
            <span className="font-serif text-base font-semibold text-white block leading-tight">
              XYZ Atelier
            </span>
            <span className="text-[10px] font-bold tracking-[0.15em] text-gold-400 uppercase">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-obsidian-800 scrollbar-track-transparent">
        {navGroups.map((group) => {
          const isCollapsed = collapsedGroups.has(group.title);
          return (
            <div key={group.title}>
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full px-3 mb-1.5 group"
              >
                <span className="text-[10px] font-bold tracking-[0.15em] text-obsidian-600 uppercase group-hover:text-obsidian-400 transition-colors">
                  {group.title}
                </span>
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3 text-obsidian-700" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-obsidian-700" />
                )}
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {group.items.map(renderNavItem)}
                </div>
              )}
            </div>
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
            <p className="text-[10px] text-obsidian-500 truncate">
              {roleLabel} • <span className="text-obsidian-600">{user?.email || 'admin@xyz.com'}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-obsidian-400 hover:text-white hover:bg-obsidian-800/60 border border-obsidian-800 transition-colors"
            title="Open customer storefront in a new tab"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Store ↗</span>
          </a>
          <button
            onClick={() => logout()}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-obsidian-500 hover:text-rose-400 hover:bg-rose-500/10 border border-obsidian-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-obsidian-950 text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-obsidian-900/70 border-r border-obsidian-800/60 backdrop-blur-sm flex-shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-72 bg-obsidian-900 border-r border-obsidian-800/60 shadow-2xl">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-obsidian-500 hover:text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center gap-3 px-4 lg:px-8 py-3 bg-obsidian-900/50 border-b border-obsidian-800/40 backdrop-blur-sm sticky top-0 z-40">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-obsidian-500 hover:text-white hover:bg-obsidian-800/60 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-xs tracking-wider text-obsidian-500 font-medium">
            <Link
              href="/admin"
              className="text-gold hover:text-gold-300 transition-colors flex items-center gap-1.5 font-semibold"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-obsidian-700" />
            <span className="text-obsidian-300 font-medium">{getSectionTitle(pathname)}</span>
          </div>

          <div className="flex-1" />

          {/* Mobile brand */}
          <Link href="/admin" className="sm:hidden flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" />
            <span className="font-serif text-sm font-semibold text-white">XYZ Admin</span>
          </Link>

          <div className="flex-1 sm:hidden" />

          {/* Live Store link (opens in new tab) */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-obsidian-400 hover:text-gold hover:bg-obsidian-800/60 border border-obsidian-800 transition-colors"
            title="Preview customer storefront in a new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Store</span>
          </a>

          {/* Search (desktop) */}
          <div className="hidden md:flex relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-obsidian-600" />
            <input
              type="text"
              placeholder="Search admin..."
              className="w-56 pl-8 pr-3 py-1.5 bg-obsidian-800/40 border border-obsidian-700/40 rounded-lg text-xs text-white placeholder-obsidian-600 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/10 transition-colors"
            />
          </div>

          {/* Quick nav (mobile) */}
          <nav className="flex sm:hidden items-center gap-1">
            {mobileNavItems.slice(0, 4).map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`p-2 rounded-lg ${active ? 'text-gold bg-gold/15' : 'text-obsidian-500 hover:text-white'}`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              );
            })}
          </nav>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
