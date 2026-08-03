import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaLeaf } from "react-icons/fa6";
import prisma from "@/utils/db";
import { imgSrc } from "@/utils/imgSrc";

// `span` is written out literally so Tailwind picks the classes up at build time.
// 9 tiles: the large one covers 2×2, so the 4×3 grid fills exactly.
// Order follows the header navigation for the plant categories it lists.
const featured = [
  {
    title: "Гортензии",
    category: "Гортензии",
    emoji: "💐",
    span: "col-span-2 row-span-2 max-lg:row-span-1 max-sm:col-span-1",
  },
  { title: "Хвойные", category: "Хвойные деревья и кустарники", emoji: "🌲", span: "" },
  { title: "Розы", category: "Розы", emoji: "🌹", span: "" },
  { title: "Лиственные деревья", category: "Лиственные деревья", emoji: "🌳", span: "" },
  { title: "Плодовые", category: "Плодовые деревья и кустарники", emoji: "🍎", span: "" },
  { title: "Лиственные кустарники", category: "Лиственные кустарники", emoji: "🌿", span: "" },
  { title: "Лианы", category: "Лианы", emoji: "🪴", span: "" },
  { title: "Многолетние цветы", category: "Цветы многолетние", emoji: "🌸", span: "" },
  { title: "Газоны и травосмеси", category: "Газоны и травосмеси", emoji: "🌾", span: "" },
];

const moreCategories = [
  { title: "Горшки и контейнеры", category: "Контейнеры и горшки" },
  { title: "Торфяная продукция", category: "Торфяная продукция" },
  { title: "Семена", category: "Семена" },
  { title: "Сетки и агротекстиль", category: "Сетки и агротекстиль" },
  { title: "Инструменты", category: "Инструменты" },
];

const loadPreviews = async () => {
  const previews = new Map<string, string>();

  try {
    const categories = await prisma.category.findMany({
      where: { name: { in: featured.map((item) => item.category) } },
      select: {
        name: true,
        products: { where: { isActive: true }, select: { mainImage: true } },
      },
    });

    for (const category of categories) {
      const withImage = category.products.find((product) => product.mainImage);
      if (withImage) previews.set(category.name, withImage.mainImage);
    }
  } catch {
    // DB unavailable — every tile falls back to its emoji placeholder
  }

  return previews;
};

const FeaturedCategories = async () => {
  const previews = await loadPreviews();

  return (
    <section className="bg-white py-20 max-lg:py-14 max-sm:py-10">
      <div className="mx-auto max-w-screen-2xl px-10 max-sm:px-5">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-4 max-sm:mb-7 max-sm:flex-col max-sm:items-start max-sm:gap-3">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-bold uppercase tracking-widest text-brand">
              <FaLeaf className="text-xs" /> Каталог
            </span>
            <h2 className="text-4xl font-extrabold leading-tight text-gray-900 max-md:text-3xl">
              Что выращиваем
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-sm font-semibold text-brand transition-all hover:gap-2.5"
          >
            Все товары <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {/* Mosaic */}
        <div className="grid grid-cols-4 auto-rows-[210px] gap-4 max-lg:grid-cols-2 max-lg:auto-rows-[190px] max-sm:grid-cols-1 max-sm:auto-rows-[170px] max-sm:gap-3">
          {featured.map((item) => {
            const image = previews.get(item.category);
            const isLarge = item.span.startsWith("col-span-2");

            return (
              <Link
                key={item.category}
                href={`/shop/${item.category}`}
                className={`group relative overflow-hidden rounded-2xl bg-brand ${item.span}`}
              >
                {image ? (
                  <Image
                    src={imgSrc(image)}
                    alt={item.title}
                    fill
                    sizes={
                      isLarge
                        ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    }
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand to-brand-dark">
                    <span className={isLarge ? "text-7xl" : "text-6xl"}>
                      {item.emoji}
                    </span>
                  </div>
                )}

                {/* Legibility wash */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* Label */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 max-sm:p-4">
                  <h3
                    className={`font-extrabold leading-tight text-white ${
                      isLarge ? "text-3xl max-md:text-2xl" : "text-lg"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-brand group-hover:opacity-100 max-lg:opacity-100">
                    <FaArrowRight className="text-xs" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* The rest of the catalogue, as plain chips */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5 max-sm:mt-6">
          <span className="mr-1 text-sm font-semibold text-gray-400">
            Также у нас есть:
          </span>
          {moreCategories.map((item) => (
            <Link
              key={item.category}
              href={`/shop/${item.category}`}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-brand hover:bg-brand/5 hover:text-brand"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
