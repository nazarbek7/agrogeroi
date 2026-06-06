import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(req: NextRequest) {
  try {
    const admin = req.nextUrl.searchParams.get("mode") === "admin";
    const vacancies = await prisma.vacancy.findMany({
      where: admin ? {} : { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(vacancies);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, type, description, requirements, isActive } = body;

    if (!title || !type || !description) {
      return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
    }

    const vacancy = await prisma.vacancy.create({
      data: {
        title,
        type,
        description,
        requirements: requirements || [],
        isActive: isActive ?? true,
      },
    });
    return NextResponse.json(vacancy, { status: 201 });
  } catch (error) {
    console.error("POST /api/vacancies error:", error);
    return NextResponse.json({ error: "Ошибка создания вакансии" }, { status: 500 });
  }
}
