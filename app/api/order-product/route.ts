import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// POST /api/order-product — add a single product to an order (public, called from checkout)
export async function POST(req: NextRequest) {
  try {
    const { customerOrderId, productId, quantity } = await req.json();

    if (!customerOrderId || !productId || !quantity) {
      return NextResponse.json({ error: "Не все поля заполнены" }, { status: 400 });
    }

    const item = await prisma.customer_order_product.create({
      data: {
        customerOrderId,
        productId,
        quantity: Number(quantity),
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/order-product error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
