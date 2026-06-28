"use client";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import { FaCartShopping } from "react-icons/fa6";

interface Props {
  id: string;
  title: string;
  price: number;
  image: string;
  isDark?: boolean;
}

const AddToCartButton = ({ id, title, price, image, isDark }: Props) => {
  const { addToCart, calculateTotals } = useProductStore();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, title, price, image, amount: 1 });
    calculateTotals();
    toast.success("Добавлено в корзину");
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
        isDark
          ? "bg-white/20 text-white hover:bg-white hover:text-brand"
          : "bg-brand text-white hover:bg-brand-dark"
      }`}
    >
      <FaCartShopping className="text-xs" />
      В корзину
    </button>
  );
};

export default AddToCartButton;
