import prisma from "@/utils/db";
import ProductItem from "@/components/ProductItem";
import Link from "next/link";

export const metadata = { title: "Акции и скидки — Агрогерои" };

export default async function SalePage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isOnSale: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    products = [];
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand py-12">
        <h1 className="text-center text-4xl font-bold text-white">Акции и скидки</h1>
        <p className="text-center text-green-200 mt-2">Специальные предложения от нашего питомника</p>
      </div>

      <div className="max-w-screen-2xl mx-auto px-10 max-sm:px-5 py-12">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🏷️</p>
            <p className="text-xl text-gray-500 mb-6">Сейчас акций нет — следите за обновлениями!</p>
            <Link href="/shop" className="inline-block bg-brand text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition">
              Смотреть все товары →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-8">{products.length} {products.length === 1 ? "товар" : "товаров"} по акции</p>
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
