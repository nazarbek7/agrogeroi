import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { parse } from "csv-parse/sync";

function validateRow(row: Record<string, string>) {
  const errs: string[] = [];
  const clean: Record<string, any> = {};

  const title = String(row.title ?? "").trim();
  const slug = String(row.slug ?? "").trim();
  const price = Number(row.price);
  const categoryId = String(row.categoryId ?? "").trim();
  const inStock = Number(row.inStock ?? 0);

  if (!title) errs.push("title обязателен");
  if (!slug) errs.push("slug обязателен");
  if (!Number.isFinite(price) || price < 0) errs.push("price должен быть числом >= 0");
  if (!categoryId) errs.push("categoryId обязателен");
  if (!Number.isFinite(inStock) || inStock < 0) errs.push("inStock должен быть числом >= 0");

  if (errs.length) return { ok: false as const, error: errs.join(", ") };

  clean.title = title;
  clean.slug = slug;
  clean.price = Math.round(price * 100) / 100;
  clean.categoryId = categoryId;
  clean.inStock = Math.floor(inStock);
  clean.manufacturer = row.manufacturer ? String(row.manufacturer).trim() : null;
  clean.description = row.description ? String(row.description).trim() : null;
  clean.mainImage = row.mainImage ? String(row.mainImage).trim() : null;

  return { ok: true as const, data: clean };
}

// GET /api/bulk-upload — list batches
export async function GET() {
  try {
    const batches = await prisma.bulk_upload_batch.findMany({
      orderBy: { createdAt: "desc" },
    });

    const batchesWithDetails = await Promise.all(
      batches.map(async (batch) => {
        const items = await prisma.bulk_upload_item.findMany({ where: { batchId: batch.id } });
        const successfulRecords = items.filter((i) => i.status === "CREATED" && i.productId !== null).length;
        const failedRecords = items.filter((i) => i.status === "ERROR" || i.error !== null).length;
        const errors = items.filter((i) => i.error).map((i) => i.error as string);
        return {
          id: batch.id,
          fileName: batch.fileName || `batch-${batch.id.substring(0, 8)}.csv`,
          totalRecords: items.length,
          successfulRecords,
          failedRecords,
          status: batch.status,
          uploadedBy: "Admin",
          uploadedAt: batch.createdAt,
          errors: errors.length > 0 ? errors : undefined,
        };
      })
    );

    return NextResponse.json({ batches: batchesWithDetails });
  } catch (error) {
    console.error("Error listing batches:", error);
    return NextResponse.json({ error: "Ошибка загрузки истории" }, { status: 500 });
  }
}

// POST /api/bulk-upload — upload CSV file
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "CSV файл не найден (поле: file)" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const text = Buffer.from(buffer).toString("utf-8");

    let rows: Record<string, string>[];
    try {
      rows = parse(text, { columns: true, skip_empty_lines: true, trim: true });
    } catch {
      return NextResponse.json({ error: "Неверный формат CSV файла" }, { status: 400 });
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "CSV файл не содержит строк данных" }, { status: 400 });
    }

    const valid: any[] = [];
    const parseErrors: { index: number; error: string }[] = [];
    for (let i = 0; i < rows.length; i++) {
      const result = validateRow(rows[i]);
      if (result.ok) valid.push(result.data);
      else parseErrors.push({ index: i + 1, error: result.error });
    }

    // Resolve categories
    const uniqueCategoryIds = [...new Set(valid.map((r) => r.categoryId))];
    const categories = await prisma.category.findMany({
      where: { OR: [{ id: { in: uniqueCategoryIds } }, { name: { in: uniqueCategoryIds } }] },
      select: { id: true, name: true },
    });
    const categoryMap = new Map<string, string>();
    categories.forEach((cat) => {
      categoryMap.set(cat.id, cat.id);
      categoryMap.set(cat.name.toLowerCase(), cat.id);
    });

    const outcome = await prisma.$transaction(async (tx) => {
      const batch = await tx.bulk_upload_batch.create({
        data: { fileName: file.name, status: "PENDING", itemCount: rows.length, errorCount: parseErrors.length },
      });

      let success = 0;
      let failed = 0;

      for (const row of valid) {
        const resolvedCategoryId = categoryMap.get(row.categoryId) || categoryMap.get(row.categoryId.toLowerCase());

        if (!resolvedCategoryId) {
          await tx.bulk_upload_item.create({
            data: { batchId: batch.id, title: row.title, slug: row.slug, price: row.price, manufacturer: row.manufacturer, description: row.description, mainImage: row.mainImage, categoryId: row.categoryId, inStock: row.inStock, status: "ERROR", error: `Категория не найдена: ${row.categoryId}` },
          });
          failed++;
          continue;
        }

        try {
          const product = await tx.product.create({
            data: { title: row.title, slug: row.slug, price: row.price, rating: 5, description: row.description ?? "", manufacturer: row.manufacturer ?? "", mainImage: row.mainImage ?? "", categoryId: resolvedCategoryId, inStock: row.inStock },
          });
          await tx.bulk_upload_item.create({
            data: { batchId: batch.id, productId: product.id, title: row.title, slug: row.slug, price: row.price, manufacturer: row.manufacturer, description: row.description, mainImage: row.mainImage, categoryId: resolvedCategoryId, inStock: row.inStock, status: "CREATED", error: null },
          });
          success++;
        } catch (e: any) {
          await tx.bulk_upload_item.create({
            data: { batchId: batch.id, title: row.title, slug: row.slug, price: row.price, manufacturer: row.manufacturer, description: row.description, mainImage: row.mainImage, categoryId: resolvedCategoryId || row.categoryId, inStock: row.inStock, status: "ERROR", error: e?.message || "Ошибка создания" },
          });
          failed++;
        }
      }

      for (const err of parseErrors) {
        await tx.bulk_upload_item.create({
          data: { batchId: batch.id, title: "", slug: "", price: 0, manufacturer: null, description: null, mainImage: null, categoryId: "", inStock: 0, status: "ERROR", error: `Строка ${err.index}: ${err.error}` },
        });
        failed++;
      }

      const finalStatus = success > 0 && failed === 0 ? "COMPLETED" : success > 0 && failed > 0 ? "PARTIAL" : success === 0 && failed > 0 ? "FAILED" : "PENDING";

      const updatedBatch = await tx.bulk_upload_batch.update({
        where: { id: batch.id },
        data: { status: finalStatus, itemCount: success + failed, errorCount: failed },
      });

      return { batch: updatedBatch, success, failed };
    });

    return NextResponse.json({
      message: `Загружено: ${outcome.success} товаров, ошибок: ${outcome.failed}`,
      details: { processed: outcome.success + outcome.failed, successful: outcome.success, failed: outcome.failed },
      batchId: outcome.batch.id,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Bulk upload error:", error);
    return NextResponse.json({ error: "Ошибка сервера при загрузке" }, { status: 500 });
  }
}
