import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.customer_order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });

  return NextResponse.json(order);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.customer_order.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });

  const updated = await prisma.customer_order.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      lastname: body.lastname ?? existing.lastname,
      phone: body.phone ?? existing.phone,
      email: body.email ?? existing.email,
      company: body.company ?? existing.company,
      adress: body.adress ?? existing.adress,
      apartment: body.apartment ?? existing.apartment,
      postalCode: body.postalCode ?? existing.postalCode,
      status: body.status ?? existing.status,
      city: body.city ?? existing.city,
      country: body.country ?? existing.country,
      orderNotice: body.orderNotice ?? existing.orderNotice,
      total: body.total !== undefined ? Number(body.total) : existing.total,
    },
  });

  // Уведомление при смене статуса
  if (body.status && body.status !== existing.status) {
    try {
      const user = await prisma.user.findUnique({ where: { email: updated.email } });
      if (user) {
        const statusTitles: Record<string, string> = {
          processing: "Заказ обрабатывается",
          delivered: "Заказ доставлен",
          canceled: "Заказ отменён",
          shipped: "Заказ отправлен",
          confirmed: "Заказ подтверждён",
        };
        const statusMessages: Record<string, string> = {
          processing: `Ваш заказ #${id} находится в обработке.`,
          delivered: `Ваш заказ #${id} успешно доставлен. Спасибо за покупку!`,
          canceled: `Ваш заказ #${id} был отменён. По вопросам обращайтесь в поддержку.`,
          shipped: `Ваш заказ #${id} отправлен и уже в пути!`,
          confirmed: `Ваш заказ #${id} подтверждён и будет подготовлен к отправке.`,
        };
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: statusTitles[body.status] ?? "Обновление заказа",
            message: statusMessages[body.status] ?? `Статус заказа #${id} обновлён: ${body.status}`,
            type: "ORDER_UPDATE",
            priority: body.status === "canceled" ? "URGENT" : "HIGH",
            metadata: { orderId: id, status: body.status },
          },
        });
      }
    } catch {
      // не прерываем обновление если уведомление не создалось
    }
  }

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.customer_order.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  }
}
