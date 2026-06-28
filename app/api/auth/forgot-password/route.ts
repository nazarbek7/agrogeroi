import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email обязателен" }, { status: 400 });

    const user = await prisma.user.findFirst({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user || !user.password) {
      return NextResponse.json({ ok: true });
    }

    // Delete old tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({ data: { email, token, expiresAt } });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Agrogeroi" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Сброс пароля — Agrogeroi",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">Сброс пароля</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Мы получили запрос на сброс пароля для вашего аккаунта <strong>${email}</strong>.
            Ссылка действительна 1 час.
          </p>
          <a href="${resetUrl}" style="display:inline-block; background:#3d6b35; color:#fff; font-weight:600; padding:14px 28px; border-radius:12px; text-decoration:none; font-size:15px;">
            Сбросить пароль
          </a>
          <p style="color: #999; font-size: 13px; margin-top: 24px;">
            Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
