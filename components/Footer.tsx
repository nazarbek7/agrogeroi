import { navigation } from "@/lib/utils";
import Image from "next/image";
import { FaWhatsapp, FaTelegram, FaInstagram } from "react-icons/fa";
import { FaRegEnvelope, FaPhone } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-8 pt-24 pb-14">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="flex flex-col gap-y-6">
            <Image
              src="/agrogeroi_logo.svg"
              alt="Agrogeroi logo"
              width={140}
              height={140}
              className="h-auto w-auto max-w-[140px]"
            />
            <div className="flex flex-col gap-y-3 text-sm text-gray-600">
              <a href="tel:+996708000008" className="flex items-center gap-x-2 hover:text-brand">
                <FaPhone className="text-brand" />
                <span>+996 708 00 00 08</span>
              </a>
              <a href="mailto:info@agrogeroi.com" className="flex items-center gap-x-2 hover:text-brand">
                <FaRegEnvelope className="text-brand" />
                <span>info@agrogeroi.com</span>
              </a>
            </div>
            <div className="flex gap-x-3">
              <a
                href="https://wa.me/996708000008"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-semibold"
              >
                <FaWhatsapp className="text-xl" />
                WhatsApp
              </a>
              <a
                href="https://t.me/agrogeroi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 text-sm font-semibold"
              >
                <FaTelegram className="text-xl" />
                Telegram
              </a>
              <a
                href="https://www.instagram.com/agrogeroi/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-semibold"
              >
                <FaInstagram className="text-xl" />
                Instagram
              </a>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-lg font-bold leading-6 text-brand">Акции</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.sale.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-black hover:text-gray-700">{item.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-base font-bold leading-6 text-brand">О нас</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.about.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-black hover:text-gray-700">{item.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-base font-bold leading-6 text-brand">Покупателям</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.buy.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-black hover:text-gray-700">{item.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-base font-bold leading-6 text-brand">Поддержка</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.help.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm leading-6 text-black hover:text-gray-700">{item.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          © 2024 Агрогерои. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
