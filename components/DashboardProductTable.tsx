"use client";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import { imgSrc } from "@/utils/imgSrc";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowRight, FaPlus, FaChevronDown, FaTrash, FaEyeSlash, FaEye } from "react-icons/fa6";
import toast from "react-hot-toast";

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    apiClient.get("/api/products?mode=admin", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === products.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(products.map((p) => p.id)));
    }
  };

  const bulkAction = async (action: "delete" | "deactivate" | "activate") => {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Ошибка"); return; }

      if (action === "delete") {
        toast.success(`Удалено: ${data.deleted}${data.skipped ? `, пропущено (в заказах): ${data.skipped}` : ""}`);
      } else {
        toast.success(`Обновлено: ${data.updated} товаров`);
      }
      setSelected(new Set());
      fetchProducts();
    } catch {
      toast.error("Ошибка");
    } finally {
      setBulkLoading(false);
    }
  };

  const allChecked = products.length > 0 && selected.size === products.length;
  const someChecked = selected.size > 0 && selected.size < products.length;

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Все товары</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} товаров</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-all"
        >
          <FaPlus className="text-xs" /> Добавить товар
        </Link>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-brand/5 border border-brand/20 rounded-xl">
          <span className="text-sm font-semibold text-brand">Выбрано: {selected.size}</span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => bulkAction("activate")}
              disabled={bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              <FaEye className="text-xs" /> Активировать
            </button>
            <button
              onClick={() => bulkAction("deactivate")}
              disabled={bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <FaEyeSlash className="text-xs" /> Деактивировать
            </button>
            <button
              onClick={() => { if (confirm(`Удалить ${selected.size} товаров?`)) bulkAction("delete"); }}
              disabled={bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              <FaTrash className="text-xs" /> Удалить
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 w-4 h-4 accent-brand"
                      checked={allChecked}
                      ref={(el) => { if (el) el.indeterminate = someChecked; }}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Товар</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Наличие</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Цена</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => {
                  const isInactive = product.isActive === false;
                  return (
                    <tr key={product.id} className={`hover:bg-gray-50/60 transition-colors ${isInactive ? "opacity-50" : ""}`}>
                      <td className="px-5 py-3.5">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 w-4 h-4 accent-brand"
                          checked={selected.has(product.id)}
                          onChange={() => toggleOne(product.id)}
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgSrc(product?.mainImage)}
                              alt={sanitize(product?.title) || ""}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{sanitize(product?.title)}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{sanitize(product?.manufacturer)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        {product?.inStock ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap">В наличии</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 whitespace-nowrap">Нет</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900">
                        {product?.price?.toLocaleString()} сом
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-4">
                          {/* Inline active toggle */}
                          <label className="relative inline-flex items-center cursor-pointer gap-2" title={isInactive ? "Неактивный" : "Активный"}>
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={!isInactive}
                              onChange={async () => {
                                try {
                                  const res = await fetch(`/api/products/${product.id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ isActive: isInactive }),
                                  });
                                  if (res.ok) {
                                    setProducts((prev) =>
                                      prev.map((p) => p.id === product.id ? { ...p, isActive: isInactive } : p)
                                    );
                                  }
                                } catch {}
                              }}
                            />
                            <div className="w-8 h-5 bg-gray-200 rounded-full peer-checked:bg-brand transition-colors" />
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-3" />
                          </label>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
                          >
                            Изменить <FaArrowRight className="text-[10px]" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardProductTable;
