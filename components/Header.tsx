"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import HeaderTop from "./HeaderTop";
import SearchInput from "./SearchInput";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import CartElement from "./CartElement";
import HeartElement from "./HeartElement";
import NotificationBell from "./NotificationBell";
import { MdDashboard } from "react-icons/md";
import { FaRegUser, FaPen } from "react-icons/fa6";

const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();
  const isAdmin = (session?.user as any)?.role === "admin";

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
      <div tabIndex={0} role="button" className="flex items-center gap-x-2 cursor-pointer">
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-brand bg-brand flex items-center justify-center">
          {userImage ? (
            <img src={userImage} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <FaRegUser className="text-white text-sm" />
          )}
        </div>
      </div>
      <div tabIndex={0} className="dropdown-content z-50 shadow-xl bg-white rounded-xl w-64 mt-2 border border-gray-100">
        {/* Шапка профиля */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-brand flex items-center justify-center">
              {userImage ? (
                <img src={userImage} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <FaRegUser className="text-white" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">
                {session?.user?.email}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full w-fit mt-0.5 ${isAdmin ? "bg-brand text-white" : "bg-gray-100 text-gray-600"}`}>
                {isAdmin ? "Администратор" : "Пользователь"}
              </span>
            </div>
          </div>
        </div>

        {/* Меню */}
        <ul className="py-1">
          {isAdmin && (
            <li>
              <Link href="/admin" className="flex items-center gap-x-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700">
                <MdDashboard className="text-brand text-lg" />
                Панель управления
              </Link>
            </li>
          )}
          <li>
            <Link href="/profile" className="flex items-center gap-x-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700">
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
        <div className="h-32 bg-white flex items-center justify-between px-16 max-[1320px]:px-16 max-md:px-6 max-lg:flex-col max-lg:gap-y-7 max-lg:justify-center max-lg:h-60 max-w-screen-2xl mx-auto">
          <Link href="/">
            <Image
              src="/agrogeroi_logo.svg"
              width={300}
              height={300}
              alt="Agrogeroi logo"
              className="relative right-5 max-[1023px]:w-56"
            />
          </Link>
          <SearchInput />
          <div className="flex gap-x-6 items-center">
            <NotificationBell />
            <HeartElement wishQuantity={wishQuantity} />
            <CartElement />
            {session && <ProfileDropdown />}
          </div>
        </div>
      )}

      {/* Хедер для /admin */}
      {pathname.startsWith("/admin") && (
        <div className="flex justify-between h-20 bg-white items-center px-16 max-[1320px]:px-10 max-w-screen-2xl mx-auto max-[400px]:px-5 border-b">
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
