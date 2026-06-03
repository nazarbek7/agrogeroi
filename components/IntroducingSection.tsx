import Link from "next/link";
import React from "react";

const IntroducingSection = () => {
  return (
    <div className="py-20 pt-24 bg-gradient-to-l from-white to-brand">
      <div className="text-center flex flex-col gap-y-5 items-center">
        <h2 className="text-white text-8xl font-extrabold text-center mb-2 max-md:text-6xl max-[480px]:text-4xl">
          АГРО<span className="text-black">ГЕРОИ</span>
        </h2>
        <div>
          <p className="text-white text-center text-2xl font-semibold max-md:text-xl max-[480px]:text-base">
            Питомник растений в Кыргызстане.
          </p>
          <p className="text-white text-center text-2xl font-semibold max-md:text-xl max-[480px]:text-base">
            Саженцы, деревья и кустарники для вашего сада.
          </p>
          <Link href="/shop" className="block text-brand bg-white font-bold px-12 py-3 text-xl hover:bg-gray-100 w-96 mt-5 max-md:text-lg max-md:w-72 max-[480px]:w-60 mx-auto">
            В КАТАЛОГ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IntroducingSection;
