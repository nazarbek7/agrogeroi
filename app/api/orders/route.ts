import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.customer_order.findMany({
      skip,
      take: limit,
      orderBy: { dateTime: "desc" },
    }),
    prisma.customer_order.count(),
  ]);

  return NextResponse.json({
    orders,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, lastname, phone, email, company, adress, apartment, postalCode, status, city, country, orderNotice, total, userId } = body;

  if (!name || !lastname || !phone || !email || !adress || !city || !country || !postalCode) {
    return NextResponse.json({ error: "Не все обязательные поля заполнены" }, { status: 400 });
  }

  // Проверка дубля
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const duplicate = await prisma.customer_order.findFirst({
    where: { email, total, dateTime: { gte: oneMinuteAgo } },
  });
  if (duplicate) {
    return NextResponse.json({ error: "Duplicate order detected" }, { status: 409 });
  }

  const order = await prisma.customer_order.create({
    data: {
      name, lastname, phone, email,
      company: company || "",
      adress, apartment: apartment || "",
      postalCode, status: status || "pending",
      city, country,
      orderNotice: orderNotice || "",
      total: Number(total),
      dateTime: new Date(),
    },
  });

  // Уведомление для зарегистрированного пользователя
  try {
    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!user) {
      user = await prisma.user.findUnique({ where: { email } });
    }
    if (user) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "Заказ подтверждён",
          message: `Ваш заказ #${order.id} подтверждён и будет подготовлен к отправке.`,
          type: "ORDER_UPDATE",
          priority: "HIGH",
          metadata: { orderId: order.id, status: "confirmed" },
        },
      });
    }
  } catch {
    // не прерываем заказ если уведомление не создалось
  }

  return NextResponse.json({ id: order.id, message: "Order created successfully" }, { status: 201 });
}
