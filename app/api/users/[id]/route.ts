import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, name: true },
    });
    if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { email, password, role } = await req.json();
    const data: any = {};
    if (email) data.email = email;
    if (role) data.role = role;
    if (password) data.password = await bcrypt.hash(password, 10);

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, role: true },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Ошибка обновления" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.user.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
