export const metadata = { title: "Возврат товара — Agrogeroi" };

export default function ReturnsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand py-12">
        <h1 className="text-center text-4xl font-bold text-white">Возврат товара</h1>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">

        <section>
          <h2 className="text-2xl font-bold text-brand mb-4">Условия возврата</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Мы несём ответственность за качество каждого растения. Если вы получили товар
            ненадлежащего качества — мы решим вопрос.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          {[
            {
              icon: "✅",
              title: "Когда принимаем возврат",
              items: [
                "Растение получено в повреждённом виде (поломано при транспортировке)",
                "Товар не соответствует описанию или фотографии",
                "Получен не тот вид или сорт",
              ],
            },
            {
              icon: "❌",
              title: "Когда возврат не принимается",
              items: [
                "Растение засохло из-за неправильного ухода после получения",
                "Прошло более 7 дней с момента получения",
                "Отсутствует фото/видео при получении, подтверждающее брак",
              ],
            },
          ].map((block) => (
            <div key={block.title} className="p-6 rounded-xl border border-brand/10 bg-[#f4f9f0]">
              <h3 className="font-bold text-gray-800 text-lg mb-3 flex gap-2">
                <span>{block.icon}</span> {block.title}
              </h3>
              <ul className="space-y-2">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-2 text-gray-600">
                    <span className="text-brand mt-1">—</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-brand mb-4">Как оформить возврат</h2>
          <ol className="space-y-4">
            {[
              "Сфотографируйте или снимите видео проблемного растения сразу при получении",
              "Напишите нам в WhatsApp или Telegram с фото и номером заказа",
              "Менеджер рассмотрит обращение в течение 1 рабочего дня",
              "Мы организуем замену или возврат средств",
            ].map((step, i) => (
              <li key={step} className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-brand text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                  {i + 1}
                </span>
                <span className="text-gray-700 text-lg pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="bg-[#f4f9f0] rounded-2xl p-6 border border-brand/10 flex items-center gap-4">
          <span className="text-4xl">📱</span>
          <div>
            <p className="font-bold text-gray-800">Вопросы по возврату?</p>
            <p className="text-gray-600">Пишите нам: <a href="https://wa.me/996708000008" className="text-brand font-semibold hover:underline">WhatsApp</a> или <a href="https://t.me/agrogeroi" className="text-brand font-semibold hover:underline">Telegram</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
