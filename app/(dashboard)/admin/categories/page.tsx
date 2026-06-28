"use client";
import { CustomButton, DashboardSidebar } from "@/components";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatCategoryName } from "../../../../utils/categoryFormating";
import apiClient from "@/lib/api";

const DashboardCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  // getting all categories to be displayed on the all categories page
  useEffect(() => {
    apiClient.get("/api/categories")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 w-full pt-6 px-4">
        <h1 className="text-3xl font-semibold text-center mb-5">
          Все категории
        </h1>
        <div className="flex justify-end mb-5">
          <Link href="/admin/categories/new">
            <CustomButton
              buttonType="button"
              customWidth="110px"
              paddingX={10}
              paddingY={5}
              textSize="base"
              text="Добавить категорию"
            />
          </Link>
        </div>
        <div className="xl:ml-5 w-full max-xl:mt-5 overflow-auto w-full h-[80vh]">
          <table className="table table-md table-pin-cols">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Название</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories &&
                categories.map((category: Category) => (
                  <tr key={nanoid()}>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>

                    <td>
                      <div>
                        <p>{formatCategoryName(category?.name)}</p>
                      </div>
                    </td>

                    <th>
                      <Link
                        href={`/admin/categories/${category?.id}`}
                        className="btn btn-ghost btn-xs"
                      >
                        Подробнее
                      </Link>
                    </th>
                  </tr>
                ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th></th>
                <th>Название</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardCategory;
