import Image from "next/image";
import React from "react";
import Link from "next/link";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  const isDark = color !== "black";

  return (
    <div
      className={`group flex flex-col w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        isDark ? "bg-white/15 hover:bg-white/25 border border-white/20" : "bg-white hover:scale-[1.02]"
      }`}
    >
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block overflow-hidden">
        <div className="relative w-full h-52 bg-[#e8f5e1] flex items-center justify-center overflow-hidden">
          <Image
            src={
              product.mainImage && product.mainImage !== "product_placeholder.jpg"
                ? `/${product.mainImage}`
                : "/product_placeholder.jpg"
            }
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            alt={product?.title || "Фото товара"}
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link
          href={`/product/${product.slug}`}
          className={`text-base font-semibold leading-snug line-clamp-2 hover:underline ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          {product.title}
        </Link>

        <p
          className={`text-xl font-bold mt-auto ${
            isDark ? "text-white" : "text-brand"
          }`}
        >
          {product.price.toLocaleString("ru-RU")} сом
        </p>

        <Link
          href={`/product/${product.slug}`}
          className={`mt-2 self-start px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            isDark
              ? "bg-green-400 text-white hover:bg-green-300"
              : "bg-brand text-white hover:opacity-90 shadow-sm"
          }`}
        >
          Смотреть →
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;
