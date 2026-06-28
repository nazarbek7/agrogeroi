import React from "react";
import ProductItem from "./ProductItem";
import prisma from "@/utils/db";

const Products = async ({ params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  // when no filter params present (first nav click), show everything
  const hasParams = Object.keys(searchParams ?? {}).length > 0;
  const inStockChecked = hasParams ? searchParams?.inStock === "true" : true;
  const outOfStockChecked = hasParams ? searchParams?.outOfStock === "true" : true;
  const page = searchParams?.page ? Number(searchParams?.page) : 1;
  const maxPrice = Number(searchParams?.price) || 0;
  const minRating = Number(searchParams?.rating) || 0;
  const sort = (searchParams?.sort as string) || "";
  const isBestsellerFilter = searchParams?.isBestseller === "true";
  const isNewFilter = searchParams?.isNew === "true";
  const categorySlug = params?.slug?.[0] ? decodeURIComponent(params.slug[0]) : "";

  const sortMap: Record<string, object> = {
    titleAsc:  { title: "asc" },
    titleDesc: { title: "desc" },
    lowPrice:  { price: "asc" },
    highPrice: { price: "desc" },
  };
  const orderBy = sortMap[sort] || { createdAt: "desc" };

  const where: any = {};

  if (inStockChecked && outOfStockChecked) {
    // show all
  } else if (inStockChecked) {
    where.inStock = { gt: 0 };
  } else if (outOfStockChecked) {
    where.inStock = { lte: 0 };
  } else {
    where.inStock = { gt: 0 };
  }

  if (maxPrice > 0) {
    where.price = { lte: maxPrice };
  }

  if (minRating > 0) {
    where.rating = { gte: minRating };
  }

  if (isBestsellerFilter) where.isBestseller = true;
  if (isNewFilter) where.isNew = true;

  if (categorySlug && categorySlug !== "undefined") {
    const category = await prisma.category.findFirst({
      where: { name: { equals: categorySlug, mode: "insensitive" } },
    });
    if (category) {
      where.categoryId = category.id;
    } else {
      return (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          Товары не найдены
        </h3>
      );
    }
  }

  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      skip: (page - 1) * 12,
      take: 12,
      where,
      orderBy,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="grid grid-cols-3 items-stretch gap-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
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
  );
};

export default Products;
