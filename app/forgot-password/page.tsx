"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Ошибка сервера");
      } else {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Восстановление пароля</h1>
          <p className="text-sm text-gray-500 mt-2">
            Вспомнили пароль?{" "}
            <Link href="/login" className="text-brand font-semibold hover:underline">
              Войти
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-10">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-4">📬</div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Письмо отправлено</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Если аккаунт с адресом <strong>{email}</strong> существует, мы отправили ссылку для сброса пароля.
                Проверьте папку Спам, если письмо не пришло.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block text-sm text-brand font-semibold hover:underline"
              >
                ← Вернуться ко входу
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <p className="text-sm text-gray-500 leading-relaxed">
                Введите ваш email и мы отправим ссылку для сброса пароля.
              </p>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                {loading ? "Отправка..." : "Отправить ссылку"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
