// *********************
// Role of the component: Category wrapper that will contain title and category items
// Name of the component: CategoryMenu.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CategoryMenu />
// Input parameters: no input parameters
// Output: section title and category items
// *********************

import React from "react";
import CategoryItem from "./CategoryItem";
import { categoryMenuList } from "@/lib/utils";
import Heading from "./Heading";

const CategoryMenu = () => {
  return (
    <div className="py-10 bg-green-700">
      <Heading title="КАТЕГОРИИ" />
      <div className="max-w-screen-2xl mx-auto py-10 gap-x-5 px-16 max-md:px-10 gap-y-5 grid grid-cols-7 max-xl:grid-cols-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-[450px]:grid-cols-1">
        {categoryMenuList.map((item) => (
          <CategoryItem title={item.title} key={item.id} href={item.href}>
            <span className="text-4xl">{item.emoji}</span>
          </CategoryItem>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
