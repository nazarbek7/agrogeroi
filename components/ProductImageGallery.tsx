"use client";
import Image from "next/image";
import { useState } from "react";

interface ImageItem {
  id: string;
  src: string;
}

export default function ProductImageGallery({
  images,
  title,
}: {
  images: ImageItem[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm">
        <Image
          src={images[active]?.src ?? "/product_placeholder.jpg"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-contain p-4 transition-opacity duration-200"
          alt={title}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative w-[76px] h-[76px] rounded-xl overflow-hidden bg-white flex-shrink-0 border-2 transition-all ${
                i === active
                  ? "border-brand shadow-md"
                  : "border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                fill
                sizes="76px"
                className="object-contain p-1.5"
                alt={`Фото ${i + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
