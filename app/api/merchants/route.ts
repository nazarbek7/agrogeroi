import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const merchants = await prisma.merchant.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "desc" },
    });

    // Normalize: add .products array with length so the page's merchant.products.length still works
    const result = merchants.map((m) => ({
      ...m,
      products: Array.from({ length: m._count.products }),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/merchants error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, phone, address, description, status } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Название обязательно" }, { status: 400 });
  }

  const merchant = await prisma.merchant.create({
    data: {
      name,
      email: email || null,
      phone: phone || null,
      address: address || null,
      description: description || null,
      status: status || "ACTIVE",
    },
  });

  return NextResponse.json(merchant, { status: 201 });
}
