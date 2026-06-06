"use client"

import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import Image from "next/image"
import Link from "next/link";
import { FaCheck, FaXmark } from "react-icons/fa6";
import QuantityInputCart from "@/components/QuantityInputCart";

export const CartModule = () => {
  const { products, removeFromCart, calculateTotals, total } = useProductStore();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    calculateTotals();
    toast.success("Товар удалён из корзины");
  };

  const DELIVERY_FEE = 500;
  const orderTotal = total > 0 ? total + DELIVERY_FEE : 0;

  return (
    <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
      <section aria-labelledby="cart-heading" className="lg:col-span-7">
        <h2 id="cart-heading" className="sr-only">Товары в корзине</h2>

        <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
          {products.map((product) => (
            <li key={product.id} className="flex py-6 sm:py-10">
              <div className="flex-shrink-0">
                <Image
                  width={192}
                  height={192}
                  src={product?.image ? `/${product.image}` : "/product_placeholder.jpg"}
                  alt={product.title || "Фото товара"}
                  className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                />
              </div>

              <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="text-sm">
                        <Link href={`/product/${product.id}`} className="font-medium text-gray-700 hover:text-gray-800">
                          {product.title}
                        </Link>
                      </h3>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {product.price} сом
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-0 sm:pr-9">
                    <QuantityInputCart product={product} />
                    <div className="absolute right-0 top-0">
                      <button
                        onClick={() => handleRemoveItem(product.id)}
                        type="button"
                        className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Удалить</span>
                        <FaXmark className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                  <FaCheck className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                  <span>В наличии</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Итого */}
      <section
        aria-labelledby="summary-heading"
        className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
      >
        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
          Итого
        </h2>

        <dl className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-600">Стоимость товаров</dt>
            <dd className="text-sm font-medium text-gray-900">{total} сом</dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <dt className="text-sm text-gray-600">Доставка</dt>
            <dd className="text-sm font-medium text-gray-900">
              {total > 0 ? `${DELIVERY_FEE} сом` : "—"}
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <dt className="text-base font-medium text-gray-900">К оплате</dt>
            <dd className="text-base font-bold text-brand">
              {orderTotal} сом
            </dd>
          </div>
        </dl>

        {products.length > 0 && (
          <div className="mt-6">
            <Link
              href="/checkout"
              className="block flex justify-center items-center w-full uppercase bg-brand px-4 py-3 text-base font-bold text-white shadow-sm hover:bg-brand-dark focus:outline-none focus:ring-2"
            >
              Оформить заказ
            </Link>
          </div>
        )}
      </section>
    </form>
  );
};
