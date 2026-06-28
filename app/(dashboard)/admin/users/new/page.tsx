"use client";
import { DashboardSidebar } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { sanitizeFormData } from "@/lib/form-sanitize";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const DashboardCreateNewUser = () => {
  const router = useRouter();
  const [userInput, setUserInput] = useState({ email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputCls = "w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white";
  const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5";

  const addNewUser = async () => {
    if (!userInput.email || !userInput.password) {
      toast.error("Заполните все поля"); return;
    }
    if (!isValidEmailAddressFormat(userInput.email)) {
      toast.error("Неверный формат email"); return;
    }
    if (userInput.password.length < 8) {
      toast.error("Пароль минимум 8 символов"); return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizeFormData(userInput)),
      });
      if (res.status === 201) {
        toast.success("Пользователь создан!");
        router.push("/admin/users");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Ошибка создания пользователя");
      }
    } catch {
      toast.error("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-6 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={() => router.back()}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-800 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Новый пользователь</h1>
        </div>

        <div className="max-w-lg">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100">Данные пользователя</h2>

            <div>
              <label className={labelCls}>Email</label>
              <input type="email" className={inputCls}
                placeholder="user@example.com"
                value={userInput.email}
                onChange={(e) => setUserInput({ ...userInput, email: e.target.value })} />
            </div>

            <div>
              <label className={labelCls}>Пароль</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} className={inputCls + " pr-11"}
                  placeholder="Минимум 8 символов"
                  value={userInput.password}
                  onChange={(e) => setUserInput({ ...userInput, password: e.target.value })} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelCls}>Роль</label>
              <select className={inputCls} value={userInput.role}
                onChange={(e) => setUserInput({ ...userInput, role: e.target.value })}>
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
                <option value="merchant">Продавец</option>
              </select>
            </div>

            <button type="button" onClick={addNewUser} disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1">
              {loading ? "Создание..." : "Создать пользователя"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateNewUser;
