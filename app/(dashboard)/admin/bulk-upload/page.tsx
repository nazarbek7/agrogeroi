"use client";
import { DashboardSidebar } from "@/components";
import BulkUploadHistory from "@/components/BulkUploadHistory";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { FaFileUpload, FaDownload, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface UploadResult {
  success: boolean;
  message: string;
  details?: {
    processed: number;
    successful: number;
    failed: number;
    errors?: string[];
  };
}

const BulkUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const f = e.dataTransfer.files[0];
      if (f.type === "text/csv" || f.name.endsWith(".csv")) {
        setFile(f);
        setUploadResult(null);
      } else {
        toast.error("Пожалуйста, загрузите CSV файл");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      if (f.type === "text/csv" || f.name.endsWith(".csv")) {
        setFile(f);
        setUploadResult(null);
      } else {
        toast.error("Пожалуйста, загрузите CSV файл");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Сначала выберите CSV файл");
      return;
    }
    setUploading(true);
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/bulk-upload", { method: "POST", body: formData });
      const data = await response.json();
      if (response.ok) {
        setUploadResult({ success: true, message: data.message || "Товары успешно загружены!", details: data.details });
        toast.success("Массовая загрузка завершена!");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setUploadResult({ success: false, message: data.error || "Ошибка загрузки", details: data.details });
        toast.error(data.error || "Ошибка загрузки");
      }
    } catch {
      setUploadResult({ success: false, message: "Ошибка сети при загрузке" });
      toast.error("Ошибка сети");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = `title,price,manufacturer,inStock,mainImage,description,slug,categoryId
Пример товара,999,Производитель,10,https://example.com/image.jpg,Описание товара,primer-tovara,category-uuid`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shablom-tovarov.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Шаблон скачан!");
  };

  return (
    <div className="flex xl:flex-row flex-col justify-start items-start xl:h-[calc(100vh-64px)] overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 w-full xl:px-10 xl:py-8 p-4 overflow-y-auto h-full">
        <h1 className="text-4xl font-bold mb-8">Массовая загрузка товаров</h1>

        {/* Инструкции */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-800">📋 Инструкции</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
            <li>Скачайте шаблон CSV ниже</li>
            <li>Заполните данные товаров (название, цена, производитель, наличие, изображение, описание, slug, categoryId)</li>
            <li>Загрузите заполненный CSV файл</li>
            <li>Максимальный размер файла: 5МБ</li>
          </ul>
        </div>

        {/* Кнопка скачать шаблон */}
        <div className="mb-6">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <FaDownload /> Скачать шаблон CSV
          </button>
        </div>

        {/* Зона загрузки */}
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FaFileUpload className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-lg mb-2">
              {file ? (
                <span className="font-semibold text-brand">
                  Выбран: {file.name} ({(file.size / 1024).toFixed(2)} КБ)
                </span>
              ) : (
                "Перетащите CSV файл сюда или нажмите для выбора"
              )}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block bg-brand hover:bg-brand-dark text-white font-bold py-2 px-6 rounded cursor-pointer transition-colors"
            >
              Выбрать CSV файл
            </label>
          </div>
        </div>

        {/* Кнопка загрузить */}
        {file && (
          <div className="mb-6">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full py-4 px-6 rounded-lg font-bold text-white text-lg transition-colors ${
                uploading ? "bg-gray-400 cursor-not-allowed" : "bg-brand hover:bg-brand-dark"
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Загрузка...
                </span>
              ) : "Загрузить товары"}
            </button>
          </div>
        )}

        {/* Результат */}
        {uploadResult && (
          <div className={`border-l-4 p-6 rounded-lg ${uploadResult.success ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}>
            <div className="flex items-start gap-3">
              {uploadResult.success
                ? <FaCheckCircle className="text-3xl text-green-500 flex-shrink-0 mt-1" />
                : <FaTimesCircle className="text-3xl text-red-500 flex-shrink-0 mt-1" />}
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${uploadResult.success ? "text-green-800" : "text-red-800"}`}>
                  {uploadResult.success ? "✅ Загрузка успешна!" : "❌ Ошибка загрузки"}
                </h3>
                <p className={`mb-3 ${uploadResult.success ? "text-brand" : "text-red-700"}`}>
                  {uploadResult.message}
                </p>
                {uploadResult.details && (
                  <div className="bg-white rounded p-4 space-y-2">
                    <p className="font-semibold">Статистика загрузки:</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-brand">{uploadResult.details.processed}</p>
                        <p className="text-sm text-gray-600">Обработано</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{uploadResult.details.successful}</p>
                        <p className="text-sm text-gray-600">Успешно</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{uploadResult.details.failed}</p>
                        <p className="text-sm text-gray-600">Ошибок</p>
                      </div>
                    </div>
                    {uploadResult.details.errors && uploadResult.details.errors.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold text-red-700 mb-2">Ошибки:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-600 max-h-40 overflow-y-auto">
                          {uploadResult.details.errors.map((error, i) => <li key={i}>{error}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Формат CSV */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">📝 Формат CSV файла</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Колонка</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Обязательно</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Тип</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Описание</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["title", "✅ Да", "String", "Название товара"],
                  ["price", "✅ Да", "Number", "Цена товара (например, 999)"],
                  ["manufacturer", "✅ Да", "String", "Производитель / Бренд"],
                  ["inStock", "❌ Нет", "Number", "Количество на складе (по умолчанию: 0)"],
                  ["mainImage", "❌ Нет", "URL", "URL изображения товара"],
                  ["description", "✅ Да", "String", "Описание товара"],
                  ["slug", "✅ Да", "String", "URL-идентификатор"],
                  ["categoryId", "✅ Да", "UUID", "ID категории из базы данных"],
                ].map(([col, req, type, desc]) => (
                  <tr key={col}>
                    <td className="border border-gray-300 px-4 py-2 font-mono">{col}</td>
                    <td className="border border-gray-300 px-4 py-2">{req}</td>
                    <td className="border border-gray-300 px-4 py-2">{type}</td>
                    <td className="border border-gray-300 px-4 py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8">
          <BulkUploadHistory />
        </div>
      </div>
    </div>
  );
};

export default BulkUploadPage;
