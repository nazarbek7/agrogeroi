"use client"

import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaCheck, FaXmark } from "react-icons/fa6";
import QuantityInputCart from "@/components/QuantityInputCart";
import { imgSrc } from "@/utils/imgSrc";

export const CartModule = () => {
  const { products, removeFromCart, calculateTotals, total } = useProductStore();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    calculateTotals();
    toast.success("Товар удалён из корзины");
  };

  const DELIVERY_FEE = 500;
  const orderTotal = total > 0 ? total + DELIVERY_FEE : 0;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="text-5xl">🛒</div>
        <p className="text-lg font-semibold text-gray-700">Корзина пуста</p>
        <p className="text-sm text-gray-400">Добавьте товары из каталога</p>
        <Link href="/shop" className="mt-2 px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-dark transition-all">
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
      {/* Список товаров */}
      <div className="lg:col-span-7">
        <ul className="divide-y divide-gray-100">
          {products.map((product) => (
            <li key={product.id} className="flex gap-4 py-5">
              <div className="flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc(product?.image)}
                  alt={product.title || "Фото товара"}
                  className="h-24 w-24 rounded-2xl object-cover object-center bg-gray-100 sm:h-32 sm:w-32"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/product/${product.id}`} className="font-semibold text-gray-900 hover:text-brand transition-colors line-clamp-2 text-sm sm:text-base">
                      {product.title}
                    </Link>
                    <p className="mt-1 text-sm font-bold text-brand">
                      {product.price?.toLocaleString()} сом
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(product.id)}
                    type="button"
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <FaXmark className="text-sm" />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <QuantityInputCart product={product} />
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <FaCheck className="text-xs" /> В наличии
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Итого */}
      <div className="mt-8 lg:mt-0 lg:col-span-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
          <h2 className="text-base font-bold text-gray-900 mb-5">Итого</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Стоимость товаров</span>
              <span className="font-medium text-gray-900">{total?.toLocaleString()} сом</span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
              <span className="text-gray-500">Доставка</span>
              <span className="font-medium text-gray-900">{total > 0 ? `${DELIVERY_FEE.toLocaleString()} сом` : "—"}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="font-bold text-gray-900">К оплате</span>
              <span className="text-lg font-extrabold text-brand">{orderTotal?.toLocaleString()} сом</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-6 flex justify-center items-center w-full rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark transition-all"
          >
            Оформить заказ →
          </Link>
        </div>
      </div>
    </div>
  );
};
