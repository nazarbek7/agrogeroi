"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import HeaderTop from "./HeaderTop";
import SearchInput from "./SearchInput";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import apiClient from "@/lib/api";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import CartElement from "./CartElement";
import HeartElement from "./HeartElement";
import NotificationBell from "./NotificationBell";
import { MdDashboard } from "react-icons/md";

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();
  const isAdmin = (session?.user as any)?.role === "admin";

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Вы вышли из системы");
  };

  const getWishlistByUserId = async (id: string) => {
    return; // temporary disabled
  };

  const getUserByEmail = async () => {
    if (session?.user?.email) {
      apiClient
        .get(`/api/users/email/${session?.user?.email}`, { cache: "no-store" })
        .then((response) => response.json())
        .then((data) => { getWishlistByUserId(data?.id); });
    }
  };

  useEffect(() => {
    getUserByEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email, wishlist.length]);

  return (
    <header className="bg-white">
      <HeaderTop />

      {/* Обычный хедер (не /admin) */}
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
            {/* Кнопка админки — только для admin */}
            {session && isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-x-1 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark"
              >
                <MdDashboard className="text-lg" />
                Кабинет
              </Link>
            )}
            <NotificationBell />
            <HeartElement wishQuantity={wishQuantity} />
            <CartElement />
          </div>
        </div>
      )}

      {/* Хедер для /admin страниц */}
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
            <span className="text-sm text-gray-500">{session?.user?.email}</span>
            <NotificationBell />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="w-9 h-9 rounded-full overflow-hidden cursor-pointer">
                <Image
                  src="/randomuser.jpg"
                  alt="profile"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link href="/admin">Панель управления</Link></li>
                <li><Link href="/">На сайт</Link></li>
                <li onClick={handleLogout}><a href="#">Выйти</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
