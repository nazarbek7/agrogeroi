import React from "react";
import ProductItem from "./ProductItem";
import prisma from "@/utils/db";
import { buildProductQuery, type ShopSearchParams } from "@/lib/productFilters";
import { productWord } from "@/lib/utils";

const NotFound = () => (
  <h3 className="col-span-full mt-5 w-full text-center text-3xl max-[1000px]:text-2xl max-[500px]:text-lg">
    Товары не найдены
  </h3>
);

const Products = async ({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams: ShopSearchParams;
}) => {
  const page = searchParams?.page ? Number(searchParams?.page) : 1;
  const sort = (searchParams?.sort as string) || "";

  const sortMap: Record<string, object> = {
    titleAsc: { title: "asc" },
    titleDesc: { title: "desc" },
    lowPrice: { price: "asc" },
    highPrice: { price: "desc" },
  };
  const orderBy = sortMap[sort] || { createdAt: "desc" };

  const { where, categoryFound } = await buildProductQuery(params?.slug, searchParams);
  if (!categoryFound) return <NotFound />;

  let products: any[] = [];
  let total = 0;
  try {
    // same `where` for both, otherwise the counter contradicts the grid
    [products, total] = await Promise.all([
      prisma.product.findMany({ skip: (page - 1) * 12, take: 12, where, orderBy }),
      prisma.product.count({ where }),
    ]);
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  if (products.length === 0) return <NotFound />;

  return (
    <>
      <p className="text-sm text-gray-500">
        Найдено {total} {productWord(total)}
      </p>
      <div className="grid grid-cols-3 items-stretch gap-5 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
        {products.map((product: any) => (
          <ProductItem key={product.id} product={product} color="black" />
        ))}
      </div>
    </>
  );
};

export default Products;
