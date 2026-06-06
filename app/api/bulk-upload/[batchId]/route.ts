import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// GET /api/bulk-upload/:batchId
export async function GET(_req: NextRequest, { params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;
  try {
    const batch = await prisma.bulk_upload_batch.findUnique({ where: { id: batchId } });
    if (!batch) return NextResponse.json({ error: "Партия не найдена" }, { status: 404 });

    const items = await prisma.bulk_upload_item.findMany({
      where: { batchId },
      include: { product: true },
    });

    return NextResponse.json({ batch, items });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// DELETE /api/bulk-upload/:batchId?deleteProducts=true
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;
  const deleteProducts = req.nextUrl.searchParams.get("deleteProducts") === "true";

  try {
    const batch = await prisma.bulk_upload_batch.findUnique({ where: { id: batchId } });
    if (!batch) return NextResponse.json({ error: "Партия не найдена" }, { status: 404 });

    if (deleteProducts) {
      const items = await prisma.bulk_upload_item.findMany({
        where: { batchId, productId: { not: null } },
        select: { productId: true },
      });
      const productIds = items.map((i) => i.productId).filter(Boolean) as string[];

      if (productIds.length > 0) {
        const referenced = await prisma.customer_order_product.findMany({
          where: { productId: { in: productIds } },
          select: { productId: true },
        });
        if (referenced.length > 0) {
          return NextResponse.json({ error: "Нельзя удалить товары — они используются в заказах" }, { status: 409 });
        }
      }

      await prisma.$transaction(async (tx) => {
        if (productIds.length > 0) {
          await tx.product.deleteMany({ where: { id: { in: productIds } } });
        }
        await tx.bulk_upload_item.deleteMany({ where: { batchId } });
        await tx.bulk_upload_batch.delete({ where: { id: batchId } });
      });

      return NextResponse.json({ success: true, message: "Партия и товары удалены", deletedProducts: true });
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.bulk_upload_item.deleteMany({ where: { batchId } });
        await tx.bulk_upload_batch.delete({ where: { id: batchId } });
      });

      return NextResponse.json({ success: true, message: "Партия удалена (товары сохранены)", deletedProducts: false });
    }
  } catch (error: any) {
    console.error("Delete batch error:", error);
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
