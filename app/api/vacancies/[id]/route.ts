import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const vacancy = await prisma.vacancy.findUnique({ where: { id } });
    if (!vacancy) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    return NextResponse.json(vacancy);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const vacancy = await prisma.vacancy.update({
      where: { id },
      data: {
        title:        body.title        ?? undefined,
        type:         body.type         ?? undefined,
        description:  body.description  ?? undefined,
        requirements: body.requirements ?? undefined,
        isActive:     body.isActive     ?? undefined,
      },
    });
    return NextResponse.json(vacancy);
  } catch {
    return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.vacancy.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
