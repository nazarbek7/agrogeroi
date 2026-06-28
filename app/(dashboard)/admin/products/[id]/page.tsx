"use client";
import { DashboardSidebar } from "@/components";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, use } from "react";
import toast from "react-hot-toast";
import {
  convertCategoryNameToURLFriendly as convertSlugToURLFriendly,
  formatCategoryName,
} from "../../../../../utils/categoryFormating";
import { imgSrc } from "../../../../../utils/imgSrc";

interface DashboardProductDetailsProps {
  params: Promise<{ id: string }>;
}

const DashboardProductDetails = ({ params }: DashboardProductDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>();
  const [otherImages, setOtherImages] = useState<OtherImages[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragIdRef = useRef<string | null>(null);
  const savedProduct = useRef<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!savedProduct.current || !product) return;
    setIsDirty(JSON.stringify(product) !== JSON.stringify(savedProduct.current));
  }, [product]);

  const deleteProduct = async () => {
    fetch(`/api/products/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.status !== 204) {
          if (response.status === 400) {
            toast.error("Нельзя удалить товар: сначала удалите его из заказов");
          } else {
            throw Error("Ошибка удаления товара");
          }
        } else {
          toast.success("Товар удалён");
          router.push("/admin/products");
        }
      })
      .catch(() => toast.error("Ошибка удаления товара"));
  };

  const updateProduct = async () => {
    if (!product?.title || !product?.slug || !product?.price) {
      toast.error("Заполните все поля");
      return;
    }
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (response.status === 200) {
        toast.success("Товар обновлён");
        savedProduct.current = product;
        setIsDirty(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Ошибка обновления товара");
      }
    } catch {
      toast.error("Ошибка обновления товара");
    }
  };

  // Upload main image — returns the saved filename from the server
  const uploadMainImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("uploadedFile", file);
    setUploadingMain(true);
    try {
      const response = await fetch("/api/main-image", { method: "POST", body: formData });
      if (response.ok) {
        const data = await response.json();
        return data.filename as string;
      }
      toast.error("Ошибка загрузки фото");
      return null;
    } catch {
      toast.error("Ошибка загрузки фото");
      return null;
    } finally {
      setUploadingMain(false);
    }
  };

  // Upload one extra image and add it to the DB
  const uploadExtraImage = async (file: File) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);
    setUploadingExtra(true);
    try {
      const response = await fetch(`/api/images/${id}`, { method: "POST", body: formData });
      if (response.ok) {
        await fetchOtherImages();
        toast.success("Фото добавлено");
      } else {
        toast.error("Ошибка загрузки фото");
      }
    } catch {
      toast.error("Ошибка загрузки фото");
    } finally {
      setUploadingExtra(false);
    }
  };

  const deleteExtraImage = async (imageID: string) => {
    try {
      const response = await fetch(`/api/images/${imageID}`, { method: "DELETE" });
      if (response.status === 204) {
        setOtherImages((prev) => prev.filter((img) => img.imageID !== (imageID as any)));
        toast.success("Фото удалено");
      } else {
        toast.error("Ошибка удаления фото");
      }
    } catch {
      toast.error("Ошибка удаления фото");
    }
  };

  const handleDragStart = (imageID: string) => {
    dragIdRef.current = imageID;
  };

  const handleDrop = async (targetId: string) => {
    const sourceId = dragIdRef.current;
    dragIdRef.current = null;
    setDragOverId(null);
    if (!sourceId || sourceId === targetId) return;

    const sourceIdx = otherImages.findIndex((i) => String(i.imageID) === sourceId);
    const targetIdx = otherImages.findIndex((i) => String(i.imageID) === targetId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const reordered = [...otherImages];
    const [moved] = reordered.splice(sourceIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    setOtherImages(reordered);

    try {
      await fetch("/api/images/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageIds: reordered.map((i) => i.imageID) }),
      });
    } catch {
      toast.error("Ошибка сохранения порядка");
    }
  };

  const setAsMain = async (img: OtherImages) => {
    try {
      const res = await fetch(`/api/products/${id}/swap-main`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extraImageId: img.imageID }),
      });
      if (res.ok) {
        await fetchProductData();
        toast.success("Главное фото обновлено");
      } else {
        toast.error("Ошибка смены главного фото");
      }
    } catch {
      toast.error("Ошибка смены главного фото");
    }
  };

  const fetchOtherImages = async () => {
    const res = await fetch(`/api/images/${id}`, { cache: "no-store" });
    const images = await res.json();
    setOtherImages(Array.isArray(images) ? images : []);
  };

  const fetchProductData = async () => {
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();
    setProduct(data);
    savedProduct.current = data;
    setIsDirty(false);
    await fetchOtherImages();
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);

  const inputCls = "w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white";
  const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5";

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-6 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.back()}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-800 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Редактирование товара</h1>
              {product && <p className="text-sm text-gray-500 mt-0.5 truncate max-w-xs">{product.title}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={updateProduct} disabled={!isDirty}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isDirty ? "bg-brand text-white hover:bg-brand-dark shadow-sm" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
              {isDirty ? "Сохранить" : "Нет изменений"}
            </button>
            <button type="button" onClick={deleteProduct}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all">
              Удалить
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            {/* Основная информация */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100">Основная информация</h2>

              <div>
                <label className={labelCls}>Название товара</label>
                <input type="text" className={inputCls} value={product?.title || ""}
                  onChange={(e) => setProduct({ ...product!, title: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Цена (сом)</label>
                  <input type="number" className={inputCls} value={product?.price || ""}
                    onChange={(e) => setProduct({ ...product!, price: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={labelCls}>Производитель</label>
                  <input type="text" className={inputCls} value={product?.manufacturer || ""}
                    onChange={(e) => setProduct({ ...product!, manufacturer: e.target.value })} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Slug (URL)</label>
                <input type="text" className={inputCls}
                  value={product?.slug ? convertSlugToURLFriendly(product.slug) : ""}
                  onChange={(e) => setProduct({ ...product!, slug: convertSlugToURLFriendly(e.target.value) })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Наличие</label>
                  <select className={inputCls} value={product?.inStock ?? 1}
                    onChange={(e) => setProduct({ ...product!, inStock: Number(e.target.value) })}>
                    <option value={1}>В наличии</option>
                    <option value={0}>Нет в наличии</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Категория</label>
                  <select className={inputCls} value={product?.categoryId || ""}
                    onChange={(e) => setProduct({ ...product!, categoryId: e.target.value })}>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{formatCategoryName(cat.name)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Описание</label>
                <textarea rows={7} className={inputCls + " resize-y min-h-[120px]"}
                  value={product?.description || ""}
                  onChange={(e) => setProduct({ ...product!, description: e.target.value })} />
              </div>
            </div>

            {/* Бейджи и акции */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100">Бейджи и акции</h2>

              {/* Новинка */}
              <label className="flex items-center justify-between cursor-pointer p-3.5 rounded-xl border border-brand/20 bg-brand/5 hover:bg-brand/10 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-brand">Новинка</p>
                  <p className="text-xs text-brand/60 mt-0.5">Показывать бейдж «Новинка» на карточке</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer"
                    checked={product?.isNew ?? false}
                    onChange={(e) => setProduct({ ...product!, isNew: e.target.checked })} />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-brand transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>

              {/* Хит продаж */}
              <label className="flex items-center justify-between cursor-pointer p-3.5 rounded-xl border border-orange-100 bg-orange-50 hover:bg-orange-100/50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-orange-700">Хит продаж</p>
                  <p className="text-xs text-orange-500 mt-0.5">Показывать бейдж «Хит продаж» на карточке</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer"
                    checked={product?.isBestseller ?? false}
                    onChange={(e) => setProduct({ ...product!, isBestseller: e.target.checked })} />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>

              {/* На акции */}
              <label className="flex items-center justify-between cursor-pointer p-3.5 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100/50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-red-700">На акции</p>
                  <p className="text-xs text-red-400 mt-0.5">Показывать скидку на карточке товара</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer"
                    checked={product?.isOnSale ?? false}
                    onChange={(e) => setProduct({ ...product!, isOnSale: e.target.checked })} />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-red-500 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
              </label>

              {product?.isOnSale && (
                <div>
                  <label className={labelCls}>Скидка (%)</label>
                  <input type="number" min={0} max={100} className={inputCls}
                    value={product?.discountPercent ?? 0}
                    onChange={(e) => setProduct({ ...product!, discountPercent: Number(e.target.value) })} />
                  <p className="text-xs text-gray-400 mt-1">
                    Цена со скидкой: {product.price && product.discountPercent
                      ? Math.round(product.price * (1 - product.discountPercent / 100)).toLocaleString("ru-RU")
                      : "—"} сом
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right column — photos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100 mb-4">
              Фотографии товара <span className="text-gray-400 font-normal">{1 + otherImages.length} / 7</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {/* Главное фото */}
              {product?.mainImage ? (
                <div className="relative group w-28 h-28">
                  <label className={`cursor-pointer block w-28 h-28 ${uploadingMain ? "pointer-events-none opacity-50" : ""}`}>
                    <img src={imgSrc(product.mainImage)} alt="главное фото"
                      className="w-28 h-28 object-cover rounded-xl border-2 border-brand" />
                    <span className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="text-white text-[10px] font-bold">{uploadingMain ? "Загрузка..." : "Изменить"}</span>
                    </span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const filename = await uploadMainImage(file);
                        if (filename) { setProduct((p) => ({ ...p!, mainImage: filename })); toast.success("Главное фото заменено"); }
                        e.target.value = "";
                      }} />
                  </label>
                  <span className="absolute top-1.5 left-1.5 text-[10px] bg-brand text-white px-1.5 py-0.5 rounded-full font-bold pointer-events-none z-10">Главное</span>
                  <button
                    type="button"
                    onClick={() => setProduct((p) => ({ ...p!, mainImage: "" }))}
                    className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕
                  </button>
                </div>
              ) : (
                <label className={`flex items-center justify-center w-28 h-28 rounded-xl border-2 border-dashed border-brand cursor-pointer hover:bg-brand/5 transition-colors ${uploadingMain ? "opacity-50 pointer-events-none" : ""}`}>
                  <div className="flex flex-col items-center gap-1 text-brand text-center">
                    {uploadingMain ? <span className="text-xs">Загрузка...</span> : <><span className="text-3xl font-light">+</span><span className="text-xs leading-tight">Главное</span></>}
                  </div>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const filename = await uploadMainImage(file);
                      if (filename) setProduct((p) => ({ ...p!, mainImage: filename }));
                      e.target.value = "";
                    }} />
                </label>
              )}

              {/* Дополнительные фото — с drag-and-drop для сортировки */}
              {otherImages.map((img) => {
                const imgKey = String(img.imageID);
                const isActive = activeImageId === imgKey;
                const isDragOver = dragOverId === imgKey;
                return (
                  <div key={imgKey}
                    draggable
                    onDragStart={() => handleDragStart(imgKey)}
                    onDragOver={(e) => { e.preventDefault(); setDragOverId(imgKey); }}
                    onDragLeave={() => setDragOverId(null)}
                    onDrop={() => handleDrop(imgKey)}
                    onDragEnd={() => { dragIdRef.current = null; setDragOverId(null); }}
                    className={`relative group w-28 h-28 cursor-grab active:cursor-grabbing transition-all ${isDragOver ? "scale-105 ring-2 ring-brand ring-offset-1 rounded-xl" : ""}`}
                    onClick={() => setActiveImageId(isActive ? null : imgKey)}>
                    <img src={imgSrc(img.image)} alt="доп. фото" className="w-28 h-28 object-cover rounded-xl border border-gray-200 pointer-events-none" />
                    {/* Drag handle hint */}
                    <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex gap-0.5">{[0,1].map(i=><div key={i} className="w-1 h-1 rounded-full bg-white/80 shadow"/>)}</div>
                        <div className="flex gap-0.5">{[0,1].map(i=><div key={i} className="w-1 h-1 rounded-full bg-white/80 shadow"/>)}</div>
                        <div className="flex gap-0.5">{[0,1].map(i=><div key={i} className="w-1 h-1 rounded-full bg-white/80 shadow"/>)}</div>
                      </div>
                    </div>
                    <button type="button"
                      onClick={(e) => { e.stopPropagation(); deleteExtraImage(img.imageID as any); }}
                      className={`absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>✕</button>
                    <button type="button"
                      onClick={(e) => { e.stopPropagation(); setAsMain(img); }}
                      className={`absolute bottom-1 left-1 right-1 z-10 bg-black/65 text-white text-[10px] font-bold py-1 rounded-lg transition-opacity text-center leading-none ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      Главным
                    </button>
                  </div>
                );
              })}

              {/* Добавить фото */}
              {otherImages.length < 6 && (
                <label className={`flex items-center justify-center w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-brand transition-colors ${uploadingExtra ? "opacity-50 pointer-events-none" : ""}`}>
                  <div className="flex flex-col items-center gap-1 text-gray-400 text-center">
                    {uploadingExtra ? <span className="text-xs">Загрузка...</span> : <><span className="text-3xl font-light">+</span><span className="text-xs leading-tight">Добавить</span></>}
                  </div>
                  <input type="file" accept="image/*" multiple className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      for (const file of files.slice(0, 6 - otherImages.length)) await uploadExtraImage(file);
                      e.target.value = "";
                    }} />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-4">При наведении на доп. фото — кнопка «Главным» для замены или ✕ для удаления.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardProductDetails;
