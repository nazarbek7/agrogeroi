"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";

interface WishItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
}

const WishItem = ({ id, title, price, image, slug, stockAvailabillity }: WishItemProps) => {
  const { removeFromWishlist } = useWishlistStore();

  return (
    <tr>
      <td>
        <button
          className="btn btn-sm btn-ghost text-red-500"
          onClick={() => removeFromWishlist(id)}
        >
          ✕
        </button>
      </td>
      <td>
        <div className="flex justify-center">
          <Image
            src={image || "/placeholder.png"}
            alt={title}
            width={60}
            height={60}
            className="object-contain"
          />
        </div>
      </td>
      <td>
        <Link href={`/product/${slug}`} className="hover:underline text-black">
          {title}
        </Link>
        <div className="text-sm text-gray-500">${price}</div>
      </td>
      <td>
        <span className={stockAvailabillity > 0 ? "text-green-600" : "text-red-500"}>
          {stockAvailabillity > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td>
        <Link href={`/product/${slug}`} className="btn btn-sm btn-primary">
          View
        </Link>
      </td>
    </tr>
  );
};

export default WishItem;
