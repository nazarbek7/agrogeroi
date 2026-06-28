import Link from "next/link";
import React from "react";

const IntroducingSection = () => {
  return (
    <div className="py-24 bg-gradient-to-br from-brand via-brand/90 to-[#3a5c1f] relative overflow-hidden">
      {/* Decorative rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-white/5 absolute" />
        <div className="w-[800px] h-[800px] rounded-full border border-white/5 absolute" />
      </div>

      <div className="relative text-center flex flex-col gap-y-5 items-center px-5">
        <span className="inline-block bg-white/15 text-white text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-2">
          Agrogeroi
        </span>
        <h2 className="text-white text-8xl font-extrabold text-center leading-none mb-2 max-md:text-6xl max-[480px]:text-4xl">
          AGRO<span className="text-white/40">GEROI</span>
        </h2>
        <div className="flex flex-col items-center gap-1">
          <p className="text-white/80 text-center text-xl font-medium max-md:text-lg max-[480px]:text-base">
            Питомник растений в Кыргызстане.
          </p>
          <p className="text-white/70 text-center text-lg max-md:text-base max-[480px]:text-sm">
            Саженцы, деревья и кустарники для вашего сада.
          </p>
        </div>
        <Link
          href="/shop"
          className="mt-3 bg-white text-brand font-bold px-12 py-3.5 rounded-xl hover:bg-gray-100 transition-colors shadow-sm text-base max-md:px-8"
        >
          В каталог →
        </Link>
      </div>
    </div>
  );
};

export default IntroducingSection;
