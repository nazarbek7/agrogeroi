"use client";
import DashboardSidebar from "@/components/DashboardSidebar";
import apiClient from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowRight, FaPlus } from "react-icons/fa6";

interface Merchant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  products: any[];
}

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/merchants")
      .then((r) => r.json())
      .then((data) => setMerchants(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Не удалось загрузить продавцов"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Продавцы</h1>
            <p className="text-sm text-gray-500 mt-0.5">{merchants.length} продавцов</p>
          </div>
          <Link
            href="/admin/merchant/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-all"
          >
            <FaPlus className="text-xs" /> Добавить продавца
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          ) : merchants.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">Продавцов пока нет</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Название</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Статус</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Товары</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {merchants.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">{m.name}</td>
                    <td className="px-5 py-4 text-gray-500">{m.email ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${m.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {m.status === "ACTIVE" ? "Активен" : "Неактивен"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-medium">{m.products.length}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/merchant/${m.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
                      >
                        Изменить <FaArrowRight className="text-[10px]" />
                      </Link>
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
