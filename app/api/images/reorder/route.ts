import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

// PATCH /api/images/reorder — save new image order
// Body: { imageIds: string[] }  (ordered array of imageIDs)
export async function PATCH(req: NextRequest) {
  try {
    const { imageIds } = await req.json();
    if (!Array.isArray(imageIds)) {
      return NextResponse.json({ error: "imageIds must be an array" }, { status: 400 });
    }

    await Promise.all(
      imageIds.map((id: string, index: number) =>
        prisma.image.update({ where: { imageID: id }, data: { order: index } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Ошибка" }, { status: 500 });
  }
}
