import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id: customerOrderId } = await params;

  const items = await prisma.customer_order_product.findMany({
    where: { customerOrderId },
    include: { product: true },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id: customerOrderId } = await params;
  const body = await req.json();

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Ожидается массив товаров" }, { status: 400 });
  }

  const created = await prisma.customer_order_product.createMany({
    data: body.map((item: any) => ({
      customerOrderId,
      productId: item.productId,
      quantity: item.quantity,
    })),
  });

  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id: customerOrderId } = await params;

  await prisma.customer_order_product.deleteMany({ where: { customerOrderId } });
  return new NextResponse(null, { status: 204 });
}
