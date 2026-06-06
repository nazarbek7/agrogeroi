"use client";
import { DashboardSidebar } from "@/components";
import apiClient from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NewVacancyPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Полная занятость");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title || !description) {
      toast.error("Заполните название и описание");
      return;
    }
    setSaving(true);
    try {
      const req = await requirements.split("\n").map(r => r.trim()).filter(Boolean);
      const res = await apiClient.post("/api/vacancies", {
        title, type, description, requirements: req, isActive,
      });
      if (res.ok) {
        toast.success("Вакансия добавлена");
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

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-6 xl:ml-5 w-full max-xl:px-5 pt-6 pr-6 max-w-2xl">
        <h1 className="text-3xl font-semibold">Новая вакансия</h1>

        <label className="form-control w-full">
          <div className="label"><span className="label-text">Название должности:</span></div>
          <input type="text" className="input input-bordered w-full" value={title} onChange={e => setTitle(e.target.value)} placeholder="Агроном" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label"><span className="label-text">Тип занятости:</span></div>
          <select className="select select-bordered" value={type} onChange={e => setType(e.target.value)}>
            <option>Полная занятость</option>
            <option>Частичная занятость</option>
            <option>Стажировка</option>
            <option>Удалённая работа</option>
          </select>
        </label>

        <label className="form-control w-full">
          <div className="label"><span className="label-text">Описание обязанностей:</span></div>
          <textarea className="textarea textarea-bordered h-28" value={description} onChange={e => setDescription(e.target.value)} placeholder="Опишите обязанности..." />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Требования (каждое с новой строки):</span>
          </div>
          <textarea className="textarea textarea-bordered h-24" value={requirements} onChange={e => setRequirements(e.target.value)} placeholder={"Опыт работы от 1 года\nЗнание видов растений\nОтветственность"} />
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="checkbox checkbox-success" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
          <span className="label-text font-medium">Опубликовать сразу</span>
        </label>

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="bg-brand text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50">
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          <button onClick={() => router.back()} className="px-8 py-3 rounded-lg border border-gray-300 font-semibold hover:bg-gray-50">
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
