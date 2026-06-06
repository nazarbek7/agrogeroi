export const metadata = { title: "Доставка и оплата — Агрогерои" };

export default function DeliveryPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand py-12">
        <h1 className="text-center text-4xl font-bold text-white">Доставка и оплата</h1>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">

        <section>
          <h2 className="text-2xl font-bold text-brand mb-6">Доставка</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                title: "Доставка по Бишкеку",
                desc: "Доставляем в течение 1–2 рабочих дней. Стоимость — 300 сом. Бесплатно при заказе от 5 000 сом.",
                icon: "🏙️",
              },
              {
                title: "Доставка по Кыргызстану",
                desc: "Доставляем по всем регионам через транспортные компании. Стоимость уточняется при оформлении заказа. Срок — 2–5 рабочих дней.",
                icon: "🚚",
              },
              {
                title: "Самовывоз",
                desc: "Вы можете забрать заказ самостоятельно из нашего питомника. Бесплатно. Адрес уточняйте по телефону или WhatsApp.",
                icon: "🌿",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-5 p-6 rounded-xl border border-brand/10 bg-[#f4f9f0]">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-brand mb-6">Способы оплаты</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "QR-код", color: "bg-green-100 text-green-800", desc: "Оплата по QR через любой банк" },
              { name: "Наличные", color: "bg-gray-100 text-gray-800", desc: "При получении или в питомнике" },
              { name: "Visa / Mastercard", color: "bg-blue-100 text-blue-800", desc: "Банковская карта" },
              { name: "М-Банк", color: "bg-orange-100 text-orange-800", desc: "Перевод через М-Банк" },
              { name: "О-Банк", color: "bg-purple-100 text-purple-800", desc: "Перевод через О-Банк" },
              { name: "Оптима", color: "bg-red-100 text-red-800", desc: "Перевод через Оптима Банк" },
            ].map((p) => (
              <div key={p.name} className="rounded-xl border border-gray-100 p-4 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${p.color}`}>{p.name}</span>
                <p className="text-gray-500 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#f4f9f0] rounded-2xl p-8 border border-brand/10">
          <h2 className="text-xl font-bold text-brand mb-3">Важно знать</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2"><span className="text-brand">•</span> Оплата производится после подтверждения заказа менеджером</li>
            <li className="flex gap-2"><span className="text-brand">•</span> Крупные деревья и кустарники доставляем по предварительному согласованию</li>
            <li className="flex gap-2"><span className="text-brand">•</span> Все растения упакованы для безопасной транспортировки</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
