"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get("/api/products?mode=admin");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const toggleSale = async (product: Product) => {
    try {
      const res = await apiClient.put(`/api/products/${product.id}`, {
        isOnSale: !product.isOnSale,
        discountPercent: product.isOnSale ? 0 : product.discountPercent,
      });
      if (res.ok) {
        toast.success(product.isOnSale ? "Снято с акции" : "Добавлено в акцию");
        fetchProducts();
      }
    } catch {
      toast.error("Ошибка");
    }
  };

  const setDiscount = async (product: Product, percent: number) => {
    try {
      await apiClient.put(`/api/products/${product.id}`, { discountPercent: percent });
      toast.success("Скидка обновлена");
      fetchProducts();
    } catch {
      toast.error("Ошибка");
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const saleProducts = products.filter(p => p.isOnSale);
  const regularProducts = products.filter(p => !p.isOnSale);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 xl:ml-5 w-full max-xl:px-5 pt-6 pr-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Акции и скидки</h1>
          <span className="text-sm text-gray-500 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg">
            На акции: <strong>{saleProducts.length}</strong> товаров
          </span>
        </div>

        {/* Товары на акции */}
        <div>
          <h2 className="text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2">
            🏷️ На акции ({saleProducts.length})
          </h2>
          {loading ? (
            <p className="text-gray-400">Загрузка...</p>
          ) : saleProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">Нет товаров на акции. Добавьте ниже.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {saleProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-orange-200 bg-orange-50">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{p.title}</p>
                    <p className="text-sm text-gray-500">{p.price.toLocaleString("ru-RU")} сом</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Скидка:</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      defaultValue={p.discountPercent}
                      onBlur={(e) => setDiscount(p, Number(e.target.value))}
                      className="border border-gray-300 rounded px-2 py-1 w-16 text-center text-sm"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                  <button
                    onClick={() => toggleSale(p)}
                    className="px-3 py-1.5 text-sm border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition"
                  >
                    Убрать
                  </button>
                  <Link href={`/admin/products/${p.id}`} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    Изменить
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Остальные товары */}
        <div>
          <h2 className="text-lg font-semibold text-gray-600 mb-3">
            Все товары — добавить в акцию
          </h2>
          {regularProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">Все товары уже на акции.</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
              {regularProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{p.title}</p>
                    <p className="text-sm text-gray-500">{p.price.toLocaleString("ru-RU")} сом</p>
                  </div>
                  <button
                    onClick={() => toggleSale(p)}
                    className="px-4 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    + В акцию
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
