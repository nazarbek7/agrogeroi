import { FaWhatsapp, FaTelegram, FaInstagram } from "react-icons/fa";
import { FaPhone, FaRegEnvelope, FaLocationDot } from "react-icons/fa6";

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
              <div className="bg-brand p-3 rounded-full flex-shrink-0">
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
              <div className="bg-brand p-3 rounded-full flex-shrink-0">
                <FaRegEnvelope className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href="mailto:info@agrogeroi.com" className="text-lg font-semibold text-black hover:text-brand">
                  info@agrogeroi.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-x-4">
              <div className="bg-brand p-3 rounded-full flex-shrink-0">
                <FaLocationDot className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Адрес питомника</p>
                <a
                  href="https://2gis.kg/bishkek/search/%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%A3%D0%BC%D0%B5%D1%82%D0%B0%D0%BB%D0%B8%D0%B5%D0%B2%D0%B0%2C%C2%A026%D0%B0/geo/70030077051166240/74.654377%2C42.801148?m=74.65823%2C42.799799%2F18.55"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-black hover:text-brand leading-snug"
                >
                  ул. Кенжекан Уметалиева, 26а<br />
                  <span className="text-base font-normal text-gray-600">Кок-Джар с., Октябрьский р-н, Бишкек</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-y-3 pt-2">
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
                <span>Пн — Воскресенье</span>
                <span className="font-semibold text-brand">9:00 — 18:00</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-brand mb-2">Онлайн заказы</h3>
              <p className="text-gray-600 text-sm">
                Принимаем заказы через WhatsApp и Telegram круглосуточно.
                Обрабатываем в рабочее время.
              </p>
            </div>

            {/* 2GIS Map embed */}
            <div>
              <h3 className="font-bold text-brand mb-3">Как добраться</h3>
              <a
                href="https://2gis.kg/bishkek/search/%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%A3%D0%BC%D0%B5%D1%82%D0%B0%D0%BB%D0%B8%D0%B5%D0%B2%D0%B0%2C%C2%A026%D0%B0/geo/70030077051166240/74.654377%2C42.801148?m=74.65823%2C42.799799%2F18.55"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#f4f9f0] border-2 border-brand/20 hover:border-brand rounded-xl p-5 transition-all group"
              >
                <span className="text-4xl">🗺️</span>
                <div>
                  <p className="font-bold text-gray-800 group-hover:text-brand">Открыть на 2GIS</p>
                  <p className="text-sm text-gray-500">ул. Кенжекан Уметалиева, 26а, Кок-Джар</p>
                </div>
                <span className="ml-auto text-brand text-xl">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
