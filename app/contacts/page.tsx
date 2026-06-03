import { FaWhatsapp, FaTelegram, FaInstagram } from "react-icons/fa";
import { FaPhone, FaRegEnvelope } from "react-icons/fa6";

export const metadata = {
  title: "Контакты — Агрогерои",
};

const ContactsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand py-12">
        <h1 className="text-center text-4xl font-bold text-white">Контакты</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          <div className="flex flex-col gap-y-8">
            <h2 className="text-2xl font-bold text-brand">Свяжитесь с нами</h2>

            <div className="flex items-center gap-x-4">
              <div className="bg-brand p-3 rounded-full">
                <FaPhone className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Телефон</p>
                <a href="tel:+996708000008" className="text-lg font-semibold text-black hover:text-brand">
                  +996 708 00 00 08
                </a>
              </div>
            </div>

            <div className="flex items-center gap-x-4">
              <div className="bg-brand p-3 rounded-full">
                <FaRegEnvelope className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href="mailto:info@agrogeroi.com" className="text-lg font-semibold text-black hover:text-brand">
                  info@agrogeroi.com
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-y-3 pt-4">
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Мессенджеры</p>
              <a
                href="https://wa.me/996708000008"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-3 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 font-semibold text-lg w-fit"
              >
                <FaWhatsapp className="text-2xl" />
                WhatsApp
              </a>
              <a
                href="https://t.me/agrogeroi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-3 bg-sky-500 text-white px-6 py-3 rounded-xl hover:bg-sky-600 font-semibold text-lg w-fit"
              >
                <FaTelegram className="text-2xl" />
                Telegram @agrogeroi
              </a>
              <a
                href="https://www.instagram.com/agrogeroi/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:opacity-90 font-semibold text-lg w-fit"
              >
                <FaInstagram className="text-2xl" />
                Instagram @agrogeroi
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-y-6">
            <h2 className="text-2xl font-bold text-brand">Режим работы</h2>
            <div className="flex flex-col gap-y-3 text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span>Пн — Пт</span>
                <span className="font-semibold">9:00 — 18:00</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Суббота</span>
                <span className="font-semibold">9:00 — 16:00</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Воскресенье</span>
                <span className="font-semibold text-gray-400">Выходной</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mt-4">
              <h3 className="font-bold text-brand mb-2">Онлайн заказы</h3>
              <p className="text-gray-600 text-sm">
                Принимаем заказы через WhatsApp и Telegram круглосуточно.
                Обрабатываем в рабочее время.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
