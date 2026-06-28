
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Корзина — Agrogeroi" };

import { Loader } from "@/components/Loader";
import { CartModule } from "@/components/modules/cart";
import { Suspense } from "react";

const CartPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-16 max-[1320px]:px-10 max-md:px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Корзина</h1>
        <Suspense fallback={<Loader />}>
          <CartModule />
        </Suspense>
      </div>
    </div>
  );
};

export default CartPage;
