"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle, FaClock, FaFileAlt, FaTrash, FaExclamationTriangle } from "react-icons/fa";

interface BatchHistory {
  id: string;
  fileName: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: string;
  uploadedBy: string;
  uploadedAt: string;
  errors?: string[];
}

const statusLabel: Record<string, string> = {
  COMPLETED: "Завершено",
  FAILED: "Ошибка",
  PARTIAL: "Частично",
  PENDING: "В обработке",
};

const BulkUploadHistory = () => {
  const [batches, setBatches] = useState<BatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingBatchId, setDeletingBatchId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<{ id: string; fileName: string } | null>(null);
  const [deleteProducts, setDeleteProducts] = useState(false);

  useEffect(() => { fetchBatchHistory(); }, []);

  const fetchBatchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bulk-upload");
      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches || []);
      } else {
        setError("Ошибка загрузки истории загрузок");
      }
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (batchId: string, fileName: string) => {
    setBatchToDelete({ id: batchId, fileName });
    setDeleteProducts(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!batchToDelete) return;
    setDeletingBatchId(batchToDelete.id);
    setShowDeleteModal(false);
    try {
      const response = await fetch(`/api/bulk-upload/${batchToDelete.id}?deleteProducts=${deleteProducts}`, { method: "DELETE" });
      const data = await response.json().catch(() => null);
      if (response.ok) {
        toast.success(deleteProducts ? "Партия и товары удалены!" : "Партия удалена (товары сохранены)");
        await fetchBatchHistory();
      } else {
        toast.error(data?.error || `Ошибка удаления (${response.status})`);
      }
    } catch {
      toast.error("Ошибка сети при удалении");
    } finally {
      setDeletingBatchId(null);
      setBatchToDelete(null);
      setDeleteProducts(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED": return <FaCheckCircle className="text-green-500 text-xl" />;
      case "FAILED":    return <FaTimesCircle className="text-red-500 text-xl" />;
      case "PARTIAL":   return <FaExclamationTriangle className="text-yellow-500 text-xl" />;
      case "PENDING":   return <FaClock className="text-brand text-xl" />;
      default:          return <FaFileAlt className="text-gray-500 text-xl" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return (
    <div className="flex-1 flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
  );

  if (batches.length === 0) return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
      <FaFileAlt className="text-4xl mx-auto mb-2 text-gray-400" />
      <p>История загрузок пуста</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">📜 История загрузок</h2>

      {showDeleteModal && batchToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-3xl" />
              <h3 className="text-xl font-bold">Удалить партию</h3>
            </div>
            <p className="text-gray-700 mb-4">Удалить <strong>{batchToDelete.fileName}</strong>?</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={deleteProducts} onChange={(e) => setDeleteProducts(e.target.checked)} className="mt-1" />
                <div className="text-sm">
                  <span className="font-semibold text-yellow-800">Также удалить все товары из этой партии</span>
                  <p className="text-yellow-700 text-xs mt-1">Внимание: товары, которые есть в заказах, удалить нельзя.</p>
                </div>
              </label>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setBatchToDelete(null); }} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Отмена</button>
              <button onClick={handleDeleteConfirm} className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold">
                {deleteProducts ? "Удалить партию и товары" : "Удалить только партию"}
              </button>
            </div>
          </div>
        </div>
      )}

      {batches.map((batch) => (
        <div key={batch.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(batch.status)}
              <div>
                <h3 className="font-semibold text-lg">{batch.fileName}</h3>
                <p className="text-sm text-gray-500">Загружено: {batch.uploadedBy} • {formatDate(batch.uploadedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                batch.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                batch.status === "FAILED" ? "bg-red-100 text-red-700" :
                batch.status === "PARTIAL" ? "bg-yellow-100 text-yellow-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {statusLabel[batch.status] ?? batch.status}
              </span>
              <button onClick={() => handleDeleteClick(batch.id, batch.fileName)} disabled={deletingBatchId === batch.id}
                className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50">
                {deletingBatchId === batch.id
                  ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                  : <FaTrash />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 rounded p-3 text-center">
              <p className="text-2xl font-bold text-gray-700">{batch.totalRecords}</p>
              <p className="text-xs text-gray-500">Всего</p>
            </div>
            <div className="bg-green-50 rounded p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{batch.successfulRecords}</p>
              <p className="text-xs text-gray-500">Успешно</p>
            </div>
            <div className="bg-red-50 rounded p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{batch.failedRecords}</p>
              <p className="text-xs text-gray-500">Ошибок</p>
            </div>
            <div className="bg-blue-50 rounded p-3 text-center">
              <p className="text-2xl font-bold text-brand">
                {batch.totalRecords > 0 ? Math.round((batch.successfulRecords / batch.totalRecords) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-500">Успех</p>
            </div>
          </div>

          {batch.errors && batch.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="font-semibold text-red-700 text-sm mb-2">Ошибки ({batch.errors.length}):</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-red-600 max-h-24 overflow-y-auto">
                {batch.errors.slice(0, 5).map((error, index) => <li key={index}>{error}</li>)}
                {batch.errors.length > 5 && <li className="text-red-500 font-semibold">... и ещё {batch.errors.length - 5} ошибок</li>}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BulkUploadHistory;
