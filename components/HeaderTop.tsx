"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { FaRegUser, FaRightToBracket, FaUserPlus } from "react-icons/fa6";
import { FaWhatsapp, FaTelegram, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const HeaderTop = () => {
  const { data: session }: any = useSession();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Вы вышли из системы");
  };

  return (
    <div className="h-10 text-white bg-brand">
      <div className="flex justify-between items-center h-full max-w-screen-2xl mx-auto px-12 max-[1320px]:px-6 max-md:px-4">

        {/* Лево: телефон + соцсети */}
        <ul className="flex items-center gap-x-4 max-md:gap-x-3">
          <li>
            <a href="tel:+996708000008" className="flex items-center gap-x-1.5 font-semibold hover:opacity-80">
              <FaPhoneAlt className="text-sm" />
              {/* Номер только на десктопе */}
              <span className="max-md:hidden">+996 708 00 00 08</span>
            </a>
          </li>
          <li>
            <a href="https://wa.me/996708000008" target="_blank" rel="noopener noreferrer" className="flex items-center gap-x-1 hover:opacity-80">
              <FaWhatsapp className="text-lg" />
              <span className="max-md:hidden">WhatsApp</span>
            </a>
          </li>
          <li>
            <a href="https://t.me/agrogeroi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-x-1 hover:opacity-80">
              <FaTelegram className="text-lg" />
              <span className="max-md:hidden">Telegram</span>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/agrogeroi/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-x-1 hover:opacity-80">
              <FaInstagram className="text-lg" />
              <span className="max-md:hidden">Instagram</span>
            </a>
          </li>
        </ul>

        {/* Право: auth */}
        <ul className="flex items-center gap-x-4 max-md:gap-x-3 font-semibold">
          {!session ? (
            <>
              <li>
                <Link href="/login" className="flex items-center gap-x-1.5 hover:opacity-80" title="Войти">
                  <FaRightToBracket />
                  <span className="max-md:hidden">Войти</span>
                </Link>
              </li>
              <li>
                <Link href="/register" className="flex items-center gap-x-1.5 hover:opacity-80" title="Регистрация">
                  <FaUserPlus />
                  <span className="max-md:hidden">Регистрация</span>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout} className="flex items-center gap-x-1.5 hover:opacity-80" title="Выйти">
                <FaRegUser />
                <span className="max-md:hidden">Выйти</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HeaderTop;
