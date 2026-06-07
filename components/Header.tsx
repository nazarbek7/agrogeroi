"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaPen, FaRegUser } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import CartElement from "./CartElement";
import HeaderTop from "./HeaderTop";
import HeartElement from "./HeartElement";
import NotificationBell from "./NotificationBell";
import SearchInput from "./SearchInput";

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();
  const role = (session?.user as any)?.role;
  const isAdmin = role === "admin";
  const isMerchant = role === "merchant";

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Вы вышли из системы");
  };

  useEffect(() => {
    // wishlist fetch disabled temporarily
  }, [session?.user?.email, wishlist.length]);

  const userImage = (session?.user as any)?.image;

  // Дропдаун профиля — показывается в обоих хедерах
  const ProfileDropdown = () => (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="flex items-center gap-x-2 cursor-pointer"
      >
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-brand bg-brand flex items-center justify-center">
          {userImage ? (
            <Image
              src={userImage}
              alt="profile"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaRegUser className="text-white text-sm" />
          )}
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-50 shadow-xl bg-white rounded-xl w-64 mt-2 border border-gray-100"
      >
        {/* Шапка профиля */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-brand flex items-center justify-center">
              {userImage ? (
                <Image
                  src={userImage}
                  alt="profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaRegUser className="text-white" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">
                {session?.user?.email}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full w-fit mt-0.5 ${isAdmin ? "bg-brand text-white" : "bg-gray-100 text-gray-600"}`}
              >
                {isAdmin ? "Администратор" : "Пользователь"}
              </span>
            </div>
          </div>
        </div>

        {/* Меню */}
        <ul className="py-1">
          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-x-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700"
              >
                <MdDashboard className="text-brand text-lg" />
                Панель управления
              </Link>
            </li>
          )}
          {isMerchant && (
            <li>
              <Link
                href="/merchant"
                className="flex items-center gap-x-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700"
              >
                <MdDashboard className="text-brand text-lg" />
                Панель продавца
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/profile"
              className="flex items-center gap-x-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700"
            >
              <FaPen className="text-brand text-sm" />
              Редактировать профиль
            </Link>
          </li>
          <li className="border-t border-gray-100 mt-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-x-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-red-500 w-full text-left"
            >
              <FaRegUser className="text-sm" />
              Выйти
            </button>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <header className="bg-white">
      <HeaderTop />

      {/* Обычный хедер */}
      {!pathname.startsWith("/admin") && (
        <>
          <div className="bg-white max-w-screen-2xl mx-auto px-16 max-[1320px]:px-10 max-md:px-4 py-3">
            {/* Строка 1: лого + (поиск на десктопе) + иконки */}
            <div className="flex items-center justify-between gap-x-4">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/agrogeroi_logo.svg"
                  width={200}
                  height={200}
                  alt="Agrogeroi logo"
                  className="h-12 w-auto max-md:h-9"
                />
              </Link>

              {/* Поиск — только на десктопе в этой строке */}
              <div className="flex-1 mx-6 hidden lg:block">
                <SearchInput />
              </div>

              {/* Иконки — всегда */}
              <div className="flex gap-x-4 max-md:gap-x-3 items-center flex-shrink-0">
                <NotificationBell />
                <HeartElement wishQuantity={wishQuantity} />
                <CartElement />
                {session && <ProfileDropdown />}
              </div>
            </div>

            {/* Строка 2: поиск — только на мобильном */}
            <div className="mt-3 lg:hidden">
              <SearchInput />
            </div>
          </div>
          {/* Навигация */}
          <nav className="border-t border-b border-gray-100 bg-white shadow-sm">
            <div className="max-w-screen-2xl mx-auto px-16 max-[1320px]:px-10 max-md:px-6">
              <ul className="flex items-center gap-x-1 overflow-x-auto scrollbar-hide py-0">
                {[
                  { href: "/shop", label: "Каталог" },
                  { href: "/shop/Розы", label: "Розы" },
                  { href: "/shop/Гортензии", label: "Гортензии" },
                  { href: "/shop/Хвойные деревья и кустарники", label: "Хвойные" },
                  { href: "/shop/Плодовые деревья и кустарники", label: "Плодовые" },
                  { href: "/shop/Лиственные деревья", label: "Деревья" },
                  { href: "/shop/Лианы", label: "Лианы" },
                  { href: "/contacts", label: "Контакты" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`block px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                        pathname === href
                          ? "text-brand border-brand"
                          : "text-gray-600 border-transparent hover:text-brand hover:border-brand"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </>
      )}

      {/* Хедер для /admin */}
      {pathname.startsWith("/admin") && (
        <div className="flex justify-between h-16 bg-white items-center px-16 max-[1320px]:px-10 max-w-screen-2xl mx-auto max-[400px]:px-5 border-b-2 border-brand/20 shadow-sm">
          <Link href="/">
            <Image
              src="/agrogeroi_logo.svg"
              width={110}
              height={110}
              alt="Agrogeroi logo"
              className="h-auto"
            />
          </Link>
          <div className="flex gap-x-4 items-center">
            <NotificationBell />
            <ProfileDropdown />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
