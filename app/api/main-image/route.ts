import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
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

    return NextResponse.json({ filename });
  } catch (error) {
    console.error("POST /api/main-image error:", error);
    return NextResponse.json({ error: "Ошибка загрузки файла" }, { status: 500 });
  }
}
