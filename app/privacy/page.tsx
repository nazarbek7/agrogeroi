export const metadata = { title: "Политика конфиденциальности — Agrogeroi" };

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand py-12">
        <h1 className="text-center text-4xl font-bold text-white">Политика конфиденциальности</h1>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-8 text-gray-700">
        <p className="text-lg">Последнее обновление: январь 2025 г.</p>

        {[
          {
            title: "1. Какие данные мы собираем",
            text: "При оформлении заказа мы собираем: имя, номер телефона, адрес доставки и, по желанию, email. При регистрации на сайте — email и пароль (в зашифрованном виде).",
          },
          {
            title: "2. Как мы используем ваши данные",
            text: "Данные используются исключительно для обработки и доставки ваших заказов, а также для связи с вами по вопросам заказа. Мы не передаём ваши данные третьим лицам, кроме служб доставки.",
          },
          {
            title: "3. Хранение данных",
            text: "Ваши данные хранятся на защищённых серверах. Мы принимаем технические и организационные меры для защиты информации от несанкционированного доступа.",
          },
          {
            title: "4. Файлы cookie",
            text: "Сайт использует файлы cookie для корректной работы корзины, авторизации и аналитики. Отключение cookie может повлиять на работу некоторых функций сайта.",
          },
          {
            title: "5. Ваши права",
            text: "Вы вправе запросить удаление или изменение ваших персональных данных. Для этого напишите нам на info@agrogeroi.com или в WhatsApp.",
          },
          {
            title: "6. Изменения политики",
            text: "Мы можем обновлять политику конфиденциальности. Актуальная версия всегда доступна на этой странице.",
          },
        ].map((section) => (
          <section key={section.title} className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-brand">{section.title}</h2>
            <p className="leading-relaxed">{section.text}</p>
          </section>
        ))}

        <div className="bg-[#f4f9f0] rounded-xl p-6 border border-brand/10">
          <p className="font-semibold mb-2">Вопросы по конфиденциальности:</p>
          <a href="mailto:info@agrogeroi.com" className="text-brand font-semibold hover:underline">info@agrogeroi.com</a>
        </div>
      </div>
    </div>
  );
}
