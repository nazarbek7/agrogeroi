"use client";
import { DashboardSidebar } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { sanitizeFormData } from "@/lib/form-sanitize";

const DashboardCreateNewUser = () => {
  const [userInput, setUserInput] = useState<{
    email: string;
    password: string;
    role: string;
  }>({
    email: "",
    password: "",
    role: "user",
  });

  const addNewUser = async () => {
    if (userInput.email === "" || userInput.password === "") {
      toast.error("Введите все поля для создания пользователя");
      return;
    }

    // Sanitize form data before sending to API
    const sanitizedUserInput = sanitizeFormData(userInput);

    if (
      userInput.email.length > 3 &&
      userInput.role.length > 0 &&
      userInput.password.length > 0
    ) {
      if (!isValidEmailAddressFormat(userInput.email)) {
        toast.error("Неверный формат email");
        return;
      }

      if (userInput.password.length > 7) {
        const requestOptions: any = {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sanitizedUserInput),
        };
        fetch(`/api/users`, requestOptions)
          .then((response) => {
            if (response.status === 201) {
              return response.json();
            } else {
              throw Error("Ошибка создания пользователя");
            }
          })
          .then((data: any) => {
            toast.success("Пользователь создан!");
            setUserInput({
              email: "",
              password: "",
              role: "user",
            });
          }).catch((error: any) => {
            toast.error("Ошибка создания пользователя");
          });
      } else {
        toast.error("Пароль должен быть длиннее 7 символов");
      }
    } else {
      toast.error("Введите все поля для создания пользователя");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col gap-y-7 max-xl:px-5 w-full pt-6">
        <h1 className="text-3xl font-semibold">Новый пользователь</h1>
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
              <span className="label-text">Пароль:</span>
            </div>
            <input
              type="password"
              className="input input-bordered w-full max-w-xs"
              value={userInput.password}
              onChange={(e) =>
                setUserInput({ ...userInput, password: e.target.value })
              }
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
              defaultValue={userInput.role}
              onChange={(e) =>
                setUserInput({ ...userInput, role: e.target.value })
              }
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </label>
        </div>

        <div className="flex gap-x-2">
          <button
            type="button"
            className="uppercase bg-brand px-10 py-5 text-lg border border-black border-gray-300 font-bold text-white shadow-sm hover:bg-brand-dark hover:text-white focus:outline-none focus:ring-2"
            onClick={addNewUser}
          >
            Создать пользователя
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateNewUser;
