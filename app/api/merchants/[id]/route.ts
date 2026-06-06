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
  const merchant = await prisma.merchant.findUnique({
    where: { id },
    include: { products: true },
  });

  if (!merchant) {
    return NextResponse.json({ error: "Продавец не найден" }, { status: 404 });
  }

  return NextResponse.json(merchant);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, email, phone, address, description, status } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Название обязательно" }, { status: 400 });
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
    },
    include: { products: true },
  });

  return NextResponse.json(merchant);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.merchant.delete({ where: { id } });

  return NextResponse.json({ message: "Продавец удалён" });
}
