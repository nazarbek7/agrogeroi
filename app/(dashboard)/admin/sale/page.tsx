"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTag, FaXmark } from "react-icons/fa6";

export default function AdminSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get("/api/products?mode=admin");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch { toast.error("Ошибка загрузки"); }
    finally { setLoading(false); }
  };

  const toggleSale = async (product: Product) => {
    try {
      const res = await apiClient.put(`/api/products/${product.id}`, {
        isOnSale: !product.isOnSale,
        discountPercent: product.isOnSale ? 0 : product.discountPercent,
      });
      if (res.ok) { toast.success(product.isOnSale ? "Снято с акции" : "Добавлено в акцию"); fetchProducts(); }
    } catch { toast.error("Ошибка"); }
  };

  const setDiscount = async (product: Product, percent: number) => {
    try {
      await apiClient.put(`/api/products/${product.id}`, { discountPercent: percent });
      toast.success("Скидка обновлена");
      fetchProducts();
    } catch { toast.error("Ошибка"); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const saleProducts = products.filter((p) => p.isOnSale);
  const regularProducts = products.filter((p) => !p.isOnSale);

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Акции и скидки</h1>
            <p className="text-sm text-gray-500 mt-0.5">На акции: {saleProducts.length} товаров</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* На акции */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FaTag className="text-orange-500 text-sm" />
                <h2 className="font-bold text-gray-900">На акции ({saleProducts.length})</h2>
              </div>
              {saleProducts.length === 0 ? (
                <p className="text-sm text-gray-400 px-6 py-8">Нет товаров на акции. Добавьте ниже.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {saleProducts.map((p) => (
                    <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{p.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.price.toLocaleString()} сом</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">Скидка</span>
                        <input
                          type="number" min={0} max={100}
                          defaultValue={p.discountPercent}
                          onBlur={(e) => setDiscount(p, Number(e.target.value))}
                          className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-center text-sm focus:outline-none focus:border-brand"
                        />
                        <span className="text-xs text-gray-500">%</span>
                        <Link href={`/admin/products/${p.id}`} className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition">
                          Изменить
                        </Link>
                        <button onClick={() => toggleSale(p)} className="inline-flex items-center gap-1 text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
                          <FaXmark className="text-[10px]" /> Убрать
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Добавить в акцию */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Все товары — добавить в акцию</h2>
              </div>
              {regularProducts.length === 0 ? (
                <p className="text-sm text-gray-400 px-6 py-8">Все товары уже на акции.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {regularProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{p.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.price.toLocaleString()} сом</p>
                      </div>
                      <button onClick={() => toggleSale(p)} className="text-xs font-semibold bg-orange-500 text-white px-4 py-1.5 rounded-lg hover:bg-orange-600 transition flex-shrink-0">
                        + В акцию
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
