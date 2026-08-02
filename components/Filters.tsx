"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaChevronDown, FaSliders } from "react-icons/fa6";
import { useSortStore } from "@/app/_zustand/sortStore";
import { usePaginationStore } from "@/app/_zustand/paginationStore";
import { categoryMenuList } from "@/lib/utils";

type StockMode = "all" | "inStock";

interface FiltersState {
  stock: StockMode;
  price: number;
  isBestseller: boolean;
  isNew: boolean;
}

const stockOptions: { value: StockMode; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "inStock", label: "В наличии" },
];

const allCategories = [{ title: "Все товары", href: "/shop" }, ...categoryMenuList];
const CATEGORY_PREVIEW = 7;

const Filters = ({ maxPrice }: { maxPrice: number }) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { page } = usePaginationStore();
  const { sortBy } = useSortStore();

  const [filters, setFilters] = useState<FiltersState>({
    stock: "all",
    price: maxPrice,
    isBestseller: false,
    isNew: false,
  });
  const [appliedPrice, setAppliedPrice] = useState(maxPrice);
  const [openOnMobile, setOpenOnMobile] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Only the slider is debounced — dragging it fires a change per step, and
  // every URL write re-renders the (force-dynamic) product list on the server.
  useEffect(() => {
    const timer = setTimeout(() => setAppliedPrice(filters.price), 300);
    return () => clearTimeout(timer);
  }, [filters.price]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("inStock", "true");
    params.set("outOfStock", (filters.stock === "all").toString());
    params.set("price", appliedPrice.toString());
    params.set("sort", sortBy);
    params.set("page", page.toString());
    if (filters.isBestseller) params.set("isBestseller", "true");
    if (filters.isNew) params.set("isNew", "true");
    replace(`${pathname}?${params}`);
  }, [
    filters.stock,
    filters.isBestseller,
    filters.isNew,
    appliedPrice,
    sortBy,
    page,
    pathname,
    replace,
  ]);

  const activeCount =
    (filters.stock !== "all" ? 1 : 0) +
    (filters.price < maxPrice ? 1 : 0) +
    (filters.isNew ? 1 : 0) +
    (filters.isBestseller ? 1 : 0);

  const reset = () => {
    setFilters({ stock: "all", price: maxPrice, isBestseller: false, isNew: false });
    setAppliedPrice(maxPrice);
  };

  const currentPath = decodeURIComponent(pathname);

  // the active category always stays visible, even when the list is collapsed
  const visibleCategories = showAllCategories
    ? allCategories
    : allCategories.filter(
        (item, index) => index < CATEGORY_PREVIEW || item.href === currentPath
      );

  const badges = [
    {
      label: "Новинка",
      checked: filters.isNew,
      activeClass: "bg-brand border-brand",
      toggle: () => setFilters((prev) => ({ ...prev, isNew: !prev.isNew })),
    },
    {
      label: "Хит продаж",
      checked: filters.isBestseller,
      activeClass: "bg-orange-500 border-orange-500",
      toggle: () => setFilters((prev) => ({ ...prev, isBestseller: !prev.isBestseller })),
    },
  ];

  return (
    <aside>
      {/* Mobile: collapsed by default so the grid isn't pushed below the fold */}
      <button
        type="button"
        onClick={() => setOpenOnMobile((open) => !open)}
        aria-expanded={openOnMobile}
        className="hidden w-full items-center justify-between gap-2 max-md:flex"
      >
        <span className="flex items-center gap-2 text-base font-bold uppercase tracking-wider text-gray-900">
          <FaSliders className="text-brand text-sm" />
          Фильтры
          {activeCount > 0 && (
            <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-white">
              {activeCount}
            </span>
          )}
        </span>
        <FaChevronDown
          className={`text-sm text-gray-400 transition-transform ${openOnMobile ? "rotate-180" : ""}`}
        />
      </button>

      <div className={`flex flex-col gap-6 ${openOnMobile ? "max-md:mt-5" : "max-md:hidden"}`}>
        <div className="flex items-center justify-between gap-2 max-md:hidden">
          <h3 className="text-base font-bold uppercase tracking-wider text-gray-900">Фильтры</h3>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Сбросить
            </button>
          )}
        </div>

        {/* Категории */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Категории</p>
          <ul className="flex flex-col gap-0.5">
            {visibleCategories.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-brand/10 font-semibold text-brand"
                        : "text-gray-600 hover:bg-gray-50 hover:text-brand"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
          {allCategories.length > CATEGORY_PREVIEW && (
            <button
              type="button"
              onClick={() => setShowAllCategories((shown) => !shown)}
              className="self-start px-2.5 text-xs font-semibold text-brand hover:underline"
            >
              {showAllCategories
                ? "Свернуть"
                : `Ещё ${allCategories.length - CATEGORY_PREVIEW}`}
            </button>
          )}
        </div>

        <div className="h-px bg-gray-100" />

        {/* Наличие */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Наличие</p>
          <div className="flex rounded-xl bg-gray-100 p-1">
            {stockOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, stock: option.value }))}
                className={`flex-1 whitespace-nowrap rounded-lg px-2 py-2 text-sm font-semibold transition-colors ${
                  filters.stock === option.value
                    ? "bg-white text-brand shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Цена */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Макс. цена</p>
            <span className="text-sm font-bold text-brand">
              {filters.price.toLocaleString("ru-RU")} сом
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={10}
            value={filters.price}
            aria-label="Максимальная цена"
            onChange={(e) => setFilters((prev) => ({ ...prev, price: Number(e.target.value) }))}
            className="filter-range"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0 сом</span>
            <span>{maxPrice.toLocaleString("ru-RU")} сом</span>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Бейджи */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Товары</p>
          {badges.map((item) => (
            <label key={item.label} className="group flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="sr-only"
                checked={item.checked}
                onChange={item.toggle}
              />
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                  item.checked
                    ? item.activeClass
                    : "border-gray-300 bg-white group-hover:border-brand/50"
                }`}
              >
                {item.checked && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="select-none text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="hidden rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:border-brand hover:text-brand max-md:block"
          >
            Сбросить фильтры
          </button>
        )}
      </div>
    </aside>
  );
};

export default Filters;
