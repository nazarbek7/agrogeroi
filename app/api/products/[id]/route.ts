import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Товар не найден" }, { status: 404 });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        merchantId:     body.merchantId     ?? existing.merchantId,
        title:          body.title          ?? existing.title,
        mainImage:      body.mainImage      ?? existing.mainImage,
        slug:           body.slug           ?? existing.slug,
        price:          body.price !== undefined ? Number(body.price) : existing.price,
        rating:         body.rating         ?? existing.rating,
        description:    body.description    ?? existing.description,
        manufacturer:   body.manufacturer   ?? existing.manufacturer,
        categoryId:     body.categoryId     ?? existing.categoryId,
        inStock:         body.inStock !== undefined ? Number(body.inStock) : existing.inStock,
        isOnSale:        body.isOnSale !== undefined ? Boolean(body.isOnSale) : existing.isOnSale,
        discountPercent: body.discountPercent !== undefined ? Number(body.discountPercent) : existing.discountPercent,
        isBestseller:    body.isBestseller !== undefined ? Boolean(body.isBestseller) : existing.isBestseller,
        isNew:           body.isNew !== undefined ? Boolean(body.isNew) : existing.isNew,
        characteristics: body.characteristics !== undefined ? body.characteristics : existing.characteristics,
      },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Ошибка обновления" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const referenced = await prisma.customer_order_product.count({ where: { productId: id } });
    if (referenced > 0) {
      return NextResponse.json({ error: "Нельзя удалить: товар используется в заказах" }, { status: 400 });
    }
    await prisma.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
