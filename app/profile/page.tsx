"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaRegUser, FaLock, FaTrash, FaCamera } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const isAdmin = (session?.user as any)?.role === "admin";
  const fileRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status]);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setEmail(data.email || "");
        setName(data.name || "");
        setImageUrl(data.image || "");
        setPreviewUrl(data.image || "");
      }
    };
    if (session) loadProfile();
  }, [session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Файл не должен превышать 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      setImageUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Новые пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, image: imageUrl, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Ошибка обновления");
      } else {
        toast.success("Профиль обновлён");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        await update({ email: data.email, name: data.name, image: data.image });
      }
    } catch {
      toast.error("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      if (res.ok) {
        toast.success("Аккаунт удалён");
        await signOut({ callbackUrl: "/" });
      } else {
        const data = await res.json();
        toast.error(data.error || "Ошибка удаления");
      }
    } catch {
      toast.error("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div className="flex justify-center py-20 text-gray-500">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand py-10">
        <h1 className="text-center text-3xl font-bold text-white">Мой профиль</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-y-6">

        {/* Карточка профиля */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-x-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-brand flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <FaRegUser className="text-white text-3xl" />
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-xl font-bold text-gray-800">{name || session?.user?.email}</p>
            {name && <p className="text-sm text-gray-500">{session?.user?.email}</p>}
            <span className={`text-xs px-3 py-1 rounded-full w-fit mt-1 ${isAdmin ? "bg-brand text-white" : "bg-gray-100 text-gray-600"}`}>
              {isAdmin ? "Администратор" : "Пользователь"}
            </span>
          </div>
          {isAdmin && (
            <Link href="/admin" className="ml-auto flex items-center gap-x-2 bg-brand text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-dark">
              <MdDashboard />
              Панель управления
            </Link>
          )}
        </div>

        {/* Форма */}
        <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-y-5">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-x-2">
            <FaRegUser className="text-brand" />
            Редактировать данные
          </h2>

          {/* Фото */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фото профиля <span className="text-gray-400 font-normal">(необязательно)</span>
            </label>
            <div className="flex items-center gap-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <FaCamera className="text-gray-400 text-xl" />
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <button type="button" onClick={() => fileRef.current?.click()} className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium">
                  Загрузить фото
                </button>
                {previewUrl && (
                  <button type="button" onClick={() => { setPreviewUrl(""); setImageUrl(""); }} className="text-sm text-red-500 hover:underline">
                    Удалить фото
                  </button>
                )}
                <p className="text-xs text-gray-400">JPG, PNG до 2MB</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          {/* ФИО */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ФИО <span className="text-gray-400 font-normal">(необязательно)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иванов Иван Иванович"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* Пароль */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-x-2">
              <FaLock className="text-brand" />
              Сменить пароль <span className="text-gray-400 font-normal">(необязательно)</span>
            </p>
            <div className="flex flex-col gap-y-3">
              <input type="password" placeholder="Текущий пароль" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              <input type="password" placeholder="Новый пароль" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              <input type="password" placeholder="Повторите новый пароль" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="bg-brand text-white font-semibold py-3 rounded-lg hover:bg-brand-dark disabled:opacity-50">
            {loading ? "Сохраняем..." : "Сохранить изменения"}
          </button>
        </form>

        {/* Удалить */}
        <div className="bg-white rounded-2xl shadow p-6 border border-red-100">
          <h2 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-x-2">
            <FaTrash />
            Удалить аккаунт
          </h2>
          <p className="text-sm text-gray-500 mb-4">Это действие необратимо. Все данные будут удалены.</p>
          {!showDelete ? (
            <button onClick={() => setShowDelete(true)} className="border border-red-500 text-red-500 px-6 py-2 rounded-lg hover:bg-red-50 text-sm font-semibold">
              Удалить мой аккаунт
            </button>
          ) : (
            <div className="flex gap-x-3">
              <button onClick={handleDelete} disabled={loading} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 text-sm font-semibold disabled:opacity-50">
                Да, удалить
              </button>
              <button onClick={() => setShowDelete(false)} className="border border-gray-300 px-6 py-2 rounded-lg text-sm font-semibold">
                Отмена
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
