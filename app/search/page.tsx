import { ProductItem, SectionTitle } from "@/components";
import prisma from "@/utils/db";
import React from "react";
import { sanitize } from "@/lib/sanitize";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Поиск — Agrogeroi" };

interface Props {
  searchParams: Promise<{ search: string }>;
}

const SearchPage = async ({ searchParams }: Props) => {
  const sp = await searchParams;
  const query = sp?.search?.trim() || "";

  let products: any[] = [];

  if (query) {
    try {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { manufacturer: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 24,
        orderBy: { title: "asc" },
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  return (
    <div>
      <SectionTitle title="Поиск товаров" path="Главная | Поиск" />
      <div className="max-w-screen-2xl mx-auto">
        {sp?.search && (
          <h3 className="text-4xl text-center py-10 max-sm:text-3xl">
            Результаты поиска: {sanitize(decodeURIComponent(sp?.search))}
          </h3>
        )}
        <div className="px-10 max-sm:px-5 pb-10 grid grid-cols-4 items-stretch gap-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductItem key={product.id} product={product} color="black" />
            ))
          ) : (
            <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
              Товары не найдены
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
