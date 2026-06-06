import prisma from "@/utils/db";
import ProductItem from "@/components/ProductItem";

export const metadata = { title: "Новинки — Агрогерои" };

export default async function NewProductsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 24,
    });
  } catch {
    products = [];
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand py-12">
        <h1 className="text-center text-4xl font-bold text-white">Новинки</h1>
        <p className="text-center text-green-200 mt-2">Последние поступления в наш питомник</p>
      </div>

      <div className="max-w-screen-2xl mx-auto px-10 max-sm:px-5 py-12">
        {products.length === 0 ? (
          <p className="text-center text-gray-400 py-20 text-xl">Товары пока не добавлены.</p>
        ) : (
          <>
            <p className="text-gray-500 mb-8">Показаны последние {products.length} поступлений</p>
            <div className="grid grid-cols-4 gap-5 items-stretch max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
              {products.map((p) => (
                <ProductItem key={p.id} product={p} color="black" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
