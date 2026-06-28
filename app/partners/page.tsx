export const metadata = { title: "Партнёры — Agrogeroi" };

export default function PartnersPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand py-12">
        <h1 className="text-center text-4xl font-bold text-white">Партнёры</h1>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">

        <section>
          <h2 className="text-2xl font-bold text-brand mb-4">Станьте нашим партнёром</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Мы открыты к сотрудничеству с ландшафтными дизайнерами, строительными компаниями,
            садовыми центрами и розничными магазинами по всему Кыргызстану.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: "🏡", title: "Ландшафтные дизайнеры", desc: "Предлагаем оптовые цены и широкий ассортимент для реализации ваших проектов." },
            { icon: "🏗️", title: "Строительные компании", desc: "Озеленение объектов под ключ — деревья, кустарники, газоны." },
            { icon: "🌳", title: "Садовые центры", desc: "Поставка посадочного материала оптом с документацией." },
            { icon: "📦", title: "Оптовые покупатели", desc: "Специальные условия при заказе от 50 000 сом." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-6 rounded-xl border border-brand/10 bg-[#f4f9f0]">
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-brand mb-4">Условия партнёрства</h2>
          <ul className="space-y-3 text-gray-700">
            {[
              "Оптовые цены от 15% ниже розничных",
              "Персональный менеджер для каждого партнёра",
              "Приоритетная резервация редких сортов",
              "Гибкие условия оплаты для постоянных партнёров",
              "Помощь в подборе ассортимента под проект",
            ].map((item) => (
              <li key={item} className="flex gap-3 items-start">
                <span className="text-brand font-bold mt-1">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="bg-[#f4f9f0] rounded-2xl p-8 border border-brand/10">
          <h2 className="text-xl font-bold text-brand mb-3">Обсудить сотрудничество</h2>
          <p className="text-gray-600 mb-5">Свяжитесь с нами — расскажем подробнее об условиях партнёрства.</p>
          <div className="flex gap-3 flex-wrap">
            <a href="https://wa.me/996708000008" className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition">WhatsApp</a>
            <a href="tel:+996708000008" className="bg-brand text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">+996 708 00 00 08</a>
          </div>
        </div>
      </div>
    </div>
  );
}
