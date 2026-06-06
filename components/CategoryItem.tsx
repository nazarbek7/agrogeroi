import Link from "next/link";
import React, { type ReactNode } from "react";

interface CategoryItemProps {
  children: ReactNode;
  title: string;
  href: string;
}

const CategoryItem = ({ title, children, href }: CategoryItemProps) => {
  return (
    <Link href={href} className="group">
      <div className="flex flex-col items-center gap-y-2 cursor-pointer bg-white rounded-xl py-5 px-3 shadow-sm hover:shadow-md hover:bg-brand hover:text-white transition-all duration-200 hover:-translate-y-1">
        <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
          {children}
        </div>
        <h3 className="font-semibold text-xs text-center leading-tight text-gray-700 group-hover:text-white">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryItem;
