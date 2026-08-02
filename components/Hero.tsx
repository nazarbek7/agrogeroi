import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaSeedling,
  FaSnowflake,
  FaTruck,
} from "react-icons/fa6";

const trustPoints = [
  { icon: FaSeedling, text: "Выращиваем сами" },
  { icon: FaTruck, text: "Доставка по всему Кыргызстану" },
  { icon: FaSnowflake, text: "Адаптировано к местному климату" },
];

const Hero = () => {
  return (
    <section className="relative w-full min-h-[640px] flex items-center overflow-hidden max-lg:min-h-[540px] max-sm:min-h-[480px]">
      {/* Photo layer */}
      <Image
        src="/hero-plant.png"
        alt="Гортензии в питомнике Agrogeroi"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-[center_40%] scale-105"
      />

      {/* Desktop: dark green wash from the left so the photo stays visible on the right */}
      <div
        className="absolute inset-0 pointer-events-none max-lg:hidden"
        style={{
          background:
            "linear-gradient(100deg, #101f04 0%, rgba(20,38,6,0.94) 32%, rgba(31,52,10,0.72) 55%, rgba(31,52,10,0.15) 82%, rgba(31,52,10,0) 100%)",
        }}
      />

      {/* Mobile: bottom-up wash, text sits over the darkened lower half */}
      <div
        className="absolute inset-0 pointer-events-none hidden max-lg:block"
        style={{
          background:
            "linear-gradient(0deg, #101f04 0%, rgba(16,31,4,0.92) 45%, rgba(16,31,4,0.6) 75%, rgba(16,31,4,0.35) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative w-full max-w-screen-2xl mx-auto px-16 py-20 max-[1320px]:px-10 max-md:px-5 max-lg:py-14 max-sm:py-10">
        <div className="max-w-3xl max-lg:max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/90 ring-1 ring-inset ring-white/20 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
            Питомник в Кыргызстане
          </span>

          <h1 className="mt-6 text-6xl font-extrabold leading-[1.05] tracking-tight text-white max-xl:text-5xl max-md:text-4xl max-sm:text-[2rem] max-sm:mt-5">
            Ваши растения —<br className="max-sm:hidden" /> наша забота
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80 max-sm:mt-4 max-sm:text-base">
            Розы, гортензии, хвойные и плодовые деревья — выращены в нашем
            питомнике и готовы прижиться в вашем саду.
          </p>

          <div className="mt-8 flex gap-3 max-sm:mt-6 max-sm:flex-col">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-brand-dark shadow-lg shadow-black/20 transition-colors hover:bg-lime-50"
            >
              В каталог
              <FaArrowRight className="text-sm transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contacts"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/15"
            >
              Связаться с нами
            </Link>
          </div>

          {/* Trust row — one tight line, not a card strip */}
          <ul className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/15 pt-6 max-sm:mt-8">
            {trustPoints.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2 text-[13px] font-medium text-white/75"
              >
                <Icon className="shrink-0 text-lime-300" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;
