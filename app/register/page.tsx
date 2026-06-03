"use client";
import { SectionTitle } from "@/components";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa6";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (sessionStatus === "authenticated") router.replace("/");
  }, [sessionStatus, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Файл не должен превышать 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) { setError("Неверный формат email"); toast.error("Неверный формат email"); return; }
    if (!password || password.length < 8) { setError("Пароль минимум 8 символов"); toast.error("Пароль минимум 8 символов"); return; }
    if (confirmPassword !== password) { setError("Пароли не совпадают"); toast.error("Пароли не совпадают"); return; }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || null, image: imageBase64 || null }),
      });
      const data = await res.json();
      if (res.ok) {
        setError("");
        toast.success("Регистрация успешна");
        router.push("/login");
      } else {
        const msg = data.details?.map((e: any) => e.message).join(", ") || data.error || "Ошибка регистрации";
        setError(msg); toast.error(msg);
      }
    } catch {
      toast.error("Ошибка, попробуйте снова");
      setError("Ошибка, попробуйте снова");
    }
  };

  if (sessionStatus === "loading") return <h1>Загрузка...</h1>;

  return (
    <div className="bg-white">
      <SectionTitle title="Регистрация" path="Главная | Регистрация" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-normal leading-9 text-gray-900">
            Создайте аккаунт
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-5" onSubmit={handleSubmit}>

              {/* Фото */}
              <div className="flex flex-col items-center gap-y-2">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-brand transition"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FaCamera className="text-gray-400 text-2xl" />
                  )}
                </div>
                <p className="text-xs text-gray-400">Фото профиля (необязательно, до 2MB)</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>

              {/* ФИО */}
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  ФИО <span className="text-gray-400">(необязательно)</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иванов Иван Иванович"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                <div className="mt-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Пароль */}
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Пароль</label>
                <div className="mt-2">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Повторите пароль */}
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Повторите пароль</label>
                <div className="mt-2">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full uppercase bg-brand py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-dark focus:outline-none"
              >
                Зарегистрироваться
              </button>

              {error && <p className="text-red-600 text-center text-sm">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
