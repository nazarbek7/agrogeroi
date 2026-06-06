"use client";
import { DashboardSidebar } from "@/components";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { isValidEmailAddressFormat } from "@/lib/utils";
import apiClient from "@/lib/api";

interface DashboardUserDetailsProps {
  params: Promise<{ id: string }>;
}

const DashboardSingleUserPage = ({ params }: DashboardUserDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [userInput, setUserInput] = useState<{
    email: string;
    newPassword: string;
    role: string;
  }>({
    email: "",
    newPassword: "",
    role: "",
  });
  const router = useRouter();

  const deleteUser = async () => {
    const requestOptions = {
      method: "DELETE",
    };
    apiClient
      .delete(`/api/users/${id}`, requestOptions)
      .then((response) => {
        if (response.status === 204) {
          toast.success("Пользователь удалён");
          router.push("/admin/users");
        } else {
          throw Error("Ошибка удаления пользователя");
        }
      })
      .catch((error) => {
        toast.error("Ошибка удаления пользователя");
      });
  };

  const updateUser = async () => {
    if (
      userInput.email.length > 3 &&
      userInput.role.length > 0 &&
      userInput.newPassword.length > 0
    ) {
      if (!isValidEmailAddressFormat(userInput.email)) {
        toast.error("Неверный формат email");
        return;
      }

      if (userInput.newPassword.length > 7) {
        try {
          const response = await apiClient.put(`/api/users/${id}`, {
            email: userInput.email,
            password: userInput.newPassword,
            role: userInput.role,
          });

          if (response.status === 200) {
            await response.json();
            toast.success("Пользователь обновлён");
          } else {
            const errorData = await response.json();
            toast.error(errorData.error || "Ошибка обновления пользователя");
          }
        } catch (error) {
          console.error("Error updating user:", error);
          toast.error("Ошибка обновления пользователя");
        }
      } else {
        toast.error("Пароль должен быть длиннее 7 символов");
        return;
      }
    } else {
      toast.error("Введите все поля для обновления пользователя");
      return;
    }
  };

  useEffect(() => {
    // sending API request for a single user
    apiClient
      .get(`/api/users/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserInput({
          email: data?.email,
          newPassword: "",
          role: data?.role,
        });
      });
  }, [id]);

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full pt-6">
        <h1 className="text-3xl font-semibold">Детали пользователя</h1>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email:</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Новый пароль:</span>
            </div>
            <input
              type="password"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) =>
                setUserInput({ ...userInput, newPassword: e.target.value })
              }
              value={userInput.newPassword}
            />
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Роль пользователя: </span>
            </div>
            <select
              className="select select-bordered"
              value={userInput.role}
              onChange={(e) =>
                setUserInput({ ...userInput, role: e.target.value })
              }
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </label>
        </div>
        <div className="flex gap-x-2 max-sm:flex-col">
          <button
            type="button"
            className="uppercase bg-brand px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-brand-dark hover:text-white focus:outline-none focus:ring-2"
            onClick={updateUser}
          >
            Обновить пользователя
          </button>
          <button
            type="button"
            className="uppercase bg-red-600 px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-red-700 hover:text-white focus:outline-none focus:ring-2"
            onClick={deleteUser}
          >
            Удалить пользователя
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSingleUserPage;
