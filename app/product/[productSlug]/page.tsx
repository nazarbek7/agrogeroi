import {
  StockAvailabillity,
  UrgencyText,
  ProductTabs,
  SingleProductDynamicFields,
} from "@/components";
import prisma from "@/utils/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{ productSlug: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const { productSlug } = await params;

  const product = await prisma.product.findUnique({ where: { slug: productSlug } });

  if (!product) {
    notFound();
  }

  let images: ImageItem[] = [];
  try {
    images = await prisma.image.findMany({ where: { productID: product.id } }) as any;
  } catch {
    // no extra images — that's fine
  }

  return (
    <div className="bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-center gap-x-16 pt-10 max-lg:flex-col items-center gap-y-5 px-5">
          <div>
            <Image
              src={product?.mainImage ? `/${product?.mainImage}` : "/product_placeholder.jpg"}
              width={500}
              height={500}
              alt={product?.title || "Фото товара"}
              className="w-auto h-auto"
            />
            {images.length > 0 && (
              <div className="flex justify-around mt-5 flex-wrap gap-y-1 max-[500px]:justify-center max-[500px]:gap-x-1">
                {images.map((imageItem: ImageItem, key: number) => (
                  <Image
                    key={imageItem.imageID + key}
                    src={`/${imageItem.image}`}
                    width={100}
                    height={100}
                    alt="Дополнительное фото"
                    className="w-auto h-auto"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-7 text-black max-[500px]:text-center">
            <h1 className="text-3xl">{product?.title}</h1>
            <p className="text-2xl font-bold text-brand">{product?.price} сом</p>
            <StockAvailabillity stock={product?.inStock} inStock={product?.inStock} />
            <SingleProductDynamicFields product={product} />
            <div className="flex flex-col gap-y-2 max-[500px]:items-center">
              {product?.manufacturer && (
                <p className="text-lg text-gray-600">
                  Производитель: <span className="font-semibold text-black">{product.manufacturer}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="py-16">
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
