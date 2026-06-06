"use client";

import React, { useState } from "react";

const ProductTabs = ({ product }: { product: Product }) => {
  const [currentProductTab, setCurrentProductTab] = useState<number>(0);

  return (
    <div className="px-5 text-black">
      <div role="tablist" className="tabs tabs-bordered">
        <a
          role="tab"
          className={`tab text-lg text-black pb-8 max-[500px]:text-base max-[400px]:text-sm max-[370px]:text-xs ${
            currentProductTab === 0 && "tab-active"
          }`}
          onClick={() => setCurrentProductTab(0)}
        >
          Описание
        </a>
        <a
          role="tab"
          className={`tab text-black text-lg pb-8 max-[500px]:text-base max-[400px]:text-sm max-[370px]:text-xs ${
            currentProductTab === 1 && "tab-active"
          }`}
          onClick={() => setCurrentProductTab(1)}
        >
          Доп. информация
        </a>
      </div>
      <div className="pt-5">
        {currentProductTab === 0 && (
          <div className="text-lg max-sm:text-base leading-relaxed whitespace-pre-wrap">
            {product?.description || "Описание отсутствует."}
          </div>
        )}

        {currentProductTab === 1 && (
          <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-gray-100">
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-50">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wide w-40 flex-shrink-0">Производитель</span>
              <span className="text-base text-gray-800 font-medium">{product?.manufacturer || "—"}</span>
            </div>
            <div className="flex items-center gap-4 px-5 py-4 bg-white border-t border-gray-100">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wide w-40 flex-shrink-0">В наличии</span>
              <span className="text-base text-gray-800 font-medium">
                {product?.inStock > 0 ? (
                  <span className="text-green-700 font-semibold">{product.inStock} шт.</span>
                ) : (
                  <span className="text-red-500">Нет в наличии</span>
                )}
              </span>
            </div>
            <div className="flex items-start gap-4 px-5 py-4 bg-gray-50 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wide w-40 flex-shrink-0 pt-1">Способы оплаты</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">QR-код</span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">Visa</span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">М-Банк</span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">О-Банк</span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">Оптима</span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">Наличные</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
