import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(req: NextRequest) {
  try {
    const mode = req.nextUrl.searchParams.get("mode") || "";

    if (mode === "admin") {
      const products = await prisma.product.findMany({
        orderBy: { title: "asc" },
      });
      return NextResponse.json(products);
    }

    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
    const sort = req.nextUrl.searchParams.get("sort") || "defaultSort";

    // Accept both ?category=X and ?filters[category][$equals]=X
    const categorySlug =
      req.nextUrl.searchParams.get("filters[category][$equals]") ||
      req.nextUrl.searchParams.get("category") ||
      "";

    const sortMap: Record<string, object> = {
      titleAsc:  { title: "asc" },
      titleDesc: { title: "desc" },
      lowPrice:  { price: "asc" },
      highPrice: { price: "desc" },
    };
    const orderBy = sortMap[sort] || { title: "asc" };

    const where: any = {};

    if (categorySlug && categorySlug !== "undefined") {
      // Look up category by name (case-insensitive)
      const category = await prisma.category.findFirst({
        where: { name: { equals: categorySlug, mode: "insensitive" } },
      });
      if (category) {
        where.categoryId = category.id;
      }
    }

    const products = await prisma.product.findMany({
      skip: (page - 1) * 12,
      take: 12,
      where,
      orderBy,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { merchantId, slug, title, mainImage, price, description, manufacturer, categoryId, inStock, characteristics } = body;

    if (!title || !slug || !price || !categoryId || !merchantId) {
      return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        merchantId,
        slug,
        title,
        mainImage: mainImage || "",
        price: Number(price),
        rating: 5,
        description: description || "",
        manufacturer: manufacturer || "",
        categoryId,
        inStock: Number(inStock ?? 1),
        characteristics: characteristics || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Товар с таким slug уже существует" }, { status: 409 });
    }
    return NextResponse.json({ error: "Ошибка создания товара" }, { status: 500 });
  }
}
