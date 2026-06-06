import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const userId = (session.user as any).id;
    const merchant = await prisma.merchant.findUnique({ where: { userId } });
    if (!merchant) return NextResponse.json({ error: "Продавец не найден" }, { status: 404 });

    const productCount = await prisma.product.count({ where: { merchantId: merchant.id } });

    // Count orders that contain this merchant's products
    const productIds = await prisma.product.findMany({
      where: { merchantId: merchant.id },
      select: { id: true },
    });
    const ids = productIds.map(p => p.id);
    const orderCount = await prisma.customer_order_product.groupBy({
      by: ["customerOrderId"],
      where: { productId: { in: ids } },
    }).then(r => r.length);

    return NextResponse.json({
      merchantName: merchant.name,
      products: productCount,
      orders: orderCount,
    });
  } catch (error) {
    console.error("merchant-portal/stats error:", error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
