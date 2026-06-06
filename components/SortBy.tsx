// *********************
// Role of the component: SortBy
// Name of the component: SortBy.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <SortBy />
// Input parameters: no input parameters
// Output: select input with options for sorting by a-z, z-a, price low, price high
// *********************

"use client";
import React from "react";
import { useSortStore } from "@/app/_zustand/sortStore";

const SortBy = () => {
  // getting values from Zustand sort store
  const { sortBy, changeSortBy } = useSortStore();

  return (
    <div className="flex items-center gap-x-5 max-lg:flex-col max-lg:w-full max-lg:items-start">
      <h3 className="text-xl">Сортировка:</h3>
      <select
        defaultValue={sortBy}
        onChange={(e) => changeSortBy(e.target.value)}
        className="select border-gray-400 py-2 px-2 text-base border-2 select-bordered w-48 focus:outline-none outline-none max-lg:w-full bg-white"
        name="sort"
      >
        <option value="defaultSort">По умолчанию</option>
        <option value="titleAsc">По названию А-Я</option>
        <option value="titleDesc">По названию Я-А</option>
        <option value="lowPrice">Сначала дешевле</option>
        <option value="highPrice">Сначала дороже</option>
      </select>
    </div>
  );
};

export default SortBy;
