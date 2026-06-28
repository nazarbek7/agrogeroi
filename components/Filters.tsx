"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";

interface InputCategory {
  inStock: { text: string; isChecked: boolean };
  outOfStock: { text: string; isChecked: boolean };
  priceFilter: { text: string; value: number };
  ratingFilter: { text: string; value: number };
}

const Filters = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { page } = usePaginationStore();

  const [inputCategory, setInputCategory] = useState<InputCategory>({
    inStock: { text: "instock", isChecked: true },
    outOfStock: { text: "outofstock", isChecked: true },
    priceFilter: { text: "price", value: 3000 },
    ratingFilter: { text: "rating", value: 0 },
  });
  const { sortBy } = useSortStore();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("outOfStock", inputCategory.outOfStock.isChecked.toString());
    params.set("inStock", inputCategory.inStock.isChecked.toString());
    params.set("rating", inputCategory.ratingFilter.value.toString());
    params.set("price", inputCategory.priceFilter.value.toString());
    params.set("sort", sortBy);
    params.set("page", page.toString());
    replace(`${pathname}?${params}`);
  }, [inputCategory, sortBy, page]);

  return (
    <aside className="flex flex-col gap-6">
      <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">Фильтры</h3>

      {/* Наличие */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Наличие</p>
        {[
          {
            label: "В наличии",
            checked: inputCategory.inStock.isChecked,
            onChange: () =>
              setInputCategory({
                ...inputCategory,
                inStock: { text: "instock", isChecked: !inputCategory.inStock.isChecked },
              }),
          },
          {
            label: "Нет в наличии",
            checked: inputCategory.outOfStock.isChecked,
            onChange: () =>
              setInputCategory({
                ...inputCategory,
                outOfStock: { text: "outofstock", isChecked: !inputCategory.outOfStock.isChecked },
              }),
          },
        ].map((item) => (
          <label key={item.label} className="flex items-center gap-3 cursor-pointer group">
            <span
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                item.checked
                  ? "bg-brand border-brand"
                  : "border-gray-300 bg-white group-hover:border-brand/50"
              }`}
              onClick={item.onChange}
            >
              {item.checked && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <input type="checkbox" className="sr-only" checked={item.checked} onChange={item.onChange} />
            <span className="text-sm text-gray-700 select-none">{item.label}</span>
          </label>
        ))}
      </div>

      <div className="h-px bg-gray-100" />

      {/* Цена */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Макс. цена</p>
          <span className="text-sm font-bold text-brand">
            {inputCategory.priceFilter.value.toLocaleString("ru-RU")} сом
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={3000}
          step={10}
          value={inputCategory.priceFilter.value}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              priceFilter: { text: "price", value: Number(e.target.value) },
            })
          }
          className="filter-range"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>0 сом</span>
          <span>3 000 сом</span>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Рейтинг */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Мин. рейтинг</p>
          <span className="text-sm font-bold text-brand">
            {inputCategory.ratingFilter.value === 0 ? "Любой" : `${inputCategory.ratingFilter.value}★`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={inputCategory.ratingFilter.value}
          onChange={(e) =>
            setInputCategory({
              ...inputCategory,
              ratingFilter: { text: "rating", value: Number(e.target.value) },
            })
          }
          className="filter-range"
        />
        <div className="flex justify-between text-xs text-gray-400">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Filters;
