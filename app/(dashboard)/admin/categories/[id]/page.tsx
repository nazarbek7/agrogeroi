"use client";
import { DashboardSidebar } from "@/components";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { formatCategoryName } from "../../../../../utils/categoryFormating";
import { convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";
import apiClient from "@/lib/api";

interface DashboardSingleCategoryProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleCategory = ({ params }: DashboardSingleCategoryProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [categoryInput, setCategoryInput] = useState<{ name: string }>({
    name: "",
  });
  const router = useRouter();

  const deleteCategory = async () => {
    const requestOptions = {
      method: "DELETE",
    };
    // sending API request for deleting a category
    apiClient
      .delete(`/api/categories/${id}`, requestOptions)
      .then((response) => {
        if (response.status === 204) {
          toast.success("Категория удалена");
          router.push("/admin/categories");
        } else {
          throw Error("Ошибка удаления категории");
        }
      })
      .catch((error) => {
        toast.error("Ошибка удаления категории");
      });
  };

  const updateCategory = async () => {
    if (categoryInput.name.length > 0) {
      try {
        const response = await apiClient.put(`/api/categories/${id}`, {
          name: convertCategoryNameToURLFriendly(categoryInput.name),
        });

        if (response.status === 200) {
          await response.json();
          toast.success("Категория обновлена");
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Ошибка обновления категории");
        }
      } catch (error) {
        console.error("Error updating category:", error);
        toast.error("Ошибка обновления категории");
      }
    } else {
      toast.error("Введите название категории");
      return;
    }
  };

  useEffect(() => {
    // sending API request for getting single categroy
    apiClient
      .get(`/api/categories/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategoryInput({
          name: data?.name,
        });
      });
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col gap-y-7 max-xl:px-5 w-full pt-6">
        <h1 className="text-3xl font-semibold">Детали категории</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Название категории:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={formatCategoryName(categoryInput.name)}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, name: e.target.value })
              }
            />
          </label>
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <button
            type="button"
            className="uppercase bg-brand px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-brand-dark hover:text-white focus:outline-none focus:ring-2"
            onClick={updateCategory}
          >
            Обновить категорию
          </button>
          <button
            type="button"
            className="uppercase bg-red-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
            onClick={deleteCategory}
          >
            Удалить категорию
          </button>
        </div>
        <p className="text-xl text-error max-sm:text-lg">
          Внимание: при удалении категории будут удалены все связанные с ней товары.
        </p>
      </div>
    </div>
  );
};

export default DashboardSingleCategory;
