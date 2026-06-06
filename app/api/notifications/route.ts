import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const body = await req.json();
  const { userId, title, message, type, priority = "NORMAL", metadata } = body;

  if (!userId || !title || !message || !type) {
    return NextResponse.json({ error: "Не все поля заполнены" }, { status: 400 });
  }

  const validTypes = ["ORDER_UPDATE", "PAYMENT_STATUS", "PROMOTION", "SYSTEM_ALERT"];
  const validPriorities = ["LOW", "NORMAL", "HIGH", "URGENT"];

  if (!validTypes.includes(type) || !validPriorities.includes(priority)) {
    return NextResponse.json({ error: "Неверный тип или приоритет" }, { status: 400 });
  }

  const notification = await prisma.notification.create({
    data: { userId, title, message, type, priority, metadata },
  });

  return NextResponse.json(notification, { status: 201 });
}
