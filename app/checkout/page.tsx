"use client";
import { SectionTitle } from "@/components";
import { useProductStore } from "../_zustand/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
    company: "",
    adress: "",
    apartment: "",
    city: "Бишкек",
    country: "Кыргызстан",
    postalCode: "",
    orderNotice: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { products, total, clearCart } = useProductStore();
  const router = useRouter();

  useEffect(() => {
    if (products.length === 0) {
      toast.error("Ваша корзина пуста");
      router.push("/cart");
    }
  }, []);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    if (form.name.trim().length < 2) { toast.error("Имя должно содержать минимум 2 символа"); return false; }
    if (form.lastname.trim().length < 2) { toast.error("Фамилия должна содержать минимум 2 символа"); return false; }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email.trim())) { toast.error("Введите корректный email"); return false; }
    if (form.phone.replace(/\D/g, "").length < 10) { toast.error("Номер телефона должен содержать минимум 10 цифр"); return false; }
    if (form.adress.trim().length < 5) { toast.error("Укажите адрес (минимум 5 символов)"); return false; }
    if (form.city.trim().length < 2) { toast.error("Укажите город"); return false; }
    if (!form.postalCode.trim()) { toast.error("Укажите почтовый индекс"); return false; }
    return true;
  };

  const makePurchase = async () => {
    if (!validate()) return;
    if (products.length === 0) { toast.error("Корзина пуста"); return; }
    setIsSubmitting(true);
    try {
      let userId = null;
      if (session?.user?.email) {
        try {
          const r = await apiClient.get(`/api/users/email/${session.user.email}`);
          if (r.ok) userId = (await r.json()).id;
        } catch {}
      }

      const response = await apiClient.post("/api/orders", {
        name: form.name.trim(),
        lastname: form.lastname.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        company: form.company.trim(),
        adress: form.adress.trim(),
        apartment: form.apartment.trim(),
        postalCode: form.postalCode.trim(),
        status: "pending",
        total,
        city: form.city.trim(),
        country: form.country.trim(),
        orderNotice: form.orderNotice.trim(),
        userId,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 409) {
          toast.error("Такой заказ уже существует. Подождите немного.");
          return;
        }
        toast.error(err.error || "Ошибка создания заказа");
        return;
      }

      const data = await response.json();
      const orderId: string = data.id;
      if (!orderId) throw new Error("Не получен ID заказа");

      for (const p of products) {
        await apiClient.post("/api/order-product", {
          customerOrderId: orderId,
          productId: p.id,
          quantity: p.amount,
        });
      }

      clearCart();
      try { window.dispatchEvent(new CustomEvent("orderCompleted")); } catch {}
      toast.success("Заказ оформлен! Мы свяжемся с вами для подтверждения.");
      setTimeout(() => router.push("/"), 1000);
    } catch {
      toast.error("Ошибка при оформлении заказа. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand focus:ring-brand sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="bg-white">
      <SectionTitle title="Оформление заказа" path="Главная | Корзина | Оформление заказа" />

      <main className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">

        {/* Сводка заказа */}
        <section className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16">
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ваш заказ</h2>
            <ul className="divide-y divide-gray-200 text-sm font-medium text-gray-900">
              {products.map((product) => (
                <li key={product.id} className="flex items-start gap-4 py-5">
                  <Image
                    src={product.image ? `/${product.image}` : "/product_placeholder.jpg"}
                    alt={product.title}
                    width={72}
                    height={72}
                    className="h-18 w-18 flex-none rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">× {product.amount} шт.</p>
                  </div>
                  <p className="flex-none font-semibold text-brand">
                    {(product.price * product.amount).toLocaleString("ru-RU")} сом
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 pt-5 mt-2">
              <div className="flex items-center justify-between text-base font-bold text-gray-900">
                <span>Итого</span>
                <span className="text-brand text-lg">{total.toLocaleString("ru-RU")} сом</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Доставка обсуждается при подтверждении заказа</p>
            </div>
          </div>
        </section>

        {/* Форма */}
        <form className="px-4 pt-16 pb-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0" onSubmit={(e) => { e.preventDefault(); makePurchase(); }}>
          <div className="mx-auto max-w-lg lg:max-w-none space-y-8">

            {/* Контактные данные */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Контактные данные</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className={labelCls}>Имя *</label>
                    <input id="name" type="text" autoComplete="given-name" required disabled={isSubmitting}
                      className={inputCls} value={form.name} onChange={set("name")} />
                  </div>
                  <div>
                    <label htmlFor="lastname" className={labelCls}>Фамилия *</label>
                    <input id="lastname" type="text" autoComplete="family-name" required disabled={isSubmitting}
                      className={inputCls} value={form.lastname} onChange={set("lastname")} />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className={labelCls}>Номер телефона *</label>
                  <input id="phone" type="tel" autoComplete="tel" required disabled={isSubmitting}
                    placeholder="+996 700 000 000"
                    className={inputCls} value={form.phone} onChange={set("phone")} />
                </div>
                <div>
                  <label htmlFor="email" className={labelCls}>Email *</label>
                  <input id="email" type="email" autoComplete="email" required disabled={isSubmitting}
                    className={inputCls} value={form.email} onChange={set("email")} />
                </div>
              </div>
            </section>

            {/* Оплата */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
              <svg className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">Оплата после подтверждения</p>
                <p className="text-sm text-green-700 mt-0.5">Мы свяжемся с вами и уточним детали оплаты и доставки.</p>
              </div>
            </div>

            {/* Адрес доставки */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Адрес доставки</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="adress" className={labelCls}>Улица, дом *</label>
                  <input id="adress" type="text" autoComplete="street-address" required disabled={isSubmitting}
                    placeholder="ул. Манаса, д. 12"
                    className={inputCls} value={form.adress} onChange={set("adress")} />
                </div>
                <div>
                  <label htmlFor="apartment" className={labelCls}>Квартира / офис</label>
                  <input id="apartment" type="text" disabled={isSubmitting}
                    placeholder="кв. 45"
                    className={inputCls} value={form.apartment} onChange={set("apartment")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className={labelCls}>Город *</label>
                    <input id="city" type="text" autoComplete="address-level2" required disabled={isSubmitting}
                      className={inputCls} value={form.city} onChange={set("city")} />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className={labelCls}>Почтовый индекс *</label>
                    <input id="postalCode" type="text" autoComplete="postal-code" required disabled={isSubmitting}
                      placeholder="720000"
                      className={inputCls} value={form.postalCode} onChange={set("postalCode")} />
                  </div>
                </div>
                <div>
                  <label htmlFor="country" className={labelCls}>Страна</label>
                  <input id="country" type="text" autoComplete="country-name" disabled={isSubmitting}
                    className={inputCls} value={form.country} onChange={set("country")} />
                </div>
                <div>
                  <label htmlFor="company" className={labelCls}>Организация (необязательно)</label>
                  <input id="company" type="text" autoComplete="organization" disabled={isSubmitting}
                    className={inputCls} value={form.company} onChange={set("company")} />
                </div>
                <div>
                  <label htmlFor="orderNotice" className={labelCls}>Комментарий к заказу</label>
                  <textarea id="orderNotice" rows={3} disabled={isSubmitting}
                    placeholder="Особые пожелания, удобное время доставки..."
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand focus:ring-brand sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={form.orderNotice} onChange={set("orderNotice")} />
                </div>
              </div>
            </section>

            <button type="submit" disabled={isSubmitting}
              className="w-full rounded-md bg-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              {isSubmitting ? "Оформляем заказ..." : "Оформить заказ"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;
