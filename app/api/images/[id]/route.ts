import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// GET /api/images/:productId — get images for a product
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const images = await prisma.image.findMany({ where: { productID: id } });
    return NextResponse.json(images);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
