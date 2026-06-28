"use client";

import apiClient from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";

const STATUS: Record<string, { text: string; bg: string; text_color: string }> = {
  pending:    { text: "В ожидании",   bg: "bg-amber-100",  text_color: "text-amber-700"  },
  processing: { text: "Обрабатывается", bg: "bg-blue-100",  text_color: "text-blue-700"   },
  confirmed:  { text: "Подтверждён",  bg: "bg-indigo-100", text_color: "text-indigo-700" },
  shipped:    { text: "Отправлен",    bg: "bg-cyan-100",   text_color: "text-cyan-700"   },
  delivered:  { text: "Доставлен",    bg: "bg-green-100",  text_color: "text-green-700"  },
  canceled:   { text: "Отменён",      bg: "bg-red-100",    text_color: "text-red-700"    },
};

const getStatus = (s: string) =>
  STATUS[s] ?? { text: s, bg: "bg-gray-100", text_color: "text-gray-600" };

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data?.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Все заказы</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} заказов всего</p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">Заказов пока нет</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">
                  <input type="checkbox" className="rounded border-gray-300 w-4 h-4 accent-brand" />
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID заказа</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Клиент</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Статус</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Сумма</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Дата</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => {
                const st = getStatus(order?.status);
                return (
                  <tr key={order?.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <input type="checkbox" className="rounded border-gray-300 w-4 h-4 accent-brand" />
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
                        #{order?.id?.slice(0, 8)}…
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{order?.name} {order?.lastname}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order?.country}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text_color}`}>
                        {st.text}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {order?.total?.toLocaleString()} сом
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      <p>{new Date(Date.parse(order?.dateTime)).toLocaleDateString("ru-RU")}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(Date.parse(order?.dateTime)).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order?.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
                      >
                        Подробнее
                        <FaArrowRight className="text-[10px]" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
