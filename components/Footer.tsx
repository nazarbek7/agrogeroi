import { navigation } from "@/lib/utils";
import Image from "next/image";
import { FaWhatsapp, FaTelegram, FaInstagram } from "react-icons/fa";
import { FaRegEnvelope, FaPhone, FaLocationDot } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#1c3a10]" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-8 pt-16 pb-10">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo + contacts */}
          <div className="flex flex-col gap-y-6">
            <Image
              src="/agrogeroi_logo.svg"
              alt="Agrogeroi logo"
              width={140}
              height={140}
              className="h-auto w-auto max-w-[140px] brightness-0 invert"
            />
            <div className="flex flex-col gap-y-3 text-sm text-white/70">
              <a href="tel:+996708000008" className="flex items-center gap-x-2 hover:text-white transition-colors">
                <FaPhone className="text-green-400 flex-shrink-0" />
                <span>+996 708 00 00 08</span>
              </a>
              <a href="mailto:info@agrogeroi.com" className="flex items-center gap-x-2 hover:text-white transition-colors">
                <FaRegEnvelope className="text-green-400 flex-shrink-0" />
                <span>info@agrogeroi.com</span>
              </a>
              <a
                href="https://2gis.kg/bishkek/search/%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%A3%D0%BC%D0%B5%D1%82%D0%B0%D0%BB%D0%B8%D0%B5%D0%B2%D0%B0%2C%C2%A026%D0%B0/geo/70030077051166240/74.654377%2C42.801148?m=74.65823%2C42.799799%2F18.55"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-x-2 hover:text-white transition-colors"
              >
                <FaLocationDot className="text-green-400 flex-shrink-0 mt-0.5" />
                <span>ул. Кенжекан Уметалиева, 26а,<br />Кок-Джар с., Октябрьский р-н, Бишкек</span>
              </a>
            </div>
            <div className="flex gap-x-3 flex-wrap gap-y-2">
              <a
                href="https://wa.me/996708000008"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 text-sm font-semibold transition-colors"
              >
                <FaWhatsapp className="text-xl" /> WhatsApp
              </a>
              <a
                href="https://t.me/agrogeroi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-400 text-sm font-semibold transition-colors"
              >
                <FaTelegram className="text-xl" /> Telegram
              </a>
              <a
                href="https://www.instagram.com/agrogeroi/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-semibold transition-colors"
              >
                <FaInstagram className="text-xl" /> Instagram
              </a>
            </div>
          </div>

          {/* Nav links */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-green-400 mb-5">Акции</h3>
                <ul role="list" className="space-y-3">
                  {navigation.sale.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">{item.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-bold uppercase tracking-widest text-green-400 mb-5">О нас</h3>
                <ul role="list" className="space-y-3">
                  {navigation.about.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">{item.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-green-400 mb-5">Покупателям</h3>
                <ul role="list" className="space-y-3">
                  {navigation.buy.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">{item.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-bold uppercase tracking-widest text-green-400 mb-5">Поддержка</h3>
                <ul role="list" className="space-y-3">
                  {navigation.help.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">{item.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          © 2026 Agrogeroi. Все права защищены.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
