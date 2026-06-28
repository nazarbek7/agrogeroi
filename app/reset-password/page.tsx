"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-500 text-sm">Неверная ссылка для сброса пароля.</p>
        <Link href="/login" className="mt-4 inline-block text-brand text-sm font-semibold hover:underline">
          ← Ко входу
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Пароль минимум 8 символов"); return; }
    if (password !== confirm) { setError("Пароли не совпадают"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Ошибка сервера");
      } else {
        setDone(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Пароль изменён</h2>
        <p className="text-sm text-gray-500">Перенаправляем вас на страницу входа...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <p className="text-sm text-gray-500">Введите новый пароль для вашего аккаунта.</p>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Новый пароль</label>
        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Минимум 8 символов"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Повторите пароль</label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Повторите пароль"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-brand text-white font-bold text-sm tracking-wide hover:bg-brand-dark transition-all active:scale-95 disabled:opacity-60"
      >
        {loading ? "Сохранение..." : "Сохранить пароль"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Новый пароль</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10">
          <Suspense fallback={<div className="text-center text-sm text-gray-400">Загрузка...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
