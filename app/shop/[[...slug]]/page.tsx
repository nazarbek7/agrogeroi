export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Breadcrumb, Filters, Pagination, SortBy } from "@/components";
import Products from "@/components/Products";
import React from "react";
import { sanitize } from "@/lib/sanitize";
import { getPriceCeiling } from "@/lib/productFilters";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const awaitedParams = await params;
  const raw = awaitedParams?.slug?.[0];
  const category = raw
    ? sanitize(raw.includes("-") ? raw.split("-").join(" ") : decodeURIComponent(raw))
    : null;

  const title = category
    ? `${category} — Каталог Agrogeroi`
    : "Каталог растений — Agrogeroi";
  const description = category
    ? `Купить ${category.toLowerCase()} в питомнике Agrogeroi. Широкий выбор, доставка по Кыргызстану.`
    : "Гортензии, хвойные, розы, плодовые деревья, кустарники и многолетние цветы. Питомник растений Agrogeroi.";

  return { title, description };
}

const improveCategoryText = (text: string): string =>
  text.includes("-") ? text.split("-").join(" ") : text;

const ShopPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;

  const categoryTitle =
    awaitedParams?.slug && awaitedParams?.slug[0]?.length > 0
      ? sanitize(improveCategoryText(decodeURIComponent(awaitedParams.slug[0])))
      : "Все товары";

  const priceCeiling = await getPriceCeiling();

  return (
    <div className="bg-[#f7faf4] min-h-screen text-black">
      <div className="max-w-screen-2xl mx-auto px-16 max-[1320px]:px-10 max-md:px-5 py-6">
        <Breadcrumb />

        <div className="mt-6 grid grid-cols-[240px_1fr] gap-8 max-md:grid-cols-1 max-md:gap-4">
          {/* Sidebar — a single instance: two mounted copies both wrote the URL
              from their own state, so changing the sorting reset the filters */}
          <div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:sticky md:top-6 max-md:p-4">
              <Filters maxPrice={priceCeiling} />
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h1 className="text-2xl font-extrabold text-gray-900 uppercase tracking-wide">
                {categoryTitle}
              </h1>
              <SortBy />
            </div>

            <Products params={awaitedParams} searchParams={awaitedSearchParams} />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
