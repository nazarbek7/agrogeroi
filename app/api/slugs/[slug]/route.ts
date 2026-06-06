import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/slugs/[slug] error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
