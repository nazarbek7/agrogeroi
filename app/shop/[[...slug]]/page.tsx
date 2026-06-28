export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Breadcrumb, Filters, Pagination, SortBy } from "@/components";
import Products from "@/components/Products";
import React from "react";
import { sanitize } from "@/lib/sanitize";

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

  return (
    <div className="bg-[#f7faf4] min-h-screen text-black">
      <div className="max-w-screen-2xl mx-auto px-16 max-[1320px]:px-10 max-md:px-5 py-6">
        <Breadcrumb />

        <div className="mt-6 grid grid-cols-[220px_1fr] gap-8 max-md:grid-cols-1">
          {/* Sidebar */}
          <div className="max-md:hidden">
            <div className="sticky top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <Filters />
            </div>
          </div>

          {/* Mobile filters row */}
          <div className="hidden max-md:block">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <Filters />
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
