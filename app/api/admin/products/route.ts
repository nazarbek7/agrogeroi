import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// PATCH /api/admin/products
// body: { action: "delete" | "deactivate" | "activate", ids: string[] }
export async function PATCH(req: NextRequest) {
  try {
    const { action, ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Нет выбранных товаров" }, { status: 400 });
    }

    if (action === "deactivate") {
      const result = await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { isActive: false },
      });
      return NextResponse.json({ updated: result.count });
    }

    if (action === "activate") {
      const result = await prisma.product.updateMany({
        where: { id: { in: ids } },
        data: { isActive: true },
      });
      return NextResponse.json({ updated: result.count });
    }

    if (action === "delete") {
      const referenced = await prisma.customer_order_product.findMany({
        where: { productId: { in: ids } },
        select: { productId: true },
      });
      const blockedIds = new Set(referenced.map((r) => r.productId));
      const deletableIds = ids.filter((id) => !blockedIds.has(id));

      if (deletableIds.length > 0) {
        await prisma.product.deleteMany({ where: { id: { in: deletableIds } } });
      }

      return NextResponse.json({ deleted: deletableIds.length, skipped: blockedIds.size });
    }

    return NextResponse.json({ error: "Неизвестное действие" }, { status: 400 });
  } catch (error: any) {
    console.error("PATCH /api/admin/products error:", error);
    return NextResponse.json({ error: error.message || "Ошибка сервера" }, { status: 500 });
  }
}
