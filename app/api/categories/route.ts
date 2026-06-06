import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Название обязательно" }, { status: 400 });

    const category = await prisma.category.create({ data: { name } });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Ошибка создания" }, { status: 500 });
  }
}
