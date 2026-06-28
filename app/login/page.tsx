"use client";
import { CustomButton } from "@/components";
import TelegramLoginButton from "@/components/TelegramLoginButton";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const hasGoogle = !!(process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true");

  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      setError("Ваша сессия истекла. Пожалуйста, войдите снова.");
      toast.error("Ваша сессия истекла. Пожалуйста, войдите снова.");
    }
    if (sessionStatus === "authenticated") router.replace("/");
  }, [sessionStatus, router, searchParams]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmailAddressFormat(email)) {
      setError("Неверный формат email");
      toast.error("Неверный формат email");
      return;
    }
    if (!password || password.length < 8) {
      setError("Пароль слишком короткий");
      toast.error("Пароль слишком короткий");
      return;
    }

    const res = await signIn("credentials", { redirect: false, email, password });
    if (res?.error) {
      const msg = res.error.includes("google_account")
        ? "Этот аккаунт создан через Google. Войдите через кнопку «Войти через Google»."
        : "Неверный email или пароль";
      setError(msg);
      toast.error(msg);
    } else {
      setError("");
      toast.success("Вы успешно вошли");
      router.replace("/");
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Войдите в аккаунт</h1>
          <p className="text-sm text-gray-500 mt-2">
            Нет аккаунта?{" "}
            <a href="/register" className="text-brand font-semibold hover:underline">
              Зарегистрироваться
            </a>
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10">
          {/* Email form */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Пароль
                </label>
                <a href="/forgot-password" className="text-xs text-brand hover:underline font-medium">
                  Забыли пароль?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Минимум 8 символов"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand text-white font-bold text-sm tracking-wide hover:bg-brand-dark transition-all active:scale-95"
            >
              Войти
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">или войдите через</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-3">
            {/* Telegram */}
            <TelegramLoginButton />

            {/* Google */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700"
            >
              <FcGoogle className="text-xl" />
              Войти через Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
