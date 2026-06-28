import React from "react";

const StockAvailabillity = ({ inStock }: { stock: number; inStock: number }) => {
  return inStock > 0 ? (
    <span className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold w-fit">
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      В наличии
    </span>
  ) : (
    <span className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold w-fit">
      <span className="w-2 h-2 rounded-full bg-red-400" />
      Нет в наличии
    </span>
  );
};

export default StockAvailabillity;
