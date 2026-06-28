import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

// GET /api/images/:productId — get all extra images for a product
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const images = await prisma.image.findMany({
      where: { productID: id },
      orderBy: { order: "asc" },
    });
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(buffer, "agrogeroi/products/extra");

    // Determine the next order index
    const count = await prisma.image.count({ where: { productID } });

    const image = await prisma.image.create({
      data: { productID, image: url, order: count },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("POST /api/images/[id] error:", error);
    return NextResponse.json({ error: "Ошибка загрузки файла" }, { status: 500 });
  }
}

// DELETE /api/images/:imageId — delete a specific image record
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: imageID } = await params;
  try {
    const image = await prisma.image.findUnique({ where: { imageID } });
    if (!image) {
      return NextResponse.json({ error: "Изображение не найдено" }, { status: 404 });
    }

    await prisma.image.delete({ where: { imageID } });
    await deleteImage(image.image);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/images/[id] error:", error);
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
