import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("query") || "";

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    const products = await prisma.product.findMany({
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

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
