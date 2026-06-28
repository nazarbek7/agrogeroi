import React from "react";
import Link from "next/link";
import { FaSeedling, FaLeaf, FaLayerGroup, FaMapLocation } from "react-icons/fa6";

const stats = [
  { value: "10+", label: "лет опыта", icon: FaLayerGroup, color: "text-violet-500", bg: "bg-violet-50" },
  { value: "500+", label: "видов растений", icon: FaLeaf, color: "text-emerald-500", bg: "bg-emerald-50" },
  { value: "10 000+", label: "саженцев в наличии", icon: FaSeedling, color: "text-brand", bg: "bg-brand/5" },
  { value: "1 га", label: "площадь питомника", icon: FaMapLocation, color: "text-sky-500", bg: "bg-sky-50" },
];

const NurserySection = () => {
  return (
    <section className="bg-[#f4f9f0] py-20">
      <div className="max-w-screen-2xl mx-auto px-10 max-sm:px-5">
        <div className="grid grid-cols-2 gap-16 items-center max-lg:grid-cols-1 max-lg:gap-10">
          {/* Text side */}
          <div>
            <span className="inline-flex items-center gap-2 text-brand text-sm font-bold uppercase tracking-widest mb-4 bg-brand/10 px-3 py-1.5 rounded-full">
              <FaSeedling className="text-xs" /> О нас
            </span>
            <h2 className="text-5xl font-extrabold mb-6 leading-tight text-gray-900 max-md:text-4xl">
              Наш собственный<br />питомник
            </h2>
            <p className="text-gray-600 text-lg mb-4 leading-relaxed">
              Мы выращиваем растения сами — в нашем питомнике в Кыргызстане. Каждый саженец проходит заботливый уход с момента посадки до отправки к вам.
            </p>
            <p className="text-gray-500 text-base mb-8 leading-relaxed">
              Розы, хвойные, плодовые деревья, лианы, многолетние цветы — всё выращено в местных условиях и адаптировано к нашему климату.
            </p>
            <Link
              href="/contacts"
              className="inline-block bg-brand text-white font-bold px-10 py-4 rounded-xl hover:bg-brand-dark transition-colors text-base shadow-sm"
            >
              Посетить питомник
            </Link>
          </div>

          {/* Stats side */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-7 flex flex-col gap-3 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`${stat.color} text-base`} />
                  </div>
                  <p className={`text-4xl font-extrabold ${stat.color} leading-none max-md:text-3xl`}>
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NurserySection;
