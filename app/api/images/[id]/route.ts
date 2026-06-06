import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

// GET /api/images/:productId — get all extra images for a product
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const images = await prisma.image.findMany({ where: { productID: id } });
    return NextResponse.json(images);
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// POST /api/images/:productId — upload and save an extra image for a product
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: productID } = await params;
  try {
    const formData = await req.formData();
    const file = formData.get("uploadedFile") as File | null;

    if (!file || !file.size) {
      return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${nanoid()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(path.join(process.cwd(), "public", filename), buffer);

    const image = await prisma.image.create({
      data: { productID, image: filename },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("POST /api/images/[id] error:", error);
    return NextResponse.json({ error: "Ошибка загрузки файла" }, { status: 500 });
  }
}

// DELETE /api/images/:imageId — delete a specific image record (and file)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: imageID } = await params;
  try {
    const image = await prisma.image.findUnique({ where: { imageID } });
    if (!image) {
      return NextResponse.json({ error: "Изображение не найдено" }, { status: 404 });
    }

    await prisma.image.delete({ where: { imageID } });

    // Best-effort file deletion
    try {
      const { unlink } = await import("fs/promises");
      await unlink(path.join(process.cwd(), "public", image.image));
    } catch {}

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/images/[id] error:", error);
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
