import Link from "next/link";

export const metadata = { title: "Как сделать заказ — Агрогерои" };

const steps = [
  {
    num: 1,
    icon: "🌿",
    title: "Выберите растения",
    desc: "Просмотрите каталог на сайте. Используйте фильтры по категориям — розы, хвойные, плодовые, лианы и др. Нажмите «В корзину» для понравившихся товаров.",
  },
  {
    num: 2,
    icon: "🛒",
    title: "Оформите заказ",
    desc: "Откройте корзину, проверьте список товаров и нажмите «Оформить заказ». Укажите ваш телефон и адрес доставки.",
  },
  {
    num: 3,
    icon: "📞",
    title: "Подтверждение",
    desc: "Менеджер свяжется с вами в течение 30 минут для подтверждения заказа, уточнения деталей и способа оплаты.",
  },
  {
    num: 4,
    icon: "💳",
    title: "Оплата",
    desc: "Оплатите удобным способом: QR-код, наличные, М-Банк, О-Банк, Оптима или карта Visa. Оплата только после подтверждения заказа.",
  },
  {
    num: 5,
    icon: "🚚",
    title: "Доставка",
    desc: "Мы бережно упакуем растения и доставим в указанное время. По Бишкеку — 1–2 дня. По регионам — 2–5 дней.",
  },
  {
    num: 6,
    icon: "🌱",
    title: "Получение",
    desc: "Осмотрите растения при получении. Если есть вопросы по качеству — сфотографируйте и сразу сообщите нам.",
  },
];

export default function HowToOrderPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand py-12">
        <h1 className="text-center text-4xl font-bold text-white">Как сделать заказ</h1>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">

        <div className="flex flex-col gap-6">
          {steps.map((step) => (
            <div key={step.num} className="flex gap-6 items-start p-6 rounded-xl border border-brand/10 bg-[#f4f9f0]">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-brand text-white font-extrabold text-lg flex items-center justify-center">
                  {step.num}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span>{step.icon}</span> {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#f4f9f0] rounded-2xl p-8 border border-brand/10">
          <h2 className="text-xl font-bold text-brand mb-3">Или закажите через мессенджер</h2>
          <p className="text-gray-600 mb-5">
            Напишите нам список растений в WhatsApp или Telegram — мы оформим заказ за вас.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="https://wa.me/996708000008"
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              📱 WhatsApp
            </a>
            <a
              href="https://t.me/agrogeroi"
              className="flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-600 transition"
            >
              ✈️ Telegram
            </a>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block bg-brand text-white font-bold px-10 py-4 rounded-lg hover:opacity-90 transition text-lg"
          >
            Перейти в каталог →
          </Link>
        </div>
      </div>
    </div>
  );
}
