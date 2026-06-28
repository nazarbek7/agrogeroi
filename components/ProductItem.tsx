import Image from "next/image";
import React from "react";
import Link from "next/link";
import { imgSrc } from "@/utils/imgSrc";
import AddToCartButton from "./AddToCartButton";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  const isDark = color !== "black";

  const hasSaleDiscount = product.isOnSale && product.discountPercent > 0;
  const discountedPrice = hasSaleDiscount
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group flex flex-col w-full rounded-2xl overflow-hidden transition-all duration-300 ${
        isDark
          ? "bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 hover:-translate-y-1"
          : "bg-white border border-gray-100 hover:border-gray-200 hover:-translate-y-1 hover:shadow-xl shadow-sm"
      }`}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
        <Image
          src={imgSrc(product.mainImage)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          alt={product?.title || "Фото товара"}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isBestseller && (
            <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full shadow-sm">
              Хит продаж
            </span>
          )}
          {product.isNew && (
            <span className="bg-brand text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full shadow-sm">
              Новинка
            </span>
          )}
          {hasSaleDiscount && (
            <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full shadow-sm">
              -{product.discountPercent}%
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <p
          className={`text-sm font-semibold leading-snug line-clamp-2 ${
            isDark ? "text-white/90" : "text-gray-800"
          }`}
        >
          {product.title}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100/20">
          <div className="flex flex-col">
            {discountedPrice ? (
              <>
                <span className={`text-lg font-bold ${isDark ? "text-white" : "text-brand"}`}>
                  {discountedPrice.toLocaleString("ru-RU")} сом
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {product.price.toLocaleString("ru-RU")} сом
                </span>
              </>
            ) : (
              <span className={`text-lg font-bold ${isDark ? "text-white" : "text-brand"}`}>
                {product.price.toLocaleString("ru-RU")} сом
              </span>
            )}
          </div>

          <AddToCartButton
            id={product.id}
            title={product.title}
            price={discountedPrice ?? product.price}
            image={imgSrc(product.mainImage)}
            isDark={isDark}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
