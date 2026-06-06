import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const { id } = await params;
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
        user: { select: { id: true, email: true, name: true } },
      },
    });

    if (!merchant) return NextResponse.json({ error: "Продавец не найден" }, { status: 404 });
    return NextResponse.json({ ...merchant, products: Array.from({ length: merchant._count.products }) });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { name, email, phone, address, description, status, userId } = body;

    if (!name?.trim()) return NextResponse.json({ error: "Название обязательно" }, { status: 400 });

    const existing = await prisma.merchant.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Не найден" }, { status: 404 });

    // If userId changed, update user roles
    if (existing.userId && existing.userId !== userId) {
      // Remove merchant role from old user
      await prisma.user.update({ where: { id: existing.userId }, data: { role: "user" } });
    }
    if (userId && userId !== existing.userId) {
      // Grant merchant role to new user
      await prisma.user.update({ where: { id: userId }, data: { role: "merchant" } });
    }

    const merchant = await prisma.merchant.update({
      where: { id },
      data: {
        name,
        email: email || null,
        phone: phone || null,
        address: address || null,
        description: description || null,
        status: status || "ACTIVE",
        userId: userId || null,
      },
    });

    return NextResponse.json(merchant);
  } catch (error) {
    console.error("PUT /api/merchants/:id error:", error);
    return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

    const { id } = await params;
    const merchant = await prisma.merchant.findUnique({ where: { id } });
    if (merchant?.userId) {
      await prisma.user.update({ where: { id: merchant.userId }, data: { role: "user" } });
    }
    await prisma.merchant.delete({ where: { id } });
    return NextResponse.json({ message: "Продавец удалён" });
  } catch (error) {
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
