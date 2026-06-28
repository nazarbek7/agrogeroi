"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly as convertSlug } from "@/utils/categoryFormating";
import { sanitizeFormData } from "@/lib/form-sanitize";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa6";

interface Characteristic { key: string; value: string; }

const AddNewProduct = () => {
  const [product, setProduct] = useState({
    merchantId: "",
    title: "",
    price: 0,
    manufacturer: "",
    inStock: 1,
    mainImage: "",
    description: "",
    slug: "",
    categoryId: "",
  });
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([
    { key: "", value: "" },
  ]);
  const [categories, setCategories] = useState<any[]>([]);
  const [merchants, setMerchants] = useState<any[]>([]);

  const addChar = () => setCharacteristics([...characteristics, { key: "", value: "" }]);
  const removeChar = (i: number) => setCharacteristics(characteristics.filter((_, idx) => idx !== i));
  const updateChar = (i: number, field: "key" | "value", val: string) => {
    const updated = [...characteristics];
    updated[i][field] = val;
    setCharacteristics(updated);
  };

  const addProduct = async () => {
    if (!product.merchantId || !product.title || !product.slug || !product.price || !product.categoryId) {
      toast.error("Заполните все обязательные поля");
      return;
    }
    const charObj = characteristics
      .filter((c) => c.key.trim())
      .reduce((acc, c) => ({ ...acc, [c.key.trim()]: c.value.trim() }), {});

    try {
      const sanitized = sanitizeFormData(product);
      const response = await apiClient.post("/api/products", {
        ...sanitized,
        characteristics: Object.keys(charObj).length > 0 ? charObj : null,
      });
      if (response.status === 201) {
        toast.success("Товар добавлен!");
        setProduct({ merchantId: product.merchantId, title: "", price: 0, manufacturer: "", inStock: 1, mainImage: "", description: "", slug: "", categoryId: categories[0]?.id || "" });
        setCharacteristics([{ key: "", value: "" }]);
      } else {
        const err = await response.json();
        toast.error(err.message || "Ошибка добавления");
      }
    } catch {
      toast.error("Ошибка сети");
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("uploadedFile", file);
    try {
      const res = await fetch("/api/main-image", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        return data.filename as string;
      }
      toast.error("Ошибка загрузки фото");
      return null;
    } catch {
      toast.error("Ошибка загрузки фото");
      return null;
    }
  };

  useEffect(() => {
    apiClient.get("/api/categories").then((r) => r.json()).then((data) => {
      setCategories(data);
      setProduct((p) => ({ ...p, categoryId: data[0]?.id || "" }));
    });
    apiClient.get("/api/merchants").then((r) => r.json()).then((data) => {
      setMerchants(data || []);
      setProduct((p) => ({ ...p, merchantId: data?.[0]?.id || "" }));
    }).catch(() => toast.error("Не удалось загрузить продавцов"));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col gap-y-6 max-xl:px-5 w-full pt-6 pb-10 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800">Добавить новый товар</h1>

        {/* Продавец */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Продавец *</label>
          <select className="select select-bordered w-full" value={product.merchantId}
            onChange={(e) => setProduct({ ...product, merchantId: e.target.value })}>
            {merchants.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          {merchants.length === 0 && <p className="text-xs text-red-500 mt-1">Сначала создайте продавца в разделе "Продавцы"</p>}
        </div>

        {/* Название */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название товара *</label>
          <input type="text" className="input input-bordered w-full" value={product.title}
            placeholder='Напр.: Гортензия метельчатая "Самарская Лидия"'
            onChange={(e) => {
              setProduct({ ...product, title: e.target.value, slug: convertSlug(e.target.value) });
            }} />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL-slug *</label>
          <input type="text" className="input input-bordered w-full" value={convertSlug(product.slug)}
            onChange={(e) => setProduct({ ...product, slug: convertSlug(e.target.value) })} />
          <p className="text-xs text-gray-400 mt-1">Заполняется автоматически из названия</p>
        </div>

        {/* Категория */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
          <select className="select select-bordered w-full" value={product.categoryId}
            onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Цена */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Цена (сом) *</label>
          <input type="number" className="input input-bordered w-full" value={product.price || ""}
            placeholder="550"
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })} />
        </div>

        {/* Производитель/поставщик */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Производитель / Поставщик</label>
          <input type="text" className="input input-bordered w-full" value={product.manufacturer}
            placeholder="Напр.: Питомник Агрогерои"
            onChange={(e) => setProduct({ ...product, manufacturer: e.target.value })} />
        </div>

        {/* Наличие */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Наличие</label>
          <select className="select select-bordered w-full" value={product.inStock}
            onChange={(e) => setProduct({ ...product, inStock: Number(e.target.value) })}>
            <option value={1}>В наличии</option>
            <option value={0}>Нет в наличии</option>
          </select>
        </div>

        {/* Фото */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Главное фото</label>
          <input type="file" accept="image/*" className="file-input file-input-bordered w-full"
            onChange={async (e: any) => {
              const file = e.target.files[0];
              if (!file) return;
              const filename = await uploadFile(file);
              if (filename) setProduct({ ...product, mainImage: filename });
              e.target.value = "";
            }} />
          {product.mainImage && (
            <img src={`/${product.mainImage}`} alt="preview"
              className="mt-2 w-32 h-32 object-cover rounded-lg border" />
          )}
        </div>

        {/* Описание */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <textarea className="textarea textarea-bordered w-full h-32" value={product.description}
            placeholder="Описание растения, особенности, применение..."
            onChange={(e) => setProduct({ ...product, description: e.target.value })} />
        </div>

        {/* Характеристики */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Характеристики</label>
          <div className="flex flex-col gap-y-2">
            {characteristics.map((c, i) => (
              <div key={i} className="flex gap-x-2 items-center">
                <input type="text" placeholder="Параметр (напр.: Высота)" value={c.key}
                  onChange={(e) => updateChar(i, "key", e.target.value)}
                  className="input input-bordered flex-1 text-sm" />
                <input type="text" placeholder="Значение (напр.: 1,2 м)" value={c.value}
                  onChange={(e) => updateChar(i, "value", e.target.value)}
                  className="input input-bordered flex-1 text-sm" />
                <button onClick={() => removeChar(i)} className="text-red-400 hover:text-red-600 p-2">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addChar} className="mt-2 flex items-center gap-x-2 text-sm text-brand hover:text-brand-dark font-medium">
            <FaPlus /> Добавить характеристику
          </button>
          <div className="mt-2 text-xs text-gray-400 grid grid-cols-2 gap-1">
            <span>Примеры: Высота → 1,2 м</span>
            <span>Период цветения → июль–сентябрь</span>
            <span>Зона морозостойкости → 4</span>
            <span>Состав NPK → 2,2% N, 1,8% P</span>
          </div>
        </div>

        <button onClick={addProduct} type="button"
          className="bg-brand text-white font-bold py-3 px-10 text-lg hover:bg-brand-dark w-full">
          Добавить товар
        </button>
      </div>
    </div>
  );
};

export default AddNewProduct;
