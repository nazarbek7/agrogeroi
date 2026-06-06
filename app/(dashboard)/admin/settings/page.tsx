"use client";
import { DashboardSidebar } from "@/components";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaTelegram, FaInstagram, FaSave } from "react-icons/fa";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
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

  const handleSave = () => {
    toast.success("Настройки сохранены!");
  };

  const Field = ({ label, value, field, icon: Icon, type = "text" }: any) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
        {Icon && <Icon className="text-brand" />} {label}
      </label>
      <input
        type={type}
        className="input input-bordered w-full max-w-md"
        value={value}
        onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-8 xl:pl-8 max-xl:px-5 w-full pt-6 pb-10 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800">Настройки магазина</h1>

        {/* Основная информация */}
        <section>
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Основная информация</h2>
          <div className="flex flex-col gap-y-4">
            <Field label="Название магазина" field="storeName" value={settings.storeName} icon={null} />
            <Field label="Телефон" field="phone" value={settings.phone} icon={FaPhone} />
            <Field label="Email" field="email" value={settings.email} icon={FaEnvelope} type="email" />
            <Field label="Адрес" field="address" value={settings.address} icon={FaMapMarkerAlt} />
            <Field label="Часы работы" field="workingHours" value={settings.workingHours} icon={FaClock} />
          </div>
        </section>

        {/* Социальные сети */}
        <section>
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Социальные сети</h2>
          <div className="flex flex-col gap-y-4">
            <Field label="WhatsApp" field="whatsapp" value={settings.whatsapp} icon={FaWhatsapp} />
            <Field label="Telegram" field="telegram" value={settings.telegram} icon={FaTelegram} />
            <Field label="Instagram" field="instagram" value={settings.instagram} icon={FaInstagram} />
          </div>
        </section>

        {/* Настройки заказов */}
        <section>
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Заказы и доставка</h2>
          <div className="flex flex-col gap-y-4">
            <Field label="Валюта" field="currency" value={settings.currency} icon={null} />
            <Field label="Стоимость доставки (сом)" field="deliveryFee" value={settings.deliveryFee} icon={null} type="number" />
            <Field label="Минимальная сумма заказа (сом)" field="minOrderAmount" value={settings.minOrderAmount} icon={null} type="number" />
          </div>
        </section>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold py-3 px-8 rounded-lg transition-colors w-fit"
        >
          <FaSave /> Сохранить настройки
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
