import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password || password.length < 8) {
      return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
    }

    const record = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ error: "Ссылка недействительна или истекла" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.updateMany({ where: { email: record.email }, data: { password: hashed } });
    await prisma.passwordResetToken.delete({ where: { token } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
