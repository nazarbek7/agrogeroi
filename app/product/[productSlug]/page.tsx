import { StockAvailabillity, ProductTabs, SingleProductDynamicFields } from "@/components";
import ProductImageGallery from "@/components/ProductImageGallery";
import prisma from "@/utils/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import type { Metadata } from "next";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{ productSlug: string }>;
}

export async function generateMetadata({ params }: SingleProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    select: { title: true, description: true, manufacturer: true },
  });
  if (!product) return { title: "Товар не найден — Agrogeroi" };

  const desc = product.description
    ? product.description.replace(/<[^>]+>/g, "").slice(0, 160)
    : `Купить ${product.title} в питомнике Agrogeroi. Доставка по Кыргызстану.`;

  return {
    title: `${product.title} — Agrogeroi`,
    description: desc,
  };
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const { productSlug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    include: { category: { select: { name: true } } },
  });
  if (!product) notFound();

  const PLANT_CATEGORIES = new Set([
    "Розы", "Гортензии", "Хвойные деревья и кустарники",
    "Лиственные деревья", "Лиственные кустарники",
    "Плодовые деревья и кустарники", "Лианы", "Цветы многолетние",
  ]);
  const isPlant = PLANT_CATEGORIES.has((product as any).category?.name ?? "");

  let extraImages: ImageItem[] = [];
  try {
    extraImages = (await prisma.image.findMany({ where: { productID: product.id } })) as any;
  } catch {
    // no extra images — that's fine
  }

  const allImages = [
    { id: "main", src: product.mainImage?.startsWith("http") ? product.mainImage : (product.mainImage ? `/${product.mainImage}` : "/product_placeholder.jpg") },
    ...extraImages.map((img) => ({ id: img.imageID, src: img.image?.startsWith("http") ? img.image : `/${img.image}` })),
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-brand transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand transition-colors">Каталог</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">

          {/* Gallery */}
          <ProductImageGallery images={allImages} title={product.title} />

          {/* Info panel */}
          <div className="lg:sticky lg:top-6 flex flex-col gap-5">

            {/* Title + stock */}
            <div className="flex flex-col gap-3">
              <StockAvailabillity stock={product.inStock} inStock={product.inStock as any} />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-brand">
                {product.price.toLocaleString("ru-RU")}
              </span>
              <span className="text-xl font-semibold text-brand/80">сом</span>
            </div>

            <div className="h-px bg-gray-200" />

            {/* Quantity + CTA */}
            <SingleProductDynamicFields product={product as any} />

            <div className="h-px bg-gray-200" />

            {/* Meta */}
            {product.manufacturer && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400 w-28 shrink-0">Производитель</span>
                <span className="font-semibold text-gray-800">{product.manufacturer}</span>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-1">
              {[
                { icon: "🚚", label: "Быстрая\nдоставка" },
                { icon: "✅", label: "Гарантия\nкачества" },
                { icon: "💬", label: "Онлайн\nконсультация" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex flex-col items-center gap-2 bg-white rounded-2xl py-4 px-2 border border-gray-100 shadow-sm text-center"
                >
                  <span className="text-2xl">{b.icon}</span>
                  <span className="text-[11px] text-gray-500 font-medium leading-tight whitespace-pre-line">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-14 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <ProductTabs product={product as any} isPlant={isPlant} categoryName={(product as any).category?.name ?? ""} />
        </div>

      </div>
    </div>
  );
};

export default SingleProductPage;
