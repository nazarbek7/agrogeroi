import React from "react";
import Link from "next/link";

const stats = [
  { value: "10+", label: "лет опыта" },
  { value: "500+", label: "видов растений" },
  { value: "10 000+", label: "саженцев в наличии" },
  { value: "1 га", label: "площадь питомника" },
];

const NurserySection = () => {
  return (
    <section className="bg-[#f4f9f0] py-20 border-t-4 border-brand/20">
      <div className="max-w-screen-2xl mx-auto px-10 max-sm:px-5">
        <div className="grid grid-cols-2 gap-16 items-center max-lg:grid-cols-1 max-lg:gap-10">
          {/* Text side */}
          <div>
            <p className="text-brand text-sm font-bold uppercase tracking-widest mb-3">
              О нас
            </p>
            <h2 className="text-5xl font-extrabold mb-6 leading-tight text-gray-900 max-md:text-4xl">
              Наш собственный питомник
            </h2>
            <p className="text-gray-600 text-lg mb-4 leading-relaxed">
              Мы выращиваем растения сами — в нашем питомнике в Кыргызстане. Каждый саженец проходит заботливый уход с момента посадки до отправки к вам.
            </p>
            <p className="text-gray-500 text-base mb-8 leading-relaxed">
              Розы, хвойные, плодовые деревья, лианы, многолетние цветы — всё выращено в местных условиях и адаптировано к нашему климату.
            </p>
            <Link
              href="/contacts"
              className="inline-block bg-brand text-white font-bold px-10 py-4 rounded-lg hover:bg-brand-dark transition-colors text-base"
            >
              Посетить питомник
            </Link>
          </div>

          {/* Stats side */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white border-2 border-brand/10 rounded-2xl p-8 text-center hover:border-brand hover:shadow-md transition-all"
              >
                <p className="text-5xl font-extrabold text-brand mb-2 max-md:text-4xl">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NurserySection;
