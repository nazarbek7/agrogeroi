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

    const products = await prisma.product.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
