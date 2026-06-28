import React from "react";
import Link from "next/link";
import { FaLeaf, FaBagShopping, FaTruck } from "react-icons/fa6";

const steps = [
  {
    number: "01",
    title: "Выберите растения",
    desc: "Просмотрите каталог и добавьте понравившиеся товары в корзину.",
    icon: FaLeaf,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
  },
  {
    number: "02",
    title: "Оформите заказ",
    desc: "Укажите адрес доставки и удобный способ оплаты.",
    icon: FaBagShopping,
    color: "text-brand",
    bg: "bg-brand/5",
    ring: "ring-brand/20",
  },
  {
    number: "03",
    title: "Получите растения",
    desc: "Доставим бережно и в срок. Консультация по уходу — бесплатно!",
    icon: FaTruck,
    color: "text-sky-500",
    bg: "bg-sky-50",
    ring: "ring-sky-200",
  },
];

const HowToOrder = () => {
  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-10 max-sm:px-5">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            Как сделать заказ
          </h2>
          <p className="text-gray-500 text-lg">
            Всего 3 простых шага до вашего нового растения
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-8 max-md:grid-cols-1 max-md:max-w-md max-md:mx-auto">
          {/* Connecting line (desktop only) */}
          <div className="absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-emerald-200 via-brand/30 to-sky-200 max-md:hidden" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className={`relative z-10 w-20 h-20 rounded-2xl ${step.bg} ring-4 ${step.ring} flex items-center justify-center mb-5 shadow-sm`}>
                  <Icon className={`${step.color} text-2xl`} />
                </div>

                {/* Step number badge */}
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">
                  Шаг {step.number}
                </span>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="bg-brand text-white font-bold px-12 py-4 text-base hover:bg-brand-dark rounded-xl inline-block transition-colors shadow-sm"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowToOrder;
