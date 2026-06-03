import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// GET — текущий профиль
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
    select: { id: true, email: true, role: true },
  });

  if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  return NextResponse.json(user);
}

// PUT — обновить профиль
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const body = await req.json();
  const { email, currentPassword, newPassword } = body;

  const user = await prisma.user.findFirst({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });

  const updateData: any = {};

  if (email && email !== user.email) {
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email уже занят" }, { status: 400 });
    updateData.email = email;
  }

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Введите текущий пароль" }, { status: 400 });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password!);
    if (!isMatch) return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 400 });
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Новый пароль минимум 8 символов" }, { status: 400 });
    }
    updateData.password = await bcrypt.hash(newPassword, 12);
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "Нет данных для обновления" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: updateData,
    select: { id: true, email: true, role: true },
  });

  return NextResponse.json(updated);
}

// DELETE — удалить аккаунт
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });

  await prisma.user.delete({ where: { id: user.id } });
  return NextResponse.json({ message: "Аккаунт удалён" });
}
