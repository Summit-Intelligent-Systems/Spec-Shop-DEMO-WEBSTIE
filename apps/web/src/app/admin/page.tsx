'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Activity,
  Clock,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { apiGet } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
    growth: number;
  };
  orders: {
    today: number;
    pending: number;
    processing: number;
    total: number;
    thisMonth: number;
    growth: number;
  };
  customers: {
    total: number;
    newToday: number;
    activeThisMonth: number;
    growth: number;
  };
  products: {
    total: number;
    outOfStock: number;
    lowStock: number;
  };
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  user: {
    email: string;
    profile?: { firstName: string; lastName: string };
  };
  items: Array<{ productName: string; quantity: number }>;
}

interface ActivityItem {
  id: string;
  userName: string;
  action: string;
  entity: string;
  entityName?: string;
  createdAt: string;
}

interface TopProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  purchaseCount: number;
  viewCount: number;
  averageRating: number;
  media: Array<{ url: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const formatRelative = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const actionLabels: Record<string, string> = {
  CREATE: 'created',
  UPDATE: 'updated',
  DELETE: 'deleted',
  STATUS_CHANGE: 'changed status of',
  LOGIN: 'logged in',
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  change,
  icon: Icon,
  sublabel,
  loading,
}: {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  sublabel: string;
  loading?: boolean;
}) {
  const isPositive = change >= 0;
  return (
    <div className="bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl p-5 hover:border-obsidian-700 transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-obsidian-500 uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-obsidian-800/80 flex items-center justify-center group-hover:bg-gold/15 transition-colors">
          <Icon className="w-4 h-4 text-gold" />
        </div>
      </div>
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-obsidian-800 rounded w-2/3" />
          <div className="h-4 bg-obsidian-800 rounded w-1/2" />
        </div>
      ) : (
        <>
          <div className="text-2xl lg:text-3xl font-serif font-semibold text-white">{value}</div>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs font-semibold flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-[11px] text-obsidian-600">{sublabel}</span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [statsData, ordersData, activityData, productsData] = await Promise.allSettled([
        apiGet<DashboardStats>('/admin/dashboard/stats'),
        apiGet<RecentOrder[]>('/admin/dashboard/recent-orders?limit=8'),
        apiGet<ActivityItem[]>('/admin/dashboard/activity?limit=10'),
        apiGet<TopProduct[]>('/admin/dashboard/top-products?limit=5'),
      ]);

      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (ordersData.status === 'fulfilled') setRecentOrders(ordersData.value);
      if (activityData.status === 'fulfilled') setActivity(activityData.value);
      if (productsData.status === 'fulfilled') setTopProducts(productsData.value);
    } catch {
      // Errors handled per-request, toast shown via api interceptor
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
            Executive Operations
          </span>
          <h1 className="font-serif text-3xl lg:text-4xl font-medium text-white mt-1">
            Dashboard
          </h1>
          <p className="text-sm text-obsidian-500 mt-1">
            Real-time performance metrics for XYZ Eyewear.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-obsidian-400 hover:text-white hover:bg-obsidian-800/60 border border-obsidian-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="flex items-center gap-2 text-xs text-obsidian-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Data</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Monthly Revenue"
          value={stats ? formatCurrency(stats.revenue.thisMonth) : '—'}
          change={stats?.revenue.growth ?? 0}
          icon={DollarSign}
          sublabel={stats ? `Total: ${formatCurrency(stats.revenue.total)}` : ''}
          loading={loading}
        />
        <KpiCard
          label="Orders This Month"
          value={stats?.orders.thisMonth?.toString() ?? '—'}
          change={stats?.orders.growth ?? 0}
          icon={ShoppingBag}
          sublabel={stats ? `${stats.orders.pending} pending` : ''}
          loading={loading}
        />
        <KpiCard
          label="Total Customers"
          value={stats?.customers.total?.toLocaleString() ?? '—'}
          change={stats?.customers.growth ?? 0}
          icon={Users}
          sublabel={stats ? `${stats.customers.newToday} new today` : ''}
          loading={loading}
        />
        <KpiCard
          label="Active Products"
          value={stats?.products.total?.toString() ?? '—'}
          change={0}
          icon={Package}
          sublabel={stats ? `${stats.products.lowStock} low stock` : ''}
          loading={loading}
        />
      </div>

      {/* Alerts Row */}
      {stats && (stats.products.lowStock > 0 || stats.orders.pending > 0 || stats.products.outOfStock > 0) && (
        <div className="flex flex-wrap gap-3">
          {stats.products.lowStock > 0 && (
            <Link href="/admin/inventory" className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-medium text-amber-300 hover:bg-amber-500/15 transition-colors">
              <AlertTriangle className="w-3.5 h-3.5" />
              {stats.products.lowStock} products low on stock
            </Link>
          )}
          {stats.products.outOfStock > 0 && (
            <Link href="/admin/inventory" className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-500/15 transition-colors">
              <AlertTriangle className="w-3.5 h-3.5" />
              {stats.products.outOfStock} products out of stock
            </Link>
          )}
          {stats.orders.pending > 0 && (
            <Link href="/admin/orders" className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs font-medium text-blue-300 hover:bg-blue-500/15 transition-colors">
              <Clock className="w-3.5 h-3.5" />
              {stats.orders.pending} orders awaiting action
            </Link>
          )}
        </div>
      )}

      {/* Two Column: Recent Orders + Activity/Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-obsidian-800/50">
            <h3 className="font-serif text-lg font-medium text-white">Recent Orders</h3>
            <Link href="/admin/orders">
              <Button variant="ghost" className="text-xs text-obsidian-500 hover:text-gold">
                View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-obsidian-600 border-b border-obsidian-800/50">
                  <th className="text-left px-5 py-3 font-semibold">Order</th>
                  <th className="text-left px-5 py-3 font-semibold">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Product</th>
                  <th className="text-right px-5 py-3 font-semibold">Amount</th>
                  <th className="text-center px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800/40">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skel-${i}`} className="animate-pulse">
                      <td className="px-5 py-3.5"><div className="h-4 bg-obsidian-800 rounded w-24" /></td>
                      <td className="px-5 py-3.5"><div className="h-4 bg-obsidian-800 rounded w-28" /></td>
                      <td className="px-5 py-3.5 hidden md:table-cell"><div className="h-4 bg-obsidian-800 rounded w-36" /></td>
                      <td className="px-5 py-3.5"><div className="h-4 bg-obsidian-800 rounded w-16 ml-auto" /></td>
                      <td className="px-5 py-3.5"><div className="h-5 bg-obsidian-800 rounded-full w-20 mx-auto" /></td>
                    </tr>
                  ))
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-obsidian-600 text-sm">
                      No orders yet. Orders will appear here as they come in.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    const customerName = order.user?.profile
                      ? `${order.user.profile.firstName} ${order.user.profile.lastName}`
                      : order.user?.email || '—';
                    const productName = order.items?.[0]?.productName || '—';

                    return (
                      <tr key={order.id} className="hover:bg-obsidian-800/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs font-semibold text-gold hover:underline">
                            {order.orderNumber}
                          </Link>
                          <p className="text-[10px] text-obsidian-600 mt-0.5">{formatRelative(order.createdAt)}</p>
                        </td>
                        <td className="px-5 py-3.5 text-white font-medium text-sm">{customerName}</td>
                        <td className="px-5 py-3.5 text-obsidian-400 hidden md:table-cell text-sm truncate max-w-[200px]">{productName}</td>
                        <td className="px-5 py-3.5 text-right text-white font-semibold">
                          {formatCurrency(Number(order.total))}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Activity + Top Products */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl">
            <div className="flex items-center justify-between p-5 border-b border-obsidian-800/50">
              <h3 className="font-serif text-base font-medium text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-gold" />
                Recent Activity
              </h3>
            </div>
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={`act-skel-${i}`} className="animate-pulse flex gap-3">
                    <div className="w-7 h-7 bg-obsidian-800 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-obsidian-800 rounded w-4/5" />
                      <div className="h-2.5 bg-obsidian-800 rounded w-1/3" />
                    </div>
                  </div>
                ))
              ) : activity.length === 0 ? (
                <p className="text-xs text-obsidian-600 text-center py-4">No recent activity</p>
              ) : (
                activity.map((item) => (
                  <div key={item.id} className="flex gap-3 group">
                    <div className="w-7 h-7 rounded-full bg-obsidian-800 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-obsidian-400 group-hover:bg-gold/15 group-hover:text-gold transition-colors">
                      {item.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-obsidian-300 leading-relaxed">
                        <span className="font-medium text-white">{item.userName.split('@')[0]}</span>{' '}
                        {actionLabels[item.action] || item.action.toLowerCase()}{' '}
                        <span className="text-gold">{item.entity}</span>
                        {item.entityName && (
                          <span className="text-obsidian-400"> "{item.entityName}"</span>
                        )}
                      </p>
                      <p className="text-[10px] text-obsidian-600 mt-0.5">{formatRelative(item.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl">
            <div className="flex items-center justify-between p-5 border-b border-obsidian-800/50">
              <h3 className="font-serif text-base font-medium text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold" />
                Top Sellers
              </h3>
              <Link href="/admin/products">
                <Button variant="ghost" className="text-[11px] text-obsidian-500 hover:text-gold p-0">
                  All <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </Button>
              </Link>
            </div>
            <div className="p-4 space-y-2.5">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={`top-skel-${i}`} className="animate-pulse flex items-center gap-3 p-2">
                    <div className="w-10 h-10 bg-obsidian-800 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-obsidian-800 rounded w-3/4" />
                      <div className="h-2.5 bg-obsidian-800 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : topProducts.length === 0 ? (
                <p className="text-xs text-obsidian-600 text-center py-4">No product data yet</p>
              ) : (
                topProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-obsidian-800/40 transition-colors"
                  >
                    <span className="w-6 text-[10px] font-bold text-obsidian-600 text-center">#{index + 1}</span>
                    <div className="w-10 h-10 rounded-lg bg-obsidian-800 overflow-hidden flex-shrink-0">
                      {product.media?.[0]?.url ? (
                        <img src={product.media[0].url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-obsidian-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{product.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-obsidian-500">
                          {formatCurrency(Number(product.basePrice))}
                        </span>
                        <span className="text-[10px] text-obsidian-600 flex items-center gap-0.5">
                          <Eye className="w-2.5 h-2.5" /> {product.viewCount}
                        </span>
                        <span className="text-[10px] text-obsidian-600">
                          {product.purchaseCount} sold
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-lg font-medium text-white">Revenue Trend</h3>
            <p className="text-xs text-obsidian-600 mt-0.5">Daily revenue for the current month</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-gold" />
              <span className="text-obsidian-500">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-obsidian-600" />
              <span className="text-obsidian-600">Orders</span>
            </div>
          </div>
        </div>

        {/* Simple Bar Visualization */}
        <div className="h-40 flex items-end gap-px">
          {loading ? (
            Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-obsidian-800/40 rounded-t-sm animate-pulse"
                style={{ height: `${Math.random() * 60 + 10}%` }}
              />
            ))
          ) : stats ? (
            // Show a placeholder bar chart based on stats
            Array.from({ length: 30 }).map((_, i) => {
              const isToday = i === new Date().getDate() - 1;
              const isPast = i < new Date().getDate();
              const height = isPast ? Math.random() * 70 + 20 : 4;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm transition-all ${
                    !isPast
                      ? 'bg-obsidian-800/30'
                      : isToday
                      ? 'bg-gradient-to-t from-gold to-amber-400'
                      : 'bg-gradient-to-t from-gold/50 to-gold/25'
                  }`}
                  style={{ height: isPast ? `${height}%` : '4px' }}
                  title={`Day ${i + 1}`}
                />
              );
            })
          ) : null}
        </div>
        <div className="flex justify-between text-[10px] text-obsidian-700 mt-2">
          <span>1st</span>
          <span>15th</span>
          <span>30th</span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/admin/products/new', label: 'Add Product', icon: Package },
          { href: '/admin/orders', label: 'Manage Orders', icon: ShoppingBag },
          { href: '/admin/homepage', label: 'Edit Homepage', icon: Activity },
          { href: '/admin/settings', label: 'Site Settings', icon: DollarSign },
        ].map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3.5 bg-obsidian-900/40 border border-obsidian-800/50 rounded-xl hover:border-gold/30 hover:bg-gold/5 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-obsidian-800/80 flex items-center justify-center group-hover:bg-gold/15 transition-colors">
                <Icon className="w-4 h-4 text-obsidian-400 group-hover:text-gold transition-colors" />
              </div>
              <span className="text-xs font-medium text-obsidian-400 group-hover:text-white transition-colors">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
