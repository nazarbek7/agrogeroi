import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// POST /api/products/:id/swap-main — atomically swap mainImage with an extra image
// Body: { extraImageId: string }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { extraImageId } = await req.json();

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Товар не найден" }, { status: 404 });

    const extraImage = await prisma.image.findUnique({ where: { imageID: extraImageId } });
    if (!extraImage) return NextResponse.json({ error: "Изображение не найдено" }, { status: 404 });

    const oldMainImage = product.mainImage;
    const newMainImage = extraImage.image;

    await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { id }, data: { mainImage: newMainImage } });
      await tx.image.delete({ where: { imageID: extraImageId } });
      if (oldMainImage) {
        await tx.image.create({ data: { productID: id, image: oldMainImage } });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Ошибка" }, { status: 500 });
  }
}
