"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import Link from "next/link";

export default function MerchantPortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [merchantName, setMerchantName] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/"); return; }
    const role = (session?.user as any)?.role;
    if (status === "authenticated" && role === "admin") { router.push("/admin"); return; }
    if (status === "authenticated" && role !== "merchant") { router.push("/"); return; }
  }, [status, session]);

  useEffect(() => {
    if ((session?.user as any)?.role !== "merchant") return;
    apiClient.get("/api/merchant-portal/stats").then(r => r.json()).then(data => {
      setStats({ products: data.products ?? 0, orders: data.orders ?? 0 });
      setMerchantName(data.merchantName ?? "");
    });
    apiClient.get("/api/merchant-portal/products").then(r => r.json()).then(data => {
      setProducts(Array.isArray(data) ? data : []);
    });
  }, [session]);

  if (status === "loading") return <div className="p-20 text-center text-gray-400">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand text-white px-10 py-5 flex items-center justify-between">
        <div>
          <p className="text-green-200 text-sm">Панель продавца</p>
          <h1 className="text-2xl font-bold">{merchantName || "Мой магазин"}</h1>
        </div>
        <Link href="/" className="text-green-200 hover:text-white text-sm">← На сайт</Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-brand/10 text-center">
            <p className="text-4xl font-extrabold text-brand">{stats.products}</p>
            <p className="text-gray-500 mt-1">Товаров</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-brand/10 text-center">
            <p className="text-4xl font-extrabold text-brand">{stats.orders}</p>
            <p className="text-gray-500 mt-1">Заказов</p>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-lg">Мои товары</h2>
            <Link href="/merchant/orders" className="text-brand text-sm hover:underline">
              Заказы →
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="text-center py-12 text-gray-400">Товаров пока нет</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Название</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Цена</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">В наличии</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Статус</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6 font-medium text-gray-800">{p.title}</td>
                    <td className="py-3 px-6 text-brand font-semibold">{p.price.toLocaleString("ru-RU")} сом</td>
                    <td className="py-3 px-6">{p.inStock} шт.</td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.inStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {p.inStock > 0 ? "В наличии" : "Нет"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
