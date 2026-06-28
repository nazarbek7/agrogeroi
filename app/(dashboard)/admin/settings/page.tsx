"use client";
import { DashboardSidebar } from "@/components";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPhone, FaEnvelope, FaLocationDot, FaClock, FaWhatsapp, FaTelegram, FaInstagram, FaFloppyDisk } from "react-icons/fa6";

const Field = ({ label, value, onChange, icon: Icon, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  icon?: any; type?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
      {Icon && <Icon className="text-gray-400 text-xs" />} {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
    />
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-sm font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">{title}</h2>
    <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">{children}</div>
  </div>
);

const SettingsPage = () => {
  const [s, setS] = useState({
    storeName: "Агрогерои",
    phone: "+996 708 00 00 08",
    email: "info@agrogeroi.kg",
    address: "г. Бишкек, ул. Манаса 40",
    workingHours: "Пн–Пт: 9:00–18:00, Сб: 10:00–16:00",
    whatsapp: "+996708000008",
    telegram: "@agrogeroi",
    instagram: "@agrogeroi",
    currency: "сом",
    deliveryFee: "500",
    minOrderAmount: "1000",
  });
  const set = (key: string) => (v: string) => setS((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Настройки магазина</h1>
          <button
            onClick={() => toast.success("Настройки сохранены!")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-all"
          >
            <FaFloppyDisk className="text-xs" /> Сохранить
          </button>
        </div>

        <div className="flex flex-col gap-5 max-w-3xl">
          <Section title="Основная информация">
            <div className="col-span-2 max-sm:col-span-1">
              <Field label="Название магазина" value={s.storeName} onChange={set("storeName")} />
            </div>
            <Field label="Телефон" value={s.phone} onChange={set("phone")} icon={FaPhone} />
            <Field label="Email" value={s.email} onChange={set("email")} icon={FaEnvelope} type="email" />
            <div className="col-span-2 max-sm:col-span-1">
              <Field label="Адрес" value={s.address} onChange={set("address")} icon={FaLocationDot} />
            </div>
            <div className="col-span-2 max-sm:col-span-1">
              <Field label="Часы работы" value={s.workingHours} onChange={set("workingHours")} icon={FaClock} />
            </div>
          </Section>

          <Section title="Социальные сети">
            <Field label="WhatsApp" value={s.whatsapp} onChange={set("whatsapp")} icon={FaWhatsapp} />
            <Field label="Telegram" value={s.telegram} onChange={set("telegram")} icon={FaTelegram} />
            <Field label="Instagram" value={s.instagram} onChange={set("instagram")} icon={FaInstagram} />
          </Section>

          <Section title="Заказы и доставка">
            <Field label="Валюта" value={s.currency} onChange={set("currency")} />
            <Field label="Стоимость доставки" value={s.deliveryFee} onChange={set("deliveryFee")} type="number" />
            <Field label="Мин. сумма заказа" value={s.minOrderAmount} onChange={set("minOrderAmount")} type="number" />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
