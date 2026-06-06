import React from "react";
import ProductItem from "./ProductItem";
import prisma from "@/utils/db";
import Link from "next/link";

const ProductsSection = async () => {
  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    products = [];
  }

  return (
    <section className="bg-[#f4f9f0] py-16">
      <div className="max-w-screen-2xl mx-auto px-10 max-sm:px-5">
        <div className="flex items-end justify-between mb-10 max-sm:flex-col max-sm:items-start max-sm:gap-3">
          <div>
            <p className="text-brand text-sm font-bold uppercase tracking-widest mb-2">Ассортимент</p>
            <h2 className="text-4xl font-extrabold text-gray-900 uppercase tracking-wide">
              Популярные товары
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-brand font-semibold text-sm hover:underline flex items-center gap-1"
          >
            Смотреть все →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-4 items-stretch gap-5 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {products.map((product: any) => (
              <ProductItem key={product.id} product={product} color="black" />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16 text-lg">
            Товары пока не добавлены.
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
