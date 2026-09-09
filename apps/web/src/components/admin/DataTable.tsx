'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Column<T> {
  key?: string;
  label?: string;
  header?: string;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  accessor?: (row: T, index?: number) => React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  keyField?: string;
  // Pagination
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  // Selection
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  getRowId?: (row: T) => string;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  // Actions
  headerActions?: React.ReactNode;
  bulkActions?: React.ReactNode;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No results found',
  emptyTitle,
  emptyDescription,
  emptyIcon,
  keyField,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 20,
  onPageChange,
  sortBy,
  sortOrder,
  onSort,
  selectable = false,
  selectedIds = new Set(),
  onSelectionChange,
  getRowId = (row: T) => (row as Record<string, string>).id,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  headerActions,
  bulkActions,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && data.every((row) => selectedIds.has(getRowId(row)));
  const someSelected = data.some((row) => selectedIds.has(getRowId(row)));

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      const newIds = new Set(data.map(getRowId));
      onSelectionChange(newIds);
    }
  };

  const handleSelectRow = (id: string) => {
    if (!onSelectionChange) return;
    const newIds = new Set(selectedIds);
    if (newIds.has(id)) {
      newIds.delete(id);
    } else {
      newIds.add(id);
    }
    onSelectionChange(newIds);
  };

  const renderSortIcon = (key: string) => {
    if (sortBy !== key) return <ArrowUpDown className="w-3.5 h-3.5 text-obsidian-600" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 text-gold" />
      : <ArrowDown className="w-3.5 h-3.5 text-gold" />;
  };

  return (
    <div className="bg-obsidian-900/60 border border-obsidian-800/60 rounded-2xl overflow-hidden">
      {/* Header Bar */}
      {(onSearchChange || headerActions || (someSelected && bulkActions)) && (
        <div className="flex items-center gap-3 p-4 border-b border-obsidian-800/50">
          {/* Search */}
          {onSearchChange && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
              <input
                type="text"
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-8 py-2 bg-obsidian-800/60 border border-obsidian-700/50 rounded-xl text-sm text-white placeholder-obsidian-500 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors"
              />
              {searchValue && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-obsidian-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <div className="flex-1" />

          {/* Bulk Actions */}
          {someSelected && bulkActions && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-obsidian-500">{selectedIds.size} selected</span>
              {bulkActions}
            </div>
          )}

          {/* Header Actions */}
          {headerActions}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-obsidian-600 border-b border-obsidian-800/50">
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 rounded border-obsidian-600 bg-obsidian-800 text-gold focus:ring-gold/30 accent-amber-500"
                  />
                </th>
              )}
              {columns.map((col, ci) => (
                <th
                  key={col.key || col.label || col.header || String(ci)}
                  className={`text-left px-5 py-3 font-semibold ${col.headerClassName || ''} ${col.sortable ? 'cursor-pointer select-none hover:text-obsidian-400 transition-colors' : ''}`}
                  onClick={() => col.sortable && col.key && onSort?.(col.key)}
                >
                  <span className="flex items-center gap-1.5">
                    {col.label || col.header}
                    {col.sortable && col.key && renderSortIcon(col.key)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800/40">
            {loading ? (
              // Loading skeleton
              Array.from({ length: limit }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  {selectable && <td className="px-4 py-3.5"><div className="w-3.5 h-3.5 bg-obsidian-800 rounded" /></td>}
                  {columns.map((col, ci) => (
                    <td key={col.key || String(ci)} className="px-5 py-3.5">
                      <div className="h-4 bg-obsidian-800 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {emptyIcon && <div className="text-obsidian-700">{emptyIcon}</div>}
                    <p className="text-obsidian-300 font-medium text-sm">{emptyMessage || emptyTitle || 'No records found'}</p>
                    {emptyDescription && <p className="text-obsidian-500 text-xs max-w-sm">{emptyDescription}</p>}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const rowId = getRowId ? getRowId(row) : (keyField ? (row as any)[keyField] : (row as any).id);
                const isSelected = selectedIds.has(rowId);
                return (
                  <tr
                    key={rowId || index}
                    className={`transition-colors ${isSelected ? 'bg-gold/5' : 'hover:bg-obsidian-800/30'} ${onRowClick ? 'cursor-pointer' : ''} ${rowClassName?.(row, index) || ''}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                          className="w-3.5 h-3.5 rounded border-obsidian-600 bg-obsidian-800 text-gold focus:ring-gold/30 accent-amber-500"
                        />
                      </td>
                    )}
                    {columns.map((col, ci) => (
                      <td key={col.key || String(ci)} className={`px-5 py-3.5 ${col.className || ''}`}>
                        {col.render
                          ? col.render(row, index)
                          : col.accessor
                          ? col.accessor(row, index)
                          : col.key
                          ? String((row as Record<string, unknown>)[col.key] ?? '')
                          : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-obsidian-800/50">
          <span className="text-xs text-obsidian-600">
            Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg text-obsidian-500 hover:text-white hover:bg-obsidian-800/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg text-obsidian-500 hover:text-white hover:bg-obsidian-800/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-xs font-medium text-obsidian-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg text-obsidian-500 hover:text-white hover:bg-obsidian-800/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg text-obsidian-500 hover:text-white hover:bg-obsidian-800/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
