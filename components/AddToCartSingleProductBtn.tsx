// *********************
// Role of the component: Button for adding product to the cart on the single product page
// Name of the component: AddToCartSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <AddToCartSingleProductBtn product={product} quantityCount={quantityCount}  />
// Input parameters: SingleProductBtnProps interface
// Output: Button with adding to cart functionality
// *********************
"use client";



import React from "react";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";



const AddToCartSingleProductBtn = ({ product, quantityCount } : SingleProductBtnProps) => {
  const { addToCart, calculateTotals } = useProductStore();

  const handleAddToCart = () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount
    });
    calculateTotals();
    toast.success("Товар добавлен в корзину");
  };
  return (
    <button
      onClick={handleAddToCart}
      className="flex-1 px-6 py-3.5 rounded-2xl border-2 border-brand text-brand font-bold text-sm tracking-wide hover:bg-brand hover:text-white transition-all duration-200 active:scale-95 min-w-0"
    >
      В корзину
    </button>
  );
};

export default AddToCartSingleProductBtn;
