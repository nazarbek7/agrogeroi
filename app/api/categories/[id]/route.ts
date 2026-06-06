import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return NextResponse.json({ error: "Категория не найдена" }, { status: 404 });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Название обязательно" }, { status: 400 });
    const updated = await prisma.category.update({ where: { id }, data: { name } });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.category.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Ошибка удаления" }, { status: 500 });
  }
}
