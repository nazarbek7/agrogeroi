import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("uploadedFile") as File | null;

    if (!file || !file.size) {
      return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(buffer, "agrogeroi/products");

    // Return both `filename` (used by existing code) and `url` pointing to Cloudinary
    return NextResponse.json({ filename: url, url });
  } catch (error) {
    console.error("POST /api/main-image error:", error);
    return NextResponse.json({ error: "Ошибка загрузки файла" }, { status: 500 });
  }
}
