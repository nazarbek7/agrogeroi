import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/notifications/:userId — список уведомлений пользователя
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id: userId } = await params;
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type") || undefined;
  const isReadParam = searchParams.get("isRead");
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const sortBy = (searchParams.get("sortBy") as "createdAt" | "priority") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const where: any = {
    userId,
    ...(type && { type }),
    ...(isReadParam !== null && { isRead: isReadParam === "true" }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({ where, orderBy: { [sortBy]: sortOrder }, skip, take: limit }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return NextResponse.json({
    notifications,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    unreadCount,
  });
}

// PUT /api/notifications/:id — отметить как прочитанное
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  const { isRead } = await req.json();

  if (typeof isRead !== "boolean") {
    return NextResponse.json({ error: "isRead должен быть boolean" }, { status: 400 });
  }

  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead },
    });
    return NextResponse.json(notification);
  } catch {
    return NextResponse.json({ error: "Уведомление не найдено" }, { status: 404 });
  }
}

// DELETE /api/notifications/:id — удалить уведомление
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const userId = body.userId;

  try {
    const notification = await prisma.notification.findFirst({ where: { id, ...(userId && { userId }) } });
    if (!notification) return NextResponse.json({ error: "Не найдено" }, { status: 404 });

    await prisma.notification.delete({ where: { id } });
    return NextResponse.json({ message: "Удалено" });
  } catch {
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
