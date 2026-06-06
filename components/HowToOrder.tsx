import React from "react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Выберите растения",
    desc: "Просмотрите каталог и добавьте понравившиеся товары в корзину.",
    icon: "🌱",
  },
  {
    number: "02",
    title: "Оформите заказ",
    desc: "Укажите адрес доставки и удобный способ оплаты.",
    icon: "📦",
  },
  {
    number: "03",
    title: "Получите растения",
    desc: "Доставим бережно и в срок. Консультация по уходу — бесплатно!",
    icon: "🚚",
  },
];

const HowToOrder = () => {
  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-10 max-sm:px-5">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-2 uppercase tracking-wide">
          Как сделать заказ
        </h2>
        <p className="text-center text-gray-500 mb-12 text-lg">
          Всего 3 простых шага до вашего нового растения
        </p>
        <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1 max-md:max-w-md max-md:mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center text-center p-8 rounded-2xl border-2 border-brand/20 hover:border-brand hover:shadow-lg transition-all"
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <div className="text-brand font-extrabold text-5xl mb-2 opacity-20">{step.number}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="bg-brand text-white font-bold px-12 py-4 text-lg hover:bg-brand-dark rounded-lg inline-block transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowToOrder;
