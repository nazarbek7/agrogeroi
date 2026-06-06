export const metadata = { title: "Частые вопросы — Агрогерои" };

const faqs = [
  {
    q: "Как сделать заказ?",
    a: "Добавьте товары в корзину на сайте и оформите заказ, или напишите нам напрямую в WhatsApp / Telegram. Менеджер свяжется с вами для подтверждения.",
  },
  {
    q: "Как быстро доставят заказ?",
    a: "По Бишкеку — 1–2 рабочих дня. По регионам Кыргызстана — 2–5 рабочих дней через транспортные компании.",
  },
  {
    q: "Можно ли забрать самостоятельно?",
    a: "Да! Самовывоз из питомника бесплатен. Адрес и время уточните по телефону или в мессенджерах.",
  },
  {
    q: "Как оплатить заказ?",
    a: "Принимаем QR-код, наличные, Visa/Mastercard, М-Банк, О-Банк и Оптима Банк. Оплата — после подтверждения заказа менеджером.",
  },
  {
    q: "Растения живые — как убедиться в качестве?",
    a: "Все растения выращены в нашем питомнике. При получении обязательно осмотрите товар. Если есть проблемы — сфотографируйте сразу и напишите нам.",
  },
  {
    q: "Что делать, если растение завяло после получения?",
    a: "Большинство растений после транспортировки требуют 1–3 дня адаптации. Если через несколько дней состояние не улучшилось — пишите нам с фото.",
  },
  {
    q: "Можно ли вернуть товар?",
    a: "Принимаем возврат, если растение получено повреждённым или не соответствует описанию. Для этого нужно фото/видео при получении и обращение в течение 7 дней.",
  },
  {
    q: "Есть ли скидки при большом заказе?",
    a: "Да, для оптовых покупателей и при заказе от определённой суммы предусмотрены скидки. Подробности — у менеджера.",
  },
  {
    q: "Выращиваете ли вы растения на заказ?",
    a: "Да, принимаем заказы на конкретные виды и сорта. Уточните наличие и сроки у нашего менеджера.",
  },
];

export default function FaqPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand py-12">
        <h1 className="text-center text-4xl font-bold text-white">Частые вопросы</h1>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-4">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border border-brand/10 overflow-hidden">
            <div className="bg-[#f4f9f0] px-6 py-4 flex gap-3 items-start">
              <span className="text-brand font-extrabold text-lg flex-shrink-0">Q.</span>
              <h3 className="font-bold text-gray-800 text-base">{faq.q}</h3>
            </div>
            <div className="px-6 py-4 flex gap-3 items-start">
              <span className="text-gray-400 font-extrabold text-lg flex-shrink-0">A.</span>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}

        <div className="mt-6 bg-[#f4f9f0] rounded-2xl p-6 border border-brand/10 text-center">
          <p className="text-gray-700 text-lg font-semibold mb-2">Не нашли ответ?</p>
          <p className="text-gray-500 mb-4">Напишите нам — ответим быстро</p>
          <a
            href="/contacts"
            className="inline-block bg-brand text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition"
          >
            Написать нам →
          </a>
        </div>
      </div>
    </div>
  );
}
