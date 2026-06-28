"use client";

import React, { useState } from "react";

type CareInfo = { icon: string; label: string; value: string };

const CARE_BY_CATEGORY: Record<string, CareInfo[]> = {
  "Розы": [
    { icon: "☀️", label: "Освещение", value: "Полное солнце 6+ ч" },
    { icon: "💧", label: "Полив", value: "2 раза в неделю" },
    { icon: "🌱", label: "Почва", value: "Суглинок, pH 6–6,5" },
    { icon: "❄️", label: "Зимостойкость", value: "до −25 °C" },
  ],
  "Гортензии": [
    { icon: "🌤️", label: "Освещение", value: "Полутень / рассеянный" },
    { icon: "💧", label: "Полив", value: "Обильный, влажно" },
    { icon: "🌱", label: "Почва", value: "Кислая, pH 4,5–6" },
    { icon: "❄️", label: "Зимостойкость", value: "до −30 °C" },
  ],
  "Хвойные деревья и кустарники": [
    { icon: "☀️", label: "Освещение", value: "Солнце / полутень" },
    { icon: "💧", label: "Полив", value: "Умеренный" },
    { icon: "🌱", label: "Почва", value: "Суглинок, дренаж" },
    { icon: "❄️", label: "Зимостойкость", value: "до −35 °C" },
  ],
  "Лиственные деревья": [
    { icon: "☀️", label: "Освещение", value: "Полное солнце" },
    { icon: "💧", label: "Полив", value: "В засуху" },
    { icon: "🌱", label: "Почва", value: "Любая, плодородная" },
    { icon: "❄️", label: "Зимостойкость", value: "до −40 °C" },
  ],
  "Лиственные кустарники": [
    { icon: "🌤️", label: "Освещение", value: "Солнце / полутень" },
    { icon: "💧", label: "Полив", value: "Умеренный" },
    { icon: "🌱", label: "Почва", value: "Рыхлая, плодородная" },
    { icon: "❄️", label: "Зимостойкость", value: "до −35 °C" },
  ],
  "Плодовые деревья и кустарники": [
    { icon: "☀️", label: "Освещение", value: "Полное солнце" },
    { icon: "💧", label: "Полив", value: "Регулярный" },
    { icon: "🌱", label: "Почва", value: "Суглинок, pH 6–7" },
    { icon: "❄️", label: "Зимостойкость", value: "до −30 °C" },
  ],
  "Лианы": [
    { icon: "🌤️", label: "Освещение", value: "Солнце / полутень" },
    { icon: "💧", label: "Полив", value: "Умеренный" },
    { icon: "🌱", label: "Почва", value: "Плодородная, дренаж" },
    { icon: "❄️", label: "Зимостойкость", value: "до −25 °C" },
  ],
  "Цветы многолетние": [
    { icon: "☀️", label: "Освещение", value: "Солнце / полутень" },
    { icon: "💧", label: "Полив", value: "Умеренный" },
    { icon: "🌱", label: "Почва", value: "Рыхлая, перегнойная" },
    { icon: "❄️", label: "Зимостойкость", value: "до −35 °C" },
  ],
};

const PAYMENT_METHODS = [
  { label: "QR-код", color: "bg-green-100 text-green-800" },
  { label: "Visa", color: "bg-blue-100 text-blue-800" },
  { label: "М-Банк", color: "bg-orange-100 text-orange-800" },
  { label: "О-Банк", color: "bg-purple-100 text-purple-800" },
  { label: "Оптима", color: "bg-red-100 text-red-800" },
  { label: "Наличные", color: "bg-gray-100 text-gray-700" },
];

const ProductTabs = ({ product, isPlant = false, categoryName = "" }: { product: Product; isPlant?: boolean; categoryName?: string }) => {
  const careItems = CARE_BY_CATEGORY[categoryName] ?? [];
  const [tab, setTab] = useState<0 | 1>(0);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-gray-100">
        {(["Описание", "Доп. информация"] as const).map((label, i) => (
          <button
            key={label}
            onClick={() => setTab(i as 0 | 1)}
            className={`px-8 py-4 text-sm font-semibold transition-colors relative ${
              tab === i
                ? "text-brand"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {label}
            {tab === i && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">

        {/* Description tab */}
        {tab === 0 && (
          <div className="flex flex-col gap-8">
            {/* Description text */}
            <div className="flex gap-4">
              <div className="w-1 rounded-full bg-brand flex-shrink-0 self-stretch" />
              <p className="text-gray-700 leading-relaxed text-base">
                {product?.description || "Описание отсутствует."}
              </p>
            </div>

            {/* Care cards — только для растений */}
            {isPlant && careItems.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Условия выращивания
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {careItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col items-center gap-2 bg-gray-50 rounded-2xl px-4 py-5 border border-gray-100 text-center"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nursery banner — только для растений */}
            {isPlant && (
              <div className="flex items-center gap-4 bg-brand/5 border border-brand/10 rounded-2xl px-5 py-4">
                <span className="text-3xl">🌿</span>
                <div>
                  <p className="text-sm font-bold text-brand">Питомник Agrogeroi</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Все растения выращены в наших питомниках в Кыргызстане — адаптированы к местному климату
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional info tab */}
        {tab === 1 && (
          <div className="flex flex-col gap-0 rounded-2xl overflow-hidden border border-gray-100">
            <div className="flex items-center gap-4 px-6 py-4 bg-gray-50">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide w-36 shrink-0">
                Производитель
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {product?.manufacturer || "—"}
              </span>
            </div>

            <div className="flex items-center gap-4 px-6 py-4 bg-white border-t border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide w-36 shrink-0">
                В наличии
              </span>
              {product?.inStock > 0 ? (
                <span className="text-sm font-semibold text-green-700">
                  {product.inStock} шт.
                </span>
              ) : (
                <span className="text-sm font-semibold text-red-500">
                  Нет в наличии
                </span>
              )}
            </div>

            <div className="flex items-start gap-4 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide w-36 shrink-0 pt-0.5">
                Способы оплаты
              </span>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <span
                    key={m.label}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${m.color}`}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductTabs;
