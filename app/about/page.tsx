export const metadata = { title: "О компании — Агрогерои" };

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand py-12">
        <h1 className="text-center text-4xl font-bold text-white">О компании</h1>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">
        <section>
          <h2 className="text-2xl font-bold text-brand mb-4">Кто мы</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            <strong>Агрогерои</strong> — кыргызский питомник растений, основанный с целью сделать
            садоводство доступным и приятным для каждого жителя Кыргызстана. Мы выращиваем
            растения сами — в нашем собственном питомнике на площади более 1 гектара.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-brand mb-4">Наша миссия</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Мы верим, что каждый двор, балкон и сад заслуживает красоты. Наша миссия —
            обеспечить жителей Кыргызстана качественными саженцами, адаптированными к местному
            климату, по доступным ценам.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-brand mb-6">Наши достижения</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "10+", label: "лет опыта" },
              { value: "500+", label: "видов растений" },
              { value: "10 000+", label: "саженцев в год" },
              { value: "1 га", label: "площадь питомника" },
            ].map((s) => (
              <div key={s.label} className="bg-[#f4f9f0] rounded-2xl p-6 text-center border border-brand/10">
                <p className="text-3xl font-extrabold text-brand mb-1">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-brand mb-4">Что мы предлагаем</h2>
          <ul className="space-y-3 text-gray-700 text-lg">
            {[
              "Розы, гортензии, клематисы и другие декоративные растения",
              "Хвойные и лиственные деревья для озеленения",
              "Плодовые деревья и кустарники",
              "Газонные смеси и почвенные материалы",
              "Садовый инвентарь и аксессуары",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-brand font-bold mt-1">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-[#f4f9f0] rounded-2xl p-8 border border-brand/10">
          <h2 className="text-2xl font-bold text-brand mb-3">Наш питомник</h2>
          <p className="text-gray-700 leading-relaxed">
            Питомник расположен в Кыргызстане. Все растения проходят заботливый уход с момента
            посадки. Мы используем экологичные методы выращивания без вредных химикатов.
            Приглашаем вас лично посетить нас — мы рады каждому гостю!
          </p>
          <div className="mt-4">
            <a href="/contacts" className="inline-block bg-brand text-white font-bold px-8 py-3 rounded-lg hover:opacity-90 transition">
              Связаться с нами →
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
