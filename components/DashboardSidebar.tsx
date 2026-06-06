"use client";

import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaTable } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { FaStore } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin",             label: "Панель управления", icon: MdDashboard,   exact: true },
  { href: "/admin/orders",      label: "Заказы",            icon: FaBagShopping, exact: false },
  { href: "/admin/products",    label: "Товары",            icon: FaTable,       exact: false },
  { href: "/admin/bulk-upload", label: "Массовая загрузка", icon: FaFileUpload,  exact: false },
  { href: "/admin/categories",  label: "Категории",         icon: MdCategory,    exact: false },
  { href: "/admin/users",       label: "Пользователи",      icon: FaRegUser,     exact: false },
  { href: "/admin/merchant",    label: "Продавцы",          icon: FaStore,       exact: false },
  { href: "/admin/settings",    label: "Настройки",         icon: MdSettings,    exact: false },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="xl:w-[400px] bg-brand h-full max-xl:w-full">
      {links.map(({ href, label, icon: Icon, exact }) => (
        <Link key={href} href={href}>
          <div
            className={`flex gap-x-2 w-full cursor-pointer items-center py-6 pl-5 text-xl text-white transition-colors ${
              isActive(href, exact) ? "bg-brand-dark" : "hover:bg-brand-dark"
            }`}
          >
            <Icon className="text-2xl" />
            <span className="font-normal">{label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DashboardSidebar;
