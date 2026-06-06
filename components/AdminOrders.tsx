"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";

const statusLabel: Record<string, { text: string; class: string }> = {
  pending:    { text: "В ожидании",   class: "badge-warning" },
  processing: { text: "Обрабатывается", class: "badge-info" },
  confirmed:  { text: "Подтверждён",  class: "badge-primary" },
  shipped:    { text: "Отправлен",    class: "badge-accent" },
  delivered:  { text: "Доставлен",    class: "badge-success" },
  canceled:   { text: "Отменён",      class: "badge-error" },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/api/orders");
        const data = await response.json();
        setOrders(data?.orders ?? []);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const s = (status: string) => statusLabel[status] ?? { text: status, class: "badge-ghost" };

  return (
    <div className="xl:ml-5 w-full max-xl:mt-5">
      <h1 className="text-3xl font-semibold text-center mb-5">Все заказы</h1>
      {loading ? (
        <p className="text-center py-10 text-gray-500">Загрузка...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-md table-pin-cols">
            <thead>
              <tr>
                <th><input type="checkbox" className="checkbox" /></th>
                <th>ID заказа</th>
                <th>Имя и страна</th>
                <th>Статус</th>
                <th>Сумма</th>
                <th>Дата</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    Заказов пока нет
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order?.id}>
                  <th><input type="checkbox" className="checkbox" /></th>
                  <td><p className="font-bold">#{order?.id?.slice(0, 8)}…</p></td>
                  <td>
                    <div className="font-bold">{order?.name} {order?.lastname}</div>
                    <div className="text-sm opacity-50">{order?.country}</div>
                  </td>
                  <td>
                    <span className={`badge text-white badge-sm ${s(order?.status).class}`}>
                      {s(order?.status).text}
                    </span>
                  </td>
                  <td>{order?.total} сом</td>
                  <td>{new Date(Date.parse(order?.dateTime)).toLocaleDateString("ru-RU")}</td>
                  <th>
                    <Link href={`/admin/orders/${order?.id}`} className="btn btn-ghost btn-xs">
                      Подробнее
                    </Link>
                  </th>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th>ID заказа</th>
                <th>Имя и страна</th>
                <th>Статус</th>
                <th>Сумма</th>
                <th>Дата</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
