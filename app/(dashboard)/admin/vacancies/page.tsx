"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa6";

export default function AdminVacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVacancies = async () => {
    try {
      const res = await apiClient.get("/api/vacancies?mode=admin");
      const data = await res.json();
      setVacancies(Array.isArray(data) ? data : []);
    } catch { toast.error("Ошибка загрузки"); }
    finally { setLoading(false); }
  };

  const toggleActive = async (v: Vacancy) => {
    try {
      await apiClient.put(`/api/vacancies/${v.id}`, { isActive: !v.isActive });
      toast.success(v.isActive ? "Скрыто" : "Опубликовано");
      fetchVacancies();
    } catch { toast.error("Ошибка"); }
  };

  const deleteVacancy = async (id: string) => {
    if (!confirm("Удалить вакансию?")) return;
    try {
      await apiClient.delete(`/api/vacancies/${id}`);
      toast.success("Вакансия удалена");
      fetchVacancies();
    } catch { toast.error("Ошибка удаления"); }
  };

  useEffect(() => { fetchVacancies(); }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Вакансии</h1>
            <p className="text-sm text-gray-500 mt-0.5">{vacancies.length} вакансий</p>
          </div>
          <Link
            href="/admin/vacancies/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-all"
          >
            <FaPlus className="text-xs" /> Добавить вакансию
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : vacancies.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-gray-400 text-sm">Вакансий пока нет</p>
            <Link href="/admin/vacancies/new" className="text-brand text-sm font-semibold hover:underline">
              Добавить первую вакансию →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {vacancies.map((v) => (
              <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-gray-900">{v.title}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${v.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {v.isActive ? "Активна" : "Скрыта"}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{v.type}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{v.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link href={`/admin/vacancies/${v.id}`} className="px-3 py-1.5 text-xs font-semibold border border-brand text-brand rounded-xl hover:bg-brand hover:text-white transition">
                    Изменить
                  </Link>
                  <button onClick={() => toggleActive(v)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-1.5 text-gray-600">
                    {v.isActive ? <><FaEyeSlash className="text-[10px]" /> Скрыть</> : <><FaEye className="text-[10px]" /> Показать</>}
                  </button>
                  <button onClick={() => deleteVacancy(v.id)} className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition flex items-center gap-1.5">
                    <FaTrash className="text-[10px]" /> Удалить
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
