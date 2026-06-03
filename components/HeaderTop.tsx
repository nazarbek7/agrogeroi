"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaHeadphones, FaRegEnvelope, FaRegUser } from "react-icons/fa6";
import { FaWhatsapp, FaTelegram } from "react-icons/fa";

const HeaderTop = () => {
  const { data: session }: any = useSession();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Вы вышли из системы");
  };

  return (
    <div className="h-10 text-white bg-brand max-lg:px-5 max-lg:h-16 max-[573px]:px-0">
      <div className="flex justify-between h-full max-lg:flex-col max-lg:justify-center max-lg:items-center max-w-screen-2xl mx-auto px-12 max-[573px]:px-0">
        <ul className="flex items-center h-full gap-x-5 max-[370px]:text-sm max-[370px]:gap-x-2">
          <li className="flex items-center gap-x-2 font-semibold">
            <FaHeadphones className="text-white" />
            <span>+996 708 00 00 08</span>
          </li>
          <li className="flex items-center gap-x-2 font-semibold">
            <a href="https://wa.me/996708000008" target="_blank" rel="noopener noreferrer" className="flex items-center gap-x-1 hover:opacity-80">
              <FaWhatsapp className="text-white text-lg" />
              <span>WhatsApp</span>
            </a>
          </li>
          <li className="flex items-center gap-x-2 font-semibold">
            <a href="https://t.me/agrogeroi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-x-1 hover:opacity-80">
              <FaTelegram className="text-white text-lg" />
              <span>Telegram</span>
            </a>
          </li>
        </ul>
        <ul className="flex items-center gap-x-5 h-full max-[370px]:text-sm max-[370px]:gap-x-2 font-semibold">
          {!session ? (
            <>
              <li className="flex items-center">
                <Link href="/login" className="flex items-center gap-x-2 font-semibold">
                  <FaRegUser className="text-white" />
                  <span>Войти</span>
                </Link>
              </li>
              <li className="flex items-center">
                <Link href="/register" className="flex items-center gap-x-2 font-semibold">
                  <FaRegUser className="text-white" />
                  <span>Регистрация</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <span className="ml-10 text-base">{session.user?.email}</span>
              <li className="flex items-center">
                <button onClick={() => handleLogout()} className="flex items-center gap-x-2 font-semibold">
                  <FaRegUser className="text-white" />
                  <span>Выйти</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HeaderTop;
