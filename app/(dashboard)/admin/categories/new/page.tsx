"use client";
import { DashboardSidebar } from "@/components";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { convertCategoryNameToURLFriendly } from "../../../../../utils/categoryFormating";
import apiClient from "@/lib/api";

const DashboardNewCategoryPage = () => {
  const [categoryInput, setCategoryInput] = useState({
    name: "",
  });

  const addNewCategory = async () => {
    if (categoryInput.name.length > 0) {
      try {
        const response = await apiClient.post(`/api/categories`, {
          name: convertCategoryNameToURLFriendly(categoryInput.name),
        });

        if (response.status === 201) {
          await response.json();
          toast.success("Категория добавлена!");
          setCategoryInput({
            name: "",
          });
        } else {
          const errorData = await response.json();
          toast.error(
            errorData.error || "Ошибка при создании категории"
          );
        }
      } catch (error) {
        console.error("Error creating category:", error);
        toast.error("Ошибка при создании категории");
      }
    } else {
      toast.error("Введите название категории");
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col gap-y-7 max-xl:px-5 w-full pt-6">
        <h1 className="text-3xl font-semibold">Новая категория</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Название категории:</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              value={categoryInput.name}
              onChange={(e) =>
                setCategoryInput({ ...categoryInput, name: e.target.value })
              }
            />
          </label>
        </div>

        <div className="flex gap-x-2">
          <button
            type="button"
            className="uppercase bg-brand px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-brand-dark hover:text-white focus:outline-none focus:ring-2"
            onClick={addNewCategory}
          >
            Создать категорию
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardNewCategoryPage;
