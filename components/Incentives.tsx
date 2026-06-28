import React from "react";
import { FaTruck, FaHeadset, FaBagShopping } from "react-icons/fa6";

const cards = [
  {
    name: "Бесплатная доставка",
    description: "Доставляем растения бережно и в кратчайшие сроки по всему Кыргызстану.",
    icon: FaTruck,
    color: "text-sky-500",
    bg: "bg-sky-50",
  },
  {
    name: "Поддержка 24/7",
    description: "Наши консультанты помогут подобрать растения и ответят на любые вопросы.",
    icon: FaHeadset,
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
  {
    name: "Удобный заказ",
    description: "Быстрое оформление заказа и удобные способы оплаты.",
    icon: FaBagShopping,
    color: "text-brand",
    bg: "bg-brand/5",
  },
];

const Incentives = () => {
  return (
    <section className="bg-[#f4f9f0] py-12">
      <div className="mx-auto max-w-screen-2xl px-10 max-sm:px-5">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Почему выбирают нас
        </h2>
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-md:max-w-sm max-md:mx-auto">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.name}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className={`flex-shrink-0 w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`${card.color} text-xl`} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{card.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Incentives;
