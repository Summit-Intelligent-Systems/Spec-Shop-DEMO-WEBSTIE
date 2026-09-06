'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const kpiCards = [
  {
    label: 'Monthly Revenue',
    value: '₹28,47,500',
    change: '+18.4%',
    isPositive: true,
    icon: DollarSign,
    sublabel: 'vs ₹24,05,000 last month',
  },
  {
    label: 'Orders This Month',
    value: '342',
    change: '+12.1%',
    isPositive: true,
    icon: ShoppingBag,
    sublabel: '94 in optical lab now',
  },
  {
    label: 'Active Customers',
    value: '1,847',
    change: '+6.3%',
    isPositive: true,
    icon: Users,
    sublabel: '312 VIP Privé members',
  },
  {
    label: 'Avg. Order Value',
    value: '₹8,325',
    change: '-2.1%',
    isPositive: false,
    icon: TrendingUp,
    sublabel: 'Lens add-ons: 78% attach rate',
  },
];

const recentOrders = [
  { id: 'XYZ-88219', customer: 'Sophia Vane', product: 'The Sovereign Round', amount: 7998, status: 'IN_LAB', stage: 'Lens Surfacing' },
  { id: 'XYZ-88220', customer: 'Arjun Patel', product: 'The Aurelius Aviator', amount: 12499, status: 'SHIPPED', stage: 'DHL Express' },
  { id: 'XYZ-88221', customer: 'Maya Kapoor', product: 'The Athena Cat-Eye', amount: 5499, status: 'PENDING_RX', stage: 'Awaiting Rx Verification' },
  { id: 'XYZ-88222', customer: 'Ravi Kumar', product: 'The Scholar Rectangle', amount: 3499, status: 'DELIVERED', stage: 'Completed' },
  { id: 'XYZ-88223', customer: 'Priya Singh', product: 'The Monarch Browline', amount: 6999, status: 'IN_LAB', stage: 'Coating Chamber' },
];

const labQueueSummary = [
  { stage: 'Prescription Pending Review', count: 12, urgency: 'HIGH' },
  { stage: 'Frame Sourcing & Prep', count: 8, urgency: 'NORMAL' },
  { stage: 'Lens Surfacing & Edging', count: 24, urgency: 'NORMAL' },
  { stage: 'Anti-Reflective Coating', count: 15, urgency: 'NORMAL' },
  { stage: 'QA & Dispatch', count: 6, urgency: 'LOW' },
];

const statusColor: Record<string, string> = {
  IN_LAB: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  SHIPPED: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  PENDING_RX: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  DELIVERED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
            Executive Operations
          </span>
          <h1 className="font-serif text-3xl lg:text-4xl font-medium text-white mt-1">
            KPI Dashboard
          </h1>
          <p className="text-sm text-obsidian-500 mt-1">
            Real-time performance metrics for the XYZ Eyewear optical commerce engine.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-obsidian-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Data • Last refreshed just now</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl p-5 hover:border-obsidian-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-obsidian-500 uppercase tracking-wider">
                  {kpi.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-obsidian-800/80 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gold" />
                </div>
              </div>
              <div className="text-2xl lg:text-3xl font-serif font-semibold text-white">
                {kpi.value}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs font-semibold flex items-center gap-1 ${kpi.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {kpi.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change}
                </span>
                <span className="text-[11px] text-obsidian-600">{kpi.sublabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column: Recent Orders + Lab Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-obsidian-800/50">
            <h3 className="font-serif text-lg font-medium text-white">Recent Orders</h3>
            <Link href="/admin/orders">
              <Button variant="ghost" className="text-xs text-obsidian-500 hover:text-gold">
                View All
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-obsidian-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-semibold text-gold">{order.id}</span>
                    </td>
                    <td className="px-5 py-3.5 text-white font-medium">{order.customer}</td>
                    <td className="px-5 py-3.5 text-obsidian-400 hidden md:table-cell">{order.product}</td>
                    <td className="px-5 py-3.5 text-right text-white font-semibold">
                      ₹{order.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${statusColor[order.status] || 'text-obsidian-400'}`}>
                        {order.stage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Optical Lab Queue Summary */}
        <div className="bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl">
          <div className="flex items-center justify-between p-5 border-b border-obsidian-800/50">
            <h3 className="font-serif text-lg font-medium text-white">Optical Lab Queue</h3>
            <span className="text-xs text-obsidian-600 font-mono">65 active</span>
          </div>

          <div className="p-5 space-y-4">
            {labQueueSummary.map((stage) => (
              <div key={stage.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-obsidian-400 flex items-center gap-1.5">
                    {stage.urgency === 'HIGH' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                    {stage.urgency === 'NORMAL' && <Clock className="w-3 h-3 text-amber-400" />}
                    {stage.urgency === 'LOW' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {stage.stage}
                  </span>
                  <span className="font-mono font-bold text-white">{stage.count}</span>
                </div>
                <div className="h-1.5 bg-obsidian-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stage.urgency === 'HIGH'
                        ? 'bg-rose-500'
                        : stage.urgency === 'NORMAL'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min((stage.count / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 pt-0">
            <Link href="/admin/prescriptions">
              <Button
                variant="outline"
                className="w-full border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                12 Rx Awaiting Clinical Review
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Revenue Trend Placeholder */}
      <div className="bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-lg font-medium text-white">Revenue Trend — September 2026</h3>
            <p className="text-xs text-obsidian-600 mt-0.5">Optical lab revenue + direct frame sales combined</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-gold" />
              <span className="text-obsidian-500">This Month</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-obsidian-700" />
              <span className="text-obsidian-600">Last Month</span>
            </div>
          </div>
        </div>

        {/* Mini Bar Chart Visualization */}
        <div className="flex items-end justify-between gap-1.5 h-40">
          {[65, 48, 72, 85, 55, 90, 78, 95, 60, 88, 70, 82, 92, 75, 68, 98, 85, 72, 80, 95, 88, 76, 83, 90, 78, 94, 87, 0, 0, 0].map(
            (val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-sm transition-all ${
                    val === 0
                      ? 'bg-obsidian-800/40 h-1'
                      : i === 15
                      ? 'bg-gradient-to-t from-gold to-amber-400'
                      : 'bg-gradient-to-t from-gold/60 to-gold/30'
                  }`}
                  style={{ height: val ? `${val}%` : '4px' }}
                />
              </div>
            ),
          )}
        </div>
        <div className="flex justify-between text-[10px] text-obsidian-700 mt-2">
          <span>Sept 1</span>
          <span>Sept 15</span>
          <span>Sept 30</span>
        </div>
      </div>
    </div>
  );
}
