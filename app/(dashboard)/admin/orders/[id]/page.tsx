"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { isValidEmailAddressFormat, isValidNameOrLastname } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaTrash } from "react-icons/fa6";

interface OrderProduct {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    inStock: number;
  };
}

const STATUS_OPTIONS = [
  { value: "pending",    label: "В ожидании"    },
  { value: "processing", label: "Обрабатывается" },
  { value: "confirmed",  label: "Подтверждён"   },
  { value: "shipped",    label: "Отправлен"     },
  { value: "delivered",  label: "Доставлен"     },
  { value: "canceled",   label: "Отменён"       },
];

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  confirmed:  "bg-indigo-100 text-indigo-700",
  shipped:    "bg-cyan-100 text-cyan-700",
  delivered:  "bg-green-100 text-green-700",
  canceled:   "bg-red-100 text-red-700",
};

const Field = ({
  label, value, onChange, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
    />
  </div>
);

const AdminSingleOrder = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      apiClient.get(`/api/orders/${params?.id}`).then((r) => r.json()),
      apiClient.get(`/api/order-product/${params?.id}`).then((r) => r.json()),
    ]).then(([orderData, productsData]) => {
      setOrder(orderData);
      setOrderProducts(Array.isArray(productsData) ? productsData : []);
    }).finally(() => setLoading(false));
  }, [params?.id]);

  const updateOrder = async () => {
    if (!order) return;
    const required = [order.name, order.lastname, order.phone, order.email,
      order.adress, order.apartment, order.city, order.country, order.postalCode];
    if (required.some((v) => !v?.trim())) { toast.error("Заполните все обязательные поля"); return; }
    if (!isValidNameOrLastname(order.name)) { toast.error("Неверный формат имени"); return; }
    if (!isValidNameOrLastname(order.lastname)) { toast.error("Неверный формат фамилии"); return; }
    if (!isValidEmailAddressFormat(order.email)) { toast.error("Неверный формат email"); return; }

    try {
      const res = await apiClient.put(`/api/orders/${order.id}`, order);
      if (res.status === 200) toast.success("Заказ обновлён");
      else throw new Error();
    } catch {
      toast.error("Ошибка обновления заказа");
    }
  };

  const deleteOrder = async () => {
    if (!order) return;
    if (!confirm("Удалить заказ?")) return;
    await apiClient.delete(`/api/order-product/${order.id}`);
    await apiClient.delete(`/api/orders/${order.id}`);
    toast.success("Заказ удалён");
    router.push("/admin/orders");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center text-gray-500">Заказ не найден</div>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600";
  const statusLabel = STATUS_OPTIONS.find((s) => s.value === order.status)?.label ?? order.status;

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />

      <div className="flex-1 p-6 max-xl:p-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 mb-6 flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
          >
            <FaArrowLeft className="text-xs" /> Назад
          </Link>

          <div className="w-px h-8 bg-gray-200" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-lg font-bold text-gray-900">Заказ</h1>
              <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                #{order.id?.slice(0, 12)}…
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">
                {new Date(Date.parse(order.dateTime)).toLocaleDateString("ru-RU", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-xs font-medium text-gray-500">
                {new Date(Date.parse(order.dateTime)).toLocaleTimeString("ru-RU", {
                  hour: "2-digit", minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400">Сумма заказа</p>
            <p className="text-lg font-bold text-gray-900">{order.total?.toLocaleString()} сом</p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_360px] gap-6 max-xl:grid-cols-1">
          {/* Left — Customer + Address */}
          <div className="flex flex-col gap-5">
            {/* Customer info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Данные клиента</h2>
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <Field label="Имя" value={order.name} onChange={(v) => setOrder({ ...order, name: v })} />
                <Field label="Фамилия" value={order.lastname} onChange={(v) => setOrder({ ...order, lastname: v })} />
                <Field label="Телефон" value={order.phone} onChange={(v) => setOrder({ ...order, phone: v })} />
                <Field label="Email" type="email" value={order.email} onChange={(v) => setOrder({ ...order, email: v })} />
                <div className="col-span-2 max-sm:col-span-1">
                  <Field label="Компания (необязательно)" value={order.company} onChange={(v) => setOrder({ ...order, company: v })} />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Адрес доставки</h2>
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <div className="col-span-2 max-sm:col-span-1">
                  <Field label="Адрес" value={order.adress} onChange={(v) => setOrder({ ...order, adress: v })} />
                </div>
                <Field label="Квартира / офис" value={order.apartment} onChange={(v) => setOrder({ ...order, apartment: v })} />
                <Field label="Город" value={order.city} onChange={(v) => setOrder({ ...order, city: v })} />
                <Field label="Страна" value={order.country} onChange={(v) => setOrder({ ...order, country: v })} />
                <Field label="Почтовый индекс" value={order.postalCode} onChange={(v) => setOrder({ ...order, postalCode: v })} />
              </div>
            </div>

            {/* Notice */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Примечание</h2>
              <textarea
                rows={3}
                value={order.orderNotice ?? ""}
                onChange={(e) => setOrder({ ...order, orderNotice: e.target.value })}
                placeholder="Примечание к заказу..."
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all resize-none"
              />
            </div>
          </div>

          {/* Right — Products + Status + Actions */}
          <div className="flex flex-col gap-5">
            {/* Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Статус заказа</h2>
              <select
                value={order.status}
                onChange={(e) => setOrder({ ...order, status: e.target.value as any })}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Products */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Товары</h2>
              {orderProducts.length === 0 ? (
                <p className="text-sm text-gray-400">Товары не найдены</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {orderProducts.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.product?.mainImage ? `/${item.product.mainImage}` : "/product_placeholder.jpg"}
                          alt={item.product?.title}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product?.slug}`}
                          className="text-sm font-semibold text-gray-900 hover:text-brand truncate block"
                        >
                          {item.product?.title}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.product?.price?.toLocaleString()} сом × {item.quantity} шт.
                        </p>
                      </div>
                      <div className="text-sm font-bold text-gray-900 flex-shrink-0">
                        {(item.product?.price * item.quantity)?.toLocaleString()} сом
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Итого</span>
                  <span className="text-lg font-bold text-gray-900">{order.total?.toLocaleString()} сом</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={updateOrder}
                className="w-full py-3 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-dark transition-all active:scale-95"
              >
                Сохранить изменения
              </button>
              <button
                onClick={deleteOrder}
                className="w-full py-3 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <FaTrash className="text-xs" /> Удалить заказ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSingleOrder;
