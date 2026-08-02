import prisma from "@/utils/db";

export type ShopSearchParams = { [key: string]: string | string[] | undefined };

/**
 * Single source of truth for the shop `where` clause — the product grid and the
 * result counter must filter identically, otherwise the count lies.
 */
export const buildProductQuery = async (
  slug: string[] | undefined,
  searchParams: ShopSearchParams
) => {
  // no params at all (first nav click) means "show everything"
  const hasParams = Object.keys(searchParams ?? {}).length > 0;
  const inStockChecked = hasParams ? searchParams?.inStock === "true" : true;
  const outOfStockChecked = hasParams ? searchParams?.outOfStock === "true" : true;
  const maxPrice = Number(searchParams?.price) || 0;
  const minRating = Number(searchParams?.rating) || 0;
  const isBestsellerFilter = searchParams?.isBestseller === "true";
  const isNewFilter = searchParams?.isNew === "true";
  const categorySlug = slug?.[0] ? decodeURIComponent(slug[0]) : "";

  const where: any = { isActive: true };

  if (!(inStockChecked && outOfStockChecked)) {
    where.inStock = outOfStockChecked && !inStockChecked ? { lte: 0 } : { gt: 0 };
  }
  if (maxPrice > 0) where.price = { lte: maxPrice };
  if (minRating > 0) where.rating = { gte: minRating };

  if (isBestsellerFilter && isNewFilter) {
    where.OR = [{ isBestseller: true }, { isNew: true }];
  } else if (isBestsellerFilter) {
    where.isBestseller = true;
  } else if (isNewFilter) {
    where.isNew = true;
  }

  if (categorySlug && categorySlug !== "undefined") {
    const category = await prisma.category.findFirst({
      where: { name: { equals: categorySlug, mode: "insensitive" } },
    });
    if (!category) return { where, categoryFound: false };
    where.categoryId = category.id;
  }

  return { where, categoryFound: true };
};

/**
 * Upper bound of the price slider, taken from the catalogue instead of a
 * hardcoded number — a hardcoded cap silently hides everything above it.
 * Deliberately global (not per category) so the value stays stable while the
 * user moves between categories and the slider keeps its position.
 */
export const getPriceCeiling = async () => {
  try {
    const priciest = await prisma.product.findFirst({
      where: { isActive: true },
      orderBy: { price: "desc" },
      select: { price: true },
    });
    return Math.max(1000, Math.ceil((priciest?.price ?? 0) / 100) * 100);
  } catch {
    return 3000;
  }
};
