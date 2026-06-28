"use client";
import React from "react";
import { useSortStore } from "@/app/_zustand/sortStore";

const SortBy = () => {
  const { sortBy, changeSortBy } = useSortStore();

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Сортировка:</span>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => changeSortBy(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all cursor-pointer hover:border-gray-300"
        >
          <option value="defaultSort">По умолчанию</option>
          <option value="titleAsc">По названию А–Я</option>
          <option value="titleDesc">По названию Я–А</option>
          <option value="lowPrice">Сначала дешевле</option>
          <option value="highPrice">Сначала дороже</option>
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" viewBox="0 0 16 16"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export default SortBy;
