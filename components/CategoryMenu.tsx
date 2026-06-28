import React from "react";
import CategoryItem from "./CategoryItem";
import { categoryMenuList } from "@/lib/utils";

const CategoryMenu = () => {
  return (
    <div className="py-14 bg-brand">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white">Категории</h2>
        <p className="text-white/60 text-sm mt-1.5">Выберите нужную категорию</p>
      </div>
      <div className="max-w-screen-2xl mx-auto gap-3 px-10 max-md:px-5 grid grid-cols-7 max-xl:grid-cols-5 max-lg:grid-cols-4 max-md:grid-cols-3 max-[450px]:grid-cols-2">
        {categoryMenuList.map((item) => (
          <CategoryItem title={item.title} key={item.id} href={item.href}>
            <span className="text-3xl">{item.emoji}</span>
          </CategoryItem>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
