'use client';

import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Truck,
  Package,
  Search,
  AlertTriangle,
} from 'lucide-react';

type OrderStatus = 'ALL' | 'PENDING_RX' | 'IN_LAB' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: OrderStatus;
  labStage: string;
  date: string;
  hasRxIssue: boolean;
}

const ORDERS_DATA: AdminOrder[] = [
  { id: '1', orderNumber: 'XYZ-88219', customer: 'Sophia Vane', email: 'sophia@example.com', product: 'The Sovereign Round + SV 1.74', amount: 7998, status: 'IN_LAB', labStage: 'Lens Surfacing', date: 'Sept 04', hasRxIssue: false },
  { id: '2', orderNumber: 'XYZ-88220', customer: 'Arjun Patel', email: 'arjun@example.com', product: 'The Aurelius Aviator (Polarized)', amount: 12499, status: 'SHIPPED', labStage: 'DHL Express #IN84920', date: 'Sept 03', hasRxIssue: false },
  { id: '3', orderNumber: 'XYZ-88221', customer: 'Maya Kapoor', email: 'maya@example.com', product: 'The Athena Cat-Eye + Progressive', amount: 9499, status: 'PENDING_RX', labStage: 'Awaiting Rx Verification', date: 'Sept 05', hasRxIssue: true },
  { id: '4', orderNumber: 'XYZ-88222', customer: 'Ravi Kumar', email: 'ravi@example.com', product: 'The Scholar Rectangle + SV 1.67', amount: 3499, status: 'DELIVERED', labStage: 'Completed', date: 'Aug 30', hasRxIssue: false },
  { id: '5', orderNumber: 'XYZ-88223', customer: 'Priya Singh', email: 'priya@example.com', product: 'The Monarch Browline + SV 1.60', amount: 6999, status: 'IN_LAB', labStage: 'Anti-Reflective Coating', date: 'Sept 02', hasRxIssue: false },
  { id: '6', orderNumber: 'XYZ-88224', customer: 'Aditya Pathak', email: 'aditya@xyz.com', product: 'The Prism Sport Wrap (Mirror)', amount: 4999, status: 'IN_LAB', labStage: 'Frame Prep', date: 'Sept 06', hasRxIssue: false },
  { id: '7', orderNumber: 'XYZ-88225', customer: 'Vikram Joshi', email: 'vikram@example.com', product: 'The Lumina Round + Progressive', amount: 11200, status: 'PENDING_RX', labStage: 'Cylinder axis query', date: 'Sept 06', hasRxIssue: true },
  { id: '8', orderNumber: 'XYZ-88226', customer: 'Nandini Rao', email: 'nandini@example.com', product: 'The Imperial Aviator + Photochromic', amount: 8499, status: 'SHIPPED', labStage: 'BlueDart #BD7741', date: 'Sept 04', hasRxIssue: false },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING_RX: { label: 'Pending Rx', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30', icon: AlertTriangle },
  IN_LAB: { label: 'In Optical Lab', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Clock },
  SHIPPED: { label: 'Shipped', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'bg-obsidian-500/15 text-obsidian-400 border-obsidian-600/30', icon: Package },
};

const filterTabs: { key: OrderStatus; label: string; count: number }[] = [
  { key: 'ALL', label: 'All Orders', count: ORDERS_DATA.length },
  { key: 'PENDING_RX', label: 'Pending Rx', count: ORDERS_DATA.filter((o) => o.status === 'PENDING_RX').length },
  { key: 'IN_LAB', label: 'In Lab', count: ORDERS_DATA.filter((o) => o.status === 'IN_LAB').length },
  { key: 'SHIPPED', label: 'Shipped', count: ORDERS_DATA.filter((o) => o.status === 'SHIPPED').length },
  { key: 'DELIVERED', label: 'Delivered', count: ORDERS_DATA.filter((o) => o.status === 'DELIVERED').length },
];

export default function AdminOrdersPage() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState(ORDERS_DATA);

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = activeFilter === 'ALL' || o.status === activeFilter;
    const matchesSearch =
      !searchQuery ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, labStage: newStatus === 'SHIPPED' ? 'In Transit' : newStatus === 'DELIVERED' ? 'Completed' : o.labStage }
          : o,
      ),
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Fulfillment Center</span>
          <h1 className="font-serif text-3xl font-medium text-white mt-1">
            Orders & Fulfillment Queue
          </h1>
          <p className="text-sm text-obsidian-500 mt-1">
            Process customer orders, update lab stages, and manage dispatch operations.
          </p>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-obsidian-900/80 border border-obsidian-800/60 rounded-xl p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === tab.key
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'text-obsidian-500 hover:text-white border border-transparent'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-60">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-600" />
          <input
            type="text"
            placeholder="Search orders or customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-obsidian-900/80 border border-obsidian-800/60 rounded-xl text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-gold/50"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-obsidian-600 border-b border-obsidian-800/50">
                <th className="text-left px-5 py-3 font-semibold">Order</th>
                <th className="text-left px-5 py-3 font-semibold">Customer</th>
                <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">Product</th>
                <th className="text-right px-5 py-3 font-semibold">Amount</th>
                <th className="text-center px-5 py-3 font-semibold">Status</th>
                <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Lab Stage</th>
                <th className="text-center px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800/40">
              {filteredOrders.map((order) => {
                const config = statusConfig[order.status] || statusConfig.IN_LAB;
                const StatusIcon = config.icon;
                return (
                  <tr key={order.id} className="hover:bg-obsidian-800/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {order.hasRxIssue && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />}
                        <span className="font-mono text-xs font-bold text-gold">{order.orderNumber}</span>
                      </div>
                      <span className="text-[11px] text-obsidian-600 block mt-0.5">{order.date}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-white font-medium block">{order.customer}</span>
                      <span className="text-[11px] text-obsidian-600">{order.email}</span>
                    </td>
                    <td className="px-5 py-4 text-obsidian-400 text-xs hidden lg:table-cell max-w-[200px] truncate">
                      {order.product}
                    </td>
                    <td className="px-5 py-4 text-right text-white font-semibold">
                      ₹{order.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-obsidian-400 text-xs hidden md:table-cell">
                      {order.labStage}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-obsidian-800/80 border border-obsidian-700 rounded-lg px-2 py-1.5 text-[11px] text-obsidian-300 focus:outline-none focus:border-gold/50 cursor-pointer"
                      >
                        <option value="PENDING_RX">Pending Rx</option>
                        <option value="IN_LAB">In Lab</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-obsidian-600">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No orders match the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
