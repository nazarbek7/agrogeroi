"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditVacancyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [requirementsText, setRequirementsText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiClient.get(`/api/vacancies/${id}`).then(r => r.json()).then(data => {
      setVacancy(data);
      setRequirementsText((data.requirements || []).join("\n"));
    });
  }, [id]);

  const handleSave = async () => {
    if (!vacancy) return;
    setSaving(true);
    try {
      const requirements = requirementsText.split("\n").map(r => r.trim()).filter(Boolean);
      const res = await apiClient.put(`/api/vacancies/${id}`, { ...vacancy, requirements });
      if (res.ok) {
        toast.success("Вакансия обновлена");
        router.push("/admin/vacancies");
      } else {
        toast.error("Ошибка сохранения");
      }
    } catch {
      toast.error("Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить вакансию?")) return;
    await apiClient.delete(`/api/vacancies/${id}`);
    toast.success("Удалено");
    router.push("/admin/vacancies");
  };

  if (!vacancy) return <div className="p-10 text-gray-400">Загрузка...</div>;

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 xl:ml-5 w-full max-xl:px-5 pt-6 pr-6 max-w-2xl">
        <h1 className="text-3xl font-semibold">Редактировать вакансию</h1>

        <label className="form-control w-full">
          <div className="label"><span className="label-text">Название должности:</span></div>
          <input type="text" className="input input-bordered w-full" value={vacancy.title} onChange={e => setVacancy({ ...vacancy, title: e.target.value })} />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"><span className="label-text">Тип занятости:</span></div>
          <select className="select select-bordered" value={vacancy.type} onChange={e => setVacancy({ ...vacancy, type: e.target.value })}>
            <option>Полная занятость</option>
            <option>Частичная занятость</option>
            <option>Стажировка</option>
            <option>Удалённая работа</option>
          </select>
        </label>

        <label className="form-control w-full">
          <div className="label"><span className="label-text">Описание:</span></div>
          <textarea className="textarea textarea-bordered h-28" value={vacancy.description} onChange={e => setVacancy({ ...vacancy, description: e.target.value })} />
        </label>

        <label className="form-control w-full">
          <div className="label"><span className="label-text">Требования (каждое с новой строки):</span></div>
          <textarea className="textarea textarea-bordered h-24" value={requirementsText} onChange={e => setRequirementsText(e.target.value)} />
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="checkbox checkbox-success" checked={vacancy.isActive} onChange={e => setVacancy({ ...vacancy, isActive: e.target.checked })} />
          <span className="label-text font-medium">Опубликована (видна на сайте)</span>
        </label>

        <div className="flex gap-3 flex-wrap">
          <button onClick={handleSave} disabled={saving} className="bg-brand text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50">
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          <button onClick={() => router.back()} className="px-8 py-3 rounded-lg border border-gray-300 font-semibold hover:bg-gray-50">
            Отмена
          </button>
          <button onClick={handleDelete} className="px-8 py-3 rounded-lg border border-red-200 text-red-500 font-semibold hover:bg-red-50 ml-auto">
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
