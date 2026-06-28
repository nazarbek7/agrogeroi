export const metadata = { title: "Условия использования — Agrogeroi" };

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand py-12">
        <h1 className="text-center text-4xl font-bold text-white">Условия использования</h1>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-8 text-gray-700">
        <p className="text-lg">Последнее обновление: январь 2025 г.</p>

        {[
          {
            title: "1. Общие положения",
            text: "Используя сайт agrogeroi.com, вы соглашаетесь с настоящими условиями. Сайт принадлежит и управляется компанией Agrogeroi (Кыргызстан).",
          },
          {
            title: "2. Использование сайта",
            text: "Вы обязуетесь использовать сайт только в законных целях. Запрещено копирование, распространение или изменение материалов сайта без письменного разрешения.",
          },
          {
            title: "3. Оформление заказов",
            text: "Размещая заказ, вы подтверждаете, что вам есть 18 лет и информация, предоставленная при заказе, является достоверной. Мы вправе отказать в обработке заказа по обоснованным причинам.",
          },
          {
            title: "4. Цены и наличие",
            text: "Цены на сайте указаны в кыргызских сомах и актуальны на момент публикации. Мы оставляем право изменять цены без предварительного уведомления. Наличие товара подтверждается менеджером при оформлении заказа.",
          },
          {
            title: "5. Ответственность",
            text: "Мы не несём ответственности за гибель растений вследствие ненадлежащего ухода после передачи покупателю, а также за форс-мажорные обстоятельства.",
          },
          {
            title: "6. Интеллектуальная собственность",
            text: "Все материалы сайта (тексты, фотографии, логотипы) принадлежат Agrogeroi. Использование без разрешения запрещено.",
          },
          {
            title: "7. Изменения условий",
            text: "Мы можем изменять условия использования. Продолжение использования сайта после изменений означает ваше согласие с новой редакцией.",
          },
        ].map((section) => (
          <section key={section.title} className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-brand">{section.title}</h2>
            <p className="leading-relaxed">{section.text}</p>
          </section>
        ))}

        <div className="bg-[#f4f9f0] rounded-xl p-6 border border-brand/10">
          <p className="font-semibold mb-2">Вопросы по условиям:</p>
          <a href="mailto:info@agrogeroi.com" className="text-brand font-semibold hover:underline">info@agrogeroi.com</a>
        </div>
      </div>
    </div>
  );
}
