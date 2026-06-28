"use client";
import React from "react";

interface QuantityInputProps {
  quantityCount: number;
  setQuantityCount: React.Dispatch<React.SetStateAction<number>>;
}

const QuantityInput = ({ quantityCount, setQuantityCount }: QuantityInputProps) => {
  const dec = () => { if (quantityCount > 1) setQuantityCount(quantityCount - 1); };
  const inc = () => setQuantityCount(quantityCount + 1);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-500">Количество:</span>
      <div className="flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden">
        <button
          type="button"
          onClick={dec}
          disabled={quantityCount <= 1}
          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-brand hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg font-light"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-bold text-gray-800 select-none">
          {quantityCount}
        </span>
        <button
          type="button"
          onClick={inc}
          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-brand hover:bg-gray-50 transition-colors text-lg font-light"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityInput;
