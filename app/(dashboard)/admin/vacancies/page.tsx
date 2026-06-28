"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminVacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVacancies = async () => {
    try {
      const res = await apiClient.get("/api/vacancies?mode=admin");
      const data = await res.json();
      setVacancies(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (v: Vacancy) => {
    try {
      await apiClient.put(`/api/vacancies/${v.id}`, { isActive: !v.isActive });
      toast.success(v.isActive ? "Скрыто" : "Опубликовано");
      fetchVacancies();
    } catch {
      toast.error("Ошибка");
    }
  };

  const deleteVacancy = async (id: string) => {
    if (!confirm("Удалить вакансию?")) return;
    try {
      await apiClient.delete(`/api/vacancies/${id}`);
      toast.success("Вакансия удалена");
      fetchVacancies();
    } catch {
      toast.error("Ошибка удаления");
    }
  };

  useEffect(() => { fetchVacancies(); }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col gap-y-6 w-full max-xl:px-5 pt-6 pr-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Вакансии</h1>
          <Link href="/admin/vacancies/new" className="bg-brand text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90">
            + Добавить вакансию
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400">Загрузка...</p>
        ) : vacancies.length === 0 ? (
          <p className="text-gray-400">Вакансий пока нет.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {vacancies.map((v) => (
              <div key={v.id} className="border border-gray-200 rounded-xl p-5 flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-gray-800">{v.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${v.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {v.isActive ? "Активна" : "Скрыта"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{v.type}</p>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{v.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/admin/vacancies/${v.id}`} className="px-3 py-1.5 text-sm border border-brand text-brand rounded-lg hover:bg-brand hover:text-white transition">
                    Изменить
                  </Link>
                  <button onClick={() => toggleActive(v)} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    {v.isActive ? "Скрыть" : "Показать"}
                  </button>
                  <button onClick={() => deleteVacancy(v.id)} className="px-3 py-1.5 text-sm border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition">
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
