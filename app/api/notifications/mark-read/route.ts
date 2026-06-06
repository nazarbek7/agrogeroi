import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { notificationIds, userId } = await req.json();

  if (!Array.isArray(notificationIds) || notificationIds.length === 0 || !userId) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  }

  const result = await prisma.notification.updateMany({
    where: { id: { in: notificationIds }, userId },
    data: { isRead: true },
  });

  return NextResponse.json({ updatedCount: result.count });
}
