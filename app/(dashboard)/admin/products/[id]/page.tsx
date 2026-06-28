"use client";
import { DashboardSidebar } from "@/components";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, use } from "react";
import toast from "react-hot-toast";
import {
  convertCategoryNameToURLFriendly as convertSlugToURLFriendly,
  formatCategoryName,
} from "../../../../../utils/categoryFormating";

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

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col gap-y-7 w-full max-xl:px-5 pt-6 pb-10 px-6">
        <h1 className="text-3xl font-semibold">Детали товара</h1>

        {/* Название */}
        <label className="form-control w-full max-w-xs">
          <div className="label"><span className="label-text">Название товара:</span></div>
          <input type="text" className="input input-bordered w-full max-w-xs"
            value={product?.title || ""}
            onChange={(e) => setProduct({ ...product!, title: e.target.value })} />
        </label>

        {/* Цена */}
        <label className="form-control w-full max-w-xs">
          <div className="label"><span className="label-text">Цена (сом):</span></div>
          <input type="number" className="input input-bordered w-full max-w-xs"
            value={product?.price || ""}
            onChange={(e) => setProduct({ ...product!, price: Number(e.target.value) })} />
        </label>

        {/* Производитель */}
        <label className="form-control w-full max-w-xs">
          <div className="label"><span className="label-text">Производитель:</span></div>
          <input type="text" className="input input-bordered w-full max-w-xs"
            value={product?.manufacturer || ""}
            onChange={(e) => setProduct({ ...product!, manufacturer: e.target.value })} />
        </label>

        {/* Slug */}
        <label className="form-control w-full max-w-xs">
          <div className="label"><span className="label-text">Slug:</span></div>
          <input type="text" className="input input-bordered w-full max-w-xs"
            value={product?.slug ? convertSlugToURLFriendly(product.slug) : ""}
            onChange={(e) => setProduct({ ...product!, slug: convertSlugToURLFriendly(e.target.value) })} />
        </label>

        {/* Наличие */}
        <label className="form-control w-full max-w-xs">
          <div className="label"><span className="label-text">Наличие:</span></div>
          <select className="select select-bordered"
            value={product?.inStock ?? 1}
            onChange={(e) => setProduct({ ...product!, inStock: Number(e.target.value) })}>
            <option value={1}>В наличии</option>
            <option value={0}>Нет в наличии</option>
          </select>
        </label>

        {/* Категория */}
        <label className="form-control w-full max-w-xs">
          <div className="label"><span className="label-text">Категория:</span></div>
          <select className="select select-bordered"
            value={product?.categoryId || ""}
            onChange={(e) => setProduct({ ...product!, categoryId: e.target.value })}>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{formatCategoryName(cat.name)}</option>
            ))}
          </select>
        </label>

        {/* Все фото: главное + дополнительные в одной строке */}
        <div className="flex flex-col gap-y-3">
          <span className="label-text font-medium">
            Фотографии товара: {1 + otherImages.length} / 7
          </span>
          <div className="flex flex-wrap gap-3">

            {/* Главное фото — первое в ряду */}
            {product?.mainImage ? (
              <div className="relative group w-28 h-28">
                <img
                  src={`/${product.mainImage}`}
                  alt="главное фото"
                  className="w-28 h-28 object-cover rounded-lg border-2 border-brand"
                />
                <span className="absolute top-1 left-1 text-[10px] bg-brand text-white px-1.5 py-0.5 rounded font-semibold leading-none pointer-events-none">
                  Главное
                </span>
                {/* Удалить главное фото */}
                <button
                  onClick={() => setProduct((p) => ({ ...p!, mainImage: "" }))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Удалить"
                >✕</button>
                {/* Клик по картинке — заменить фото */}
                <label className="absolute inset-0 cursor-pointer rounded-lg" title="Заменить фото">
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const filename = await uploadMainImage(file);
                      if (filename) {
                        setProduct((p) => ({ ...p!, mainImage: filename }));
                        toast.success("Главное фото заменено");
                      }
                      e.target.value = "";
                    }} />
                </label>
              </div>
            ) : (
              /* Пустой слот для главного фото */
              <label className={`flex items-center justify-center w-28 h-28 rounded-lg border-2 border-dashed border-brand cursor-pointer hover:bg-brand/5 transition-colors ${uploadingMain ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="flex flex-col items-center gap-1 text-brand text-center">
                  {uploadingMain ? (
                    <span className="text-xs">Загрузка...</span>
                  ) : (
                    <>
                      <span className="text-3xl font-light">+</span>
                      <span className="text-xs leading-tight">Главное фото</span>
                    </>
                  )}
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

            {/* Дополнительные фото */}
            {otherImages.map((img) => (
              <div key={img.imageID} className="relative group w-28 h-28">
                <img
                  src={`/${img.image}`}
                  alt="доп. фото"
                  className="w-28 h-28 object-cover rounded-lg border"
                />
                <button
                  onClick={() => deleteExtraImage(img.imageID as any)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Удалить"
                >✕</button>
              </div>
            ))}

            {/* Слот «Добавить фото» */}
            {otherImages.length < 6 && (
              <label className={`flex items-center justify-center w-28 h-28 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-brand transition-colors ${uploadingExtra ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="flex flex-col items-center gap-1 text-gray-400 text-center">
                  {uploadingExtra ? (
                    <span className="text-xs">Загрузка...</span>
                  ) : (
                    <>
                      <span className="text-3xl font-light">+</span>
                      <span className="text-xs leading-tight">Добавить фото</span>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" multiple className="hidden"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    const remaining = 6 - otherImages.length;
                    for (const file of files.slice(0, remaining)) {
                      await uploadExtraImage(file);
                    }
                    e.target.value = "";
                  }} />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-400">Нажмите на главное фото, чтобы заменить его. При наведении — кнопка удаления.</p>
        </div>

        {/* Акция / Скидка */}
        <div className="flex flex-col gap-y-3 p-4 rounded-lg border border-orange-200 bg-orange-50 max-w-xs">
          <p className="font-semibold text-orange-700">Акция / Скидка</p>
          <label className="flex items-center gap-x-3 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-warning"
              checked={product?.isOnSale ?? false}
              onChange={(e) => setProduct({ ...product!, isOnSale: e.target.checked })} />
            <span className="label-text font-medium">Товар на акции</span>
          </label>
          {product?.isOnSale && (
            <label className="form-control">
              <div className="label"><span className="label-text">Скидка (%):</span></div>
              <input type="number" min={0} max={100} className="input input-bordered w-full"
                value={product?.discountPercent ?? 0}
                onChange={(e) => setProduct({ ...product!, discountPercent: Number(e.target.value) })} />
            </label>
          )}
        </div>

        {/* Описание */}
        <label className="form-control">
          <div className="label"><span className="label-text">Описание:</span></div>
          <textarea className="textarea textarea-bordered h-24"
            value={product?.description || ""}
            onChange={(e) => setProduct({ ...product!, description: e.target.value })} />
        </label>

        {/* Кнопки */}
        <div className="flex gap-x-2 max-sm:flex-col">
          <button type="button" onClick={updateProduct} disabled={!isDirty}
            className={`uppercase px-10 py-5 text-lg font-bold text-white shadow-sm focus:outline-none focus:ring-2 transition-colors ${
              isDirty
                ? "bg-brand hover:bg-brand-dark cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}>
            {isDirty ? "Сохранить изменения" : "Нет изменений"}
          </button>
          <button type="button" onClick={deleteProduct}
            className="uppercase bg-red-600 px-10 py-5 text-lg font-bold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2">
            Удалить товар
          </button>
        </div>
        <p className="text-xl max-sm:text-lg text-error">
          Для удаления товара сначала удалите все его записи в заказах.
        </p>
      </div>
    </div>
  );
};

export default DashboardProductDetails;
