"use client";

import React from "react";
import { MdDashboard, MdCategory, MdSettings } from "react-icons/md";
import { FaTable, FaRegUser, FaBagShopping, FaStore, FaUpload, FaBriefcase, FaTag } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const links = [
  { href: "/admin",             label: "Дашборд",           icon: MdDashboard,   exact: true },
  { href: "/admin/orders",      label: "Заказы",            icon: FaBagShopping, exact: false },
  { href: "/admin/products",    label: "Товары",            icon: FaTable,       exact: false },
  { href: "/admin/bulk-upload", label: "Массовая загрузка", icon: FaUpload,      exact: false },
  { href: "/admin/categories",  label: "Категории",         icon: MdCategory,    exact: false },
  { href: "/admin/users",       label: "Пользователи",      icon: FaRegUser,     exact: false },
  { href: "/admin/merchant",    label: "Продавцы",          icon: FaStore,       exact: false },
  { href: "/admin/sale",        label: "Акции",             icon: FaTag,         exact: false },
  { href: "/admin/vacancies",   label: "Вакансии",          icon: FaBriefcase,   exact: false },
  { href: "/admin/settings",    label: "Настройки",         icon: MdSettings,    exact: false },
];

const DashboardSidebar = () => {
  const pathname = usePathname();
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-60 shrink-0 bg-gray-900 min-h-screen flex flex-col max-xl:w-full max-xl:min-h-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/agrogeroi_logo.svg" width={32} height={32} alt="logo" className="h-8 w-auto brightness-0 invert" />
          <span className="text-white font-bold text-sm tracking-wide">Agrogeroi</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1 max-xl:flex-row max-xl:flex-wrap">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-brand text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`text-base flex-shrink-0 ${active ? "text-white" : "text-gray-500"}`} />
              <span className="max-xl:hidden">{label}</span>
              <span className="hidden max-xl:block text-xs">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 max-xl:hidden">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <span className="text-base">🌐</span>
          <span>На сайт</span>
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
