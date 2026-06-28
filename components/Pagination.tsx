"use client";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import React from "react";

const Pagination = () => {
  const { page, incrementPage, decrementPage } = usePaginationStore();

  return (
    <div className="flex items-center justify-center gap-2 py-12">
      <button
        onClick={decrementPage}
        disabled={page <= 1}
        className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-brand hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg font-semibold flex items-center justify-center"
      >
        ‹
      </button>

      <div className="px-5 h-10 rounded-xl bg-brand text-white text-sm font-bold flex items-center gap-2">
        <span className="text-white/70 font-normal">Страница</span>
        <span>{page}</span>
      </div>

      <button
        onClick={incrementPage}
        className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-brand hover:text-brand transition-all text-lg font-semibold flex items-center justify-center"
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
