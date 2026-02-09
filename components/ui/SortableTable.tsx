"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export type SortDirection = "asc" | "desc" | null;
export type SortConfig<T> = {
  key: keyof T;
  direction: SortDirection;
};

interface SortableTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
  }[];
  onRowClick?: (row: T) => void;
  className?: string;
}

export default function SortableTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  className = "",
}: SortableTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);

  const handleSort = (key: keyof T) => {
    let direction: SortDirection = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig(direction ? { key, direction } : null);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const getSortIcon = (key: keyof T) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4 text-teal-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-teal-600" />
    );
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg overflow-hidden border border-gray-100 ${className}`}>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={`${String(column.key)}-${index}`}
                    className={`px-3 md:px-6 lg:px-8 py-3 md:py-4 lg:py-5 text-left text-xs md:text-sm lg:text-base font-semibold text-gray-700 uppercase tracking-wider ${
                      column.sortable !== false ? "cursor-pointer hover:bg-gray-100" : ""
                    }`}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1 md:gap-2">
                      <span className="truncate">{column.label}</span>
                      {column.sortable !== false && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  className={`bg-gray-50 ${onRowClick ? "cursor-pointer hover:bg-gray-100" : ""}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-3 md:px-6 lg:px-8 py-3 md:py-4 lg:py-5 whitespace-nowrap">
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] ?? "N/A")}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {sortedData.length === 0 && (
        <div className="p-8 md:p-16 text-center">
          <p className="text-gray-400 text-sm md:text-base lg:text-lg">No data available</p>
        </div>
      )}
    </div>
  );
}
