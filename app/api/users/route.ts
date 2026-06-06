import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, name: true, image: true },
      orderBy: { email: "asc" },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Пользователь с таким email уже существует" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, role: role || "user" },
      select: { id: true, email: true, role: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Ошибка создания" }, { status: 500 });
  }
}
